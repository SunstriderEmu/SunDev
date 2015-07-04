<?php

namespace SUN\DAO;

use PDO;
use SUN\Domain\Classes;

class ClassesDAO extends DAO {
	public function getTotal() {
		$query = $this->tools->query('SELECT COUNT(*) as count FROM class_test_spells');
		$query->execute();
		$spells = $query->fetch();

		$query = $this->tools->query('SELECT COUNT(*) as count FROM class_test_talents');
		$query->execute();
		$talents = $query->fetch();

		return $spells['count'] + $talents['count'];
	}

	public function getTested() {
		$query = $this->tools->query('SELECT COUNT(*) as count FROM class_test_spells WHERE tester != 0');
		$query->execute();
		$spells = $query->fetch();

		$query = $this->tools->query('SELECT COUNT(*) as count FROM class_test_talents WHERE tester != 0');
		$query->execute();
		$talents = $query->fetch();

		return $spells['count'] + $talents['count'];
	}

	public function getTotalClass(Classes $classes) {
		$query = $this->tools->prepare('SELECT COUNT(*) as count FROM class_test_spells WHERE class = :class');
		$query->bindValue(':class', $classes->getIndex(), PDO::PARAM_INT);
		$query->execute();
		$spells = $query->fetch();

		$query = $this->tools->prepare('SELECT COUNT(*) as count FROM class_test_talents WHERE class = :class');
		$query->bindValue(':class', $classes->getIndex(), PDO::PARAM_INT);
		$query->execute();
		$talents = $query->fetch();

		return $spells['count'] + $talents['count'];
	}

	public function getTestedClass(Classes $classes) {
		$query = $this->tools->prepare('SELECT COUNT(*) as count FROM class_test_spells WHERE tester != 0 AND class = :class');
		$query->bindValue(':class', $classes->getIndex(), PDO::PARAM_INT);
		$query->execute();
		$spells = $query->fetch();

		$query = $this->tools->prepare('SELECT COUNT(*) as count FROM class_test_talents WHERE tester != 0 AND class = :class');
		$query->bindValue(':class', $classes->getIndex(), PDO::PARAM_INT);
		$query->execute();
		$talents = $query->fetch();

		return $spells['count'] + $talents['count'];
	}

	public function getClassSpells(Classes $classes) {
		$query = $this->tools->prepare('SELECT * FROM class_test_spells WHERE class = :class');
		$query->bindValue(':class', $classes->getIndex(), PDO::PARAM_INT);
		$query->execute();
		$spells = $query->fetchAll();

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
		$classes->setSpells($query->rowCount());
	}

	public function getClassTalents(Classes $classes) {
		$query = $this->tools->prepare('SELECT * FROM class_test_talents WHERE class = :class');
		$query->bindValue(':class', $classes->getIndex(), PDO::PARAM_INT);
		$query->execute();
		$talents = $query->fetchAll();

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
		$classes->setTalents($query->rowCount());
	}

	public function getGlobal() {
		$query = $this->tools->query('SELECT * FROM class_test_spells');
		$query->execute();
		$spells = $query->fetchAll();

		$query2 = $this->tools->query('SELECT * FROM class_test_talents');
		$query2->execute();
		$talents = $query2->fetchAll();

		$classes = new Classes(["spells" => $query->rowCount(), "talents" => $query2->rowCount(),]);
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
		$classes->setTotal($query->rowCount() + $query2->rowCount());
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
			case "hunter": return 3; break;
			case "rogue": return 4; break;
			case "priest": return 5; break;
			case "shaman": return 7; break;
			case "mage": return 8; break;
			case "warlock": return 9; break;
			case "druid": return 11;break;
			default: return;
		}
	}

	public function getSpecSpells(Classes $classes, $spe) {
		$query = $this->tools->prepare('SELECT * FROM class_test_spells WHERE class = :class AND spe = :spe');
		$query->bindValue(':class', $classes->getIndex(), PDO::PARAM_INT);
		$query->bindValue(':spe', $spe, PDO::PARAM_INT);
		$query->execute();
		return $query->fetchAll();
	}

	public function getSpecTalents(Classes $classes, $spe) {
		$query = $this->tools->prepare('SELECT * FROM class_test_talents WHERE class = :class AND spe = :spe');
		$query->bindValue(':class', $classes->getIndex(), PDO::PARAM_INT);
		$query->bindValue(':spe', $spe, PDO::PARAM_INT);
		$query->execute();
		return $query->fetchAll();
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
		$query = $this->tools->prepare('UPDATE class_test_' . $category . ' SET tested = :tested WHERE name = :name AND class = :class');
		$query->bindValue(':tested', $info->value, PDO::PARAM_INT);
		$query->bindValue(':name', $info->name, PDO::PARAM_STR);
		$query->bindValue(':class', $info->class, PDO::PARAM_INT);
		$query->execute();
	}

	public function setTester($info, $category) {
		$query = $this->tools->prepare('UPDATE class_test_' . $category . ' SET tester = :tester WHERE name = :name AND class = :class');
		$query->bindValue(':tester', $info->value, PDO::PARAM_INT);
		$query->bindValue(':name', $info->name, PDO::PARAM_STR);
		$query->bindValue(':class', $info->class, PDO::PARAM_INT);
		$query->execute();
	}

	public function setIssue($info, $category) {
		$query = $this->tools->prepare('UPDATE class_test_' . $category . ' SET issue = :issue WHERE name = :name AND class = :class');
		$query->bindValue(':issue', $info->value, PDO::PARAM_INT);
		$query->bindValue(':name', $info->name, PDO::PARAM_STR);
		$query->bindValue(':class', $info->class, PDO::PARAM_INT);
		$query->execute();
		return "ok";
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
		return "ok";
	}
} 