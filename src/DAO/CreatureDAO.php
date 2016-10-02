<?php

namespace SUN\DAO;

use SUN\Domain\Creature;
use Doctrine\DBAL\Connection;

class CreatureDAO extends DAO
{
    public function getCreature($entry)
    {
        return $this->getDb('test')->fetchAssoc('SELECT * from creature_template WHERE entry = ?', array($entry));
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
        $name = $this->getDb('test')->fetchAssoc('SELECT ct.name FROM creature c JOIN creature_template ct ON ct.entry = c.id WHERE guid = ?', array($creature->getGuid()));
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
        return $this->getDb('test')->fetchAll('SELECT ct.entry, ct.groupid, ct.id, ct.text as texten, lct.text_loc2 as textfr, ct.type, ct.language, ct.probability, ct.emote, ct.duration, ct.sound, ct.comment, ct.BroadcastTextId, ct.TextRange FROM creature_text ct LEFT JOIN locales_creature_text lct ON ct.entry = lct.entry AND ct.groupid = lct.groupid AND ct.id = lct.id WHERE ct.entry = ?', array($entry));
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
        return $this->getDb('test')->fetchAll("SELECT entry, name FROM creature_template WHERE name LIKE '%{$name}%'");
    }
	
	public function getEquipment($entry)
	{
		$getInfos  = $this->getDb('test')->fetchAssoc('SELECT name, equipment_id FROM creature_template WHERE entry = ?', array(intval($entry)));
		$itemInfos = [
			"name"          => $getInfos['name'],
			"equipmentID"   => $getInfos['equipment_id'],
		];

		$getEquipment  = $this->getDb('test')->fetchAll('SELECT id, equipmodel1, equipmodel2, equipmodel3, equipinfo1, equipinfo2, equipinfo3, equipslot1, equipslot2, equipslot3 FROM creature_equip_template WHERE entry = ?', array($getInfos['equipment_id']));
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