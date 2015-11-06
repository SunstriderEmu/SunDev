<?php

namespace SUN\DAO;

use PDO;

class PathDAO extends DAO {

	public function getPath($path) {
		$point = $this->test->fetchAssoc('SELECT COUNT(point) as count FROM waypoint_data WHERE id = ?', array(intval($path)));

		return $path = [
			"path" => $path,
			"points" => $point['count'],
			];
	}

	public function getEntryPath($entry) {
		$query  = $this->test->prepare('SELECT entry FROM waypoints WHERE entry = :entry');
		$query->bindValue(':entry', $entry, PDO::PARAM_INT);
		$query->execute();

		return $query->rowCount() > 0 ? false : true;
	}

	public function setTransfer($info, $db) {
		$name  = $this->$db->fetchAssoc('SELECT name FROM creature_template WHERE entry = ?', array(intval($info->entry)));

		// Delete previous waypoints
		$this->$db->executeQuery('DELETE FROM waypoints WHERE entry = ?', array(intval($info->entry)));

		// Points to transfer
		$points = $this->$db->fetchAll('SELECT point, position_x, position_y, position_z FROM waypoint_data WHERE id = ?', array(intval($info->path)));

		// Transfer
		$insert = 'INSERT IGNORE INTO waypoints (entry, pointid, position_x, position_y, position_z, point_comment';
		foreach($points as $point) {
			$insert .= "({$info->entry}, {$point['point']}, {$point['position_x']}, {$point['position_y']}, {$point['position_z']}, {$name['name']}),'";
		}
		$insert = rtrim($insert, ',');

		$this->$db->executeQuery($insert);
	}

	public function setPause($info, $db) {
		$this->$db->executeQuery('UPDATE waypoint_data SET delay = ? WHERE id = ? AND point = ?;', array(intval($info->delay), intval($info->path), intval($info->point)));
	}

	public function sendTransfer($info) {
		$get = $this->test->fetchAssoc('SELECT COUNT(*) as count FROM waypoints WHERE entry = ?', array(intval($info->entry)));
		$review = [
			"entry" 	=> $info->entry,
			"source"	=> $info->source,
			"user"		=> $info->user,
			'info1' 	=> $info->path
		];
		if($get['count'] != 0)
			$review['info1'] = -1 * intval($review['info1']);
		$manager = new ReviewDAO($this->app);
		$manager->createReview($review);
	}

	public function sendPause($info) {
		return $this->tools->executeQuery('INSERT INTO smart_review (entryorguid, source_type, path, info1, user, date) VALUES (?, ?, ?, ?, ?, ?)
											 ON DUPLICATE KEY UPDATE path = ?, info1 = ?, date = ?, user = ?', array(
				"entry"	=> intval($info->path),
				"source"	=> intval($info->source),
			"point"	=> intval($info->point),
			"delay"	=> intval($info->delay),
			"user" => intval($info->user), time()));
	}
} 