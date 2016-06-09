<?php $this->load->view('partials/header');?>
<div class="login-form">
	<?php if($failedlogin == 'true') : ?>
		<p class='failed-login'>The username or password entered was incorrect.</p>
	<?php endif; ?>
	<h2 class="form-header">Login</h2><br />
  <form action="<?php echo base_url('login/'); ?>" method="POST" class="validated-form">
    <input type="text" name="email" placeholder="Email" class="form-text-input" /><br />
    <input type="password" name="password" placeholder="Password" class="form-text-input" /><br />
    <center><input type="submit" value="Login" class="form-submit-input" /></center>
  </form>
</div>
<?php $this->load->view('partials/footer'); ?>