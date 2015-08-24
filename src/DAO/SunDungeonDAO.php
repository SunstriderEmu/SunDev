<?php

namespace SUN\DAO;

use SUN\Domain\Creature;
use SUN\Domain\Zone;
use PDO;

class SunDungeonDAO extends DAO {
	public function getCreatures($dungeon) {
		$query = $this->tools->prepare('SELECT ct.entry, ct.difficulty_entry_1 as heroic, name, c.map,
											   tester, stats, resistances, immunities, respawn, equipment, gossip, emote, smartai, comment
										FROM world.creature c
										JOIN world.creature_template ct ON ct.entry = c.id
										LEFT JOIN dungeons_test dt ON ct.entry = dt.entry
										WHERE c.map = :dungeon GROUP BY c.id');
		$query->bindValue(':dungeon', $dungeon, PDO::PARAM_INT);
		$query->execute();
		$fetch = $query->fetchAll();

		$creatures = [];
		foreach($fetch as $creature) {
			$creatures[$creature['entry']] = new Creature($creature);

			if($creature['heroic'] != 0) {
				$query2 = $this->tools->prepare('SELECT ct.entry, name, tester, stats, resistances, immunities, respawn, equipment, gossip, emote, smartai, comment
												 FROM world.creature_template ct
												 LEFT JOIN dungeons_test dt ON ct.entry = dt.entry
												 WHERE ct.entry = :entry');
				$query2->bindValue(':entry', $creature['heroic'], PDO::PARAM_INT);
				$query2->execute();
				$heroic = $query2->fetch();

				$creatures[$heroic['entry']] = new Creature($heroic);
			}
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

		$query = $this->tools->prepare('INSERT INTO dungeons_test (entry, map, ' . $columnDB . ')
								VALUE (:entry, :map, :value)
								ON DUPLICATE KEY UPDATE '. $columnDB .' = :value');
		$query->bindValue(':entry', $creature->entry, PDO::PARAM_INT);
		$query->bindValue(':map', $creature->map, PDO::PARAM_INT);
		$query->bindValue(':value', $creature->status, PDO::PARAM_INT);
		$query->execute();
	}

	public function setTester($creature) {
		$query = $this->tools->prepare('INSERT INTO dungeons_test (entry, map, tester)
								VALUE (:entry, map, :value)
								ON DUPLICATE KEY UPDATE tester = :value');
		$query->bindValue(':entry', $creature->entry, PDO::PARAM_INT);
		$query->bindValue(':map', $creature->map, PDO::PARAM_INT);
		$query->bindValue(':value', $creature->tester, PDO::PARAM_INT);
		$query->execute();
	}

	public function setComment($creature) {
		$query = $this->tools->prepare('INSERT INTO dungeons_test (entry, comment)
								VALUE (:entry, :comment)
								ON DUPLICATE KEY UPDATE comment = :comment');
		$query->bindValue(':entry', $creature->entry, PDO::PARAM_INT);
		$query->bindValue(':comment', $creature->comment, PDO::PARAM_STR);
		$query->execute();
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

		$query = $this->tools->prepare('SELECT (SUM(CASE WHEN stats = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN resistances = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN immunities = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN respawn = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN equipment = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN gossip = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN emote = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN smartai = :status THEN 1 ELSE 0 END)
								) AS TotalCount
                                FROM dungeons_test');
		$query->bindValue(':status', $status, PDO::PARAM_INT);
		$query->execute();
		$countStatus = $query->fetch();

		return $countStatus['TotalCount'];
	}

	function countFields($status, $map) {
		$query = $this->tools->prepare('SELECT (SUM(CASE WHEN stats = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN resistances = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN immunities = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN respawn = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN equipment = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN gossip = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN emote = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN smartai = :status THEN 1 ELSE 0 END)
								) AS TotalCount
                                FROM dungeons_test
                                WHERE map = :map');
		$query->bindValue(':status', $status, PDO::PARAM_INT);
		$query->bindValue(':map', $map, PDO::PARAM_INT);
		$query->execute();
		$countStatus = $query->fetch();

		return $countStatus['TotalCount'];
	}

	public function getMapName($map) {
		$query = $this->dbc->prepare('SELECT name FROM dbc_areatable WHERE ref_map = :map');
		$query->bindValue(':map', $map, PDO::PARAM_INT);
		$query->execute();
		$map = $query->fetch();

		return $map['name'];
	}

	public function getCreaturesCount($map) {
		$query = $this->world->prepare('SELECT count(*) as count FROM creature WHERE map = :map GROUP BY id');
		$query->bindValue(':map', $map, PDO::PARAM_INT);
		$query->execute();
		$total = $query->fetchAll();

		$count = 0;
		foreach($total as $creature) {
			$count++;
		}

		return $count;
	}

	public function getGlobalCreaturesCount() {
		$query = $this->world->query('SELECT count(*) as count FROM creature WHERE map IN (540, 542, 543, 545, 546, 547, 552, 553, 554, 555, 556, 557, 558, 560, 269) GROUP BY id');
		$query->execute();
		$total = $query->fetchAll();

		$count = 0;
		foreach($total as $creature) {
			$count++;
		}

		return $count;
	}

	public function getCreaturesTested($map) {
		$query = $this->tools->prepare('SELECT count(*) as count
                                         FROM dungeons_test
                                         WHERE map = :map
                                               AND stats != 0 AND resistances != 0 AND immunities != 0 AND respawn != 0 AND equipment != 0
                                               AND gossip != 0 AND emote != 0 AND smartai != 0 ');
		$query->bindValue(':map', $map, PDO::PARAM_INT);
		$query->execute();
		$tested = $query->fetch();

		return $tested['count'];
	}

	public function getGlobalTested() {
		$query = $this->tools->query('SELECT COUNT(*) as count FROM dungeons_test');
		$query->execute();
		$testedQuest = $query->fetch();
		return $testedQuest['count'];
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