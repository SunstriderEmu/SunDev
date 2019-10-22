<?php

namespace SUN\DAO;

use SUN\Domain\Creature;
use Doctrine\DBAL\Connection;

class CreatureDAO extends DAO
{
    public function getCreature($entry)
    {
        $creature = $this->getDb('test')->fetchAssoc('SELECT * from creature_template WHERE entry = ?', array($entry));
        $creature_resist = $this->getDb('test')->fetchAll('SELECT * from creature_template_resistance WHERE CreatureId = ?', array($entry));
        $minStats = $this->getDb('test')->fetchAssoc('SELECT * from creature_classlevelstats WHERE class = ? AND level = ?', array($creature['unit_class'], $creature['minlevel']));
        $maxStats = $this->getDb('test')->fetchAssoc('SELECT * from creature_classlevelstats WHERE class = ? AND level = ?', array($creature['unit_class'], $creature['maxlevel']));

		for ($i = 1; $i <= 6; $i++)
			$creature['resistance'.$i] = 0;
		
		if ($creature_resist) {
			foreach ($creature_resist as $resist)
			{
				$creature['resistance'.$resist['School']] = $resist['Resistance'];
			}
		}
		
        $creature['gender'] = $this->getGender($entry);

        $total = $this->getDb('test')->fetchAssoc('SELECT COUNT(*) as count, map FROM creature c JOIN creature_entry ce ON ce.spawnID = c.spawnID WHERE ce.entry = ?', array($entry));
        $creature['total'] = $total['count'];

        $zone = $this->getDb('dbc')->fetchAssoc('SELECT name FROM dbc_areatable WHERE ref_map = ?', array($total['map']));
        $creature['zone'] = $zone['name'];

        $creature['texts'] = $this->getDb('test')->fetchAll('SELECT CreatureID, type FROM creature_text WHERE CreatureID = ?', array($entry));

        $creature['minhp'] = $creature['HealthModifier'] * $minStats["basehp{$creature['exp']}"];
        $creature['minmp'] = $creature['ManaModifier'] * $minStats["basemana"];
        $creature['minarmor'] = $creature['ArmorModifier'] * $minStats["basearmor"];

        if($creature['minlevel'] != $creature['maxlevel']) {
            $creature['maxhp'] = $creature['HealthModifier'] * $maxStats["basehp{$creature['exp']}"];
            $creature['maxmp'] = $creature['ManaModifier'] * $maxStats["basemana"];
            $creature['maxarmor'] = $creature['ArmorModifier'] * $maxStats["basearmor"];
        }

        if($creature['exp'] != 0)
            $base_damage = "damage_exp{$creature['exp']}";
        else
            $base_damage = "damage_base";

        // Update as of 2019/4/14
        $minStats[$base_damage] *= 2;
        $maxStats[$base_damage] *= 2;
        $minStats['attackpower'] /= 2;
        $maxStats['attackpower'] /= 2;
        $minStats['rangedattackpower'] /= 2;
        $maxStats['rangedattackpower'] /= 2;
        $creature['BaseAttackTime'] /= 1000;
        $creature['RangeAttackTime'] /= 1000;

        $creature['melee']['minlevel']['base']  = $creature['DamageModifier'] * $minStats[$base_damage];
        $creature['melee']['minlevel']['ap']    = ($minStats['attackpower'] / 14) * $creature['BaseAttackTime'];
        $creature['melee']['minlevel']['min']   = $creature['DamageModifier'] * ($minStats[$base_damage] + $creature['melee']['minlevel']['ap']);
        $creature['melee']['minlevel']['max']   = $creature['melee']['minlevel']['min'] * (1 + $creature['BaseVariance']);
        $creature['melee']['minlevel']['avg']   = ($creature['melee']['minlevel']['min'] + $creature['melee']['minlevel']['max']) / 2 / ($creature['BaseAttackTime']);

        if ($creature['RangeAttackTime']) {
            $creature['ranged']['minlevel']['base']  = $creature['DamageModifier'] * $minStats[$base_damage];
            $creature['ranged']['minlevel']['ap']    = ($minStats['rangedattackpower'] / 14) * $creature['RangeAttackTime'];
            $creature['ranged']['minlevel']['min']   = $creature['DamageModifier'] * ($minStats[$base_damage] + $creature['ranged']['minlevel']['ap']);
            $creature['ranged']['minlevel']['max']   = $creature['ranged']['minlevel']['min'] * (1 + $creature['RangeVariance']);
            $creature['ranged']['minlevel']['avg']   = ($creature['ranged']['minlevel']['min'] + $creature['ranged']['minlevel']['max']) / 2 / ($creature['RangeAttackTime']);
        }
        
        if($creature['minlevel'] != $creature['maxlevel']) {
            $creature['melee']['maxlevel']['base']  = $creature['DamageModifier'] * $maxStats[$base_damage];
            $creature['melee']['maxlevel']['ap']    = ($maxStats['attackpower'] / 14) * $creature['BaseAttackTime'];
            $creature['melee']['maxlevel']['min']   = $creature['DamageModifier'] * ($maxStats[$base_damage] + $creature['melee']['maxlevel']['ap']);
            $creature['melee']['maxlevel']['max']   = $creature['melee']['maxlevel']['min'] * (1 + $creature['BaseVariance']);
            $creature['melee']['maxlevel']['avg']   = ($creature['melee']['maxlevel']['min'] + $creature['melee']['maxlevel']['max']) / 2 / ($creature['BaseAttackTime']);

            $creature['ranged']['maxlevel']['base']  = $creature['DamageModifier'] * $maxStats[$base_damage];
            $creature['ranged']['maxlevel']['ap']    = ($maxStats['rangedattackpower'] / 14) * $creature['RangeAttackTime'];
            $creature['ranged']['maxlevel']['min']   = $creature['DamageModifier'] * ($maxStats[$base_damage] + $creature['ranged']['maxlevel']['ap']);
            $creature['ranged']['maxlevel']['max']   = $creature['ranged']['maxlevel']['min'] * (1 + $creature['RangeVariance']);
            $creature['ranged']['maxlevel']['avg']   = ($creature['ranged']['maxlevel']['min'] + $creature['ranged']['maxlevel']['max']) / 2 / ($creature['RangeAttackTime']);
        }
        return $creature;
    }

