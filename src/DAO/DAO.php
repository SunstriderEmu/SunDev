<?php

namespace SUN\DAO;

use Exception;

class DAO
{
	protected $app;

	/**
	 * @param \Silex\Application $app
	 */
	public function __construct(\Silex\Application $app)
	{
		$this->app = $app;
	}

    protected function getDb($name)
    {
        return $this->app['dbs'][$name];
    }

    /**
     * 0-9		SmartAI
     * 10-29	Creature
     * 30-39	GameObject
     * 40-49	Spell
     * 50-59	Loot
     * 60-69	Item
     * 70-79	Waypoints
     *
     * @param $data
     * @param $db
     * @return string
     * @throws Exception
     */
	public function setScript($data, $db) {
        $conn = $this->getDb($db);
        $conn->beginTransaction();
        try
        {
            switch($data['review']->source_type) {
                case 0: // Creature
                case 1: // GO
                case 2: // AreaTrigger
                case 9: // Script
                    switch($data['review']->source_type)
                    {
                        case 0:
                            if ($data['review']->entryorguid > 0)
                            {
                                $export .= "-- NPC {$data['review']->entryorguid}\nSET @ENTRY = {$data['review']->entryorguid};\nUPDATE creature_template SET AIName='SmartAI', ScriptName='' WHERE entry = @ENTRY;\n";
                                $this->getDb($db)->executeQuery('UPDATE creature_template SET AIName="SmartAI", ScriptName="" WHERE entry = ?;', array(intval($data['review']->entryorguid)));
                            }
                            else
                            {
                                $entry = $this->getDb($db)->fetchAssoc('SELECT entry as id FROM creature_entry WHERE spawnID = ?;', array(abs($data['review']->entryorguid)));
                                $export .= "-- GUID {$data['review']->entryorguid} - ENTRY {$entry['id']}\nSET @ENTRY = {$data['review']->entryorguid};\nUPDATE creature_template SET AIName='SmartAI', ScriptName='' WHERE entry = {$entry['id']};";
                                $this->getDb($db)->executeQuery('UPDATE creature_template SET AIName="SmartAI", ScriptName="" WHERE entry = ?;', array($entry['id']));
                            }
                            break;
                        case 1:
                            if ($data['review']->entryorguid > 0)
                            {
                                $export .= "-- GO {$data['review']->entryorguid}\nSET @ENTRY = {$data['review']->entryorguid};\nUPDATE gameobject_template SET AIName='SmartGameObjectAI', ScriptName='' WHERE entry = @ENTRY;\n";
                                $this->getDb($db)->executeQuery('UPDATE gameobject_template SET AIName="SmartGameObjectAI", ScriptName="" WHERE entry = ?;', array(intval($data['review']->entryorguid)));
                            }
                            else
                            {
                                $entry = $this->getDb($db)->executeQuery('SELECT id FROM gameobject WHERE guid = ?;', array(abs($data['review']->entryorguid)));
                                $export .= "-- GUID {$data['review']->entryorguid} - ENTRY {$entry['id']}\nSET @ENTRY = {$data['review']->entryorguid};\nUPDATE gameobject_template SET AIName='SmartGameObjectAI', ScriptName='' WHERE entry = {$entry['id']};";
                                $this->getDb($db)->executeQuery('UPDATE gameobject_template SET AIName="SmartGameObjectAI", ScriptName="" WHERE entry = ?;', array($entry['id']));
                            }
                            break;
                        case 2:
                            $export .= "-- AreaTrigger {$data['review']->entryorguid}\nSET @ENTRY = {$data['review']->entryorguid};\nREPLACE INTO areatrigger_scripts VALUES (@ENTRY, 'SmartTrigger');\n";
                            $this->getDb($db)->executeQuery('REPLACE INTO areatrigger_scripts VALUES (?, "SmartTrigger")', array(intval($data['review']->entryorguid)));
                            break;
                    }

                    $export .= "DELETE FROM smart_scripts WHERE entryorguid = @ENTRY AND source_type = {$data['review']->source_type};\n";

                    $this->getDb($db)->executeQuery('DELETE FROM smart_scripts WHERE entryorguid = ? AND source_type = ?;', array($data['review']->entryorguid, $data['review']->source_type));
                    if($data['script'] != null) {
                        $export .= "INSERT IGNORE INTO smart_scripts (entryorguid, source_type, id, link, event_type, event_phase_mask, event_chance, event_flags, event_param1, event_param2, event_param3, event_param4, action_type, action_param1, action_param2, action_param3, action_param4, action_param5, action_param6, target_type, target_flags, target_param1, target_param2, target_param3, target_x, target_y, target_z, target_o, comment, patch_min, patch_max) VALUES \n";
                        $insert = 'INSERT IGNORE INTO smart_scripts (entryorguid, source_type, id, link, event_type, event_phase_mask, event_chance, event_flags, event_param1, event_param2, event_param3, event_param4, action_type, action_param1, action_param2, action_param3, action_param4, action_param5, action_param6, target_type, target_flags, target_param1, target_param2, target_param3, target_x, target_y, target_z, target_o, comment, patch_min, patch_max) VALUES ';
                        foreach($data['script'] as $line)
                        {
                            $insert .= "({$data['review']->entryorguid}, {$data['review']->source_type}, {$line[0]}, {$line[1]}, {$line[2]}, {$line[3]}, {$line[4]}, {$line[5]}, {$line[6]}, {$line[7]}, {$line[8]}, {$line[9]}, {$line[10]}, {$line[11]}, {$line[12]}, {$line[13]}, {$line[14]}, {$line[15]}, {$line[16]}, {$line[17]}, {$line[18]}, {$line[19]}, {$line[20]}, {$line[21]}, {$line[22]}, {$line[23]}, {$line[24]}, {$line[25]}, '{$line[26]}', '{$line[27]}', '{$line[28]}'),";
                            $export .= "(@ENTRY, {$data['review']->source_type}, {$line[0]}, {$line[1]}, {$line[2]}, {$line[3]}, {$line[4]}, {$line[5]}, {$line[6]}, {$line[7]}, {$line[8]}, {$line[9]}, {$line[10]}, {$line[11]}, {$line[12]}, {$line[13]}, {$line[14]}, {$line[15]}, {$line[16]}, {$line[17]}, {$line[18]}, {$line[19]}, {$line[20]}, {$line[21]}, {$line[22]}, {$line[23]}, {$line[24]}, {$line[25]}, '{$line[26]}', '{$line[27]}', '{$line[28]}'),\n";
                        }
                        $insert = rtrim($insert, ',');
                        $export = rtrim($export, ",\n");
                        $this->getDb($db)->executeQuery($insert);
                    }
                    echo $export.";\n";
                    break;
                case 10: // Stats
                    $this->getDb($db)->executeQuery("UPDATE creature_template
                                              SET AIName = ?, ScriptName = ?, rank = ?, type = ?, family = ?, mingold = ?, maxgold = ?,
                                              exp = ?, unit_class = ?, minlevel = ?, maxlevel = ?, HealthModifier = ?, ManaModifier = ?, ArmorModifier = ?, DamageModifier = ?, BaseAttackTime = ?, RangeAttackTime = ?, BaseVariance = ?, RangeVariance = ?,
                                              resistance1 = ?, resistance2 = ?, resistance3 = ?, resistance4 = ?, resistance5 = ?, resistance6 = ?
                                              WHERE entry = ?",
                        array($data['script']->info[0], $data['script']->info[1], $data['script']->info[2], $data['script']->info[3], $data['script']->info[4], $data['script']->info[5], $data['script']->info[6],
                            $data['script']->modifiers[0], $data['script']->modifiers[1], $data['script']->modifiers[2], $data['script']->modifiers[3], $data['script']->modifiers[4], $data['script']->modifiers[5], $data['script']->modifiers[6], $data['script']->modifiers[7], $data['script']->modifiers[8], $data['script']->modifiers[9], $data['script']->modifiers[10], $data['script']->modifiers[11],
                            $data['script']->resistance[0], $data['script']->resistance[1], $data['script']->resistance[2], $data['script']->resistance[3], $data['script']->resistance[4], $data['script']->resistance[5],
                            intval($data['review']->entryorguid)));
                    break;
                case 11: // Equipment
					if($data['review']->info1 == '0') {
						$newEntry = $this->getDb($db)->fetchAssoc('SELECT (MAX(entry) + 1) as entry FROM creature_equip_template');
						$data['review']->info1 = $newEntry['entry'];
                    }
                    $this->getDb($db)->executeQuery("DELETE FROM creature_equip_template WHERE creatureID = ?", array(intval($data['review']->entryorguid)));
                    $insert = "INSERT INTO creature_equip_template (creatureID, id, equipmodel1, equipmodel2, equipmodel3, equipinfo1, equipinfo2, equipinfo3, equipslot1, equipslot2, equipslot3) VALUES";
                    foreach($data['script'] as $line)
                        $insert .= "\n({$data['review']->entryorguid}, {$line[0]}, {$line[1]}, {$line[2]}, {$line[3]}, {$line[4]}, {$line[5]}, {$line[6]}, {$line[7]}, {$line[8]}, {$line[9]}),";
                    $insert = rtrim($insert, ',') . ';';
                    echo $insert;
                    $this->getDb($db)->executeQuery($insert);
                    break;
                case 12: // Text
                    $export = "\nSET @ENTRY = {$data['review']->entryorguid};\nDELETE FROM creature_text WHERE CreatureID = @ENTRY;\n";
                    $this->getDb($db)->executeQuery("DELETE FROM creature_text WHERE CreatureID = ?", array(intval($data['review']->entryorguid)));
                    $this->getDb($db)->executeQuery("DELETE FROM locales_creature_text WHERE entry = ?", array(intval($data['review']->entryorguid)));
                    $insert = "INSERT IGNORE INTO creature_text (CreatureID, groupid, id, text, type, language, probability, emote, sound, comment) VALUES ";
                    $export .= "INSERT IGNORE INTO creature_text (CreatureID, groupid, id, text, type, language, probability, emote, sound, comment) VALUES \n";
                    $insertLocale = "INSERT IGNORE INTO locales_creature_text (entry, groupid, id, text_loc2) VALUES ";
                    foreach($data['script'] as $line)
                    {
						$line[2] = str_replace('"', '\"', $line[2]);
						$line[3] = str_replace('"', '\"', $line[3]);
                        $export .= "(@ENTRY, {$line[0]}, {$line[1]}, \"{$line[2]}\", {$line[4]}, {$line[5]}, {$line[6]}, {$line[7]}, {$line[8]}, \"{$line[9]}\"),\n";
                        $insert .= "({$data['review']->entryorguid}, {$line[0]}, {$line[1]}, \"{$line[2]}\", {$line[4]}, {$line[5]}, {$line[6]}, {$line[7]}, {$line[8]}, \"{$line[9]}\"),";
                        $insertLocale .= "({$data['review']->entryorguid}, {$line[0]}, {$line[1]}, \"{$line[3]}\"),";
                    }
                    $export = rtrim($export, ",\n");
                    $insert = rtrim($insert, ',');
                    $insertLocale = rtrim($insertLocale, ',');
                    $this->getDb($db)->executeQuery($insert);
                    if ($line[3] != '')
                        $this->getDb($db)->executeQuery($insertLocale);
                    echo $export.";\n";
                    break;
                case 13: // Gossip
                    // newX = new entry de maxentry;
                    $maxMenuEntry = $this->getDb('test')->fetchAssoc('SELECT MAX(entry) as entry FROM gossip_menu');
                    $maxMenuEntry = $maxMenuEntry['entry'];

                    $maxConditionEntry = $this->getDb('test')->fetchAssoc('SELECT MAX(id) as entry FROM conditions');
                    $maxConditionEntry = $maxConditionEntry['entry'];

                    $sql_menu  		= "INSERT INTO gossip_menu VALUES ";
                    $sql_texts 		= "INSERT INTO gossip_text (id, text0_0, text0_1) VALUES ";
                    $sql_option 	= "INSERT INTO gossip_menu_option (menu_id, id, option_icon, option_text, option_id, npc_option_npcflag, action_menu_id) VALUES ";
                    $sql_condition 	= "INSERT INTO conditions (id, SourceGroup, SourceEntry, SourceTypeOrReferenceId, ConditionTypeOrReference, ConditionTarget, NegativeCondition, ConditionValue1, ConditionValue2, ConditionValue3) VALUES ";

                    foreach($data['script']->menus as $key => $menu){
                        // gossip_menu
                        if(preg_match('/new[0-9]+/', $key) == 1){
                            $maxMenuEntry++;
                            if($data['script']->main == $key)
                                $first = $maxMenuEntry;
                            $key = $maxMenuEntry;
                        }

                        $this->getDb($db)->executeQuery('DELETE FROM gossip_menu WHERE entry = ?', array($key));
                        $this->getDb($db)->executeQuery('DELETE FROM gossip_text WHERE ID = ?', array($key));
                        $this->getDb($db)->executeQuery('DELETE FROM gossip_menu_option WHERE menu_id = ?', array($key));

                        if($data['script']->main == $key)
                            $first = $key;

                        $sql_menu  .= "({$key}, {$key}),";

                        if($menu->text1 == null)
                            $sql_texts .= "({$key}, \"{$menu->text0}\", NULL),";
                        elseif ($menu->text0 == null)
                            $sql_texts .= "({$key}, NULL, \"{$menu->text1}\"),";
                        else
                            $sql_texts .= "({$key}, \"{$menu->text0}\", \"{$menu->text1}\"),";

                        foreach($menu->options as $keyOption => $option){
                            switch($option->icon){
                                case 1:		$option_id = 3;		break;
                                case 2:		$option_id = 4;		break;
                                case 3:		$option_id = 5;		break;
                                case 4:		$option_id = 6;		break;
                                case 5:		$option_id = 8;		break;
                                case 6:		$option_id = 9;		break;
                                case 7:		$option_id = 10;	break;
                                case 8:		$option_id = 11;	break;
                                case 10:	$option_id = 12;	break;
                                case 11:	$option_id = 13;	break;
                                case 12:	$option_id = 14;	break;
                                case 13:	$option_id = 15;	break;
                                default: 	$option_id = $keyOption;
                            }
                            $sql_option .= "({$key}, {$keyOption}, {$option->icon}, \"{$option->text}\", {$option_id}, {$option->flag}, {$option->next}),";
                            foreach($option->conditions as $keyCondition => $condition) {
                                if(preg_match('/new[0-9]+/', $keyCondition) == 1){
                                    $maxConditionEntry++;
                                    $condition->id = $maxConditionEntry;
                                }
                                $sql_condition .= "({$condition->id}, {$condition->source}, {$condition->type}, {$condition->target}, {$condition->reverse}, {$condition->value1}, {$condition->value2}, {$condition->value3}),";
                            }
                        }
                        foreach($menu->conditions as $keyCondition => $condition){
                            if(preg_match('/new[0-9]+/', $condition->id) == 1){
                                $maxConditionEntry++;
                                $condition->id = $maxConditionEntry;
                            } else
                                $this->getDb($db)->executeQuery('DELETE FROM conditions WHERE id = ?', array($condition->id));
                            $sql_condition .= "({$condition->id}, {$condition->source}, {$condition->type}, {$condition->target}, {$condition->reverse}, {$condition->value1}, {$condition->value2}, {$condition->value3}),";
                        }
                        var_dump($menu->conditions);
                        $this->getDb($db)->executeUpdate('UPDATE creature_template SET gossip_menu_id = ? WHERE entry = ?', array($first, $data['review']->entryorguid));
                        $this->getDb($db)->executeQuery(rtrim($sql_menu, ','));
                        $this->getDb($db)->executeQuery(rtrim($sql_texts, ','));
                        if(strlen($sql_option) > 130)
                            $this->getDb($db)->executeQuery(rtrim($sql_option, ','));
                        if(strlen($sql_condition) > 180)
                            $this->getDb($db)->executeQuery(rtrim($sql_condition, ','));
                    }
                    break;
                case 20: // NPC Flag
                    $this->getDb($db)->executeQuery("UPDATE creature_template SET npcflag = ? WHERE entry = ?", array(intval($data['script']), intval($data['review']->entryorguid)));
                    break;
                case 21: // Unit Flag
                    $this->getDb($db)->executeQuery("UPDATE creature_template SET unit_flags = ? WHERE entry = ?", array(intval($data['script']), intval($data['review']->entryorguid)));
                    break;
                case 22: // Unit Flag 2
                    $this->getDb($db)->executeQuery("UPDATE creature_template SET unit_flags2 = ? WHERE entry = ?", array(intval($data['script']), intval($data['review']->entryorguid)));
                    break;
                case 23: // Dynamic Flag
                    $this->getDb($db)->executeQuery("UPDATE creature_template SET dynamicflags = ? WHERE entry = ?", array(intval($data['script']), intval($data['review']->entryorguid)));
                    break;
                case 24: // Type Flag
                    $this->getDb($db)->executeQuery("UPDATE creature_template SET type_flags = ? WHERE entry = ?", array(intval($data['script']), intval($data['review']->entryorguid)));
                    break;
                case 25: // Flag extra
                    $this->getDb($db)->executeQuery("UPDATE creature_template SET flags_extra = ? WHERE entry = ?", array(intval($data['script']), intval($data['review']->entryorguid)));
                    break;
                case 26: // Immunities
                    $this->getDb($db)->executeQuery("UPDATE creature_template SET mechanic_immune_mask = ? WHERE entry = ?", array(intval($data['script']), intval($data['review']->entryorguid)));
                    break;
                case 50: $this->setLoot($data, $db, 'creature');	break;
                case 51: $this->setLoot($data, $db, 'disenchant');	break;
                case 52: $this->setLoot($data, $db, 'fishing');		break;
                case 53: $this->setLoot($data, $db, 'gameobject');	break;
                case 54: $this->setLoot($data, $db, 'item');		break;
                case 55: $this->setLoot($data, $db, 'pickpocket');	break;
                case 56: $this->setLoot($data, $db, 'prospecting');	break;
                case 57: $this->setLoot($data, $db, 'quest_mail');	break;
                case 58: $this->setLoot($data, $db, 'reference');	break;
                case 59: $this->setLoot($data, $db, 'skinning');	break;
                case 70: // Transfer Waypoints
                    $name  = $this->getDb($db)->fetchAssoc('SELECT name FROM creature_template WHERE entry = ?', array(intval($data['script']->entry)));
                    // Delete previous waypoints
                    $this->getDb($db)->executeQuery('DELETE FROM waypoints WHERE entry = ?', array(intval($data['script']->entry)));
                    // Points to transfer
                    $points = $this->getDb($db)->fetchAll('SELECT point, position_x, position_y, position_z FROM waypoint_data WHERE id = ?', array(intval($data['script']->path)));
                    // Transfer
                    $insert = 'INSERT INTO waypoints (entry, pointid, position_x, position_y, position_z, point_comment) VALUES ';
                    foreach($points as $point)
                    {
                        $name['name'] = str_replace('"', "'", $name['name']);
                        $insert .= "({$data['script']->entry}, {$point['point']}, {$point['position_x']}, {$point['position_y']}, {$point['position_z']}, \"{$name['name']}\"),";
                    }
                    $insert = rtrim($insert, ',');
                    $this->getDb($db)->executeQuery($insert);
                    break;
                case 71: // Set Pause on Waypoint
                    $this->getDb($db)->executeQuery('UPDATE waypoint_data SET delay = ? WHERE id = ? AND point = ?', array(intval($data['script']->delay), intval($data['script']->path), intval($data['script']->point)));
                    break;
                default: return "Error - {$data['review']->source_type}";
            }
            $conn->commit();
        }
        catch(Exception $e)
        {
            $conn->rollBack();
            throw $e;
        }
		return "Success";
	}

	protected function setLoot($data, $db, $table) {
		$this->getDb($db)->executeQuery("DELETE FROM {$table}_loot_template WHERE entry = ?", array($data['review']->entryorguid));
		$insert = "INSERT IGNORE INTO {$table}_loot_template (entry, item, ChanceOrQuestChance, groupid, mincountOrRef, maxcount, lootcondition, condition_value1, condition_value2) VALUES ";
		foreach($data['script'] as $line)
			$insert .= "({$data['review']->entryorguid}, {$line[0]}, {$line[1]}, {$line[2]}, {$line[3]}, {$line[4]}, {$line[5]}, {$line[6]}, {$line[7]}),";
		$insert = rtrim($insert, ',');
		$this->getDb($db)->executeQuery($insert);
	}
} 