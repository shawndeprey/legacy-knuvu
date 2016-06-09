<?php $this->load->view('partials/header');?>
<div class="create-form">
	<?php if($failedquery == 'true') : ?>
		<p class='failed-login'>RFI name already in use.</p>
	<?php endif; ?>
	<h2 class="form-header">Create New RFI</h2><br />
  <form action="<?php echo base_url('create/rfi/'); ?>" method="POST" class="validated-form">
  	<input type="hidden" name="validate" value="true" />
  	<input type="hidden" name="owner" value="<?php echo $user['id']; ?>" />
    <input type="text" name="name" placeholder="RFI Name" class="form-text-input" /><br />
    <center><input type="submit" value="Create" class="form-submit-input" /></center>
  </form>
</div>
<?php $this->load->view('partials/footer'); ?>