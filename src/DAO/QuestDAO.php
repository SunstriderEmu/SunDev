<?php

namespace SUN\DAO;

use SUN\Domain\Quest;
use SUN\Domain\Zone;

class QuestDAO extends DAO
{
	public function getQuests($zone)
	{
		$getZoneID = $this->getDb('dbc')->fetchAll('SELECT id, name FROM dbc_areatable WHERE id = ?', array($zone));

		if($getZoneID == null)
			return $this->app->redirect('/quests');

		$fetch = $this->getDb('test')->fetchAll("SELECT qt.entry, qt.Title as name, qt.RequiredRaces as race, it.entry as itemid, it.name as itemname,
							  			ct.entry as idstarter, ct.name as starter, ct2.entry as idender, ct2.name as ender,
							  			qtest.startTxt, qtest.progTxt, qtest.endTxt, qtest.txtEvent, qtest.pathEvent, qtest.timeEvent,
							  			qtest.Exp, qtest.Stuff, qtest.Gold, qtest.emotNPC, qtest.spellNPC, qtest.placeNPC, qtest.workObj, qtest.baObj,
                              			qtest.other as comment, qtest.tester,
							  			objstart.id as objidstarter, objt.name as objstarter,
							  			objend.id as objidender, objt2.name as objender
							  			FROM quest_template qt
							  			LEFT JOIN creature_queststarter qstart ON qt.entry = qstart.quest
							  			LEFT JOIN creature_questender qend ON qt.entry = qend.quest
							  			LEFT JOIN creature_template ct ON qstart.id = ct.entry
							  			LEFT JOIN creature_template ct2 ON qend.id = ct2.entry
							  			LEFT JOIN gameobject_queststarter objstart ON qt.entry = objstart.quest
							  			LEFT JOIN gameobject_questender objend ON qt.entry = objend.quest
							  			LEFT JOIN gameobject_template objt ON objstart.id = objt.entry
							  			LEFT JOIN gameobject_template objt2 ON objend.id = objt2.entry
							  			LEFT JOIN item_template it ON qt.entry = it.startquest
							  			LEFT JOIN {$this->app['dbs.options']['tools']['dbname']}.quest_test qtest ON qt.entry = qtest.questid
							  			WHERE ZoneOrSort = ? AND qt.Title NOT LIKE '%BETA%'
							  			GROUP BY qt.entry", array($zone));
		$quests = [];
		foreach($fetch as $quest)
			$quests[$quest['entry']] = new Quest($quest);
		return $quests;
	}

	public function setStatus($quest)
	{
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
		$this->getDb('tools')->executeQuery("INSERT INTO quest_test (questid, {$columnDB}) VALUES (:questID, :value) ON DUPLICATE KEY UPDATE {$columnDB} = :value", array("questID" => $quest->id, "value" => $quest->status));
	}

	public function setComment($quest)
	{
		if(intval($quest->id) < 0)
			return;
		$this->getDb('tools')->executeQuery("INSERT INTO quest_test (questid, other) VALUES (:questID, :value) ON DUPLICATE KEY UPDATE other = :value", array("questID" => $quest->id, "value" => $quest->comment));
	}

	public function setTester($quest)
	{
		if(intval($quest->id) < 0)
			return;
		$this->getDb('tools')->executeQuery("INSERT INTO quest_test (questid, tester) VALUES (:questID, :value) ON DUPLICATE KEY UPDATE tester = :value", array("questID" => $quest->id, "value" => $quest->tester));
	}

	function getGlobalProgress()
	{
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
	
	public function globalCount($status)
	{
		$countStatus = $this->getDb('tools')->fetchAssoc('SELECT (SUM(CASE WHEN startTxt = :status THEN 1 ELSE 0 END) +
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
                                				 FROM quest_test', array("status" => $status));
		return $countStatus['TotalCount'];
	}

	function countFields($status, $zoneID)
	{
		$countStatus = $this->getDb('tools')->fetchAssoc("SELECT (SUM(CASE WHEN startTxt = :status THEN 1 ELSE 0 END) +
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
                                JOIN {$this->app['dbs.options']['test']['dbname']}.quest_template qt ON qtest.questid = qt.entry
                                WHERE ZoneOrSort = :zoneID", array("status" => $status, "zoneID" => $zoneID));
		return $countStatus['TotalCount'];
	}

	public function getZoneName($zoneID)
	{
		$zoneName = $this->getDb('dbc')->fetchAssoc('SELECT name FROM dbc_areatable WHERE id = ?', array($zoneID));
		return $zoneName['name'];
	}

	public function getQuestsCount($zoneID)
	{
		$totalQuest = $this->getDb('world')->fetchAssoc('SELECT count(*) as count FROM quest_template WHERE ZoneOrSort = ? AND Title NOT LIKE "%BETA%"', array($zoneID));
		return $totalQuest['count'];
	}

	public function getGlobalQuestsCount()
	{
		$total = $this->getDb('world')->fetchAssoc('SELECT count(*) as count FROM quest_template WHERE ZoneOrSort IN(3457, 3703, 3483, 3562, 3713, 3714, 3836, 3521, 3717, 3716, 3715, 3607, 3519, 3791, 3790, 3789, 3792, 3518, 3522, 3923, 3523, 3847, 3849, 3848, 3845, 3520, 3959, 2367, 2366, 3606) AND Title NOT LIKE "%BETA%"');
		return $total['count'];
	}

	public function getQuestsTested($zoneID)
	{
		$testedQuest = $this->getDb('tools')->fetchAssoc("SELECT count(*) as count
                                         		 FROM quest_test qtest
                                         		 LEFT JOIN {$this->app['dbs.options']['test']['dbname']}.quest_template qt ON qtest.questid = qt.entry
                                         		 WHERE ZoneOrSort = ?
                                               	 AND questid != 0 AND startTxt != 0 AND progTxt != 0 AND endTxt != 0 AND pathEvent != 0
                                               	 AND timeEvent != 0 AND Exp != 0 AND Stuff != 0 AND Gold != 0
                                               	 AND emotNPC != 0 AND spellNPC != 0 AND placeNPC != 0 AND workObj != 0 AND baObj != 0", array($zoneID));
		return $testedQuest['count'];
	}

	public function getGlobalTested()
	{
		$testedQuest = $this->getDb('tools')->fetchAssoc('SELECT COUNT(*) as count FROM quest_test');
		return $testedQuest['count'];
	}

	function getZone($id)
	{
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

	public function getQuestName($id)
	{
		$quest = $this->getDb('test')->fetchAssoc('SELECT Title FROM quest_template WHERE entry = ?', array($id));
		return $quest['Title'];
	}
}