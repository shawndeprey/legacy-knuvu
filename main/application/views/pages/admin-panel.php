<?php $this->load->view('partials/header');?>
<div class="dashboard">

	<div class="user-controls">
		<h2>Capability Models</h2>
		<a href="<?php echo base_url('import/model/'); ?>">
			<p><img src="<?php echo base_url('application/assets/images/template/import-icon.png'); ?>" alt="import_capability" height="22" width="22"><span>Import Capability Model</span></p>
		</a>
	</div>

	<div class="file-browser">
		<table border="0" cellpadding="0" cellspacing="0">
			<tr class="file-attributes">
				<td class="filename">Capability Model</td>
				<td class="action">Action</td>
			</tr>
			<?php if(count($models) == 0) : ?>
				<tr class="knuvu-file">
					<td>You currently have no capability models.</td>
				</tr>
			<?php else : ?>
				<?php foreach ($models as $model) : ?>
					<tr class="knuvu-file">
						<td class="filename"><a href="javascript:void(0)"><b><?php echo $model['name']; ?></b></a></td>
						<td class="action">
							<a href="javascript:void(0)" onclick="$('form#model<?php echo $model['id']; ?>').submit()">
								<img src="<?php echo base_url('application/assets/images/template/remove-icon.png'); ?>" alt="create_knuvu" height="22" width="22">
							</a>
							<form action="<?php echo base_url('delete/model/'.$model['id']); ?>" method="POST" id="model<?php echo $model['id']; ?>">
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
<?php $this->load->view('partials/footer'); ?>