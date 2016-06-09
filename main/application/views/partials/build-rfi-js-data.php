<script>
	var data = {};
	var temp = jQuery.parseJSON('<?php echo $rfi['rfi']; ?>');
	data.id = <?php echo $rfi['id']; ?>;
	data.name = '<?php echo $rfi['name']; ?>';
	data.owner = <?php echo $rfi['owner']; ?>;
	data.level = temp.level;
	rfi.initRFI('builder');
</script>