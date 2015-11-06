<?php

namespace SUN\DAO;

class DAO {
	protected $app;
	protected $dbc;
	protected $world;
	protected $tools;
	protected $test;

	/**
	 * @param \Silex\Application $app
	 */
	public function __construct(\Silex\Application $app)
	{
		$this->app = $app;
		$this->dbc = $app['dbs']['dbc'];
		$this->world = $app['dbs']['world'];
		$this->tools = $app['dbs']['suntools'];
		$this->test  = $app['dbs']['test_world'];
	}

	/**
	 * @param $data
	 * @param $db
	 * @return string
	 */
	public function setScript($data, $db) {
		switch($data['review']->source_type) {
			case 0: // Creature
			case 1: // GO
		  //case 2:    AreaTrigger NIY
			case 9: // Script
				if($data['review']->source_type == 1)
					$this->$db->executeQuery('UPDATE creature_template SET AIName="SmartAI", ScriptName="" WHERE entry = ?;', array($data['review']->entryorguid));

				$this->$db->executeQuery('DELETE FROM smart_scripts WHERE entryorguid = ? AND source_type = ?;', array($data['review']->entryorguid, $data['review']->source_type));
				if($data['script'] != null) {
					$insert = 'INSERT IGNORE INTO smart_scripts (entryorguid, source_type, id, link, event_type, event_phase_mask, event_chance, event_flags, event_param1, event_param2, event_param3, event_param4, action_type, action_param1, action_param2, action_param3, action_param4, action_param5, action_param6, target_type, target_flags, target_param1, target_param2, target_param3, target_x, target_y, target_z, target_o, comment) VALUES ';
					foreach($data['script'] as $line) {
						$insert .= "({$data['review']->entryorguid}, {$data['review']->source_type}, {$line[0]}, {$line[1]}, {$line[2]}, {$line[3]}, {$line[4]}, {$line[5]}, {$line[6]}, {$line[7]}, {$line[8]}, {$line[9]}, {$line[10]}, {$line[11]}, {$line[12]}, {$line[13]}, {$line[14]}, {$line[15]}, {$line[16]}, {$line[17]}, {$line[18]}, {$line[19]}, {$line[20]}, {$line[21]}, {$line[22]}, {$line[23]}, {$line[24]}, {$line[25]}, '{$line[26]}'),";
					}
					$insert = rtrim($insert, ',');
					$this->$db->executeQuery($insert);
				}
				break;
			case 3: // Equipment
				$this->$db->executeQuery("UPDATE creature_template SET equipment_id = ? WHERE entry = ?", array(intval($data['review']->info1), intval($data['review']->entryorguid)));
				$this->$db->executeQuery("DELETE FROM creature_equip_template WHERE entry = ?", array(intval($data['review']->info1)));
                $insert = "INSERT IGNORE INTO creature_equip_template (entry, id, equipmodel1, equipmodel2, equipmodel3, equipinfo1, equipinfo2, equipinfo3, equipslot1, equipslot2, equipslot3) VALUES ";
                foreach($data['script'] as $line) {
                    $insert .= "({$data['review']->info1}, {$line[0]}, {$line[1]}, {$line[2]}, {$line[3]}, {$line[4]}, {$line[5]}, {$line[6]}, {$line[7]}, {$line[8]}, {$line[9]}),";
                }
                $insert = rtrim($insert, ',');
                $this->$db->executeQuery($insert);
				break;
            case 4: // Text
                $this->$db->executeQuery("DELETE FROM creature_text WHERE entry = ?", array(intval($data['review']->entryorguid)));
                $insert = "INSERT IGNORE INTO creature_text (entry, groupid, id, text, type, language, probability, emote, sound, comment) VALUES ";
                foreach($data['script'] as $line) {
                    $insert .= "({$data['review']->entryorguid}, {$line[0]}, {$line[1]}, '{$line[2]}', {$line[3]}, {$line[4]}, {$line[5]}, {$line[6]}, {$line[7]}, '{$line[8]}'),";
                }
                $insert = rtrim($insert, ',');
                $this->$db->executeQuery($insert);
                break;
			case 5: // Immunities
                $this->$db->executeQuery("UPDATE creature_template SET mechanic_immune_mask = ? WHERE entry = ?", array(intval($data['script']), intval($data['review']->entryorguid)));
                break;
			case 6: // NPC Flag
                $this->$db->executeQuery("UPDATE creature_template SET npcflag = ? WHERE entry = ?", array(intval($data['script']), intval($data['review']->entryorguid)));
                break;
			case 7: // Unit Flag
                $this->$db->executeQuery("UPDATE creature_template SET unit_flags = ? WHERE entry = ?", array(intval($data['script']), intval($data['review']->entryorguid)));
                break;
			case 8: // Unit Flag 2
                $this->$db->executeQuery("UPDATE creature_template SET unit_flags2 = ? WHERE entry = ?", array(intval($data['script']), intval($data['review']->entryorguid)));
                break;
			case 20: // Dynamic Flag
                $this->$db->executeQuery("UPDATE creature_template SET dynamicflags = ? WHERE entry = ?", array(intval($data['script']), intval($data['review']->entryorguid)));
                break;
			case 21: // Type Flag
                $this->$db->executeQuery("UPDATE creature_template SET type_flags = ? WHERE entry = ?", array(intval($data['script']), intval($data['review']->entryorguid)));
                break;
			case 22: // Flag extra
                $this->$db->executeQuery("UPDATE creature_template SET flags_extra = ? WHERE entry = ?", array(intval($data['script']), intval($data['review']->entryorguid)));
                break;
			case 10: $this->setLoot($data, $db, 'creature');	break;
			case 11: $this->setLoot($data, $db, 'disenchant');	break;
			case 12: $this->setLoot($data, $db, 'fishing');		break;
			case 13: $this->setLoot($data, $db, 'gameobject');	break;
			case 14: $this->setLoot($data, $db, 'item');		break;
			case 15: $this->setLoot($data, $db, 'pickpocket');	break;
			case 16: $this->setLoot($data, $db, 'prospecting');	break;
			case 17: $this->setLoot($data, $db, 'quest_mail');	break;
			case 18: $this->setLoot($data, $db, 'reference');	break;
			case 19: $this->setLoot($data, $db, 'skinning');	break;
			default: return "Error - {$data['review']->source_type}";
		}
		return "Success";
	}

	protected function setLoot($data, $db, $table) {
		$this->$db->executeQuery("DELETE FROM {$table}_loot_template WHERE entry = ?", array($data['review']->entryorguid));
		$insert = "INSERT IGNORE INTO {$table}_loot_template (entry, item, ChanceOrQuestChance, groupid, mincountOrRef, maxcount, lootcondition, condition_value1, condition_value2) VALUES ";
		foreach($data['script'] as $line) {
			$insert .= "({$data['review']->entryorguid}, {$line[0]}, {$line[1]}, {$line[2]}, {$line[3]}, {$line[4]}, {$line[5]}, {$line[6]}, {$line[7]}),";
		}
		$insert = rtrim($insert, ',');
		$this->$db->executeQuery($insert);
	}
} 