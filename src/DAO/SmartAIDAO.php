<?php

namespace SUN\DAO;

use SUN\Domain\Creature;
use SUN\Domain\Gameobject;
use SUN\Domain\Line;

class SmartAIDAO extends DAO
{
	/**
	 * Get the next available entry for the SmartAI Tutorial.
	 *
	 * @return mixed
	 */
	public function getAvailableEntry()
	{
		return $this->getDb('test')->fetchAssoc('SELECT entryorguid FROM smart_scripts WHERE entryorguid BETWEEN 50000 AND 50099 ORDER BY entryorguid DESC LIMIT 1');
	}

	/**
	 * Get the Creature Entry SmartAI.
	 *
	 * @param Creature $creature
	 * @return array
	 */
	public function getCreatureEntryScript(Creature $creature)
	{
		$all = $this->getDb('test')->fetchAll('SELECT * FROM smart_scripts WHERE entryorguid = ? AND source_type = 0', array($creature->getEntry()));
		$lines = [];
		foreach($all as $line)
			$lines[$line['id']] = new Line($line);
		return $lines;
	}

	/**
	 * Get the Creature Guid SmartAI.
	 *
	 * @param Creature $creature
	 * @return array
	 */
	public function getCreatureGuidScript(Creature $creature)
	{
		$all = $this->getDb('test')->fetchAll('SELECT * FROM smart_scripts WHERE entryorguid = -? AND source_type = 0', array($creature->getGuid()));
		$lines = [];
		foreach($all as $line)
			$lines[$line['id']] = new Line($line);
		return $lines;
	}

	/**
	 * Get the GameObject Entry SmartAI.
	 *
	 * @param Gameobject $go
	 * @return array
	 */
	public function getGOEntryScript(Gameobject $go)
	{
		$all = $this->getDb('test')->fetchAll('SELECT * FROM smart_scripts WHERE entryorguid = ? AND source_type = 1', array($go->getEntry()));
		$lines = [];
		foreach($all as $line)
			$lines[$line['id']] = new Line($line);
		return $lines;
	}

	/**
	 * Get the GameObject Guid SmartAI.
	 *
	 * @param Gameobject $go
	 * @return array
	 */
	public function getGOGuidScript(Gameobject $go)
	{
		$all = $this->getDb('test')->fetchAll('SELECT * FROM smart_scripts WHERE entryorguid = -? AND source_type = 1', array($go->getGuid()));
		$lines = [];
		foreach($all as $line)
			$lines[$line['id']] = new Line($line);
		return $lines;
	}

	/**
	 * Get SmartAI Script.
	 *
	 * @param $script
	 * @return array
	 */
	public function getScript($script) {
		$all = $this->getDb('test')->fetchAll('SELECT * FROM smart_scripts WHERE entryorguid = ? AND source_type = 9', array($script));
		$lines = [];
		foreach($all as $line) {
			$lines[$line['id']] = new Line($line);
		}
		return $lines;
	}

	/**
	 * Get AreaTrigger script.
	 *
	 * @param $entry
	 * @return array
	 */
	public function getAreaTriggerScript($entry)
	{
		$all = $this->getDb('test')->fetchAll('SELECT * FROM smart_scripts WHERE entryorguid = ? AND source_type = 2', array(intval($entry)));
		$lines = [];
		foreach($all as $line) {
			$lines[$line['id']] = new Line($line);
		}
		return $lines;
	}

	/**
	 * Get all the SmartAI Events.
	 *
	 * @return array
	 */
	public function getEvents()
	{
		$fetch = $this->getDb('tools')->fetchAll('SELECT * FROM smartai_events');
		$events = [];
		foreach($fetch as $event)
			$events[$event['id']] = $event;
		return $events;
	}

	/**
	 * Get the #id SmartAI Event.
	 *
	 * @param $id
	 * @return mixed
	 */
	public function getEvent($id)
	{
		return $this->getDb('tools')->fetchAssoc('SELECT * FROM smartai_events WHERE id = ?', array($id));
	}

	/**
	 * Get all the SmartAI Actions.
	 *
	 * @return array
	 */
	public function getActions()
	{
		$fetch = $this->getDb('tools')->fetchAll('SELECT * FROM smartai_actions');
		$actions = [];
		foreach($fetch as $action)
			$actions[$action['id']] = $action;
		return $actions;
	}

	/**
	 * Get the #id SmartAI Action.
	 *
	 * @param $id
	 * @return mixed
	 */
	public function getAction($id)
	{
		return $this->getDb('tools')->fetchAssoc('SELECT * FROM smartai_actions WHERE id = ?', array($id));
	}

	/**
	 * Get all the SmartAI Targets.
	 *
	 * @return array
	 */
	public function getTargets()
	{
		$fetch = $this->getDb('tools')->fetchAll('SELECT * FROM smartai_targets');
		$targets = [];
		foreach($fetch as $target)
			$targets[$target['id']] = $target;
		return $targets;
	}

	/**
	 * Get the #id SmartAI Target.
	 *
	 * @param $id
	 * @return mixed
	 */
	public function getTarget($id)
	{
		return $this->getDb('tools')->fetchAssoc('SELECT * FROM smartai_targets WHERE id = ?', array($id));
	}
} 