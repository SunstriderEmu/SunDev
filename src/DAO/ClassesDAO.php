<?php

namespace SUN\DAO;

use SUN\Domain\Classes;

class ClassesDAO extends DAO {
	public function getTotal() {
		$spells = $this->getDb('tools')->fetchAssoc('SELECT COUNT(*) as count FROM class_test_spells');
		$talents = $this->getDb('tools')->fetchAssoc('SELECT COUNT(*) as count FROM class_test_talents');
		return $spells['count'] + $talents['count'];
	}

	public function getTested() {
		$spells = $this->getDb('tools')->fetchAssoc('SELECT COUNT(*) as count FROM class_test_spells WHERE tester != 0');
		$talents = $this->getDb('tools')->fetchAssoc('SELECT COUNT(*) as count FROM class_test_talents WHERE tester != 0');
		return $spells['count'] + $talents['count'];
	}

	public function getTotalClass(Classes $classes) {
		$spells = $this->getDb('tools')->fetchAssoc('SELECT COUNT(*) as count FROM class_test_spells WHERE class = ?', array($classes->getIndex()));
		$talents = $this->getDb('tools')->fetchAssoc('SELECT COUNT(*) as count FROM class_test_talents WHERE class = ?', array($classes->getIndex()));
		return $spells['count'] + $talents['count'];
	}

	public function getTestedClass(Classes $classes) {
		$spells = $this->getDb('tools')->fetchAssoc('SELECT COUNT(*) as count FROM class_test_spells WHERE tester != 0 AND class = ?', array($classes->getIndex()));
		$talents = $this->getDb('tools')->fetchAssoc('SELECT COUNT(*) as count FROM class_test_talents WHERE tester != 0 AND class = ?', array($classes->getIndex()));
		return $spells['count'] + $talents['count'];
	}

	public function getClassSpells(Classes $classes) {
		$spells = $this->getDb('tools')->fetchAll('SELECT * FROM class_test_spells WHERE class = ?', array($classes->getIndex()));
		foreach($spells as $spell) {
			if($spell['tested'] == "2") {
				$classes->setSuccess($classes->getSuccess() + 1);
				$classes->setSpellsTested($classes->getSpellsTested() + 1);
			}
			if($spell['tested'] == "3") {
				$classes->setBugged($classes->getBugged() + 1);
				$classes->setSpellsTested($classes->getSpellsTested() + 1);
			}
		}
		$classes->setSpells(count($spells));
	}

	public function getClassTalents(Classes $classes) {
		$talents = $this->getDb('tools')->fetchAll('SELECT * FROM class_test_talents WHERE class = ?', array($classes->getIndex()));

		foreach($talents as $talent) {
			if($talent['tested'] == "2") {
				$classes->setSuccess($classes->getSuccess() + 1);
				$classes->setTalentsTested($classes->getTalentsTested() + 1);
			}

			if($talent['tested'] == "3") {
				$classes->setBugged($classes->getBugged() + 1);
				$classes->setTalentsTested($classes->getTalentsTested() + 1);
			}
		}
		$classes->setTalents(count($talents));
	}

	public function getGlobal() {
		$spells = $this->getDb('tools')->fetchAll('SELECT * FROM class_test_spells');
		$talents = $this->getDb('tools')->fetchALl('SELECT * FROM class_test_talents');

		$classes = new Classes(["spells" => count($spells), "talents" => count($talents)]);
		foreach($spells as $spell) {
			if($spell['tested'] == "2") {
				$classes->setSuccess($classes->getSuccess() + 1);
				$classes->setSpellsTested($classes->getSpellsTested() + 1);
			}
			if($spell['tested'] == "3") {
				$classes->setBugged($classes->getBugged() + 1);
				$classes->setSpellsTested($classes->getSpellsTested() + 1);
			}
		}
		foreach($talents as $talent) {
			if($talent['tested'] == "2") {
				$classes->setSuccess($classes->getSuccess() + 1);
				$classes->setTalentsTested($classes->getTalentsTested() + 1);
			}

			if($talent['tested'] == "3") {
				$classes->setBugged($classes->getBugged() + 1);
				$classes->setTalentsTested($classes->getTalentsTested() + 1);
			}
		}
		$classes->setTotal(count($spells) + count($talents));
		$classes->setTested($classes->getSuccess() + $classes->getBugged());

		return $classes;
	}

