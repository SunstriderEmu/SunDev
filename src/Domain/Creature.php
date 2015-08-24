<?php

namespace SUN\Domain;

class Creature {
	protected $entry;
	protected $guid;
	protected $name;

	protected $map;
	protected $heroic;
	protected $tester;
	protected $stats;
	protected $resistances;
	protected $immunities;
	protected $respawn;
	protected $equipment;
	protected $gossip;
	protected $emote;
	protected $smartai;
	protected $comment;

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
	public function getImmunities()
	{
		return $this->immunities;
	}

	/**
	 * @param mixed $immunities
	 */
	public function setImmunities($immunities)
	{
		$this->immunities = $immunities;
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
	public function getResistances()
	{
		return $this->resistances;
	}

	/**
	 * @param mixed $resistances
	 */
	public function setResistances($resistances)
	{
		$this->resistances = $resistances;
	}

	/**
	 * @return mixed
	 */
	public function getRespawn()
	{
		return $this->respawn;
	}

	/**
	 * @param mixed $respawn
	 */
	public function setRespawn($respawn)
	{
		$this->respawn = $respawn;
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
	public function getStats()
	{
		return $this->stats;
	}

	/**
	 * @param mixed $stats
	 */
	public function setStats($stats)
	{
		$this->stats = $stats;
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

	public function hydrate(array $data) {
		foreach($data as $key => $value) {
			$method = 'set' . ucfirst($key);

			if(method_exists($this, $method)) {
				$this->$method($value);
			}
		}
	}
} 