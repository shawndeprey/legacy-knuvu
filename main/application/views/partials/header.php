<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
	<title><?php echo $title; ?></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<link rel="stylesheet" href="<?php echo base_url('application/assets/css/knuvu.css'); ?>" type="text/css" media="screen"/>
	<link rel="stylesheet" href="<?php echo base_url('application/assets/css/rfi.css'); ?>" type="text/css" media="screen"/>
	<script type="text/javascript" src="<?php echo base_url('application/assets/js/jquery-1.8.2.min.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo base_url('application/assets/js/jquery.placeholder.min.js'); ?>"></script>
	<script type="text/javascript">var base_url = "<?php echo base_url(''); ?>"; var api_key = "<?php echo $api_key; ?>"; var user_id = <?php echo( isset($user) ? $user['id'] : 'null' ); ?>; </script>
  <script type="text/javascript" src="<?php echo base_url('application/assets/js/input.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo base_url('application/assets/js/knuvu.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo base_url('application/assets/js/file.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo base_url('application/assets/js/rfi.js'); ?>"></script>
</head>
<body>
<?php $this->load->view('partials/error');?>
<?php $this->load->view('partials/menu');?>
<div class="content">