	public function getClass($index) {
		$class = new Classes(["index" => $index]);
		$class->setTotal($this->getTotalClass($class));
		$class->setTested($this->getTestedClass($class));
		switch($index) {
			case "1":
				$class->setName("Warrior");
				$class->setSpec1("Arms");
				$class->setSpec2("Fury");
				$class->setSpec3("Protection");
				break;
			case "2":
				$class->setName("Paladin");
				$class->setSpec1("Holy");
				$class->setSpec2("Protection");
				$class->setSpec3("Retribution");
				break;
			case "3":
				$class->setName("Hunter");
				$class->setSpec1("Beast Mastery");
				$class->setSpec2("Marksmanship");
				$class->setSpec3("Survival");
				break;
			case "4":
				$class->setName("Rogue");
				$class->setSpec1("Assassination");
				$class->setSpec2("Combat");
				$class->setSpec3("Subtlety");
				break;
			case "5":
				$class->setName("Priest");
				$class->setSpec1("Discipline");
				$class->setSpec2("Holy");
				$class->setSpec3("Shadow");
				break;
			case "7":
				$class->setName("Shaman");
				$class->setSpec1("Elemental");
				$class->setSpec2("Enhancement");
				$class->setSpec3("Restoration");
				break;
			case "8":
				$class->setName("Mage");
				$class->setSpec1("Arcane");
				$class->setSpec2("Frost");
				$class->setSpec3("Fire");
				break;
			case "9":
				$class->setName("Warlock");
				$class->setSpec1("Affliction");
				$class->setSpec2("Demonology");
				$class->setSpec3("Destruction");
				break;
			case "11":
				$class->setName("Druid");
				$class->setSpec1("Balance");
				$class->setSpec2("Feral");
				$class->setSpec3("Restoration");
				break;
			default: return;
		}
		$this->getClassSpells($class);
		$this->getClassTalents($class);
		$this->getSpec($class);
		return $class;
	}

	public function getIndex($class) {
		switch($class) {
			case "warrior": return 1; break;
			case "paladin": return 2; break;
			case "hunter": 	return 3; break;
			case "rogue": 	return 4; break;
			case "priest": 	return 5; break;
			case "shaman": 	return 7; break;
			case "mage": 	return 8; break;
			case "warlock": return 9; break;
			case "druid": 	return 11;break;
			default: return;
		}
	}

	public function getSpecSpells(Classes $classes, $spe) {
		return $this->getDb('tools')->fetchAll('SELECT * FROM class_test_spells WHERE class = ? AND spe = ?', array($classes->getIndex(), $spe));
	}

	public function getSpecTalents(Classes $classes, $spe) {
		return $this->getDb('tools')->fetchAll('SELECT * FROM class_test_talents WHERE class = ? AND spe = ?', array($classes->getIndex(), $spe));
	}

	public function getSpec(Classes $classes) {
		$classes->setSpec1Spells($this->getSpecSpells($classes, 1));
		$classes->setSpec2Spells($this->getSpecSpells($classes, 2));
		$classes->setSpec3Spells($this->getSpecSpells($classes, 3));

		$classes->setSpec1Talents($this->getSpecTalents($classes, 1));
		$classes->setSpec2Talents($this->getSpecTalents($classes, 2));
		$classes->setSpec3Talents($this->getSpecTalents($classes, 3));
	}

	public function setTested($info, $category) {
		$this->getDb('tools')->executeQuery("UPDATE class_test_{$category} SET tested = ? WHERE name = ? AND class = ?", array($info->value, $info->name, $info->class));
	}

	public function setTester($info, $category) {
		$this->getDb('tools')->executeQuery("UPDATE class_test_{$category} SET tester = ? WHERE name = ? AND class = ?", array($info->value, $info->name, $info->class));
	}

	public function setIssue($info, $category) {
		$this->getDb('tools')->executeQuery("UPDATE class_test_{$category} SET issue = ? WHERE name = ? AND class = ?", array($info->value, $info->name, $info->class));
	}

	public function setInfo($info) {
		switch($info->category) {
			case "spells":
				switch($info->field) {
					case "tested": $this->setTested($info, 'spells'); break;
					case "tester": $this->setTester($info, 'spells'); break;
					case "issue": $this->setIssue($info, 'spells'); break;
					default: return;
				}
				break;
			case "talents":
				switch($info->field) {
					case "tested": $this->setTested($info, 'talents'); break;
					case "tester": $this->setTester($info, 'talents'); break;
					case "issue": $this->setIssue($info, 'talents'); break;
					default: return;
				}
				break;
			default: return;
		}
	}
} 