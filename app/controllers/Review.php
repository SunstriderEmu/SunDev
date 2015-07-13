<?php

// VALIDATE SCRIPT
$app->post('/review/edit', function() use($app) {
	if(isset($_POST['sql'])) {
		$script = json_decode($_POST['sql']);
		$manager = new \SUN\DAO\DAO($app);
		if(isset($script->update)) {
			$manager->setQuery($script->update, 'test');
			$manager->setQuery($script->update, 'world');
		}
		if(isset($script->delete)) {
			$manager->setQuery($script->delete, 'test');
			$manager->setQuery($script->delete, 'world');
		}
		if(isset($script->insert)) {
			$manager->setQuery($script->insert, 'test');
			$manager->setQuery($script->insert, 'world');
		}
	}
	$review = json_decode($_POST['review']);
	$manager= new \SUN\DAO\ReviewDAO($app);
	$manager->setReview($review);

	switch($review->source_type) {
		case "0":
		case "1":
		case "9":
			$query = $app['dbs']['test_world']->prepare('SELECT * FROM smart_scripts WHERE entryorguid = :entry AND source_type = :source');
			$query->bindValue(':entry', $review->entryorguid, PDO::PARAM_STR);
			$query->bindValue(':source', $review->source_type, PDO::PARAM_STR);
			$query->execute();
			$all = $query->fetchAll();

			$delete = "DELETE FROM smart_scripts WHERE entryorguid = " . $review->entryorguid . " AND source_type = " . $review->source_type;
			$SQL 	= "INSERT IGNORE INTO smart_scripts (entryorguid, source_type, id, link, event_type, event_phase_mask, event_chance, event_flags, event_param1, event_param2, event_param3, event_param4, action_type, action_param1, action_param2, action_param3, action_param4, action_param5, action_param6, target_type, target_flags, target_param1, target_param2, target_param3, target_x, target_y, target_z, target_o, comment) VALUES ";
			foreach ($all as $key => $line) {
				$SQL .= "('" . $line['entryorguid'] . "', '" . $line['source_type'] . "', '" . $line['id'] . "', '" . $line['link'] . "', '" . $line['event_type'] . "', '" . $line['event_phase_mask'] . "', '" . $line['event_chance'] . "', '" . $line['event_flags'] . "', '" . $line['event_param1'] . "', '" . $line['event_param2'] . "', '" . $line['event_param3'] . "', '" . $line['event_param4'] . "', '" . $line['action_type'] . "', '" . $line['action_param1'] . "', '" . $line['action_param2'] . "', '" . $line['action_param3'] . "', '" . $line['action_param4'] . "', '" . $line['action_param5'] . "', '" . $line['action_param6'] . "', '" . $line['target_type'] . "', '" . $line['target_flags'] . "', '" . $line['target_param1'] . "', '" . $line['target_param2'] . "', '" . $line['target_param3'] . "', '" . $line['target_x'] . "', '" . $line['target_y'] . "', '" . $line['target_z'] . "', '" . $line['target_o'] . "', '" . $line['comment'] . "'),";
			}
			$SQL = substr($SQL, 0, -1);
			$manager->setQuery($delete, 'world');
			$manager->setQuery($SQL, 'world');
			break;
		case "3":
			$query = $app['dbs']['test_world']->prepare('SELECT * FROM waypoints WHERE entry = :entry');
			$query->bindValue(':entry', $review->entryorguid, PDO::PARAM_STR);
			$query->execute();
			$all = $query->fetchAll();

			$delete = "DELETE FROM waypoints WHERE entry = " . $review->entryorguid;
 			$SQL = "INSERT IGNORE INTO waypoints (entry, pointid, position_x, position_y, position_z, point_comment) VALUES ";
			foreach ($all as $key => $line) {
				$SQL .= "('" . $line['entry'] . "', '" . $line['pointid'] . "', '" . $line['position_x'] . "', '" . $line['position_y'] . "', '" . $line['position_z'] . "', '" . $line['point_comment'] . "'),";
			}
			$SQL = substr($SQL, 0, -1);
			$manager->setQuery($delete, 'world');
			$manager->setQuery($SQL, 'world');
			break;
		case "4":
			$query = $app['dbs']['test_world']->prepare('SELECT * FROM creature_text WHERE entry = :entry');
			$query->bindValue(':entry', $review->entryorguid, PDO::PARAM_STR);
			$query->execute();
			$all = $query->fetchAll();

			$delete = "DELETE FROM creature_text WHERE entry = " . $review->entryorguid;
			$SQL = "INSERT IGNORE INTO creature_text (entry, groupid, id, text, type, language, probability, emote, duration, sound, comment, BroadcastTextId, TextRange) VALUES ";
			foreach ($all as $key => $line) {
				$SQL .= "('" . $line['entry'] . "', '" . $line['groupid'] . "', '" . $line['id'] . "', '" . $line['text'] . "', '" . $line['type'] . "', '" . $line['language'] . "', '" . $line['probability'] . "', '" . $line['emote'] . "', '" . $line['duration'] . "', '" . $line['sound'] . "', '" . $line['comment'] . "', '" . $line['BroadcastTextId'] . "', '" . $line['TextRange'] . "'),";
			}
			$SQL = substr($SQL, 0, -1);
			$manager->setQuery($delete, 'world');
			$manager->setQuery($SQL, 'world');
			break;
		case "5":
			$query = $app['dbs']['test_world']->prepare('SELECT * FROM waypoint_data WHERE id = :id');
			$query->bindValue(':id', $review->entryorguid, PDO::PARAM_STR);
			$query->execute();
			$all = $query->fetchAll();

			$delete = "DELETE FROM waypoint_data WHERE id = " . $review->entryorguid;
			$SQL = "INSERT IGNORE INTO waypoint_data (id, point, position_x, position_y, position_z, orientation, delay, move_type, action, action_chance, wpguid) VALUES ";
			foreach ($all as $key => $line) {
				$SQL .= "('" . $line['id'] . "', '" . $line['point'] . "', '" . $line['position_x'] . "', '" . $line['position_y'] . "', '" . $line['position_z'] . "', '" . $line['orientation'] . "', '" . $line['delay'] . "', '" . $line['move_type'] . "', '" . $line['action'] . "', '" . $line['action_chance'] . "', '" . $line['wpguid'] . "'),";
			}
			$SQL = substr($SQL, 0, -1);
			$manager->setQuery($delete, 'world');
			$manager->setQuery($SQL, 'world');
			break;
		default: return;
	}

	return "Success";
});

// SEND REVIEW
$app->post('/review/new', function() use($app) {
	if(isset($_POST['sql'])) {
		$script = json_decode($_POST['sql']);
		$manager = new \SUN\DAO\DAO($app);
		if(isset($script->update)) {
			$manager->setQuery($script->update, 'test');
		}
		if(isset($script->delete)) {
			$manager->setQuery($script->delete, 'test');
		}
		if(isset($script->insert)) {
			$manager->setQuery($script->insert, 'test');
		}
	}
	$script = json_decode($_POST['review']);
	$manager= new \SUN\DAO\ReviewDAO($app);
	$manager->createReview($script);
	return "Success";
});