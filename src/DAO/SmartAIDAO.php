<?php

namespace SUN\DAO;

use SUN\Domain\Creature;
use SUN\Domain\Gameobject;
use SUN\Domain\Line;
use SUN\Domain\Text;
use PDO;

class SmartAIDAO {
	private $app;
	private $world;
	private $test;
	private $tools;

	/**
	 * @param \Silex\Application $app
	 */
	public function __construct(\Silex\Application $app) {
		$this->app = $app;
		$this->world = $app['dbs']['world'];
		$this->test = $app['dbs']['test_world'];
		$this->tools = $app['dbs']['suntools'];
	}

	public function getAvailableEntry() {
		$query = $this->test->query('SELECT entryorguid FROM smart_scripts WHERE entryorguid BETWEEN 50000 AND 50099 ORDER BY entryorguid DESC LIMIT 1');
		$query->execute();
		$result = $query->fetch();
		return $result['entryorguid'];
	}

	public function findCreatureEntryName(Creature $creature) {
		$query = $this->test->prepare('SELECT name FROM creature_template WHERE entry = :entry');
		$query->bindValue(':entry', $creature->getEntry(), PDO::PARAM_INT);
		$query->execute();
		$name = $query->fetch(PDO::FETCH_ASSOC);
		$creature->setName($name['name']);

		return $creature;
	}

	public function findCreatureGuidName(Creature $creature) {
		$query = $this->test->prepare('SELECT ct.name FROM creature c JOIN creature_template ct ON ct.entry = c.id WHERE guid = :guid');
		$query->bindValue(':guid', $creature->getGuid(), PDO::PARAM_INT);
		$query->execute();
		$name = $query->fetch(PDO::FETCH_ASSOC);
		$creature->setName($name['name']);

		return $creature;
	}

	public function findGOEntryName(Gameobject $gameobject) {
		$query = $this->test->prepare('SELECT name FROM gameobject_template WHERE entry = :entry');
		$query->bindValue(':entry', $gameobject->getEntry(), PDO::PARAM_INT);
		$query->execute();
		$name = $query->fetch(PDO::FETCH_ASSOC);
		$gameobject->setName($name['name']);

		return $gameobject;
	}

	public function findGOGuidName(Gameobject $gameobject) {
		$query = $this->test->prepare('SELECT ct.name FROM gameobject c JOIN gameobject_template ct ON ct.entry = c.id WHERE guid = :guid');
		$query->bindValue(':guid', $gameobject->getGuid(), PDO::PARAM_INT);
		$query->execute();
		$name = $query->fetch(PDO::FETCH_ASSOC);
		$gameobject->setName($name['name']);

		return $gameobject;
	}

	/*
	 * GET CREATURE ENTRY SCRIPT
	 */
	public function getCreatureEntryScript(Creature $creature) {
		$query = $this->test->prepare('SELECT * FROM smart_scripts WHERE entryorguid = :entry AND source_type = 0');
		$query->bindValue(':entry', $creature->getEntry(), PDO::PARAM_INT);
		$query->execute();
		$all = $query->fetchAll();

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
		$query = $this->test->prepare('SELECT * FROM smart_scripts WHERE entryorguid = -:guid AND source_type = 0');
		$query->bindValue(':guid', $creature->getGuid(), PDO::PARAM_INT);
		$query->execute();
		$all = $query->fetchAll();

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
		$query = $this->test->prepare('SELECT * FROM smart_scripts WHERE entryorguid = :entry AND source_type = 1');
		$query->bindValue(':entry', $go->getEntry(), PDO::PARAM_INT);
		$query->execute();
		$all = $query->fetchAll();

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
		$query = $this->test->prepare('SELECT * FROM smart_scripts WHERE entryorguid = -:guid AND source_type = 1');
		$query->bindValue(':guid', $go->getGuid(), PDO::PARAM_INT);
		$query->execute();
		$all = $query->fetchAll();

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
		$query = $this->test->prepare('SELECT * FROM smart_scripts WHERE entryorguid = :script AND source_type = 9');
		$query->bindValue(':script', $script, PDO::PARAM_INT);
		$query->execute();
		$all = $query->fetchAll();

		$lines = [];
		foreach($all as $line) {
			$lines[$line['id']] = new Line($line);
		}
		return $lines;
	}

