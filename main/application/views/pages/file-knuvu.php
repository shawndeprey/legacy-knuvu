<?php $this->load->view('partials/loading-screen');?>
<?php $this->load->view('partials/header');?>
<?php $this->load->view('partials/import-model');?>
<div class="file-menu" id="page-has-custom-input">

	<div class="tabs">
		<ul>
			<li><a href="javascript:file.changeTab('general')" class="selected" id="tab-general">General</a></li>
			<li><a href="javascript:file.changeTab('sample')" id="tab-sample">Candidate</a></li>
			<li><a href="javascript:file.changeTab('group')" id="tab-group">Group</a></li>
			<li><a href="javascript:file.changeTab('poa')" id="tab-poa">Point of Analysis(PoA)</a></li>
			<li><a href="javascript:file.changeTab('dpoa')" id="tab-dpoa">Discrete PoA</a></li>
		</ul>
	</div>

	<div class="general-menu sub-file-menu" id="general">
		<div class="upper-menu">
			<form action="<?php echo( isset($capability) ? base_url("save/knuvu/".$capability['id']."/".$project['id']."/") : base_url('save/knuvu/') ); ?>" id="general" method="POST">
				<input type="text" name="project-name" placeholder="File Name" class="form-text-input file-form-input" id="file-name" />
				<!--<label for="file-sample">Candidate:</label>
				<input type="text" name="project-sample" placeholder="First Candidate" class="form-text-input file-form-input file-form-input-disabled" id="file-sample" disabled="disabled" />
				<br />-->
				<label for="layout_type" class="layout_type">View Type</label>
				<select id="layout_type" >
				  <option value="performance">performance</option>
				</select>
				<label for="toggle-risk-checkbox" class="layout_type">Risk</label>
				<input type="checkbox" name="toggle-risk" id="toggle-risk-checkbox" checked="true">
				<label for="toggle-label-checkbox" class="layout_type">Label</label>
				<input type="checkbox" name="toggle-label" id="toggle-label-checkbox" checked="true">
				<a href="javascript:knuvu.toggleImportModel();" class="import-on-file">
					<p><img src="<?php echo base_url('application/assets/images/template/import-icon.png'); ?>" alt="import_knuvu" height="22" width="22"><span>Import KnuVu</span></p>
				</a>
				<input type="hidden" name="project-id" value="<?php echo $project['id']; ?>" />
				<input type="hidden" name="project-sample" id="file-sample" />
				<input type="hidden" name="project-file" id="project-file" />
				<input type="hidden" name="email" value="<?php echo $user['email']; ?>" />
				<input type="hidden" name="password" value="<?php echo $user['password']; ?>" />
				<span class="on-right"><input type="submit" value="Save" class="form-submit-input file-form-input" onclick="file.save();return false;" /></span>
			</form>
		</div>
	</div>

	<div class="samples-menu sub-file-menu" id="sample">
		<div class="upper-menu">
			<form action="javascript:file.updateObject('sample');" id="sample">
				<!--<label for="display-order">Display Order(disabled)</label>
				<select id="display-order">
				  <option value="1">1</option>
				</select>-->
				<input type="text" placeholder="Candidate Name" id="name" class="form-text-input file-form-input" />
				<input type="hidden" id="sample_name" />
				<span class="on-right">
					<input type="submit" value="Confirm" class="form-submit-input file-form-input" />
					<a href="javascript:file.deleteObject('sample');" class="remove-object">
						<img src="<?php echo base_url('application/assets/images/template/remove-icon.png'); ?>" alt="remove_object" height="22" width="22">
					</a>
				</span>
			</form>
		</div>
	</div>

	<div class="group-menu sub-file-menu" id="group">
		<div class="upper-menu">
			<form action="javascript:file.updateObject('group');" id="group">
				<!--<label for="display-order">Display Order(disabled)</label>
				<select id="display-order">
				  <option value="1">1</option>
				</select>-->
				<input type="text" placeholder="Group Name" id="name" class="form-text-input file-form-input" />
				<input type="hidden" id="group_name" />
				<span class="on-right">
					<input type="submit" value="Confirm" class="form-submit-input file-form-input" />
					<a href="javascript:file.deleteObject('group');" class="remove-object">
						<img src="<?php echo base_url('application/assets/images/template/remove-icon.png'); ?>" alt="remove_object" height="22" width="22">
					</a>
				</span>
			</form>
		</div>
	</div>

	<div class="poa-menu sub-file-menu" id="poa">
		<div class="upper-menu" id="poa_menu_upper">
			<form action="javascript:file.updateObject('poa');" id="poa">
				<!--<label for="display-order">Display Order(disabled)</label>
				<select class="display_order" id="display-order">
				  <option value="1">1</option>
				</select>-->
				<input type="text" placeholder="Analysis Point" id="name" class="form-text-input file-form-input non-nested-control" />
				<label for="poa_group" class="spacing non-nested-control">Group</label>
				<select id="poa_group" class="non-nested-control">
				  <option value="none">none</option>
				</select>
				<label for="priority" class="extra-spacing non-nested-control">Priority</label>
				<select id="priority" class="non-nested-control">
				  <option value="0">0 - No Priority</option>
				  <option value="1">1 - Low Priority</option>
				  <option value="2">2 - Some Priority</option>
				  <option value="3">3 - High Priority</option>
				</select>
				<br class="non-nested-control" />
				<label for="rank_by" class="extra-spacing non-nested-control">Rank By</label>
				<select id="rank_by" class="non-nested-control">
				  <option value="0">Absolute</option>
				  <option value="1">Mean</option>
				  <option value="2">Benchmark</option>
				</select>
				<label for="scale" class="extra-spacing non-nested-control">Scale</label>
				<select id="scale" class="non-nested-control">
				  <option value="0">Low to High</option>
				  <option value="1">High to Low</option>
				</select>
				<label for="benchmark" class="extra-spacing non-nested-control">Benchmark</label>
				<select id="benchmark" class="non-nested-control">
				  <option value="null">None</option>
				</select>

				<label for="toggle-nested" class="extra-spacing">Nested</label>
				<input type="checkbox" id="toggle-nested" class="inline-element">
				<div class="nested-control">
					<a href="javascript:file.toggleModelMenu();" class="toggle-model-button" id="toggle_model_button">edit</a>
					<label class="extra-spacing" id="nested-model-label">Nested Model: <span>none</span></label>
				</div>

				<br class="nested-control" />
				<br class="nested-control" />

				<input type="hidden" id="poa_nested_type" val="0" />
				<input type="hidden" id="poa_nested_file_id" val="0" />
				<input type="hidden" id="poa_nested_group_id" val="0" />

				<input type="hidden" id="poa_name" />
				<input type="hidden" id="poa_group_name" />
				<input type="hidden" id="priority_original" />
				<input type="hidden" id="rank_by_original" />
				<input type="hidden" id="scale_original" />
				<input type="hidden" id="benchmark_original" />
				<input type="hidden" id="poa_id" />

				<span class="on-right">
					<input type="submit" value="Confirm" class="form-submit-input file-form-input" />
					<a href="javascript:file.deleteObject('poa');" class="remove-object">
						<img src="<?php echo base_url('application/assets/images/template/remove-icon.png'); ?>" alt="remove_object" height="22" width="22">
					</a>
				</span>
			</form>
		</div>
		<!--<div class="lower-menu" id="dpoa_menu_lower"></div>-->
	</div>

	<div class="dpoa-menu sub-file-menu" id="dpoa">
		<div class="upper-menu">
			<form action="javascript:file.updateObject('dpoa');" id="dpoa">
				<div class="select-box">
					<div id="non-nested-attributes">
						<label for="performance" class="spacing">Performance</label>
						<select id="performance">
							<?php for($i = 1; $i <= 10; $i++){ echo( "<option value='$i'>$i</option>" ); }?>
						</select>
						<label for="risk" class="extra-spacing">Risk</label>
						<select id="risk">
						  <option value="0">0 - No Risk</option>
						  <option value="1">1 - Low Risk</option>
						  <option value="2">2 - Some Risk</option>
						  <option value="3">3 - High Risk</option>
						</select>
					</div>
				</div>
				<input type="text" placeholder="Label" id="label" class="form-text-input file-form-input" />
				<input type="hidden" id="poa" />
				<input type="hidden" id="sample" />
				<input type="hidden" id="label_original" />
				<input type="hidden" id="performance_original" />
				<input type="hidden" id="risk_original" />
				<span class="on-right"><input type="submit" value="Confirm" class="form-submit-input file-form-input" /></span>
			</form>
		</div>
	</div>

</div>

<div class="knuvu-file">
	<div class="internal-file-container">
	  <div class="competition">
	  	<div class="competition-header">
	  		<a href="#" class="add-sample" id="add-sample" onclick="file.addSample()">+</a>
	  	</div>
	  	<div id="competition-content"></div>
	  </div>
	  <div class="poa-container">
	  	<div class="poa-section"></div>
	  </div>
	</div>
</div>
<?php $this->load->view('partials/build-knuvu-js-data');?>
<?php $this->load->view('partials/user-model-feed');?>
<?php $this->load->view('partials/footer'); ?>