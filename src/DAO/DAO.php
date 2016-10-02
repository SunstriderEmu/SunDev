<?php

namespace SUN\DAO;

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

	protected function setLoot($data, $db, $table) {
		$this->getDb($db)->executeQuery("DELETE FROM {$table}_loot_template WHERE entry = ?", array($data['review']->entryorguid));
		$insert = "INSERT IGNORE INTO {$table}_loot_template (entry, item, ChanceOrQuestChance, groupid, mincountOrRef, maxcount, lootcondition, condition_value1, condition_value2) VALUES ";
		foreach($data['script'] as $line)
			$insert .= "({$data['review']->entryorguid}, {$line[0]}, {$line[1]}, {$line[2]}, {$line[3]}, {$line[4]}, {$line[5]}, {$line[6]}, {$line[7]}),";
		$insert = rtrim($insert, ',');
		$this->getDb($db)->executeQuery($insert);
	}
} 