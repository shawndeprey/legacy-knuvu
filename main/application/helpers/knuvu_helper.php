<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function set_standard_page_data($context)
{
	$data['title'] = 'Knuvu';
	$data['login'] = $context->session->userdata('login');
	$data['failedlogin'] = 'false';
	$data['failedquery'] = 'false';
	$data['api_key'] = 'K6hs8ldi93H456c3C99823ADmsJNMK';
	$data['base_url'] = base_url("");
	if($data['login'] == 'true'){
		$data['user'] = array(
			'id'=>$context->session->userdata('id'),
			'email'=>$context->session->userdata('email'),
			'password'=>$context->session->userdata('password'),
			'permission'=>$context->session->userdata('permission')
		);
	}
	return $data;
}

function check_for_login_and_perform_login($data, $context)
{
	$email = $context->input->post('email');
	$password = $context->input->post('password');
	if($email != false && $password != false){
		$user = $context->User->check_user_credentials($email, $password);
		if($user != false){
			$context->session->set_userdata('login', 'true');
			$context->session->set_userdata($user);
			$data['login'] = $context->session->userdata('login');
			$data['user'] = array(
				$context->session->userdata('id'),
				$context->session->userdata('email'),
				$context->session->userdata('password'),
				$context->session->userdata('permission')
			);
		} else {
			$context->session->set_userdata('login', 'false');
			$data['login'] = 'false';
			$data['failedlogin'] = 'true';
		}
	}
	return $data;
}

function check_api_key($key)
{
	return ($key == 'K6hs8ldi93H456c3C99823ADmsJNMK');
}

function build_back_button($data, $title, $url)
{
	$data["back"] = array(
		"title" => $title,
		"url" => $url
	);
	return $data;
}

