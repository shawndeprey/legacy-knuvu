<?php
class Rfi extends CI_Model {

  var $id = '';
  var $name = '';
  var $owner = '';
  var $creation_date = '';
  var $modified_date = '';
  var $rfi = '';

  function __construct()
  {
    parent::__construct();
  }

  function get_rfi($rfi_id)
  {
  	return $this->db->query("select * from admin_rfi where id='$rfi_id';")->row_array();
  }

  function insert_rfi($data)
  {
  	if( isset($_POST['name']) && isset($_POST['owner']) ){
		  $name = $_POST['name'];
		  $owner = $_POST['owner'];
		  if(count($this->db->query("select * from admin_rfi where name='$name' and owner='$owner';")->row_array()) == 0) {
        $rfi = array(
	        'level'=>array(
	          0=>array(
	          	'name'=>'Level Name', 'child_type'=>'poa', 'child'=>array(0=>array('name'=>'Employees', 'questions'=>array(
	          	'performance'=>array(0=>array('type'=>'Yes or No', 'q'=>'This is the first question to compute performance?'), 1=>array('type'=>'absolute', 'q'=>'This is the second question to compute performance?')),
	          	'performance_risk'=>array(0=>array('type'=>'absolute', 'q'=>'What is the risk in your exployee department?')),
	          	'cost'=>array(0=>array('type'=>'money', 'q'=>'What was the cost of your employees?')),
	          	'cost_risk'=>array(0=>array('type'=>'absolute', 'q'=>'What was the cost risk of your employees?')))))
	          ),
	          1=>array(
	          	'name'=>'Level Name', 'child_type'=>'group', 'child'=>array(0=>array('name'=>'Level Name', 'child_type'=>'poa', 'child'=>array(0=>array('name'=>'Marketing', 'questions'=>array(
	          	'performance'=>array(0=>array('type'=>'absolute', 'q'=>'What was your companies employee performance?')),
	          	'performance_risk'=>array(0=>array('type'=>'Yes or No', 'q'=>'What is the risk in your exployee department?')),
	          	'cost'=>array(0=>array('type'=>'money', 'q'=>'What was the cost of your employees?')),
	          	'cost_risk'=>array(0=>array('type'=>'absolute', 'q'=>'What was the cost risk of your employees?')))), 1=>array('name'=>'Income', 'questions'=>array(
	          	'performance'=>array(0=>array('type'=>'Yes or No', 'q'=>'What was your companies employee performance?')),
	          	'performance_risk'=>array(0=>array('type'=>'absolute', 'q'=>'This is the first question for risk?'), 1=>array('type'=>'absolute', 'q'=>'This is the second question for risk?')),
	          	'cost'=>array(0=>array('type'=>'money', 'q'=>'What was the cost of your employees?')),
	          	'cost_risk'=>array(0=>array('type'=>'absolute', 'q'=>'What was the cost risk of your employees?')))) )))
	          ),
						2=>array(
	          	'name'=>'Level Name', 'child_type'=>'group', 'child'=>array(0=>array('name'=>'Level Name', 'child_type'=>'poa', 'child'=>array(0=>array('name'=>'Phones', 'questions'=>array(
	          	'performance'=>array(0=>array('type'=>'absolute', 'q'=>'What was your companies employee performance?')),
	          	'performance_risk'=>array(0=>array('type'=>'absolute', 'q'=>'What is the risk in your exployee department?')),
	          	'cost'=>array(0=>array('type'=>'money', 'q'=>'What was the cost of your employees?')),
	          	'cost_risk'=>array(0=>array('type'=>'absolute', 'q'=>'What was the cost risk of your employees?')))), 1=>array('name'=>'Roads', 'questions'=>array(
	          	'performance'=>array(0=>array('type'=>'Yes or No', 'q'=>'What was your companies employee performance?')),
	          	'performance_risk'=>array(0=>array('type'=>'absolute', 'q'=>'This is the first question for risk?'), 1=>array('type'=>'absolute', 'q'=>'This is the second question for risk?')),
	          	'cost'=>array(0=>array('type'=>'money', 'q'=>'What was the cost of your employees?')),
	          	'cost_risk'=>array(0=>array('type'=>'absolute', 'q'=>'What was the cost risk of your employees?')))) )), 1=>array('name'=>'Level Name', 'child_type'=>'poa', 'child'=>array(0=>array('name'=>'Developers', 'questions'=>array(
	          	'performance'=>array(0=>array('type'=>'absolute', 'q'=>'What was your companies employee performance?')),
	          	'performance_risk'=>array(0=>array('type'=>'absolute', 'q'=>'What is the risk in your exployee department?')),
	          	'cost'=>array(0=>array('type'=>'money', 'q'=>'What was the cost of your employees?')),
	          	'cost_risk'=>array(0=>array('type'=>'Yes or No', 'q'=>'What was the cost risk of your employees?')))), 1=>array('name'=>'Management', 'questions'=>array(
	          	'performance'=>array(0=>array('type'=>'absolute', 'q'=>'What was your companies employee performance?')),
	          	'performance_risk'=>array(0=>array('type'=>'absolute', 'q'=>'This is the first question for risk?'), 1=>array('type'=>'absolute', 'q'=>'This is the second question for risk?')),
	          	'cost'=>array(0=>array('type'=>'money', 'q'=>'What was the cost of your employees?')),
	          	'cost_risk'=>array(0=>array('type'=>'absolute', 'q'=>'What was the cost risk of your employees?')))) )))
	          ),
          )
        );
        $this->db->query('insert into admin_rfi (id, name, owner, creation_date, modified_date, rfi) values("", "'.$name.'", "'.$owner.'", now(), now(), "'.addslashes(json_encode($rfi)).'");');
		  } else {
		  	$data['failedquery'] = 'true';
		  }
  	}
  	return $data;
  }

  function delete_rfi($rfi_id, $email, $password)
  {
  	$a_user = $this->User->check_user_credentials($email, $password);
  	$rfi = $this->Rfi->get_rfi($rfi_id);
  	if($a_user != false && intval($rfi['owner']) == $a_user['id']){
  		$this->db->query("delete from admin_rfi where id='$rfi_id';");
  	}
  }

  function update_rfi($data, $email, $password)
  {
    
  }

  function import_rfi($data)
  {
    
  }
}