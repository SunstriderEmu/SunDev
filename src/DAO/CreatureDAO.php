<?php

namespace SUN\DAO;

use SUN\Domain\Creature;
use SUN\Domain\Text;
use Doctrine\DBAL\Connection;

class CreatureDAO extends DAO {
    public function getCreature($entry) {
        $creature = $this->test->fetchAssoc('SELECT * from creature_template WHERE entry = ?', array($entry));
        $minStats = $this->test->fetchAssoc('SELECT * from creature_classlevelstats WHERE class = ? AND level = ?', array($creature['unit_class'], $creature['minlevel']));
        $maxStats = $this->test->fetchAssoc('SELECT * from creature_classlevelstats WHERE class = ? AND level = ?', array($creature['unit_class'], $creature['maxlevel']));

        $creature['gender'] = $this->getGender($entry);

        $total = $this->test->fetchAssoc('SELECT COUNT(*) as count, map from creature WHERE id = ?', array($entry));
        $creature['total'] = $total['count'];

        $zone = $this->dbc->fetchAssoc('SELECT name FROM dbc_areatable WHERE ref_map = ?', array($total['map']));
        $creature['zone'] = $zone['name'];

        $creature['texts'] = $this->test->fetchAll('SELECT text, type FROM creature_text WHERE entry = ?', array($entry));

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

        $creature['melee']['minlevel']['base']  = $creature['DamageModifier'] * $minStats[$base_damage];
        $creature['melee']['minlevel']['ap']    = $creature['DamageModifier'] * ($minStats['attackpower'] / 14) * ($creature['BaseAttackTime'] / 1000);
        $creature['melee']['minlevel']['min']   = $creature['DamageModifier'] * ($minStats[$base_damage] + ($minStats['attackpower'] / 14) * ($creature['BaseAttackTime'] / 1000));
        $creature['melee']['minlevel']['max']   = $creature['DamageModifier'] * ($minStats[$base_damage] + ($minStats['attackpower'] / 14) * ($creature['BaseAttackTime'] / 1000)) * (1 + $creature['BaseVariance']);
        $creature['melee']['minlevel']['avg']   = ($creature['melee']['minlevel']['min'] + $creature['melee']['minlevel']['max']) / 2 / ($creature['BaseAttackTime'] / 1000);

        $creature['ranged']['minlevel']['base']  = $creature['DamageModifier'] * $minStats[$base_damage];
        $creature['ranged']['minlevel']['ap']    = $creature['DamageModifier'] * ($minStats['rangedattackpower'] / 14) * ($creature['RangeAttackTime'] / 1000);
        $creature['ranged']['minlevel']['min']   = $creature['DamageModifier'] * ($minStats[$base_damage] + ($minStats['rangedattackpower'] / 14) * ($creature['RangeAttackTime'] / 1000));
        $creature['ranged']['minlevel']['max']   = $creature['DamageModifier'] * ($minStats[$base_damage] + ($minStats['rangedattackpower'] / 14) * ($creature['RangeAttackTime'] / 1000)) * (1 + $creature['RangeVariance']);
        $creature['ranged']['minlevel']['avg']   = ($creature['ranged']['minlevel']['min'] + $creature['ranged']['minlevel']['max']) / 2 / ($creature['RangeAttackTime'] / 1000);

        if($creature['minlevel'] != $creature['maxlevel']) {
            $creature['melee']['maxlevel']['base']  = $creature['DamageModifier'] * $maxStats[$base_damage];
            $creature['melee']['maxlevel']['ap']    = $creature['DamageModifier'] * ($maxStats['attackpower'] / 14) * ($creature['BaseAttackTime'] / 1000);
            $creature['melee']['maxlevel']['min']   = $creature['DamageModifier'] * ($maxStats[$base_damage] + ($maxStats['attackpower'] / 14) * ($creature['BaseAttackTime'] / 1000));
            $creature['melee']['maxlevel']['max']   = $creature['DamageModifier'] * ($maxStats[$base_damage] + ($maxStats['attackpower'] / 14) * ($creature['BaseAttackTime'] / 1000)) * (1 + $creature['BaseVariance']);
            $creature['melee']['maxlevel']['avg']   = ($creature['melee']['maxlevel']['min'] + $creature['melee']['maxlevel']['max']) / 2 / ($creature['BaseAttackTime'] / 1000);

            $creature['ranged']['maxlevel']['base']  = $creature['DamageModifier'] * $maxStats[$base_damage];
            $creature['ranged']['maxlevel']['ap']    = $creature['DamageModifier'] * ($maxStats['rangedattackpower'] / 14) * ($creature['RangeAttackTime'] / 1000);
            $creature['ranged']['maxlevel']['min']   = $creature['DamageModifier'] * ($maxStats[$base_damage] + ($maxStats['rangedattackpower'] / 14) * ($creature['RangeAttackTime'] / 1000));
            $creature['ranged']['maxlevel']['max']   = $creature['DamageModifier'] * ($maxStats[$base_damage] + ($maxStats['rangedattackpower'] / 14) * ($creature['RangeAttackTime'] / 1000)) * (1 + $creature['RangeVariance']);
            $creature['ranged']['maxlevel']['avg']   = ($creature['ranged']['maxlevel']['min'] + $creature['ranged']['maxlevel']['max']) / 2 / ($creature['RangeAttackTime'] / 1000);
        }
        return $creature;
    }

