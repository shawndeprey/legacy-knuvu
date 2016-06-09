<?php $this->load->view('partials/header');?>
<div class="login-form">
	<h2 class="form-header">Import Capability Model</h2><br />
  <form enctype="multipart/form-data" action="<?php echo base_url('import/model/'); ?>" method="POST" class="validated-form">
  	<input type="hidden" name="validate" value="true" />
    <input type="text" name="name" placeholder="Model Name" class="form-text-input" /><br />
    <label for="csv_file">File to Import:</label>
    <input name="csv_file" type="file" /><br />
    <center><input type="submit" value="Import" class="form-submit-input" /></center>
  </form>
</div>
<?php $this->load->view('partials/footer'); ?>