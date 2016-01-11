<?php

namespace SUN\DAO;

class PathDAO extends DAO {

	public function getPath($path) {
		$point = $this->getDb('test')->fetchAssoc('SELECT COUNT(point) as count FROM waypoint_data WHERE id = ?', array(intval($path)));
		return $path = [ "path" => $path, "points" => $point['count'] ];
	}

	public function getEntryPath($entry) {
		$query = $this->getDb('test')->executeQuery('SELECT entry FROM waypoints WHERE entry = ?', array($entry));
		return $query->rowCount() > 0 ? false : true;
	}
} 