    public function getStats($class, $level)
    {
        return $this->getDb('test')->fetchAssoc('SELECT * FROM creature_classlevelstats WHERE level = ? AND class = ?', array($level, $class));
    }

    public function getGender($entry)
    {
        $models = $this->getDb('test')->fetchAssoc('SELECT modelid1, modelid2, modelid3, modelid4 FROM creature_template WHERE entry = ?', array($entry));
        $modelId = [];
        for($i = 1 ; $i < 5 ; $i++) {
            if($models["modelid{$i}"] != 0)
                array_push($modelId, $models["modelid{$i}"]);
        }
        $modelId = array_map("unserialize", array_unique(array_map("serialize", $modelId)));
        $modelInfos = $this->getDb('test')->fetchAll('SELECT modelid_other_gender, gender FROM creature_model_info WHERE modelid IN (?)', array($modelId), array(Connection::PARAM_INT_ARRAY));
        $gender = 0;
        foreach($modelInfos as $model) {
            if(($model['gender'] == 0 && $model['modelid_other_gender'] > 0) || ($model['gender'] == 1 && $model['modelid_other_gender'] > 0))
                return 'both';
            if($model['gender'] == 1 && $model['modelid_other_gender'] == 0)
                $gender++;
        }
        $gender = $gender / count($modelId);
        switch($gender){
            case 0: return 'male'; break;
            case 1: return 'female'; break;
            default: return 'both';
        }
    }

    public function findCreatureEntryName(Creature $creature)
    {
        $name = $this->getDb('test')->fetchAssoc('SELECT name FROM creature_template WHERE entry = ?', array($creature->getEntry()));
        $creature->setName($name['name']);
        return $creature;
    }

    public function findCreatureGuidName(Creature $creature)
    {
        $name = $this->getDb('test')->fetchAssoc('SELECT ct.name FROM creature c JOIN creature_entry ce ON ce.spawnID = c.spawnID JOIN creature_template ct ON ce.entry = ct.entry WHERE c.spawnID = ? LIMIT 1', array($creature->getGuid()));
        $creature->setName($name['name']);
        return $creature;
    }

    public function getImmunities($entry)
    {
        $immunities = $this->getDb('test')->fetchAssoc('SELECT mechanic_immune_mask as mask FROM creature_template WHERE entry = ?', array($entry));
        return $immunities['mask'];
    }

    public function getNPCFlag($entry)
    {
        $flag = $this->getDb('test')->fetchAssoc('SELECT npcflag FROM creature_template WHERE entry = ?', array($entry));
        return $flag['npcflag'];
    }

