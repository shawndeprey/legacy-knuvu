<?php
class User extends CI_Model {

  var $id = '';
  var $email = '';
  var $password = '';
  var $projects = '';

  function __construct()
  {
    parent::__construct();
  }

  function find_by_id($user)
  {
    $user = $this->db->query('select * from admin_user where id="'.$user.'";')->row_array();
    return $user;
  }

  function get_user($user)
  {
    $user = $this->db->query('select * from admin_user where email="'.$user.'";')->row_array();
    return $user;
  }

  function check_user_credentials($user, $pass)
  {
    $user = $this->db->query('select * from admin_user where email="'.$user.'" and password="'.$pass.'";')->row_array();
    return $user;
  }

  function get_user_projects($user)
  {
    $projects = $this->db->query('select id, capability_id, name, sample, creation_date, modified_date from admin_project where owner="'.$user.'" and capability_id=0 and state=0;')->result_array();
    return $projects;
  }

  function get_full_user_projects($user)
  {
    $projects = $this->db->query('select * from admin_project where owner="'.$user.'" and capability_id=0 and state=0;')->result_array();
    return $projects;
  }

  function get_user_rfis($user)
  {
    $rfis = $this->db->query('select * from admin_rfi where owner="'.$user.'";')->result_array();
    return $rfis;
  }

  function get_user_capabilities($user)
  {
    $projects = $this->db->query('select * from admin_capability where owner="'.$user.'";')->result_array();
    return $projects;
  }
  function get_capability_project($user, $cap_id, $data)
  {
    $data['capability'] = $this->db->query('select * from admin_capability where owner="'.$user.'" and id='.$cap_id.';')->row_array();
    $data['projects'] = $this->db->query('select id, capability_id, name, sample, creation_date, modified_date from admin_project where owner="'.$user.'" and capability_id='.$cap_id.';')->result_array();
    return $data;
  }

  function insert_user()
  {
    $this->email   = $_POST['email'];
    $this->password = $_POST['password'];
    $this->db->insert('entries', $this);
  }

  function update_user()
  {
    $this->email   = $_POST['email'];
    $this->password = $_POST['password'];
    $this->db->update('admin_user', $this, array('id' => $_POST['id']));
  }
}