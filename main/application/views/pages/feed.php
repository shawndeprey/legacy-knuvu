<?php
if($feed == 'invalid key'){
	echo ("Invalid API key or project does not exist.");
} else {
	switch($feed_type){
		case 0:{//Full Project
			$json_feed = json_encode( array(
				'id'=>$feed['id'],
				'capability_id'=>$feed['capability_id'],
				'name'=>$feed['name'],
				'owner'=>$feed['owner'],
				'sample'=>$feed['sample'],
				'creation_date'=>$feed['creation_date'],
				'modified_date'=>$feed['modified_date'],
				'file'=>json_decode($feed['file'])
			)); break;
		}
		case 1:{//Project Meta Feed
			$json_feed = json_encode( array(
				'id'=>$feed['id'],
				'capability_id'=>$feed['capability_id'],
				'name'=>$feed['name'],
				'owner'=>$feed['owner'],
				'sample'=>$feed['sample'],
				'creation_date'=>$feed['creation_date'],
				'modified_date'=>$feed['modified_date']
			)); break;
		}
		case 2:{//Project Attributes Feed
			$json_feed_temp = array();
			foreach ($feed as $f){
				$model = json_decode($f['file']);
				array_push($json_feed_temp, array('id'=>$f['id'], 'name'=>$f['name'], 'groups'=>$model->group));
			}
			$json_feed = json_encode($json_feed_temp);
			break;
		}
	}
}
echo ($json_feed);