	/*
	 * SET SCRIPT
	 */
	public function setQuery($sql, $db) {
		$query = $this->$db->query($sql);
		return $query->execute();
	}

	/*
	 * SET REVIEW
	 */
	public function setReview($entry, $type, $user) {
		$query = $this->tools->prepare('INSERT INTO smart_review (entryorguid, source_type, user, date) VALUES (:entry, :source_type, :user, :date)
										ON DUPLICATE KEY UPDATE date = :date, user = :user');
		$query->bindValue(':entry', $entry, PDO::PARAM_STR);
		$query->bindValue(':source_type', $type, PDO::PARAM_STR);
		$query->bindValue(':user', $user, PDO::PARAM_STR);
		$query->bindValue(':date', time(), PDO::PARAM_STR);
		return $query->execute();
	}

	/*
	 * DELETE REVIEW
	 */
	public function deleteReview($entry, $type) {
		$query = $this->tools->prepare('DELETE FROM smart_review WHERE entryorguid = :entry AND source_type = :source_type');
		$query->bindValue(':entry', $entry, PDO::PARAM_STR);
		$query->bindValue(':source_type', $type, PDO::PARAM_STR);
		return $query->execute();
	}

	/*
	 * GET REVIEW
	 */
	public function getReview() {
		$query = $this->tools->query('SELECT * FROM smart_review');
		$query->execute();
		$fetch = $query->fetchAll();

		$scripts = [];
		$identifier = "";
		foreach($fetch as $script) {
			switch($script['source_type']) {
				case "0":
					$source = "creature/";
					if($script['entryorguid'] > 0) {
						$identifier = "entry/";
						$creature 	= new \SUN\Domain\Creature(["entry" => $script['entryorguid']]);
						$name = $this->findCreatureEntryName($creature);
					} else {
						$identifier = "guid/";
						$creature 	= new \SUN\Domain\Creature(["guid" => $script['entryorguid']]);
						$name = $this->findCreatureGuidName($creature);
					}
					break;
				case "1":
					$source = "object/";
					if($script['entryorguid'] > 0) {
						$identifier = "entry/";
						$go		 	= new \SUN\Domain\Gameobject(["entry" => $script['entryorguid']]);
						$name = $this->findGOEntryName($go);
					} else {
						$identifier = "guid/";
						$go		 	= new \SUN\Domain\Gameobject(["guid" => $script['entryorguid']]);
						$name = $this->findGOGuidName($go);
					}
					break;
				case "4":
					$source = "creature/";
					$identifier = "entry/";
					$creature 	= new \SUN\Domain\Creature(["entry" => $script['entryorguid']]);
					$name = $this->findCreatureEntryName($creature);
					break;
				case "9":
					$source = "script/";
					$creature 	= new \SUN\Domain\Creature(["entry" => substr($script['entryorguid'], 0, -2)]);
					$name = $this->findCreatureEntryName($creature);
					break;
				default: return;
			}

			$manager = new UserDAO($this->app);
			$username = $manager->find($script['user']);

			$scripts[] = [
				"name"			=> $name->getName(),
				"link"  		=> $source . $identifier . $script['entryorguid'],
				"id"			=> $script['entryorguid'],
				"type"			=> $source,
				"source_type" 	=> $script['source_type'],
				"user"			=> $username->getUsername(),
				"date"			=> $script['date'],
			];
		}
		return $scripts;
	}

	/*
	 * GET LINE
	 */
	public function getCreatureLine(Creature $creature, $line) {
		$query = $this->test->prepare('SELECT * FROM smart_scripts WHERE entryorguid = :entry AND source_type = 0 AND id = :id');
		$query->bindValue(':entry', $creature->getEntry(), PDO::PARAM_INT);
		$query->bindValue(':id', $line, PDO::PARAM_INT);
		$query->execute();
		$result = $query->fetch(PDO::FETCH_ASSOC);

		$query = $this->tools->prepare('SELECT * FROM smartai_events WHERE id = :id');
		$query->bindValue(':id', $result['event_type'], PDO::PARAM_INT);
		$query->execute();
		$event = $query->fetch(PDO::FETCH_ASSOC);

		$query = $this->tools->prepare('SELECT * FROM smartai_actions WHERE id = :id');
		$query->bindValue(':id', $result['action_type'], PDO::PARAM_INT);
		$query->execute();
		$action = $query->fetch(PDO::FETCH_ASSOC);

		$query = $this->tools->prepare('SELECT * FROM smartai_targets WHERE id = :id');
		$query->bindValue(':id', $result['target_type'], PDO::PARAM_INT);
		$query->execute();
		$target = $query->fetch(PDO::FETCH_ASSOC);

		$line = [];
		$line["line"] 	=  $result;
		$line["event"] 	=  $event;
		$line["action"] =  $action;
		$line["target"] =  $target;

		return json_encode($line);
	}

	public function getEvents() {
		$query = $this->tools->query('SELECT * FROM smartai_events');
		$query->execute();
		$fetch = $query->fetchAll();

		$events = [];
		foreach($fetch as $event) {
			$events[$event['id']] = $event;
		}
		return $events;
	}

	public function getEvent($event) {
		$query = $this->tools->prepare('SELECT * FROM smartai_events WHERE id = :id');
		$query->bindValue(':id', $event, PDO::PARAM_INT);
		$query->execute();
		$event = $query->fetch();

		return $event;
	}

	public function getActions() {
		$query = $this->tools->query('SELECT * FROM smartai_actions');
		$query->execute();
		$fetch = $query->fetchAll();

		$actions = [];
		foreach($fetch as $action) {
			$actions[$action['id']] = $action;
		}
		return $actions;
	}

	public function getAction($action) {
		$query = $this->tools->prepare('SELECT * FROM smartai_actions WHERE id = :id');
		$query->bindValue(':id', $action, PDO::PARAM_INT);
		$query->execute();
		$action = $query->fetch();

		return $action;
	}

	public function getTargets() {
		$query = $this->tools->query('SELECT * FROM smartai_targets');
		$query->execute();
		$fetch = $query->fetchAll();

		$targets = [];
		foreach($fetch as $target) {
			$targets[$target['id']] = $target;
		}
		return $targets;
	}

	public function getTarget($target) {
		$query = $this->tools->prepare('SELECT * FROM smartai_targets WHERE id = :id');
		$query->bindValue(':id', $target, PDO::PARAM_INT);
		$query->execute();
		$target = $query->fetch();

		return $target;
	}

	public function getSpellName($id) {
		$query = $this->test->prepare('SELECT spellName1 FROM spell_template WHERE entry = :entry');
		$query->bindValue(':entry', $id, PDO::PARAM_INT);
		$query->execute();
		$spell = $query->fetch();

		return $spell['spellName1'];
	}

	public function getQuestName($id) {
		$query = $this->test->prepare('SELECT Title FROM quest_template WHERE entry = :entry');
		$query->bindValue(':entry', $id, PDO::PARAM_INT);
		$query->execute();
		$quest = $query->fetch();

		return $quest['Title'];
	}

	public function getItemName($id) {
		$query = $this->test->prepare('SELECT name FROM item_template WHERE entry = :entry');
		$query->bindValue(':entry', $id, PDO::PARAM_INT);
		$query->execute();
		$item = $query->fetch();

		return $item['name'];
	}

	public function getCreatureText($entry) {
		$query = $this->test->prepare('SELECT * FROM creature_text WHERE entry = :entry');
		$query->bindValue(':entry', $entry, PDO::PARAM_INT);
		$query->execute();
		$all = $query->fetchAll();

		$texts = [];
		foreach($all as $text) {
			$texts[] = new Text($text);
		}
		return $texts;
	}

} 