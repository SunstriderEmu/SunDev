<?php

namespace SUN\DAO;

use PDO;

class PathDAO extends DAO {

	public function getPath($path) {
		$query = $this->test->prepare('SELECT COUNT(point) as count FROM waypoint_data WHERE id = :pathID');
		$query->bindValue(':pathID', $path, PDO::PARAM_INT);
		$query->execute();
		$point = $query->fetch();

		return $path = [
			"path" => $path,
			"points" => $point['count'],
			];
	}

	public function getEntryPath($entry) {
		$query  = $this->test->prepare('SELECT entry FROM waypoints WHERE entry = :entry');
		$query->bindValue(':entry', $entry, PDO::PARAM_INT);
		$query->execute();

		return $free = $query->rowCount() > 0 ? false : true;
	}

	public function setTransfer($info, $db) {
		$query  = $this->$db->prepare('SELECT name FROM creature_template WHERE entry = :entry');
		$query->bindValue(':entry', $info->entry, PDO::PARAM_INT);
		$query->execute();
		$getName = $query->fetch();

		// Delete previous waypoints
		$query  = $this->$db->prepare('DELETE FROM waypoints WHERE entry = :entry');
		$query->bindValue(':entry', $info->entry, PDO::PARAM_INT);
		$query->execute();

		// Points to transfer
		$query  = $this->$db->prepare('SELECT point, position_x, position_y, position_z FROM waypoint_data WHERE id = :pathID');
		$query->bindValue(':pathID', $info->path, PDO::PARAM_INT);
		$query->execute();

		// Transfer
		while($getPoints = $query->fetch()) {
			$transferQuery = $this->$db->prepare('INSERT IGNORE INTO waypoints (entry, pointid, position_x, position_y, position_z, point_comment)
												  VALUES (:entry, :pointid, :position_x, :position_y, :position_z, :comment)');
			$transferQuery->bindValue(':entry',      $info->entry, PDO::PARAM_INT);
			$transferQuery->bindValue(':pointid',    $getPoints["point"], PDO::PARAM_INT);
			$transferQuery->bindValue(':position_x', $getPoints["position_x"], PDO::PARAM_INT);
			$transferQuery->bindValue(':position_y', $getPoints["position_y"], PDO::PARAM_INT);
			$transferQuery->bindValue(':position_z', $getPoints["position_z"], PDO::PARAM_INT);
			$transferQuery->bindValue(':comment',    $getName["name"], PDO::PARAM_STR);
			$transferQuery->execute();
		}
	}

	public function setPause($info, $db) {
		$update = $this->$db->prepare('UPDATE waypoint_data SET delay = :delay WHERE id = :pathID AND point = :point;');
		$update->bindValue(':delay', $info->delay, PDO::PARAM_INT);
		$update->bindValue(':pathID', $info->path, PDO::PARAM_INT);
		$update->bindValue(':point', $info->point, PDO::PARAM_INT);
		$update->execute();
	}

	public function sendTransfer($info) {
		$query = $this->test->prepare('SELECT COUNT(*) as count FROM waypoints WHERE entry = :entry');
		$query->bindValue(':entry', $info->entry, PDO::PARAM_INT);
		$query->execute();
		$get = $query->fetch();

		if($get['count'] != 0) {
			$query = $this->tools->prepare('INSERT INTO smart_review (entryorguid, source_type, path, user, date) VALUES (:entry, :source_type, -:path, :user, :date)
											ON DUPLICATE KEY UPDATE path = -:path, date = :date, user = :user');
			$query->bindValue(':entry', $info->entry, PDO::PARAM_STR);
			$query->bindValue(':source_type', $info->source, PDO::PARAM_STR);
			$query->bindValue(':path', $info->path, PDO::PARAM_STR);
			$query->bindValue(':user', $info->user, PDO::PARAM_STR);
			$query->bindValue(':date', time(), PDO::PARAM_STR);
			return $query->execute();
		} else {
			$query = $this->tools->prepare('INSERT INTO smart_review (entryorguid, source_type, path, user, date) VALUES (:entry, :source_type, :path, :user, :date)
											ON DUPLICATE KEY UPDATE path= :path,date = :date, user = :user');
			$query->bindValue(':entry', $info->entry, PDO::PARAM_STR);
			$query->bindValue(':source_type', $info->source, PDO::PARAM_STR);
			$query->bindValue(':path', $info->path, PDO::PARAM_STR);
			$query->bindValue(':user', $info->user, PDO::PARAM_STR);
			$query->bindValue(':date', time(), PDO::PARAM_STR);
			return $query->execute();
		}
	}

	public function sendPause($info) {
		$query = $this->tools->prepare('INSERT INTO smart_review (entryorguid, source_type, path, info1, user, date) VALUES (:entry, :source_type, :path, :info1, :user, :date)
										ON DUPLICATE KEY UPDATE path = :path, info1 = :info1, date = :date, user = :user');
		$query->bindValue(':entry', $info->path, PDO::PARAM_STR);
		$query->bindValue(':source_type', $info->source, PDO::PARAM_STR);
		$query->bindValue(':path', $info->point, PDO::PARAM_STR);
		$query->bindValue(':info1', $info->delay, PDO::PARAM_STR);
		$query->bindValue(':user', $info->user, PDO::PARAM_STR);
		$query->bindValue(':date', time(), PDO::PARAM_STR);
		return $query->execute();
	}
} 