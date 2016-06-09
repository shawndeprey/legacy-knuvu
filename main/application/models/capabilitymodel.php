<?php
class Capabilitymodel extends CI_Model {

  var $id = '';
  var $name = '';
  var $owner = '';
  var $sample = '';
  var $creation_date = '';
  var $modified_date = '';
  var $model_id = '';

  function __construct()
  {
    parent::__construct();
  }

  function all_models()
  {
  	return $this->db->query("select id, name from admin_capability_model;")->result_array();
  }

  function get_model($id)
  {
  	return $this->db->query("select * from admin_capability_model where id='$id';")->row_array();
  }

  function get_limited_model($id)
  {
    return $this->db->query("select id, name from admin_capability_model where id='$id';")->row_array();
  }

  function insert_model($data)
  {
  	return $data;
  }

  function delete_model($id, $email, $password)
  {
  	$a_user = $this->User->check_user_credentials($email, $password);
  	if($a_user != false){//This check may not be needed, but, it is added security
  		$this->db->query("delete from admin_capability_model where id='$id';");
  	}
  }

  function update_model($data, $email, $password)
  {
    
  }

  function import_model($data)
  {
    try {
      $name = $_POST['name'];
      $model = null;
      if( isset($_FILES['csv_file']) ){
        $model = import_csv_model($_FILES['csv_file'], $name);
      }
      if($model != null){
        $new_file = str_replace("\\\\\"", "Parse Error", addslashes(str_replace("\\r\\n", "", json_encode($model))));
        $this->db->query('insert into admin_capability_model (id, name, model) values("", "'.$name.'","'.$new_file.'");');
      }
    } catch(Exception $e) {
      $log_id = rand();
      error_log($log_id.": An exception occurred while importing project: ".$e);
      $data['error1'] = "Woops! An error occurred while trying to import your project. Please ensure your file meets the template guidelines. Error ID: ".$log_id;
    }
    return $data;
  }
}