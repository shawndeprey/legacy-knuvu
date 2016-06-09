<?php $this->load->view('partials/header');?>
<div class="create-form create-capability">
	<?php if($failedquery == 'true') : ?>
		<p class='failed-login'>Capability project name already in use.</p>
	<?php endif; ?>
	<h2 class="form-header">Create Capability Model</h2><br />
  <form action="<?php echo base_url('create/capability/'); ?>" method="POST" class="validated-form">
  	<input type="hidden" name="validate" value="true" />
  	<input type="hidden" name="owner" value="<?php echo $user['id']; ?>" />
  	<center>
	    <input type="text" name="name" placeholder="Capability Project Name" class="form-text-input" /><br />
	    <input type="text" name="sample" placeholder="Candidate" class="form-text-input" /><br />
    </center>
    <label for="model" class="model">Model</label>
		<select id="model" name="model" >
			<?php foreach ($models as $model) : ?>
				<option value="<?php echo $model['id']; ?>"><?php echo $model['name']; ?></option>
			<?php endforeach; ?>
		</select>
    <center><input type="submit" value="Create" class="form-submit-input" /></center>
  </form>
</div>
<?php $this->load->view('partials/footer'); ?>