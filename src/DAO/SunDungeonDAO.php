<?php

namespace SUN\DAO;

use SUN\Domain\Creature;
use SUN\Domain\Zone;
use Doctrine\DBAL\Connection;

class SunDungeonDAO extends DAO {
	public function getCreatures($dungeon) {
		$fetch = $this->getDb('tools')->fetchAll("SELECT ct.entry, ct.difficulty_entry_1 as heroic, ct.name, c.map,
											    n_stats, n_resistances, n_immunities, n_respawn,
											    h_stats, h_resistances, h_immunities, h_respawn,
											    equipment, gossip, emote, smartai, comment, tester
										  FROM {$this->app['dbs.options']['test_world']['dbname']}.creature c
										  JOIN {$this->app['dbs.options']['test_world']['dbname']}.creature_template ct ON ct.entry = c.id
										  LEFT JOIN dungeons_test dt ON ct.entry = dt.entry
										  WHERE c.map = ? GROUP BY c.id", array($dungeon));
		$creatures = [];
		foreach($fetch as $creature) {
			$creatures[$creature['entry']] = new Creature($creature);
		}
		return $creatures;
	}

	public function setStatus($creature) {
		if($creature->entry < "0")
			return;
		if($creature->column > "8")
			return;
		if($creature->status > "4" || $creature->status < "0")
			return;

		switch ($creature->column) {
			case 1: $columnDB = "stats"; break;
			case 2: $columnDB = "resistances"; break;
			case 3: $columnDB = "immunities"; break;
			case 4: $columnDB = "respawn"; break;
			case 5: $columnDB = "equipment"; break;
			case 6: $columnDB = "gossip"; break;
			case 7: $columnDB = "emote"; break;
			case 8: $columnDB = "smartai"; break;
			default: return;
		}

		if($creature->type == "normal")
			$columnDB = "n_{$columnDB}";
		if($creature->type == "heroic") {
			$columnDB = "h_{$columnDB}";
			$getEntry = $this->getDb('test')->fetchAssoc('SELECT entry FROM creature_template WHERE difficulty_entry_1 = ?', array(intval($creature->entry)));
			$creature->entry = $getEntry['entry'];
		}


		$this->getDb('tools')->executeQuery("INSERT INTO dungeons_test (entry, map, {$columnDB}) VALUE (:entry, :map, :value) ON DUPLICATE KEY UPDATE {$columnDB} = :value",
									array("entry" => $creature->entry, "map" => $creature->map, "value" => $creature->status));
	}

	public function setTester($creature) {
		$this->getDb('tools')->executeQuery('INSERT INTO dungeons_test (entry, map, tester) VALUE (:entry, map, :value) ON DUPLICATE KEY UPDATE tester = :value',
									array("entry" => $creature->entry, "map" => $creature->map, "value" => $creature->tester));
	}

	public function setComment($creature) {
		$this->getDb('tools')->executeQuery('INSERT INTO dungeons_test (entry, comment) VALUE (:entry, :comment) ON DUPLICATE KEY UPDATE comment = :comment',
									array("entry" => $creature->entry, "comment" => $creature->comment));
	}

	function getGlobalProgress() {
		return new Zone([
			"name"		=> "Global",
			"total"		=> $this->getGlobalCreaturesCount(),
			"tested"	=> $this->getGlobalTested(),
			"success"	=> $this->globalCount(1),
			"working"	=> $this->globalCount(2),
			"bugged"	=> $this->globalCount(3),
			"no"		=> $this->globalCount(4),
		]);
	}
	public function globalCount($status) {
		$countStatus = $this->getDb('tools')->fetchAssoc('SELECT (SUM(CASE WHEN n_stats = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN h_stats = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN n_resistances = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN h_resistances = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN n_immunities = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN h_immunities = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN n_respawn = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN h_respawn = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN equipment = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN gossip = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN emote = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN smartai = :status THEN 1 ELSE 0 END)
												 ) AS TotalCount
                                				 FROM dungeons_test', array("status" => $status));
		return $countStatus['TotalCount'];
	}

	function countFields($status, $map) {
		$countStatus = $this->getDb('tools')->fetchAssoc('SELECT (SUM(CASE WHEN n_stats = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN h_stats = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN n_resistances = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN h_resistances = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN n_immunities = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN h_immunities = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN n_respawn = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN h_respawn = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN equipment = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN gossip = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN emote = :status THEN 1 ELSE 0 END) +
                                       			 SUM(CASE WHEN smartai = :status THEN 1 ELSE 0 END)
												 ) AS TotalCount
                                				 FROM dungeons_test WHERE map = :map', array("status" => $status, "map" => $map));
		return $countStatus['TotalCount'];
	}

	public function getMapName($map) {
		$map = $this->getDb('dbc')->fetchAssoc('SELECT name FROM dbc_areatable WHERE ref_map = ?', array($map));
		return $map['name'];
	}

	public function getCreaturesCount($map) {
		return $this->getDb('test')->executeQuery('SELECT count(*) as count FROM creature WHERE map = ? GROUP BY id', array($map))->rowCount();
	}

	public function getGlobalCreaturesCount() {
		return $this->getDb('test')->executeQuery('SELECT count(*) as count FROM creature WHERE map IN (540, 542, 543, 545, 546, 547, 552, 553, 554, 555, 556, 557, 558, 560, 269) GROUP BY id')->rowCount();
	}

	public function getCreaturesTested($map) {
		return $this->getDb('tools')->executeQuery('SELECT map FROM dungeons_test WHERE map = ?
                                             AND n_stats != 0 AND n_resistances != 0 AND n_immunities != 0 AND n_respawn != 0
                                             AND h_stats != 0 AND h_resistances != 0 AND h_immunities != 0 AND h_respawn != 0
                                             AND equipment != 0 AND gossip != 0 AND emote != 0 AND smartai != 0', array($map))->rowCount();
	}

	public function getGlobalTested() {
		return $this->getDb('tools')->executeQuery('SELECT map FROM dungeons_test')->rowCount();
	}

	function getMap($id) {
		return new Zone([
			"id" 		=> $id,
			"name"		=> $this->getMapName($id),
			"total"		=> $this->getCreaturesCount($id),
			"tested"	=> $this->getCreaturesTested($id),
			"success"	=> $this->countFields(1, $id),
			"working"	=> $this->countFields(2, $id),
			"bugged"	=> $this->countFields(3, $id),
			"no"		=> $this->countFields(4, $id),
		]);
	}
} 