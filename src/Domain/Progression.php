<?php
namespace SUN\Domain\Progression;

class Progression {
	private $quests;
	private $classes;
	private $dungeons;
	private $world;
	private $capacity;

	public function getQuests() {
		return $this->quests;
	}

	public function setQuests($quests) {
		$this->quests = $quests;
	}

	public function getClasses() {
		return $this->classes;
	}

	public function setClasses($classes) {
		$this->classes = $classes;
	}

	public function getDungeons() {
		return $this->dungeons;
	}

	public function setDungeons($dungeons) {
		$this->dungeons = $dungeons;
	}

	public function getWorld() {
		return $this->world;
	}

	public function setWorld($world) {
		$this->world = $world;
	}

	public function getCapacity() {
		return $this->capacity;
	}

	public function setCapacity($capacity) {
		$this->capacity = $capacity;
	}
} 