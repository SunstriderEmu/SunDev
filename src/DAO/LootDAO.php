<?php

namespace SUN\DAO;

use PDO;

class LootDAO extends DAO {

	public function getCreatureLoot($id) {
		$query = $this->test->prepare('SELECT * FROM creature_loot_template WHERE entry = :id');
		$query->bindValue(':id', $id, PDO::PARAM_INT);
		$query->execute();
		$loots = $query->fetchAll();

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		$query2 = $this->test->prepare('SELECT entry, name FROM creature_template WHERE lootid = :id');
		$query2->bindValue(':id', $id, PDO::PARAM_INT);
		$query2->execute();
		$creatures = $query2->fetchAll();

		return $loot = [
			"id"		=> $id,
			"used"		=> $query2->rowCount(),
			"items"		=> $items,
			"creatures"	=> $creatures,
			"type"		=> 0,
		];
	}

	public function getDisenchantLoot($id) {
		$query = $this->test->prepare('SELECT * FROM disenchant_loot_template WHERE entry = :id');
		$query->bindValue(':id', $id, PDO::PARAM_INT);
		$query->execute();
		$loots = $query->fetchAll();

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return $loot = [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 1,
		];
	}

	public function getFishingLoot($id) {
		$query = $this->test->prepare('SELECT * FROM fishing_loot_template WHERE entry = :id');
		$query->bindValue(':id', $id, PDO::PARAM_INT);
		$query->execute();
		$loots = $query->fetchAll();

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return $loot = [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 2,
		];
	}

	public function getGOLoot($id) {
		$query = $this->test->prepare('SELECT * FROM gameobject_loot_template WHERE entry = :id');
		$query->bindValue(':id', $id, PDO::PARAM_INT);
		$query->execute();
		$loots = $query->fetchAll();

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return $loot = [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 3,
		];
	}

	public function getItemLoot($id) {
		$query = $this->test->prepare('SELECT * FROM item_loot_template WHERE entry = :id');
		$query->bindValue(':id', $id, PDO::PARAM_INT);
		$query->execute();
		$loots = $query->fetchAll();

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return $loot = [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 4,
		];
	}

	public function getPickpocketLoot($id) {
		$query = $this->test->prepare('SELECT * FROM pickpocketing_loot_template WHERE entry = :id');
		$query->bindValue(':id', $id, PDO::PARAM_INT);
		$query->execute();
		$loots = $query->fetchAll();

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return $loot = [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 5,
		];
	}

	public function getProspectLoot($id) {
		$query = $this->test->prepare('SELECT * FROM prospecting_loot_template WHERE entry = :id');
		$query->bindValue(':id', $id, PDO::PARAM_INT);
		$query->execute();
		$loots = $query->fetchAll();

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return $loot = [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 6,
		];
	}

	public function getQuestMailLoot($id) {
		$query = $this->test->prepare('SELECT * FROM quest_mail_loot_template WHERE entry = :id');
		$query->bindValue(':id', $id, PDO::PARAM_INT);
		$query->execute();
		$loots = $query->fetchAll();

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return $loot = [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 7,
		];
	}

	public function getReferenceLoot($id) {
		$query = $this->test->prepare('SELECT * FROM reference_loot_template WHERE entry = :id');
		$query->bindValue(':id', $id, PDO::PARAM_INT);
		$query->execute();
		$loots = $query->fetchAll();

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		$query2 = $this->test->prepare('SELECT entry FROM creature_loot_template WHERE item = :id AND mincountOrRef < 0 and ChanceOrQuestChance > 0');
		$query2->bindValue(':id', $id, PDO::PARAM_INT);
		$query2->execute();
		$lootid = $query2->fetchAll();

		$creatures = [];
		foreach($lootid as $creature) {
			$query3 = $this->test->prepare('SELECT entry, name FROM creature_template WHERE lootid = :id');
			$query3->bindValue(':id', $creature['entry'], PDO::PARAM_INT);
			$query3->execute();
			$creature = $query3->fetch();
			$creatures[$creature['entry']]['entry'] = $creature['entry'];
			$creatures[$creature['entry']]['name'] = $creature['name'];
		}

		return $loot = [
			"id"		=> $id,
			"used"		=> $query2->rowCount(),
			"items"		=> $items,
			"creatures"	=> $creatures,
			"references"=> $lootid,
			"type"		=> 8,
		];
	}

	public function getSkinningLoot($id) {
		$query = $this->test->prepare('SELECT * FROM skinning_loot_template WHERE entry = :id');
		$query->bindValue(':id', $id, PDO::PARAM_INT);
		$query->execute();
		$loots = $query->fetchAll();

		$items= [];
		foreach($loots as $item) {
			$items[$item['item']] = $item;
		}

		return $loot = [
			"id"		=> $id,
			"items"		=> $items,
			"type"		=> 9,
		];
	}
} 