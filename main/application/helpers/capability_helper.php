<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function import_csv_model($file, $name)
{
	//Set up the file data for processing
	$m = array();
	$string_file = file( $file["tmp_name"] );
	//$string_file = str_replace("\r\n", "", $string_file);
	$lines = array();
	foreach($string_file as $line_num => $line){
		//preg_match('/\".+\"/i', $line, $result);
		//foreach($result as $r_num => $r){
		//	$line = str_replace($r, preg_replace('/,|"/i', '', $r), $line);
		//}
		$line = preg_replace('/[0-9.]+\s/i', '', $line, 1);//Limit replacement to 1 so it only catches the first instance.
		$line = preg_replace('/\//i', '-', $line);
		$line = preg_replace('/\\\\/i', '-', $line);
		$line = preg_replace('/&/i', 'and', $line);
		$line = preg_replace('/\(.+\)/i', '', $line);
		$line = preg_replace('/"/i', '', $line);
		$line = preg_replace("/'/i", '', $line);
		$line = preg_replace("/:/i", '', $line);
		$line = preg_replace("/\./i", '', $line);
    $lines[$line_num] = explode(',', $line);
	}

	//Calculate the number maximum levels deep capability model goes
	$levels = 0;
	foreach($lines as $line_num => $line){
    foreach($line as $cell_num => $cell){
    	if($cell != null && $cell != ''){
    		$levels = ($cell_num > $levels) ? $cell_num : $levels;
    		break;
    	}
    }
	}
	//$levels += 1;
	
	//Create array of temp objects containing each knuvu level
	$temp = array();
	$checking_for_poa = false;
	$group = null;
	$added = 0;
	for($L = 0; $L < $levels; $L++){
		$temp[$L] = array();
		$temp[$L]['group'] = array();
		$temp[$L]['poa'] = array();
		$temp[$L]['dpoa'] = array();
		$titles = "@@";
		$add_group = false;

		foreach($lines as $line_num => $line){
			if($line[$L] != null && $line[$L] != ''){
				$checking_for_poa = false;
			}
			if(!$checking_for_poa && $line[$L] != null && $line[$L] != ''){
				//array_push($temp[$L]['group'], array("display_order"=>0, "name"=>$line[$L]));
				$group = $line[$L];
				$add_group = true;
				$added++;
			} else {
				if($line[$L + 1] != null && $line[$L + 1] != ''){
					if($add_group){//Only add groups if they have POA's
						$add_group = false;
						array_push($temp[$L]['group'], array("display_order"=>0, "name"=>$group));
					}
					$title = $line[$L + 1];
					if( preg_match("/"."@@$title@@"."/i", $titles) ){
						array_push($temp[$L]['poa'], array("display_order"=>0, "name"=>"$title - $group", "group"=>$group, "performance_priority"=>0, "cost_priority"=>0, "rank_by"=>0, "scale"=>0, "benchmark"=>""));
						array_push($temp[$L]['dpoa'], array("poa"=>"$title - $group", "competitor"=>$name, "performance"=>0, "performance_risk"=>0, "performance_label"=>"", "cost"=>0, "cost_risk"=>0, "cost_label"=>"No"));
					} else {
						$titles = "$titles$title@@";
						array_push($temp[$L]['poa'], array("display_order"=>0, "name"=>$title, "group"=>$group, "performance_priority"=>0, "cost_priority"=>0, "rank_by"=>0, "scale"=>0, "benchmark"=>""));
						array_push($temp[$L]['dpoa'], array("poa"=>$title, "competitor"=>$name, "performance"=>0, "performance_risk"=>0, "performance_label"=>"", "cost"=>0, "cost_risk"=>0, "cost_label"=>"No"));
					}
					$added++;
				}
			}
		}

	}

	//Create array of knuvu files
	for($L = 0; $L < $levels; $L++){
		array_push($m, array(
      "competition"=>array( 0=>array("display_order" => 0, "name" => $name)),
      "group"=>$temp[$L]['group'],
      "poa"=>$temp[$L]['poa'],
      "dpoa"=>$temp[$L]['dpoa']
    ));
	}

	//Model has been created. Return it.
	return $m;
}