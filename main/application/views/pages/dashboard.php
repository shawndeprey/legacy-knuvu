<?php $this->load->view('partials/header');?>
<?php $this->load->view('partials/import-model');?>
<div class="dashboard">
	<div class="file-menu" id="page-has-custom-input">

		<div class="tabs">
			<ul>
				<li><a href="javascript:knuvu.changeDashboardTab('knuvu')" class="selected dashboard-tab" id="tab-knuvu">KnuVu</a></li>
				<li><a href="javascript:knuvu.changeDashboardTab('rethink')" class="dashboard-tab" id="tab-rethink">Re-Think</a></li>
				<li><a href="javascript:knuvu.changeDashboardTab('rfi')" class="dashboard-tab" id="tab-rfi">Request for Information</a></li>
			</ul>
		</div>

		<div id="knuvu" class="active dashboard-menu-item">
			<div class="user-controls">
				<a href="<?php echo base_url('create/new/'); ?>">
					<p><img src="<?php echo base_url('application/assets/images/template/add-icon.png'); ?>" alt="create_knuvu" height="22" width="22"><span>Create Blank KnuVu</span></p>
				</a>
				<a href="javascript:knuvu.toggleImportModel();">
					<p><img src="<?php echo base_url('application/assets/images/template/import-icon.png'); ?>" alt="import_knuvu" height="22" width="22"><span>Import KnuVu</span></p>
				</a>
			</div>
			<div class="file-browser">
				<table border="0" cellpadding="0" cellspacing="0">
					<tr class="file-attributes">
						<td class="filename">Filename</td>
						<td class="start-date">Date Created</td>
						<td class="end-date">Last Modified</td>
						<td class="action">Action</td>
					</tr>
					<?php if(count($projects) == 0) : ?>
						<tr class="knuvu-file">
							<td>You currently have no projects.</td>
						</tr>
					<?php else : ?>
						<?php foreach ($projects as $project) : ?>
							<tr class="knuvu-file">
								<td class="filename"><a href="<?php echo base_url('open/'.$project['id']); ?>"><b><?php echo $project['name']; ?>.kv</b></a></td>
								<td class="start-date"><?php echo $project['creation_date']; ?></td>
								<td class="end-date"><?php echo $project['modified_date']; ?></td>
								<td class="action">
									<a href="javascript:void(0)" onclick="$('form#project<?php echo $project['id']; ?>').submit()" class="inline-actions">
										<img src="<?php echo base_url('application/assets/images/template/remove-icon.png'); ?>" alt="create_knuvu" height="22" width="22">
									</a>
									<form action="<?php echo base_url('delete/project/'.$project['id']); ?>" method="POST" id="project<?php echo $project['id']; ?>">
										<input type="hidden" name="email" value="<?php echo $user['email']; ?>" />
										<input type="hidden" name="password" value="<?php echo $user['password']; ?>" />
									</form>
									<a href="<?php echo base_url('copy/'.$project['id']); ?>" class="inline-actions">
										<img src="<?php echo base_url('application/assets/images/template/add-icon.png'); ?>" alt="copy_knuvu" height="22" width="22">
									</a>
								</td>
							</tr>
						<?php endforeach; ?>
					<?php endif; ?>
				</table>
			</div>
		</div>


		<div id="rethink" class="hidden dashboard-menu-item">
			<div class="user-controls">
				<a href="<?php echo base_url('create/capability/'); ?>">
					<p><img src="<?php echo base_url('application/assets/images/template/add-icon.png'); ?>" alt="create_knuvu" height="22" width="22"><span>Create Model</span></p>
				</a>
			</div>
			<div class="file-browser">
				<table border="0" cellpadding="0" cellspacing="0">
					<tr class="file-attributes">
						<td class="filename">Capability Model</td>
						<td class="start-date">Date Created</td>
						<td class="end-date">Last Modified</td>
						<td class="action">Action</td>
					</tr>
					<?php if(count($capabilities) == 0) : ?>
						<tr class="knuvu-file">
							<td>You currently have no projects.</td>
						</tr>
					<?php else : ?>
						<?php foreach ($capabilities as $capability) : ?>
							<tr class="knuvu-file">
								<td class="filename"><a href="<?php echo base_url('open/capability/'.$capability['id']); ?>"><b><?php echo $capability['name']; ?></b></a></td>
								<td class="start-date"><?php echo $capability['creation_date']; ?></td>
								<td class="end-date"><?php echo $capability['modified_date']; ?></td>
								<td class="action">
									<a href="javascript:void(0)" onclick="$('form#capability<?php echo $capability['id']; ?>').submit()">
										<img src="<?php echo base_url('application/assets/images/template/remove-icon.png'); ?>" alt="create_knuvu" height="22" width="22">
									</a>
									<form action="<?php echo base_url('delete/capability/'.$capability['id']); ?>" method="POST" id="capability<?php echo $capability['id']; ?>">
										<input type="hidden" name="email" value="<?php echo $user['email']; ?>" />
										<input type="hidden" name="password" value="<?php echo $user['password']; ?>" />
									</form>
								</td>
							</tr>
						<?php endforeach; ?>
					<?php endif; ?>
				</table>
			</div>
		</div>

		<div id="rfi" class="hidden dashboard-menu-item">
			<div class="user-controls">
				<a href="<?php echo base_url('create/rfi/'); ?>">
					<p><img src="<?php echo base_url('application/assets/images/template/add-icon.png'); ?>" alt="create_knuvu" height="22" width="22"><span>Create RFI</span></p>
				</a>
			</div>
			<div class="file-browser">
				<table border="0" cellpadding="0" cellspacing="0">
					<tr class="file-attributes">
						<td class="filename">RFI Name</td>
						<td class="start-date">Date Created</td>
						<td class="end-date">Last Modified</td>
						<td class="action">Action</td>
					</tr>
					<?php if(count($rfis) == 0) : ?>
						<tr class="knuvu-file">
							<td>You currently have no projects.</td>
						</tr>
					<?php else : ?>
						<?php foreach ($rfis as $rfi) : ?>
							<tr class="knuvu-file">
								<td class="filename"><a href="<?php echo base_url('open/rfi/'.$rfi['id']); ?>"><b><?php echo $rfi['name']; ?>.rfi</b></a></td>
								<td class="start-date"><?php echo $rfi['creation_date']; ?></td>
								<td class="end-date"><?php echo $rfi['modified_date']; ?></td>
								<td class="action">
									<a href="javascript:void(0)" onclick="$('form#rfi<?php echo $rfi['id']; ?>').submit()">
										<img src="<?php echo base_url('application/assets/images/template/remove-icon.png'); ?>" alt="create_knuvu" height="22" width="22">
									</a>
									<form action="<?php echo base_url('delete/rfi/'.$rfi['id']); ?>" method="POST" id="rfi<?php echo $rfi['id']; ?>">
										<input type="hidden" name="email" value="<?php echo $user['email']; ?>" />
										<input type="hidden" name="password" value="<?php echo $user['password']; ?>" />
									</form>
								</td>
							</tr>
						<?php endforeach; ?>
					<?php endif; ?>
				</table>
			</div>
		</div>

	</div>
</div>
<?php $this->load->view('partials/footer'); ?>