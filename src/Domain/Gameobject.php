<?php

namespace SUN\Domain;

class Gameobject {
	protected $entry;
	protected $guid;
	protected $name;

	public function __construct(array $data) {
		$this->hydrate($data);
	}

	public function getEntry() {
		return $this->entry;
	}

	public function setEntry($entry) {
		$this->entry = $entry;
	}

	public function getGuid() {
		return $this->guid;
	}

	public function setGuid($guid) {
		$this->guid = $guid;
	}

	public function getName() {
		return $this->name;
	}

	public function setName($name) {
		$this->name = $name;
	}

	public function hydrate(array $data) {
		foreach($data as $key => $value) {
			$method = 'set' . ucfirst($key);

			if(method_exists($this, $method)) {
				$this->$method($value);
			}
		}
	}
} 