<?php

namespace SUN\DAO;

class EquipDAO extends DAO {
	public function getEquipment($entry) {
		$getInfos  = $this->test->fetchAssoc('SELECT name, equipment_id FROM creature_template WHERE entry = ?', array(intval($entry)));
		$itemInfos = [
			"name"          => $getInfos['name'],
			"equipmentID"   => $getInfos['equipment_id'],
		];

		$getEquipment  = $this->test->fetchAll('SELECT id, equipmodel1, equipmodel2, equipmodel3, equipinfo1, equipinfo2, equipinfo3, equipslot1, equipslot2, equipslot3 FROM creature_equip_template WHERE entry = ?', array($getInfos['equipment_id']));
		foreach($getEquipment as $equipment) {
			$itemInfos['id'][$equipment['id']] = [
				"mainhand"     => [
					"displayid"     => $equipment['equipmodel1'],
					"skill"         => $equipment['equipinfo1'],
					"slot"          => $equipment['equipslot1']
				],
				"offhand"     => [
					"displayid"     => $equipment['equipmodel2'],
					"skill"         => $equipment['equipinfo2'],
					"slot"          => $equipment['equipslot2']
				],
				"ranged"     => [
					"displayid"     => $equipment['equipmodel3'],
					"skill"         => $equipment['equipinfo3'],
					"slot"          => $equipment['equipslot3']
				]
			];
		}
		return $itemInfos;
	}
} 