    public function getUnitFlag($entry)
    {
        $flag = $this->getDb('test')->fetchAssoc('SELECT unit_flags FROM creature_template WHERE entry = ?', array($entry));
        return $flag['unit_flags'];
    }

    public function getUnitFlag2($entry)
    {
        $flag = $this->getDb('test')->fetchAssoc('SELECT unit_flags2 FROM creature_template WHERE entry = ?', array($entry));
        return $flag['unit_flags2'];
    }

    public function getDynamicFlag($entry)
    {
        $flag = $this->getDb('test')->fetchAssoc('SELECT dynamicflags FROM creature_template WHERE entry = ?', array($entry));
        return $flag['dynamicflags'];
    }

    public function getTypeFlag($entry)
    {
        $flag = $this->getDb('test')->fetchAssoc('SELECT type_flags FROM creature_template WHERE entry = ?', array($entry));
        return $flag['type_flags'];
    }

    public function getFlagExtra($entry)
    {
        $flag = $this->getDb('test')->fetchAssoc('SELECT flags_extra FROM creature_template WHERE entry = ?', array($entry));
        return $flag['flags_extra'];
    }

    public function getCreatureText($entry)
    {
        return $this->getDb('test')->fetchAll('SELECT ct.CreatureID, ct.groupid, ct.id, ct.text as texten, lct.text_loc2 as textfr, ct.type, ct.language, ct.probability, ct.emote, ct.duration, ct.sound, ct.comment, ct.BroadcastTextId, ct.TextRange FROM creature_text ct LEFT JOIN locales_creature_text lct ON ct.CreatureID = lct.entry AND ct.groupid = lct.groupid AND ct.id = lct.id WHERE ct.CreatureID = ?', array($entry));
    }
	
	public function getFreeGossipMenuId()
	{
		$result = $this->getDb('test')->fetchAssoc('SELECT max(entry) +1 as free_id FROM gossip_menu', array());
		return $result['free_id'];
	}
	
	public function getFreeTextId()
	{
		$result = $this->getDb('test')->fetchAssoc('SELECT max(ID) +1 as free_id FROM gossip_text', array());
		return $result['free_id'];
	}
	
	public function getTCGossipOptionSQL($tc_menu_id, &$requests, &$free_menu_id, &$sun_text_id)
	{
		$result_gossip_menu_option = $this->getDb('trinity')->fetchAll('SELECT MenuID, OptionID, OptionIcon, OptionText, OptionBroadcastTextID, OptionType, OptionNpcFlag, ActionMenuID, ActionPoiID, BoxCoded, BoxMoney, BoxText, BoxBroadcastTextID FROM gossip_menu_option WHERE MenuID = ?', array($tc_menu_id));

		if(empty($result_gossip_menu_option))
			return;
		
		//sorry about this...
		$option_menu_id = $free_menu_id;
		$free_menu_id += sizeof($result_gossip_menu_option)+1;
		$starting_free_menu_id = $free_menu_id;
		foreach($result_gossip_menu_option as $gossip_option) {
			++$free_menu_id;
			array_push($requests, "INSERT INTO gossip_menu_option (menu_id, id, option_icon, option_text, OptionBroadcastTextID, option_id, npc_option_npcflag, action_menu_id, action_poi_id, box_coded, box_money, box_text, BoxBroadcastTextID) VALUES ($option_menu_id, \"".$gossip_option['OptionID']."\",\"".$gossip_option['OptionIcon']."\", \"".$gossip_option['OptionText']."\",\"".$gossip_option['OptionBroadcastTextID']."\",\"".$gossip_option['OptionType']."\",\"".$gossip_option['OptionNpcFlag']."\",".$free_menu_id.",\"".$gossip_option['ActionPoiID']."\",\"".$gossip_option['BoxCoded']."\",\"".$gossip_option['BoxMoney']."\",\"".$gossip_option['BoxText']."\",\"".$gossip_option['BoxBroadcastTextID']."\");");
			if($gossip_option['ActionPoiID'] != 0)
				array_push($requests, "-- -- Last request containts ActionPoiID, this tool currently does not handle it");
		}
		
		$free_menu_id = $starting_free_menu_id;
		foreach($result_gossip_menu_option as $gossip_option) {
			if($gossip_option['ActionMenuID'] != 0) {
				$free_menu_id++;
				$this->getTCGossipMenuSQL($gossip_option['ActionMenuID'], $requests, $free_menu_id, $sun_text_id);
			}
		}
	}
	
