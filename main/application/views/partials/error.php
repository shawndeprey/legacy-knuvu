<div class="error-form form-header">
	<h2>Error: <span>title</span></h2>
	<p>This is an error description.</p>
	<center><input type="button" value="Ok" class="form-submit-input file-form-input" onclick="knuvu.removeError();" /></center>
</div>
<script>
<?php
	if( isset($GLOBALS["phperror"]) ){
		if( isset($importerror) ){
			echo 'setTimeout(\'knuvu.throwError("Import", "Woops! It looks like there were some issues importing your file. We imported what we could, but, please ensure you follow all of the importing guidelines.")\', 500);';
		}
	}
?>
</script>