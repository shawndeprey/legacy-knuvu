<div class="import-model login-form" id="import">
	<h2 class="form-header">Import CSV</h2><br />
	<form enctype="multipart/form-data" action="<?php echo base_url('import/csv/'); ?>" method="POST" class="validated-form">
		<input type="text" name="name" placeholder="Project Name" class="form-text-input" /><br />
		<label for="import_type">Import Type:</label>
    <select name="import_type" class="import-select">
    	<option value="performance">Performance</option>
		  <option value="risk">Risk</option>
		  <option value="label">Label</option>
    </select>
    <br />
    <label for="csv_file">File to Import:</label>
    <input name="csv_file" type="file" /><br />
    <center><input type="submit" value="Import" class="form-submit-input" /></center>
    <center><a href="javascript:knuvu.toggleImportModel();" class="cancel">Cancel</a></center>
	</form>
</div>