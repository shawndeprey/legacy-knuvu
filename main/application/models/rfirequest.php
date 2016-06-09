<?php
class Rfirequest extends CI_Model {

  var $id = '';
  var $rfi_id = '';
  var $request_key = '';
  var $email = '';
  var $creation_date = '';
  var $modified_date = '';
  var $rfi_answers = '';

  function __construct()
  {
    parent::__construct();
  }

  function get_rfirequest($rfi_request_id)
  {
  	return $this->db->query("select * from admin_rfi_request where id='$rfi_request_id';")->row_array();
  }

  function insert_rfirequest($data)
  {
  	
  	return $data;
  }

  function delete_rfirequest($project_id, $email, $password)
  {
  	
  }

  function update_rfirequest($data, $email, $password)
  {
    
  }

  function import_rfirequest($data)
  {
    
  }
}