	public function getTCGossipMenuSQL($tc_menu_id, &$requests, &$free_menu_id, &$sun_text_id)
	{
		//Get initial menu id
		array_push($requests, "-- Menu {$free_menu_id}");
		$result_gossip_menu = $this->getDb('trinity')->fetchAssoc('SELECT gm.MenuID, gm.TextID, gt.* FROM gossip_menu gm JOIN npc_text gt ON gm.TextID = gt.ID WHERE gm.MenuID = ?', array($tc_menu_id));
		$text_id = $result_gossip_menu['TextID'];
		if(empty($result_gossip_menu))
			return "Menu {$tc_menu_id} exists but not found in gossip menu (or text {$text_id} not found)";
		//Create requests
		$sun_text_id++;
		array_push($requests, "DELETE FROM gossip_text WHERE ID = $sun_text_id;");
		$result_gossip_menu['comment'] = $this->getDb('trinity')->quote($result_gossip_menu['comment']);
		$result_gossip_menu['text0_0'] = $this->getDb('trinity')->quote($result_gossip_menu['text0_0']);
		$result_gossip_menu['text0_1'] = $this->getDb('trinity')->quote($result_gossip_menu['text0_1']);
		array_push($requests, "INSERT INTO gossip_text (ID, comment, text0_0, text0_1) VALUES (${sun_text_id}, ".$result_gossip_menu['comment'].",".$result_gossip_menu['text0_0'].", ".$result_gossip_menu['text0_1'].");");
		array_push($requests, "DELETE FROM gossip_menu WHERE entry = ${free_menu_id};");
		array_push($requests, "INSERT INTO gossip_menu (entry, text_id) VALUES (${free_menu_id}, ${sun_text_id});");
		$this->getTCGossipOptionSQL($tc_menu_id, $requests, $free_menu_id, $sun_text_id);
	}
	
	public function getTCGossipSQL($entry)
	{
		$tc_menu_id = $this->getTCGossipMenuId($entry);
		if($tc_menu_id == 0)
			return "No menu for this creature";
		$requests = array();
		$free_menu_id = $this->getFreeGossipMenuId();
		$sun_text_id = $this->getFreeTextId();
		array_push($requests, "-- Link creature to first menu and ensure gossip is enabled");
		array_push($requests, "UPDATE creature_template SET gossip_menu_id = ${free_menu_id}, npcflag = npcflag | 0x1 WHERE entry = ${entry};");
		$this->getTCGossipMenuSQL($tc_menu_id, $requests, $free_menu_id, $sun_text_id);
		return $requests;
	}
	
	public function getTCGossipMenuId($entry)
	{
		$result_creature_template = $this->getDb('trinity')->fetchAssoc('SELECT gossip_menu_id FROM creature_template WHERE entry = ?', array($entry));
		$tc_menu_id = $result_creature_template['gossip_menu_id'];
		return $tc_menu_id;
	}
	
	public function getGossipMenuId($entry)
	{
		$result_creature_template = $this->getDb('test')->fetchAssoc('SELECT gossip_menu_id FROM creature_template WHERE entry = ?', array($entry));
		$tc_menu_id = $result_creature_template['gossip_menu_id'];
		return $tc_menu_id;
	}

    public function getMenu($entry)
    {
        if($entry == 0)
            return array("entry" => "0", "text_id" => "0", "text0_0" => "", "text0_1" => "");
        return  $this->getDb('test')->fetchAssoc('SELECT entry, text_id, text0_0, text0_1 FROM gossip_menu gm JOIN gossip_text gt ON gt.ID = gm.text_id WHERE gm.entry = ?', array(intval($entry)));
    }

    // Return the options of a menu in the form of an array of [ menu_id, id, option_icon, option_text, action_menu_id ]
    public function getMenuOptions($entry) {
        return $this->getDb('test')->fetchAll('SELECT menu_id, id, option_icon, option_text, action_menu_id, npc_option_npcflag FROM gossip_menu_option WHERE menu_id = ?', array(intval($entry)));
    }

