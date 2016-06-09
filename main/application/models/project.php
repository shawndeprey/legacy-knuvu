<?php
class Project extends CI_Model {

  var $id = '';
  var $name = '';
  var $owner = '';
  var $sample = '';
  var $creation_date = '';
  var $modified_date = '';
  var $competitors = '';
  var $analysis_points = '';
  var $groups = '';
  var $discrete_poa = '';

  function __construct()
  {
    parent::__construct();
  }

  function get_project($project_id)
  {
  	return $this->db->query("select * from admin_project where id='$project_id';")->row_array();
  }

  function get_limited_project($project_id)
  {
    return $this->db->query("select id, capability_id, name, owner, sample, creation_date, modified_date from admin_project where id='$project_id';")->row_array();
  }

  function insert_project_from_capability_model($cap_id, $name, $owner, $sample, $model)
  {
    $this->db->query('insert into admin_project(id, capability_id, name, owner, sample, creation_date, modified_date, state, file) values("", "'.$cap_id.'", "'.$name.'", "'.$owner.'", "'.$sample.'", now(), now(), 0, "'.addslashes(json_encode($model)).'");');
  }

  function copy_project($file_id)
  {
    $proj = $this->Project->get_project($file_id);
    $this->db->query('insert into admin_project (id, capability_id, name, owner, sample, creation_date, modified_date, state, file) values("", "", "'.$proj["name"].' - copy", "'.$proj["owner"].'", "'.$proj["sample"].'", now(), now(), 0, "'.addslashes($proj["file"]).'");');
  }

  function insert_project($data)
  {
  	if( isset($_POST['name']) && isset($_POST['owner']) && isset($_POST['sample']) ){
		  $name = $_POST['name'];
		  $owner = $_POST['owner'];
		  $sample = $_POST['sample'];
		  if(count($this->db->query("select * from admin_project where name='$name' and owner='$owner';")->row_array()) == 0) {
        $file = array(
          "meta"=>array("add_id"=>4, "fs"=>array("0"=>array("p"=>10,"r"=>0)), "gs"=>array("1"=>array("0"=>array("p"=>10,"r"=>0))) ),
          "competition"=>array( 0=>array("id"=>0, "display_order" => 0, "name" => $sample) ),
          "group"=>array( 0=>array("id"=>1, "display_order" => 1, "name" => "Group 1") ),
          "poa"=>array( 0=>array("id"=>2,"display_order" => 1, "name" => "POA 1", "group" => "Group 1", "performance_priority" => 0, "cost_priority" => 3, "rank_by" => 0, "scale" => 0, "benchmark" => "", "nt"=>0, "nf"=>0, "ng"=>0) ),
          "dpoa"=>array( 0=>array("id"=>3,"poa" => "POA 1", "competitor" => $sample, "performance" => 10, "performance_risk" => 0, "performance_label" => "", "cost" => 0.0, "cost_risk" => 0, "cost_label" => "") )
        );
        $this->db->query('insert into admin_project (id, capability_id, name, owner, sample, creation_date, modified_date, state, file) values("", "", "'.$name.'", "'.$owner.'", "'.$sample.'", now(), now(), 0, "'.addslashes(json_encode($file)).'");');
		  } else {
		  	$data['failedquery'] = 'true';
		  }
  	}
  	return $data;
  }

  function delete_project($project_id, $email, $password)
  {
  	$a_user = $this->User->check_user_credentials($email, $password);
  	$proj = $this->Project->get_project($project_id);
  	if($a_user != false && intval($proj['owner']) == $a_user['id']){
  		$this->db->query("delete from admin_project where id='$project_id';");
  	}
  }

  function update_project($data, $email, $password)
  {
    $a_user = $this->User->check_user_credentials($email, $password);
    $proj = $this->Project->get_project($_POST['project-id']);
  	if( true/*isset($_POST['project-name']) && isset($_POST['project-competitor']) &&
        isset($_POST['project-competitor']) && isset($_POST['project-group']) && isset($_POST['project-poa']) && isset($_POST['project-dpoa'])isset($_POST['project-file']) &&
        $a_user != false && intval($proj['owner']) == $a_user['id']*/){
      $this->db->query('update admin_project SET name="'.$_POST['project-name'].'" WHERE id='.$_POST['project-id'].';');
      $this->db->query('update admin_project SET sample="'.$_POST['project-sample'].'" WHERE id='.$_POST['project-id'].';');
      $this->db->query('update admin_project SET modified_date=now() WHERE id='.$_POST['project-id'].';');
      $this->db->query('update admin_project SET file="'.addslashes($_POST['project-file']).'" WHERE id='.$_POST['project-id'].';');
    } else {
      $data['failedquery'] = 'true';
    }
    return $data;
  }

  function import_project($data)
  {
    try {
      if(isset($_POST['name'])){
        $name = $_POST['name'];
      }
      $owner = $data['user']['id'];

      $file = null;
      if( isset($_FILES['csv_file']) ){
        $file = import_csv_file($_FILES['csv_file'], $_POST['import_type']);
        if(isset($_POST['project-id'])){
          $project = $this->Project->get_project($_POST['project-id']);
          $file = combine_models($project, $file, $_POST['import_type']);
          $sample = $file->competition[0]->name;
        } else {
          $sample = $file["competition"][0]["name"];
        }
      }
      if($file != null){
        $new_file = addslashes( str_replace("\\r\\n", "", json_encode($file)) );
        if(isset($_POST['project-id'])){
          $this->db->query('update admin_project SET file="'.addslashes(json_encode($file)).'" WHERE id='.$_POST['project-id'].';');
        } else {
          $this->db->query('insert into admin_project (id, capability_id, name, owner, sample, creation_date, modified_date, state, file) values("", "", "'.$name.'", "'.$owner.'", "'.$sample.'", now(), now(), 0, "'.$new_file.'");');
        }
      }
    } catch(Exception $e) {
      $log_id = rand();
      error_log($log_id.": An exception occurred while importing project: ".$e);
      $data['error1'] = "Woops! An error occurred while trying to import your project. Please ensure your file meets the template guidelines. Error ID: ".$log_id;
    }
    return $data;
  }
}