<?php

namespace SUN\DAO;

use Doctrine\DBAL\Connection;

class LootDAO extends DAO {

	public function getCreatureLoot($id) {
		$loots = $this->test->fetchAll('SELECT * FROM creature_loot_template WHERE entry = ?', array(intval($id)));
		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}
		$creatures = $this->test->fetchAll('SELECT COUNT(*) as count, entry, name FROM creature_template WHERE lootid = ?', array(intval($id)));

		return [
			"id"		=> $id,
			"used"		=> $creatures[0]['count'],
			"items"		=> $items,
			"creatures"	=> $creatures,
			"type"		=> 0,
		];
	}

	public function getDisenchantLoot($id) {
		$loots = $this->test->fetchAll('SELECT * FROM disenchant_loot_template WHERE entry = ?', array(intval($id)));
		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}
		return [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 1,
		];
	}

	public function getFishingLoot($id) {
		$loots = $this->test->fetchAll('SELECT * FROM fishing_loot_template WHERE entry = ?', array(intval($id)));

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 2,
		];
	}

	public function getGOLoot($id) {
		$loots = $this->test->fetchAll('SELECT * FROM gameobject_loot_template WHERE entry = ?', array(intval($id)));

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 3,
		];
	}

	public function getItemLoot($id) {
		$loots = $this->test->fetchAll('SELECT * FROM item_loot_template WHERE entry = ?', array(intval($id)));

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 4,
		];
	}

	public function getPickpocketLoot($id) {
		$loots = $this->test->fetchAll('SELECT * FROM pickpocketing_loot_template WHERE entry = ?', array(intval($id)));

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 5,
		];
	}

	public function getProspectLoot($id) {
		$loots = $this->test->fetchAll('SELECT * FROM prospecting_loot_template WHERE entry = ?', array(intval($id)));

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 6,
		];
	}

	public function getQuestMailLoot($id) {
		$loots = $this->test->fetchAll('SELECT * FROM quest_mail_loot_template WHERE entry = ?', array(intval($id)));

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 7,
		];
	}

	public function getReferenceLoot($id) {
		$loots = $this->test->fetchAll('SELECT * FROM reference_loot_template WHERE entry = ?', array(intval($id)));

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		$lootId = $this->test->fetchAll('SELECT entry, COUNT(*) as count FROM creature_loot_template WHERE item = ? AND mincountOrRef < 0 and ChanceOrQuestChance > 0', array(intval($id)));
		$entries = [];
		foreach($lootId as $creature) {
			$entries[] = $creature['entry'];
		}
		$entries = array_unique($entries);
		$get = $this->test->fetchAll('SELECT entry, name FROM creature_template WHERE lootid IN (?)', array((array) $entries), array(Connection::PARAM_INT_ARRAY));
		$creatures = [];
		foreach($get as $creature) {
			$creatures[$creature['entry']]['entry'] = $creature['entry'];
			$creatures[$creature['entry']]['name'] = $creature['name'];
		}

		return [
			"id"		=> $id,
			"used"		=> $lootId[0]['count'],
			"items"		=> $items,
			"creatures"	=> $creatures,
			"references"=> $lootId,
			"type"		=> 8,
		];
	}

	public function getSkinningLoot($id) {
		$loots = $this->test->fetchAll('SELECT * FROM skinning_loot_template WHERE entry = ?', array(intval($id)));

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 9,
		];
	}
} 