	// Return the conditions of a menu in the form of an array of [ id, source, type, target, reverse, value1, value2, value3 ]
    public function getMenuConditions($entry, $textid)
    {
        return $this->getDb('test')->fetchAll('SELECT
                                        id, SourceTypeOrReferenceId as source, ConditionTypeOrReference as type,
									    ConditionTarget as target, NegativeCondition as reverse,
										ConditionValue1 as value1, ConditionValue2 as value2, ConditionValue3 as value3
                                      FROM conditions
                                      WHERE SourceTypeOrReferenceId = 14 AND SourceGroup = ? AND SourceEntry = ?', array(intval($entry), intval($textid))); // CONDITION_SOURCE_TYPE_GOSSIP_MENU = 14
    }

    // Return the conditions of a menu option in the form of an array of [ id, source, type, target, reverse, value1, value2, value3 ]
    public function getMenuOptionsConditions($entry)
    {
        return $this->getDb('test')->fetchAll('SELECT id, SourceTypeOrReferenceId as source, ConditionTypeOrReference as type,
										 ConditionTarget as target, NegativeCondition as reverse,
										 ConditionValue1 as value1, ConditionValue2 as value2, ConditionValue3 as value3
                                      FROM conditions
                                      WHERE SourceTypeOrReferenceId = 15 AND SourceGroup = ?', array(intval($entry))); // CONDITION_SOURCE_TYPE_GOSSIP_MENU_OPTION = 15
    }

    public function hasMenu($array, $id)
    {
        foreach($array["menus"] as $key => $menu) {
            if($menu["id"] == $id)
                return true;
        }
        return false;
    }

    // Add a menu and all its children (referenced in its options) to $array
    public function addMenuAndChildren($entry, array & $array)
    {
        if($entry == 0)
            return;

        $menuDB = $this->getMenu($entry);
        $menu = [
            "id"      		=> $entry,
            "text0"   		=> $menuDB["text0_0"],
            "text1"   		=> $menuDB["text0_1"],
            "options" 		=> [],
            "conditions" 	=> [],
        ];

        // Process conditions
        $menuConditionsDB = $this->getMenuConditions($entry, $menuDB["text_id"]);
        foreach($menuConditionsDB as $key => $condition) {
            $menu["conditions"][$key] = [
                "id"		=> $condition['id'],
                "source"  	=> $condition['source'],
                "type"  	=> $condition['type'],
                "target"  	=> $condition['target'],
                "value1"  	=> $condition['value1'],
                "value2"  	=> $condition['value2'],
                "value3"  	=> $condition['value3'],
                "reverse"  	=> $condition['reverse'],
            ];
        }

        // Process options
        $menuOptionsDB = $this->getMenuOptions($entry);
        foreach($menuOptionsDB as $key => $option) {
            $menu["options"][$option['id']] = [
                "id"    		=> $option['id'],
                "icon"  		=> $option['option_icon'],
                "text"  		=> $option['option_text'],
                "flag"  		=> $option['npc_option_npcflag'],
                "next"  		=> $option['action_menu_id'],
                "conditions"	=> [ ],
            ];

            // Process options conditions
            $menuOptionsConditionsDB = $this->getMenuOptionsConditions($entry);
            foreach($menuOptionsConditionsDB as $keyCondition => $condition) {
                $menu["options"][$key]["conditions"][$condition['id']] = [
                    "id"		=> $condition['id'],
                    "source"  	=> $condition['source'],
                    "type"  	=> $condition['type'],
                    "target"  	=> $condition['target'],
                    "value1"  	=> $condition['value1'],
                    "value2"  	=> $condition['value2'],
                    "value3"  	=> $condition['value3'],
                    "reverse"  	=> $condition['reverse'],
                ];
            }
        }
        $array['menus'][$menu['id']] = $menu;
        $array['main'] = $menu['id'];

        // If any option points to a menu, process it too
        foreach($menuOptionsDB as $key => $option) {
            $next = $menu["options"][$option['id']]["next"];
            if($next != 0 && !$this->hasMenu($array, $next))
                $this->addMenuAndChildren($next, $array);
        }
        return $array;
    }

    public function getNewGossipMenu()
    {
        return $this->getDb('test')->fetchAssoc('SELECT (MAX(entry) + 1) as newMenu FROM gossip_menu');
    }

    public function search($name)
    {
        return $this->getDb('test')->fetchAll("SELECT entry, difficulty_entry_1 as heroic, name FROM creature_template WHERE name LIKE '%{$name}%'");
    }
	
	public function getEquipment($entry)
	{
		$getInfos  = $this->getDb('test')->fetchAssoc('SELECT name FROM creature_template WHERE entry = ?', array(intval($entry)));
		$itemInfos = [
			"name"          => $getInfos['name']
		];

		$getEquipment  = $this->getDb('test')->fetchAll('SELECT id, equipmodel1, equipmodel2, equipmodel3, equipinfo1, equipinfo2, equipinfo3, equipslot1, equipslot2, equipslot3 FROM creature_equip_template WHERE creatureID = ?', array(intval($entry)));
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