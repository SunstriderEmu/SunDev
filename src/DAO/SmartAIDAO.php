<?php

namespace SUN\DAO;

use SUN\Domain\Creature;
use SUN\Domain\Gameobject;
use SUN\Domain\Line;
use SUN\Domain\Text;

class SmartAIDAO extends DAO {
	public function getAvailableEntry() {
		return $this->getDb('test')->fetchAssoc('SELECT entryorguid FROM smart_scripts WHERE entryorguid BETWEEN 50000 AND 50099 ORDER BY entryorguid DESC LIMIT 1');
	}

	/*
	 * GET CREATURE ENTRY SCRIPT
	 */
	public function getCreatureEntryScript(Creature $creature) {
		$all = $this->getDb('test')->fetchAll('SELECT * FROM smart_scripts WHERE entryorguid = ? AND source_type = 0', array($creature->getEntry()));
		$lines = [];
		foreach($all as $line) {
			$lines[$line['id']] = new Line($line);
		}
		return $lines;
	}

	/*
	 * GET CREATURE GUID SCRIPT
	 */
	public function getCreatureGuidScript(Creature $creature) {
		$all = $this->getDb('test')->fetchAll('SELECT * FROM smart_scripts WHERE entryorguid = -? AND source_type = 0', array($creature->getGuid()));
		$lines = [];
		foreach($all as $line) {
			$lines[$line['id']] = new Line($line);
		}
		return $lines;
	}

	/*
	 * GET GAMEOBJECT ENTRY SCRIPT
	 */
	public function getGOEntryScript(Gameobject $go) {
		$all = $this->getDb('test')->fetchAll('SELECT * FROM smart_scripts WHERE entryorguid = ? AND source_type = 1', array($go->getEntry()));
		$lines = [];
		foreach($all as $line) {
			$lines[$line['id']] = new Line($line);
		}
		return $lines;
	}

	/*
	 * GET GAMEOBJECT GUID SCRIPT
	 */
	public function getGOGuidScript(Gameobject $go) {
		$all = $this->getDb('test')->fetchAll('SELECT * FROM smart_scripts WHERE entryorguid = -? AND source_type = 1', array($go->getGuid()));
		$lines = [];
		foreach($all as $line) {
			$lines[$line['id']] = new Line($line);
		}
		return $lines;
	}

	/*
	 * GET SCRIPT
	 */
	public function getScript($script) {
		$all = $this->getDb('test')->fetchAll('SELECT * FROM smart_scripts WHERE entryorguid = ? AND source_type = 9', array($script));
		$lines = [];
		foreach($all as $line) {
			$lines[$line['id']] = new Line($line);
		}
		return $lines;
	}

	public function getEvents() {
		$fetch = $this->getDb('tools')->fetchAll('SELECT * FROM smartai_events');
		$events = [];
		foreach($fetch as $event) {
			$events[$event['id']] = $event;
		}
		return $events;
	}

	public function getEvent($event) {
		return $this->getDb('tools')->fetchAssoc('SELECT * FROM smartai_events WHERE id = ?', array($event));
	}

	public function getActions() {
		$fetch = $this->getDb('tools')->fetchAll('SELECT * FROM smartai_actions');
		$actions = [];
		foreach($fetch as $action) {
			$actions[$action['id']] = $action;
		}
		return $actions;
	}

	public function getAction($action) {
		return $this->getDb('tools')->fetchAssoc('SELECT * FROM smartai_actions WHERE id = ?', array($action));
	}

	public function getTargets() {
		$fetch = $this->getDb('tools')->fetchAll('SELECT * FROM smartai_targets');
		$targets = [];
		foreach($fetch as $target) {
			$targets[$target['id']] = $target;
		}
		return $targets;
	}

	public function getTarget($target) {
		return $this->getDb('tools')->fetchAssoc('SELECT * FROM smartai_targets WHERE id = ?', array($target));
	}

	public function getSpellName($id) {
		$spell = $this->getDb('test')->fetchAssoc('SELECT spellName1 FROM spell_template WHERE entry = ?', array($id));
		return $spell['spellName1'];
	}

	public function getQuestName($id) {
		$quest = $this->getDb('test')->fetchAssoc('SELECT Title FROM quest_template WHERE entry = ?', array($id));
		return $quest['Title'];
	}

	public function getItemName($id) {
		$item = $this->getDb('test')->fetchAssoc('SELECT name FROM item_template WHERE entry = ?', array($id));
		return $item['name'];
	}

	public function getItemDisplay($id) {
		$item = $this->getDb('test')->fetchAssoc('SELECT displayid FROM item_template WHERE entry = ?', array($id));
		return $item['displayid'];
	}
} 