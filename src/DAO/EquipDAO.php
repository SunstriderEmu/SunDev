<?php

namespace SUN\DAO;

use PDO;

class EquipDAO extends DAO {
	public function getEquipment($entry) {
		$query  = $this->test->prepare('SELECT name, equipment_id FROM creature_template WHERE entry = :entry');
		$query->bindValue(':entry', $entry, PDO::PARAM_INT);
		$query->execute();

		$getInfos = $query->fetch();
		$itemInfos = [
			"name"          => $getInfos['name'],
			"equipmentID"   => $getInfos['equipment_id'],
		];

		$query2  = $this->test->prepare('SELECT id, equipmodel1, equipmodel2, equipmodel3,
											   equipinfo1, equipinfo2, equipinfo3,
                                               equipslot1, equipslot2, equipslot3
                                        FROM creature_equip_template
                                        WHERE entry = :equipment_id');
		$query2->bindValue(':equipment_id', $getInfos['equipment_id'], PDO::PARAM_INT);
		$query2->execute();
		while($getEquipment = $query2->fetch()) {
			$itemInfos['id'][$getEquipment['id']] = [

				"mainhand"     => [
					"displayid"     => $getEquipment['equipmodel1'],
					"skill"         => $getEquipment['equipinfo1'],
					"slot"          => $getEquipment['equipslot1']
				],
				"offhand"     => [
					"displayid"     => $getEquipment['equipmodel2'],
					"skill"         => $getEquipment['equipinfo2'],
					"slot"          => $getEquipment['equipslot2']
				],
				"ranged"     => [
					"displayid"     => $getEquipment['equipmodel3'],
					"skill"         => $getEquipment['equipinfo3'],
					"slot"          => $getEquipment['equipslot3']
				]
			];
		}

		return $itemInfos;
	}
} 