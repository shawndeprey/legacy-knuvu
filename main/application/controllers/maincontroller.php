<?php
class Maincontroller extends CI_Controller {

	public function index() {  if( ! file_exists('application/views/pages/index.php')){ show_404(); }
    $data = set_standard_page_data($this);
    $this->load->view('pages/index', $data);
  }
  public function admin() {  if( ! file_exists('application/views/pages/admin-panel.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] != 'true'){
      redirect(base_url('login/'), 'location');
    } else {
      if($data['user']['permission'] != 10){ redirect(base_url('dashboard/'), 'location'); }
      $data['models'] = $this->Capabilitymodel->all_models();
    }
    $this->load->view('pages/admin-panel', $data);
  }

  public function copy($file_id) {  if( ! file_exists('application/views/pages/dashboard.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] != 'true'){ redirect(base_url('login/'), 'location'); }
    $this->Project->copy_project($file_id);
    redirect(base_url('dashboard/'), 'location');
  }

	public function dashboard() {  if( ! file_exists('application/views/pages/dashboard.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] != 'true'){
      redirect(base_url('login/'), 'location');
    } else {
      $data['projects'] = $this->User->get_user_projects($data['user']['id']);
      $data['rfis'] = $this->User->get_user_rfis($data['user']['id']);
      $data['capabilities'] = $this->User->get_user_capabilities($data['user']['id']);
    }
    $this->load->view('pages/dashboard', $data);
  }

  public function login() {  if( ! file_exists('application/views/pages/login.php')){ show_404(); }
    $data = set_standard_page_data($this);
    $data = check_for_login_and_perform_login($data, $this);
    if($data['login'] == 'true'){ redirect(base_url('dashboard/'), 'location'); }
    $this->load->view('pages/login', $data);
  }

  public function logout() {  if( ! file_exists('application/views/pages/index.php')){ show_404(); }
    $this->session->set_userdata('login', 'false');
    redirect(base_url('login/'), 'location');
  }

  public function create($func) {  if( ! file_exists('application/views/pages/create.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] != 'true'){ redirect(base_url('login/'), 'location'); }
    if($func == 'knuvu' && isset($_POST['validate'])){
      $data = $this->Project->insert_project($data);
      if($data['failedquery'] != 'true'){ redirect(base_url('dashboard/'), 'location'); }
    }
    $this->load->view('pages/create', $data);
  }

  public function delete($proj_id) {  if( ! file_exists('application/views/pages/dashboard.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] != 'true'){ redirect(base_url('login/'), 'location'); }
    if(isset($_POST['email']) && isset($_POST['password'])){
      $this->Project->delete_project($proj_id, $_POST['email'], $_POST['password']);
    }
    redirect(base_url('dashboard/'), 'location');
  }

  public function deleterfi($rfi_id) {  if( ! file_exists('application/views/pages/dashboard.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] != 'true'){ redirect(base_url('login/'), 'location'); }
    if(isset($_POST['email']) && isset($_POST['password'])){
      $this->Rfi->delete_rfi($rfi_id, $_POST['email'], $_POST['password']);
    }
    redirect(base_url('dashboard/'), 'location');
  }

  public function deletecapability($id) {  if( ! file_exists('application/views/pages/dashboard.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] != 'true'){ redirect(base_url('login/'), 'location'); }
    if(isset($_POST['email']) && isset($_POST['password'])){
      $this->Capability->delete_capability($id, $_POST['email'], $_POST['password']);
    }
    redirect(base_url('dashboard/'), 'location');
  }

  public function deletecapabilityproject($cap_id, $proj_id) {  if( ! file_exists('application/views/pages/capability.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] != 'true'){ redirect(base_url('login/'), 'location'); }
    if(isset($_POST['email']) && isset($_POST['password'])){
      error_log("Capability: $cap_id  Project: $proj_id");
      $this->Project->delete_project($proj_id, $_POST['email'], $_POST['password']);
    }
    redirect(base_url("open/capability/$cap_id"), 'location');
  }

  public function deletemodel($id) {  if( ! file_exists('application/views/pages/dashboard.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] != 'true'){ redirect(base_url('login/'), 'location'); }
    if(isset($_POST['email']) && isset($_POST['password'])){
      if($data['user']['permission'] != 10){ redirect(base_url('dashboard/'), 'location'); }
      $this->Capabilitymodel->delete_model($id, $_POST['email'], $_POST['password']);
    }
    redirect(base_url('admin/'), 'location');
  }

  public function open($proj_id) {  if( ! file_exists('application/views/pages/file-knuvu.php')){ show_404(); }
    $data = set_standard_page_data($this);
    # Ensure we uncomment this when we clean this endpoint up
    # if($data['login'] != 'true'){ redirect(base_url('login/'), 'location'); }
    $data['project'] = $this->Project->get_project($proj_id);

    # The following is a temp fix to allow knuvu's to be viewed by anybody. Delete this junk when we move to ruby.
    $user_temp = $this->User->find_by_id($data['project']['owner']);
    $data['user'] = array(
      'id'=>$user_temp['id'],
      'email'=>$user_temp['email'],
      'password'=>$user_temp['password'],
      'permission'=>$user_temp['permission']
    );
    # This is the end of the stuff we need to junk

    $this->load->view('pages/file-knuvu', $data);
  }

  public function openrfi($rfi_id) {  if( ! file_exists('application/views/pages/rfi-builder.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] == 'true'){
      $data['rfi'] = $this->Rfi->get_rfi($rfi_id);
    } else {
      redirect(base_url('login/'), 'location');
    }
    $this->load->view('pages/rfi-builder', $data);
  }

  public function opencapability($id) {  if( ! file_exists('application/views/pages/capability.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] != 'true'){ redirect(base_url('login/'), 'location'); }
    $data = $this->User->get_capability_project($data['user']['id'], $id, $data);
    $data['model'] = $this->Capabilitymodel->get_limited_model($data['capability']['model_id']);
    $this->load->view('pages/capability', $data);
  }

  public function opencapabilityproject($cap_id, $proj_id) {  if( ! file_exists('application/views/pages/file-knuvu.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] != 'true'){ redirect(base_url('login/'), 'location'); }
    $data['project'] = $this->Project->get_project($proj_id);
    $data = build_back_button( $data, "Capability", base_url("open/capability/$cap_id") );
    $data['no_edit'] = true;
    $data['capability'] = $this->Capability->get_capability($cap_id);
    $this->load->view('pages/file-knuvu', $data);
  }

  public function save($func) {  if( ! file_exists('application/views/pages/file-knuvu.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] == 'true'){
      if($func == 'knuvu' && isset($_POST['email']) && isset($_POST['password']) && isset($_POST['project-id'])){
        $data = $this->Project->update_project($data, $_POST['email'], $_POST['password']);
        $data['saved'] = ($data['failedquery'] == 'true') ? 'false' : 'true';
        redirect(base_url('open/'.$_POST['project-id']), 'location');
      }
    } else {
      redirect(base_url('login/'), 'location');
    }
  }

  public function savecapabilityproject($cap_id, $proj_id) {  if( ! file_exists('application/views/pages/file-knuvu.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] == 'true'){
      if(isset($_POST['email']) && isset($_POST['password']) && isset($_POST['project-id'])){
        $data = $this->Project->update_project($data, $_POST['email'], $_POST['password']);
        $data['saved'] = ($data['failedquery'] == 'true') ? 'false' : 'true';
        redirect(base_url("open/$cap_id/project/$proj_id"), 'location');
      }
    } else {
      redirect(base_url('login/'), 'location');
    }
  }

  public function import() {  if( ! file_exists('application/views/pages/dashboard.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] == 'true'){
      $data = $this->Project->import_project($data);
    } else {
      redirect(base_url('login/'), 'location');
    }
    if(isset($_POST['project-id'])){
      redirect(base_url('open/'.$_POST['project-id']), 'location');
      //$data['project'] = $this->Project->get_project($_POST['project-id']);
      //$this->load->view('pages/file-knuvu', $data);
    } else {
      $data['projects'] = $this->User->get_user_projects($data['user']['id']);
      $data['importerror'] = 'true';
      $data['rfis'] = $this->User->get_user_rfis($data['user']['id']);
      $data['capabilities'] = $this->User->get_user_capabilities($data['user']['id']);
      $this->load->view('pages/dashboard', $data);
    }
  }

  public function importform() {  if( ! file_exists('application/views/pages/import.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] != 'true'){
      redirect(base_url('login/'), 'location');
    }
    $this->load->view('pages/import', $data);
  }

  public function importmodel() {  if( ! file_exists('application/views/pages/admin-panel.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] == 'true'){
      if(isset($_POST['validate'])){
        if($data['user']['permission'] != 10){ redirect(base_url('dashboard/'), 'location'); }
        $data = $this->Capabilitymodel->import_model($data);
        $data['models'] = $this->Capabilitymodel->all_models();
        $data['importerror'] = 'true';
        $this->load->view('pages/admin-panel', $data);
      } else {
        $this->load->view('pages/import-model', $data);
      }
    } else {
      redirect(base_url('login/'), 'location');
    }
  }

  public function createrfi() {  if( ! file_exists('application/views/pages/create-rfi.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] != 'true'){ redirect(base_url('login/'), 'location'); }
    if(isset($_POST['validate'])){
      $data = $this->Rfi->insert_rfi($data);
      if($data['failedquery'] != 'true'){ redirect(base_url('dashboard/'), 'location'); }
    }
    $this->load->view('pages/create-rfi', $data);
  }

  public function createcapability() {  if( ! file_exists('application/views/pages/create-capability.php')){ show_404(); }
    $data = set_standard_page_data($this);
    if($data['login'] != 'true'){ redirect(base_url('login/'), 'location'); }
    if(isset($_POST['validate'])){
      $data = $this->Capability->insert_capability($data);
      if($data['failedquery'] != 'true'){ redirect(base_url('dashboard/'), 'location'); }
    } else {
      $data['models'] = $this->Capabilitymodel->all_models();
    }
    $this->load->view('pages/create-capability', $data);
  }

  public function projectfeed($project_id, $api_key) { if( ! file_exists('application/views/pages/feed.php')){ show_404(); }
    $data['feed'] = check_api_key($api_key) ? $this->Project->get_project($project_id) : 'invalid key';
    $data['feed_type'] = 0;//Full Project Feed
    $this->load->view('pages/feed', $data);
  }
  public function projectmetafeed($project_id, $api_key) { if( ! file_exists('application/views/pages/feed.php')){ show_404(); }
    $data['feed'] = check_api_key($api_key) ? $this->Project->get_limited_project($project_id) : 'invalid key';
    $data['feed_type'] = 1;//Project Meta Data Feed
    $this->load->view('pages/feed', $data);
  }
  public function projectattributefeed($user_id, $api_key) { if( ! file_exists('application/views/pages/feed.php')){ show_404(); }
    $data['feed'] = check_api_key($api_key) ? $this->User->get_full_user_projects($user_id) : 'invalid key';
    $data['feed_type'] = 2;//Project Attribute Feed
    $this->load->view('pages/feed', $data);
  }

  public function products() { if( ! file_exists('application/views/pages/products.php')){ show_404(); }
    $data = set_standard_page_data($this);
    $this->load->view('pages/products', $data);
  }
  public function professionalservices() { if( ! file_exists('application/views/pages/prof-services.php')){ show_404(); }
    $data = set_standard_page_data($this);
    $this->load->view('pages/prof-services', $data);
  }
  public function trainingsupport() { if( ! file_exists('application/views/pages/prof-services.php')){ show_404(); }
    $data = set_standard_page_data($this);
    $this->load->view('pages/training-and-support', $data);
  }
  public function advisors() { if( ! file_exists('application/views/pages/prof-services.php')){ show_404(); }
    $data = set_standard_page_data($this);
    $this->load->view('pages/advisors', $data);
  }
  public function corpdevelopment() { if( ! file_exists('application/views/pages/prof-services.php')){ show_404(); }
    $data = set_standard_page_data($this);
    $this->load->view('pages/corp-development', $data);
  }
  public function about() { if( ! file_exists('application/views/pages/about.php')){ show_404(); }
    $data = set_standard_page_data($this);
    $this->load->view('pages/about', $data);
  }
  public function consultingtransaction() { if( ! file_exists('application/views/pages/consulting-transaction.php')){ show_404(); }
    $data = set_standard_page_data($this);
    $this->load->view('pages/consulting-transaction', $data);
  }
  public function contactus() { if( ! file_exists('application/views/pages/contact.php')){ show_404(); }
    $data = set_standard_page_data($this);
    $this->load->view('pages/contact', $data);
  }
  public function boarddirectors() { if( ! file_exists('application/views/pages/board-of-directors.php')){ show_404(); }
    $data = set_standard_page_data($this);
    $this->load->view('pages/board-of-directors', $data);
  }

}