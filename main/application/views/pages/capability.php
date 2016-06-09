<?php $this->load->view('partials/header');?>
<div class="dashboard">

	<div class="user-controls">
		<h2><span class="on-left">Model:<span><?php echo $model['name']; ?></span></span><?php echo $capability['name']; ?></h2>
		<br />
	</div>

	<div class="file-browser">
		<table border="0" cellpadding="0" cellspacing="0">
			<tr class="file-attributes">
				<td class="filename" style="width: 50%;">Filename</td>
				<td class="start-date">Date Created</td>
				<td class="end-date">Last Modified</td>
				<!--<td class="action">Action</td>-->
			</tr>
			<?php if(count($projects) == 0) : ?>
				<tr class="knuvu-file">
					<td>You currently have no projects.</td>
				</tr>
			<?php else : ?>
				<?php foreach ($projects as $project) : ?>
					<tr class="knuvu-file">
						<td class="filename"><a href="<?php echo base_url('open/'.$capability['id'].'/project/'.$project['id']); ?>"><b><?php echo $project['name']; ?>.kv</b></a></td>
						<td class="start-date"><?php echo $project['creation_date']; ?></td>
						<td class="end-date"><?php echo $project['modified_date']; ?></td>
<!--
						<td class="action">

							<a href="javascript:void(0)" onclick="$('form#project<?php echo $project['id']; ?>').submit()">
								<img src="<?php echo base_url('application/assets/images/template/remove-icon.png'); ?>" alt="create_knuvu" height="22" width="22">
							</a>
							<form action="<?php echo base_url("delete/".$capability['id']."/project/".$project['id']); ?>" method="POST" id="project<?php echo $project['id']; ?>">
								<input type="hidden" name="email" value="<?php echo $user['email']; ?>" />
								<input type="hidden" name="password" value="<?php echo $user['password']; ?>" />
							</form>
						</td>
-->
					</tr>
				<?php endforeach; ?>
			<?php endif; ?>
		</table>
	</div>

</div>
<?php $this->load->view('partials/footer'); ?>