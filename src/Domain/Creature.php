<?php

namespace SUN\Domain;

class Creature {
	protected $entry;
	protected $guid;
	protected $name;

	protected $map;
	protected $heroic;
	protected $tester;
	protected $n_stats;
	protected $n_resistances;
	protected $n_immunities;
	protected $n_respawn;
	protected $h_stats;
	protected $h_resistances;
	protected $h_immunities;
	protected $h_respawn;
	protected $equipment;
	protected $gossip;
	protected $emote;
	protected $smartai;
	protected $comment;

	public function __construct(array $data) {
		$this->hydrate($data);
	}

	public function hydrate(array $data) {
		foreach ($data as $key => $value) {
			$method = "set" . ucfirst($key);
			$method = implode('_', array_map('ucfirst', explode('_', $method)));
			$method = str_replace("_", "", $method);

			if(method_exists($this, $method)) {
				$this->$method($value);
			}
		}
	}

	/**
	 * @return mixed
	 */
	public function getEntry()
	{
		return $this->entry;
	}

	/**
	 * @param mixed $entry
	 */
	public function setEntry($entry)
	{
		$this->entry = $entry;
	}

	/**
	 * @return mixed
	 */
	public function getGuid()
	{
		return $this->guid;
	}

	/**
	 * @param mixed $guid
	 */
	public function setGuid($guid)
	{
		$this->guid = $guid;
	}

	/**
	 * @return mixed
	 */
	public function getName()
	{
		return $this->name;
	}

	/**
	 * @param mixed $name
	 */
	public function setName($name)
	{
		$this->name = $name;
	}

	/**
	 * @return mixed
	 */
	public function getMap()
	{
		return $this->map;
	}

	/**
	 * @param mixed $map
	 */
	public function setMap($map)
	{
		$this->map = $map;
	}

	/**
	 * @return mixed
	 */
	public function getHeroic()
	{
		return $this->heroic;
	}

	/**
	 * @param mixed $heroic
	 */
	public function setHeroic($heroic)
	{
		$this->heroic = $heroic;
	}

	/**
	 * @return mixed
	 */
	public function getTester()
	{
		return $this->tester;
	}

	/**
	 * @param mixed $tester
	 */
	public function setTester($tester)
	{
		$this->tester = $tester;
	}

	/**
	 * @return mixed
	 */
	public function getNStats()
	{
		return $this->n_stats;
	}

	/**
	 * @param mixed $n_stats
	 */
	public function setNStats($n_stats)
	{
		$this->n_stats = $n_stats;
	}

	/**
	 * @return mixed
	 */
	public function getNResistances()
	{
		return $this->n_resistances;
	}

	/**
	 * @param mixed $n_resistances
	 */
	public function setNResistances($n_resistances)
	{
		$this->n_resistances = $n_resistances;
	}

	/**
	 * @return mixed
	 */
	public function getNImmunities()
	{
		return $this->n_immunities;
	}

	/**
	 * @param mixed $n_immunities
	 */
	public function setNImmunities($n_immunities)
	{
		$this->n_immunities = $n_immunities;
	}

	/**
	 * @return mixed
	 */
	public function getNRespawn()
	{
		return $this->n_respawn;
	}

	/**
	 * @param mixed $n_respawn
	 */
	public function setNRespawn($n_respawn)
	{
		$this->n_respawn = $n_respawn;
	}

	/**
	 * @return mixed
	 */
	public function getHStats()
	{
		return $this->h_stats;
	}

	/**
	 * @param mixed $h_stats
	 */
	public function setHStats($h_stats)
	{
		$this->h_stats = $h_stats;
	}

	/**
	 * @return mixed
	 */
	public function getHResistances()
	{
		return $this->h_resistances;
	}

	/**
	 * @param mixed $h_resistances
	 */
	public function setHResistances($h_resistances)
	{
		$this->h_resistances = $h_resistances;
	}

	/**
	 * @return mixed
	 */
	public function getHImmunities()
	{
		return $this->h_immunities;
	}

	/**
	 * @param mixed $h_immunities
	 */
	public function setHImmunities($h_immunities)
	{
		$this->h_immunities = $h_immunities;
	}

	/**
	 * @return mixed
	 */
	public function getHRespawn()
	{
		return $this->h_respawn;
	}

	/**
	 * @param mixed $h_respawn
	 */
	public function setHRespawn($h_respawn)
	{
		$this->h_respawn = $h_respawn;
	}

	/**
	 * @return mixed
	 */
	public function getEquipment()
	{
		return $this->equipment;
	}

	/**
	 * @param mixed $equipment
	 */
	public function setEquipment($equipment)
	{
		$this->equipment = $equipment;
	}

	/**
	 * @return mixed
	 */
	public function getGossip()
	{
		return $this->gossip;
	}

	/**
	 * @param mixed $gossip
	 */
	public function setGossip($gossip)
	{
		$this->gossip = $gossip;
	}

	/**
	 * @return mixed
	 */
	public function getEmote()
	{
		return $this->emote;
	}

	/**
	 * @param mixed $emote
	 */
	public function setEmote($emote)
	{
		$this->emote = $emote;
	}

	/**
	 * @return mixed
	 */
	public function getSmartai()
	{
		return $this->smartai;
	}

	/**
	 * @param mixed $smartai
	 */
	public function setSmartai($smartai)
	{
		$this->smartai = $smartai;
	}

	/**
	 * @return mixed
	 */
	public function getComment()
	{
		return $this->comment;
	}

	/**
	 * @param mixed $comment
	 */
	public function setComment($comment)
	{
		$this->comment = $comment;
	}


} 