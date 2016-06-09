<?php
class Capability extends CI_Model {

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

  function get_capability($id)
  {
  	return $this->db->query("select * from admin_capability where id='$id';")->row_array();
  }

  function insert_capability($data)
  {
  	if( isset($_POST['name']) && isset($_POST['owner']) && isset($_POST['sample']) && isset($_POST['model']) ){
		  $name = $_POST['name'];
		  $owner = $_POST['owner'];
		  $sample = $_POST['sample'];
		  $model_id = $_POST['model'];
		  if(count($this->db->query("select * from admin_capability where name='$name' and owner='$owner';")->row_array()) == 0) {
		  	$this->db->query('insert into admin_capability (id, name, owner, sample, creation_date, modified_date, model_id) values("", "'.$name.'", "'.$owner.'", "'.$sample.'", now(), now(), "'.$model_id.'");');
        $cap_id = mysql_insert_id(); //Use current mysql connection to get the last inserted item.
        $cap_model = $this->Capabilitymodel->get_model($model_id);
        $model_name = $cap_model['name'];
        $string_model = preg_replace( "/$model_name/i", $sample, $cap_model['model'] );
        $models = json_decode( $string_model );
        foreach($models as $model_num => $model){
          $level = $model_num + 1;
          $this->Project->insert_project_from_capability_model($cap_id, "$name - Level $level", $owner, $sample, $model);
        }
		  } else {
		  	$data['failedquery'] = 'true';
		  }
  	}
  	return $data;
  }

  function delete_capability($id, $email, $password)
  {
  	$a_user = $this->User->check_user_credentials($email, $password);
  	$capability = $this->Capability->get_capability($id);
  	if($a_user != false && intval($capability['owner']) == $a_user['id']){
  		$this->db->query("delete from admin_capability where id='$id';");
  		$this->db->query("delete from admin_project where capability_id='$id';");
  	}
  }

  function update_capability($data, $email, $password)
  {
    
  }
}