<script>
edit = <?php echo( isset($no_edit) ? 'false' : 'true' ); ?>;
$(document).ready(function() {
	$.getJSON(<?php echo( "\"".base_url("feed/project/".$project['id']."/$api_key")."\"" );?>,{async: true}, function(yield){
		setTimeout(function(){
			var data = {};
			data.id = yield.id;
			data.name = yield.name;
			data.owner = yield.owner;
			data.sample = yield.sample;
			data.meta = yield.file.meta;
			data.competitor = yield.file.competition;
			data.poa = yield.file.poa;
			data.group = yield.file.group;
			data.discrete_poa = yield.file.dpoa;
			file.initFile('knuvu', data);
			var i = 5;while(i--){ file.resizeFile(); }
			file.loadNestedFiles(data.id);
		},0);
	});
});
</script>