function import_csv_file($file, $type)
{
	//Set up the file data for processing
	$new_file = array();
	$string_file = file( $file["tmp_name"] );
	$lines = array();
	foreach($string_file as $line_num => $line){
    $lines[$line_num] = explode(',', $line);
	}

	//Find where Priority starts
	$priority_col = null;
	$priority_row = null;
	$candidate_group_layers = null;
	$poa_group_layers = null;
	foreach($lines as $line_num => $line){
		foreach($line as $cell_num => $cell){
			if( $cell != null && $priority_col == null ){
				$priority_col = $cell_num - 1;
				$candidate_group_layers = $priority_col;
			} else {
				if( preg_match("/priority/i", $cell) ){
					$priority_row = $line_num;
					$poa_group_layers = $priority_row - 1;
					break;
				}
			}
		}
	}

	$id = 0;

	//Build Competitors
	$new_file["competition"] = array();
	$num_samples = 0;
	foreach($lines as $line_num => $line){
		if($line_num > $priority_row){
			array_push( $new_file["competition"], array("id"=>$id, "display_order" => $num_samples, "name" => $line[$candidate_group_layers]) );
			$num_samples++;
			$id++;
		}
	}

	//The following ignors all candidate groups and only allows 1 POA group
	//Build Group Data by getting 2 rows above the priority row. This will ignore any upper groups
	$new_file["group"] = array();
	$group_starts = array();
	$num_groups = 0;
	$end = count($lines[$priority_row - 2]) - 1;
	if($priority_row - 2 < 0){ //if no groups layer, force one.
		array_push( $group_starts, array(0=>0, 1=>"Group 1") );
		array_push( $new_file["group"], array("id"=>$id,"display_order" => 0, "name" => "Group 1") );
	} else {
		foreach($lines[$priority_row - 2] as $cell_num => $cell){
			if( $cell != null && $cell != '' && $cell_num != $end ){
				array_push( $group_starts, array(0=>$cell_num, 1=>$cell) );
				array_push( $new_file["group"], array("id"=>$id,"display_order" => $num_groups, "name" => $cell) );
				$num_groups++;
				$id++;
			}
		}
	}

	//Build POAs
	$new_file["poa"] = array();
	$num_poas = 0;
	foreach($lines[$priority_row - 1] as $cell_num => $cell){
		if( $cell != null && $cell != '' ){
			$p = intval( $lines[$priority_row][$cell_num] );
			foreach($group_starts as $gs){
				if($cell_num >= $gs[0]){
					$g = $gs[1];
				}
			}
			array_push( $new_file["poa"], array("id"=>$id,"display_order" => $num_poas, "name" => $cell, "group" => $g, "performance_priority" => $p, "cost_priority" => $p, "rank_by" => 0, "scale" => 0, "benchmark" => "", "nt"=>0, "nf"=>0, "ng"=>0) );
			$num_poas++;
			$id++;
		}
	}

	//Build DPOAs
	$new_file["dpoa"] = array();
	foreach($new_file["competition"] as $sample){
		foreach($new_file["poa"] as $poa_num => $poa){

			foreach($lines as $line_num => $line){
				if($line_num > $priority_row && $line[$candidate_group_layers] == $sample["name"]){
					$from_file = $line;
					break;
				}
			}
			if($type == "performance"){
				array_push( $new_file["dpoa"], array("id"=>$id,"poa" => $poa["name"], "competitor" => $sample["name"], "performance" => intval( $from_file[$poa["display_order"] + ($priority_col + 1)] ), "performance_risk" => 0, "performance_label" => "", "cost" => 0.0, "cost_risk" => 0, "cost_label" => "") );
			} else
			if($type == "risk"){
				array_push( $new_file["dpoa"], array("id"=>$id,"poa" => $poa["name"], "competitor" => $sample["name"], "performance" => 0, "performance_risk" => intval( $from_file[$poa["display_order"] + ($priority_col + 1)] ), "performance_label" => "", "cost" => 0.0, "cost_risk" => 0, "cost_label" => "") );
			} else
			if($type == "label"){
				array_push( $new_file["dpoa"], array("id"=>$id,"poa" => $poa["name"], "competitor" => $sample["name"], "performance" => 0, "performance_risk" => 0, "performance_label" => $from_file[$poa["display_order"] + ($priority_col + 1)], "cost" => 0.0, "cost_risk" => 0, "cost_label" => "") );
			}
			$id++;
		}
	}

	//Build File Meta Header
	$new_file["meta"] = array("add_id"=>$id, "fs"=>array(), "gs"=>array());
	$g_hm = array();
	$p_hm = array();
	$c_hm = array();
	$poa_count = array();
	foreach($new_file["group"] as $obj){
		$g_hm[str_replace(" ", "", $obj["name"])] = $obj["id"];
	}
	foreach($new_file["poa"] as $obj){
		$p_hm[str_replace(" ", "", $obj["name"])] = array("id"=>$obj["id"], "group"=>str_replace(" ", "", $obj["group"]));
		$poa_count[str_replace(" ", "", $obj["group"])] = isset($poa_count[str_replace(" ", "", $obj["group"])]) ? $poa_count[str_replace(" ", "", $obj["group"])] + 1  : 1;
	}
	foreach($new_file["competition"] as $obj){
		$c_hm[str_replace(" ", "", $obj["name"])] = $obj["id"];
	}

	$fs = array();
	$gs = array();
	$group_id = array();
	foreach($new_file["dpoa"] as $dpoa){
		//File Score
		$s_id = $c_hm[str_replace(' ', '', $dpoa['competitor'])];
		$fs["$s_id"] = isset($fs["$s_id"]) ? array("p"=>$fs["$s_id"]["p"] + $dpoa['performance'],"r"=>$fs["$s_id"]["r"] + $dpoa['performance_risk']) : array("p"=>$dpoa['performance'],"r"=>$dpoa['performance_risk']);
		//Group Score
		$g_id = $g_hm[ $p_hm[str_replace(" ", "", $dpoa["poa"])]["group"] ];
		array_push($group_id, array("gid"=>"$g_id", "sid"=>"$s_id", "group"=>$p_hm[str_replace(" ", "", $dpoa["poa"])]["group"]));
		if(isset($gs["$g_id"])){
			if(isset($gs["$g_id"]["$s_id"])){
				$gs["$g_id"]["$s_id"] = array("p"=>$gs["$g_id"]["$s_id"]["p"] + $dpoa['performance'],"r"=>$gs["$g_id"]["$s_id"]["r"] + $dpoa['performance_risk']);
			} else {
				$gs["$g_id"]["$s_id"] = array("p"=>$dpoa['performance'],"r"=>$dpoa['performance_risk']);
			}
		} else {
			$gs["$g_id"] = array();
			if(isset($gs["$g_id"]["$s_id"])){
				$gs["$g_id"]["$s_id"] = array("p"=>$gs["$g_id"]["$s_id"]["p"] + $dpoa['performance'],"r"=>$gs["$g_id"]["$s_id"]["r"] + $dpoa['performance_risk']);
			} else {
				$gs["$g_id"]["$s_id"] = array("p"=>$dpoa['performance'],"r"=>$dpoa['performance_risk']);
			}
		}
	}
	foreach ($fs as $key => $value){
		$fs["$key"] = array( "p"=> round( $value["p"] / count($p_hm) ),"r"=> round( $value["r"] / count($p_hm) ) );
	}
	$double_set_check = array();
	foreach ($group_id as $ids){
		if( isset($double_set_check[$ids['gid'].$ids['sid']]) ){
			//Do Nothin!
		} else {
			$double_set_check[$ids['gid'].$ids['sid']] = true;
			$num_of_poa_in_group = $poa_count[$ids["group"]] - 1;
			$p_val = ($gs[$ids["gid"]][$ids["sid"]]["p"] / $poa_count[$ids["group"]]);
			$r_val = ($gs[$ids["gid"]][$ids["sid"]]["r"] / $poa_count[$ids["group"]]);
			$gs[$ids["gid"]][$ids["sid"]] = array( "p"=> $p_val,"r"=> $r_val );
		}
	}
	$new_file["meta"]["fs"] = $fs;
	$new_file["meta"]["gs"] = $gs;

	return $new_file;
}

function combine_models($file, $partial, $type)
{
	$file = json_decode($file['file']);
	$new_data = array();
	foreach($partial["dpoa"] as $dpoa){
		$poa =  str_replace("\r", "", str_replace("\n", "", str_replace("\r\n", "", str_replace(PHP_EOL, "", str_replace(" ", "", $dpoa['poa'])))));
		$competitor =  str_replace("\r", "", str_replace("\n", "", str_replace("\r\n", "", str_replace(PHP_EOL, "", str_replace(" ", "", $dpoa['competitor'])))));
		$key = "$poa-$competitor";
		if($type == "performance"){
			$new_data[$key] = $dpoa["performance"];
		} else
		if($type == "risk"){
			$new_data[$key] = $dpoa["performance_risk"];
		} else
		if($type == "label"){
			$new_data[$key] = $dpoa["performance_label"];
		}
	}
	foreach($file->dpoa as $key => $dpoa){
		$poa = str_replace(" ", "", $dpoa->poa);
		$competitor = str_replace(" ", "", $dpoa->competitor);
		$key_value_pair = "$poa-$competitor";
		if(isset($new_data[$key_value_pair])){
			$new_val = $new_data[$key_value_pair];
			if($type == "performance"){
				$file->dpoa[$key]->performance = $new_val;
			} else
			if($type == "risk"){
				$file->dpoa[$key]->performance_risk = $new_val;
			} else
			if($type == "label"){
				$file->dpoa[$key]->performance_label = $new_val;
			}
		}
	}
	return $file;
}