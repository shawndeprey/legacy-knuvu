<div class="menu">
	<ul>
		<li><a href="<?php echo base_url(); ?>"><img src="<?php echo base_url('application/assets/images/template/logo.png'); ?>" class="logo" alt="knuvu_logo" /></a></li>
		<?php if($login != 'true') : ?>
      <li class="text-button"><a href="<?php echo base_url('/'); ?>"><p>WELCOME</p></a></li>
    	<li class="right-bar text-button"><a href="<?php echo base_url('login/'); ?>"><p>LOGIN</p></a></li>
    	<li class="right-bar text-button"><a href="<?php echo base_url('login/'); ?>"><p>REGISTER</p></a></li>
  	<?php else : ?>
  		<li class="text-button"><a href="<?php echo base_url('dashboard/'); ?>"><p>DASHBOARD</p></a></li>
  		<li class="right-bar text-button"><a href="<?php echo base_url('logout/'); ?>"><p>LOGOUT</p></a></li>
  		<?php if($user['permission'] == 10) : ?>
		  	<li class="right-bar text-button"><a href="<?php echo base_url('admin/'); ?>"><p>ADMIN</p></a></li>
			<?php endif; ?>
  	<?php endif; ?>
  	<?php if( isset($back) ) : ?>
			<li class="text-button"><a href="<?php echo $back['url']; ?>"><p><?php echo $back['title']; ?></p></a></li>
		<?php endif; ?>
	</ul>
</div>