<?php

namespace SUN\DAO;

use PDO;
use SUN\Domain\Quest;
use SUN\Domain\Zone;


class SunQuestDAO extends DAO
{
	public function getQuests($zone) {
		$query = $this->dbc->prepare('SELECT id, name FROM dbc.dbc_areatable WHERE id = :zone');
		$query->bindValue(':zone', $zone, PDO::PARAM_INT);
		$query->execute();
		$getZoneID = $query->fetchAll();

		if($query->rowCount() == 0) {
			return $this->app->redirect('/quests');
		}

		$query = $this->tools->prepare('SELECT qt.entry, qt.Title as name, qt.RequiredRaces as race, it.entry as itemid, it.name as itemname,
							  ct.entry as idstarter, ct.name as starter, ct2.entry as idender, ct2.name as ender,
							  qtest.startTxt, qtest.progTxt, qtest.endTxt, qtest.txtEvent, qtest.pathEvent, qtest.timeEvent,
							  qtest.Exp, qtest.Stuff, qtest.Gold, qtest.emotNPC, qtest.spellNPC, qtest.placeNPC, qtest.workObj, qtest.baObj,
                              qtest.other as comment, qtest.tester,
							  objstart.id as objidstarter, objt.name as objstarter,
							  objend.id as objidender, objt2.name as objender
							  FROM world.quest_template qt
							  LEFT JOIN world.creature_queststarter qstart ON qt.entry = qstart.quest
							  LEFT JOIN world.creature_questender qend ON qt.entry = qend.quest
							  LEFT JOIN world.creature_template ct ON qstart.id = ct.entry
							  LEFT JOIN world.creature_template ct2 ON qend.id = ct2.entry
							  LEFT JOIN world.gameobject_queststarter objstart ON qt.entry = objstart.quest
							  LEFT JOIN world.gameobject_questender objend ON qt.entry = objend.quest
							  LEFT JOIN world.gameobject_template objt ON objstart.id = objt.entry
							  LEFT JOIN world.gameobject_template objt2 ON objend.id = objt2.entry
							  LEFT JOIN world.item_template it ON qt.entry = it.startquest
							  LEFT JOIN suntools.quest_test qtest ON qt.entry = qtest.questid
							  WHERE ZoneOrSort = :zone AND qt.Title NOT LIKE "%BETA%"
							  GROUP BY qt.entry');
		$query->bindValue(':zone', $zone, PDO::PARAM_INT);
		$query->execute();
		$fetch = $query->fetchAll();

		$quests = [];
		foreach($fetch as $quest) {
			$quests[$quest['entry']] = new Quest($quest);
		}
		return $quests;
	}

	public function setStatus($quest) {
		if($quest->id < 0)
			return;

		if($quest->column > 15)
			return;

		if($quest->status > 4 || $quest->status < 0)
			return;

		switch ($quest->column) {
			case 1: $columnDB = "startTxt"; break;
			case 2: $columnDB = "progTxt"; break;
			case 3: $columnDB = "endTxt"; break;
			case 4: $columnDB = "txtEvent"; break;
			case 5: $columnDB = "pathEvent"; break;
			case 6: $columnDB = "timeEvent"; break;
			case 7: $columnDB = "Exp"; break;
			case 8: $columnDB = "Stuff"; break;
			case 9: $columnDB = "Gold"; break;
			case 10: $columnDB = "emotNPC"; break;
			case 11: $columnDB = "spellNPC"; break;
			case 12: $columnDB = "placeNPC"; break;
			case 13: $columnDB = "workObj"; break;
			case 14: $columnDB = "baObj"; break;
			default: return;
		}

		$query = $this->tools->prepare('INSERT INTO quest_test (questid, ' . $columnDB . ')
								VALUE (:questID, :value)
								ON DUPLICATE KEY UPDATE '. $columnDB .' = :value');
		$query->bindValue(':questID', $quest->id, PDO::PARAM_INT);
		$query->bindValue(':value', $quest->status, PDO::PARAM_INT);
		$query->execute();
	}

	function getGlobalProgress() {
		return new Zone([
			"name"		=> "Global",
			"total"	=> $this->getGlobalQuestsCount(),
			"tested"	=> $this->getGlobalTested(),
			"success"	=> $this->globalCount(1),
			"working"	=> $this->globalCount(2),
			"bugged"	=> $this->globalCount(3),
			"no"		=> $this->globalCount(4),
		]);
	}
	public function globalCount($status) {

		$query = $this->tools->prepare('SELECT (SUM(CASE WHEN startTxt = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN progTxt = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN endTxt = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN txtEvent = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN pathEvent = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN timeEvent = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN Exp = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN Stuff = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN Gold = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN emotNPC = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN spellNPC = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN placeNPC = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN workObj = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN baObj = :status THEN 1 ELSE 0 END)
                                       ) AS TotalCount
                                FROM quest_test');
		$query->bindValue(':status', $status, PDO::PARAM_INT);
		$query->execute();
		$countStatus = $query->fetch();

		return $countStatus['TotalCount'];
	}

	function countFields($status, $zoneID) {
		$query = $this->tools->prepare('SELECT (SUM(CASE WHEN startTxt = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN progTxt = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN endTxt = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN txtEvent = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN pathEvent = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN timeEvent = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN Exp = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN Stuff = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN Gold = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN emotNPC = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN spellNPC = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN placeNPC = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN workObj = :status THEN 1 ELSE 0 END) +
                                       SUM(CASE WHEN baObj = :status THEN 1 ELSE 0 END)
                                       ) AS TotalCount
                                FROM quest_test qtest
                                JOIN world.quest_template qt ON qtest.questid = qt.entry
                                WHERE ZoneOrSort = :zoneID');
		$query->bindValue(':status', $status, PDO::PARAM_INT);
		$query->bindValue(':zoneID', $zoneID, PDO::PARAM_INT);
		$query->execute();
		$countStatus = $query->fetch();

		return $countStatus['TotalCount'];
	}

	public function getZoneName($zoneID) {
		$zoneNameQuery = $this->dbc->prepare('SELECT name FROM dbc_areatable WHERE id = :zoneID');
		$zoneNameQuery->bindValue(':zoneID', $zoneID, PDO::PARAM_INT);
		$zoneNameQuery->execute();
		$zoneName = $zoneNameQuery->fetch();

		return $zoneName['name'];
	}

	public function getQuestsCount($zoneID) {
		$totalQuestQuery = $this->world->prepare('SELECT count(*) as count FROM quest_template WHERE ZoneOrSort = :zoneID AND Title NOT LIKE "%BETA%"');
		$totalQuestQuery->bindValue(':zoneID', $zoneID, PDO::PARAM_INT);
		$totalQuestQuery->execute();
		$totalQuest = $totalQuestQuery->fetch();

		return$totalQuest['count'];
	}

	public function getGlobalQuestsCount() {
		$totalQuestQuery = $this->world->query('SELECT count(*) as count FROM quest_template WHERE ZoneOrSort IN(3457, 3703, 3483, 3562, 3713, 3714, 3836, 3521, 3717, 3716, 3715, 3607, 3519, 3791, 3790, 3789, 3792, 3518, 3522, 3923, 3523, 3847, 3849, 3848, 3845, 3520, 3959, 2367, 2366, 3606) AND Title NOT LIKE "%BETA%"');
		$totalQuestQuery->execute();
		$totalQuest = $totalQuestQuery->fetch();

		return $totalQuest['count'];
	}

	public function getQuestsTested($zoneID) {
		$testedQuestQuery = $this->tools->prepare('SELECT count(*) as count
                                         FROM suntools.quest_test qtest
                                         LEFT JOIN world.quest_template qt ON qtest.questid = qt.entry
                                         WHERE ZoneOrSort = :zoneID
                                               AND questid != 0 AND startTxt != 0 AND progTxt != 0 AND endTxt != 0 AND pathEvent != 0
                                               AND timeEvent != 0 AND Exp != 0 AND Stuff != 0 AND Gold != 0
                                               AND emotNPC != 0 AND spellNPC != 0 AND placeNPC != 0 AND workObj != 0 AND baObj != 0');
		$testedQuestQuery->bindValue(':zoneID', $zoneID, PDO::PARAM_INT);
		$testedQuestQuery->execute();
		$testedQuest = $testedQuestQuery->fetch();

		return $testedQuest['count'];
	}

	public function getGlobalTested() {
		$query = $this->tools->query('SELECT COUNT(*) as count FROM quest_test');
		$query->execute();
		$testedQuest = $query->fetch();
		return $testedQuest['count'];
	}

	function getZone($id) {
		return $zone = new Zone([
			"id" 		=> $id,
			"name"		=> $this->getZoneName($id),
			"total"		=> $this->getQuestsCount($id),
			"tested"	=> $this->getQuestsTested($id),
			"success"	=> $this->countFields(1, $id),
			"working"	=> $this->countFields(2, $id),
			"bugged"	=> $this->countFields(3, $id),
			"no"		=> $this->countFields(4, $id),
		]);
	}
}