    public function getStats($class, $level) {
        return $this->test->fetchAssoc('SELECT * FROM creature_classlevelstats WHERE level = ? AND class = ?', array($level, $class));
    }

    public function getGender($entry) {
        $models = $this->test->fetchAssoc('SELECT modelid1, modelid2, modelid3, modelid4 FROM creature_template WHERE entry = ?', array($entry));
        $modelId = [];
        for($i = 1 ; $i < 5 ; $i++) {
            if($models["modelid{$i}"] != 0)
                array_push($modelId, $models["modelid{$i}"]);
        }
        $modelId = array_map("unserialize", array_unique(array_map("serialize", $modelId)));
        $modelInfos = $this->test->fetchAll('SELECT modelid_other_gender, gender FROM creature_model_info WHERE modelid IN (?)', array($modelId), array(Connection::PARAM_INT_ARRAY));
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

    public function findCreatureEntryName(Creature $creature) {
        $name = $this->test->fetchAssoc('SELECT name FROM creature_template WHERE entry = ?', array($creature->getEntry()));
        $creature->setName($name['name']);
        return $creature;
    }

    public function findCreatureGuidName(Creature $creature) {
        $name = $this->test->fetchAssoc('SELECT ct.name FROM creature c JOIN creature_template ct ON ct.entry = c.id WHERE guid = ?', array($creature->getGuid()));
        $creature->setName($name['name']);
        return $creature;
    }

    public function getImmunities($entry) {
        $immunities = $this->test->fetchAssoc('SELECT mechanic_immune_mask as mask FROM creature_template WHERE entry = ?', array($entry));
        return $immunities['mask'];
    }

    public function getNPCFlag($entry) {
        $flag = $this->test->fetchAssoc('SELECT npcflag FROM creature_template WHERE entry = ?', array($entry));
        return $flag['npcflag'];
    }

    public function getUnitFlag($entry) {
        $flag = $this->test->fetchAssoc('SELECT unit_flags FROM creature_template WHERE entry = ?', array($entry));
        return $flag['unit_flags'];
    }

    public function getUnitFlag2($entry) {
        $flag = $this->test->fetchAssoc('SELECT unit_flags2 FROM creature_template WHERE entry = ?', array($entry));
        return $flag['unit_flags2'];
    }

    public function getDynamicFlag($entry) {
        $flag = $this->test->fetchAssoc('SELECT dynamicflags FROM creature_template WHERE entry = ?', array($entry));
        return $flag['dynamicflags'];
    }

    public function getTypeFlag($entry) {
        $flag = $this->test->fetchAssoc('SELECT type_flags FROM creature_template WHERE entry = ?', array($entry));
        return $flag['type_flags'];
    }

    public function getFlagExtra($entry) {
        $flag = $this->test->fetchAssoc('SELECT flags_extra FROM creature_template WHERE entry = ?', array($entry));
        return $flag['flags_extra'];
    }

    public function getCreatureText($entry) {
        $all = $this->test->fetchAll('SELECT * FROM creature_text WHERE entry = ?', array($entry));
        $texts = [];
        foreach($all as $text) {
            $texts[] = new Text($text);
        }
        return $texts;
    }

    public function getMenu($entry) {
        if($entry == 0)
            return array("entry" => "0", "text_id" => "0", "text0_0" => "", "text0_1" => "");

        return  $this->test->fetchAssoc('SELECT entry, text_id, text0_0, text0_1 FROM gossip_menu gm JOIN gossip_text gt ON gt.ID = gm.text_id WHERE gm.entry = ?', array(intval($entry)));
    }

    // Return the options of a menu in the form of an array of [ menu_id, id, option_icon, option_text, action_menu_id ]
    public function getMenuOptions($entry) {
        return $this->test->fetchAll('SELECT menu_id, id, option_icon, option_text, action_menu_id FROM gossip_menu_option WHERE menu_id = ?', array(intval($entry)));
    }

// Return the conditions of a menu in the form of an array of [ id, source, type, target, reverse, value1, value2, value3 ]
    public function getMenuConditions($entry, $textid)
    {
        return $this->test->fetchAll('SELECT
                                        id, SourceTypeOrReferenceId as source, ConditionTypeOrReference as type,
									    ConditionTarget as target, NegativeCondition as reverse,
										ConditionValue1 as value1, ConditionValue2 as value2, ConditionValue3 as value3
                                      FROM conditions
                                      WHERE SourceTypeOrReferenceId = 14 AND SourceGroup = ? AND SourceEntry = ?', array(intval($entry), intval($textid))); // CONDITION_SOURCE_TYPE_GOSSIP_MENU = 14
    }

    // Return the conditions of a menu option in the form of an array of [ id, source, type, target, reverse, value1, value2, value3 ]
    public function getMenuOptionsConditions($entry)
    {
        return $this->test->fetchAll('SELECT id, SourceTypeOrReferenceId as source, ConditionTypeOrReference as type,
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
    public function addMenuAndChildren($entry, array & $array) {
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

        // If any option points to a menu, process it too
        foreach($menuOptionsDB as $key => $option) {
            $next = $menu["options"][$option['id']]["next"];
            if($next != 0 && !$this->hasMenu($array, $next))
                $this->addMenuAndChildren($next, $array);
        }
        return $array;
    }

    public function getNewGossipMenu() {
        return $this->test->fetchAssoc('SELECT (MAX(entry) + 1) as newMenu FROM gossip_menu');
    }
}