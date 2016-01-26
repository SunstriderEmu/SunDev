<?php

namespace SUN\Domain;

class Classes implements \JsonSerializable {
	use jsonSerializer;

	protected $index;
	protected $name;
	protected $total;
	protected $tested;
	protected $success = 0;
	protected $bugged = 0;
	protected $spells = 0;
	protected $spells_tested = 0;
	protected $talents = 0;
	protected $talents_tested = 0;
	protected $spec1;
	protected $spec2;
	protected $spec3;
	protected $spec1_spells;
	protected $spec2_spells;
	protected $spec3_spells;
	protected $spec1_talents;
	protected $spec2_talents;
	protected $spec3_talents;

	public function __construct(array $data) {
		$this->hydrate($data);
	}

	public function hydrate(array $data) {
		foreach($data as $key => $value) {
			$method = 'set' . ucfirst($key);

			if(method_exists($this, $method)) {
				$this->$method($value);
			}
		}
	}

	/**
	 * @return int
	 */
	public function getBugged()
	{
		return $this->bugged;
	}

	/**
	 * @param int $bugged
	 */
	public function setBugged($bugged)
	{
		$this->bugged = $bugged;
	}

	/**
	 * @return mixed
	 */
	public function getIndex()
	{
		return $this->index;
	}

	/**
	 * @param mixed $index
	 */
	public function setIndex($index)
	{
		$this->index = $index;
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
	public function getSpec1()
	{
		return $this->spec1;
	}

	/**
	 * @param mixed $spec1
	 */
	public function setSpec1($spec1)
	{
		$this->spec1 = $spec1;
	}

	/**
	 * @return mixed
	 */
	public function getSpec1Spells()
	{
		return $this->spec1_spells;
	}

	/**
	 * @param mixed $spec1_spells
	 */
	public function setSpec1Spells($spec1_spells)
	{
		$this->spec1_spells = $spec1_spells;
	}

	/**
	 * @return mixed
	 */
	public function getSpec1Talents()
	{
		return $this->spec1_talents;
	}

	/**
	 * @param mixed $spec1_talents
	 */
	public function setSpec1Talents($spec1_talents)
	{
		$this->spec1_talents = $spec1_talents;
	}

	/**
	 * @return mixed
	 */
	public function getSpec2()
	{
		return $this->spec2;
	}

	/**
	 * @param mixed $spec2
	 */
	public function setSpec2($spec2)
	{
		$this->spec2 = $spec2;
	}

	/**
	 * @return mixed
	 */
	public function getSpec2Spells()
	{
		return $this->spec2_spells;
	}

	/**
	 * @param mixed $spec2_spells
	 */
	public function setSpec2Spells($spec2_spells)
	{
		$this->spec2_spells = $spec2_spells;
	}

	/**
	 * @return mixed
	 */
	public function getSpec2Talents()
	{
		return $this->spec2_talents;
	}

	/**
	 * @param mixed $spec2_talents
	 */
	public function setSpec2Talents($spec2_talents)
	{
		$this->spec2_talents = $spec2_talents;
	}

	/**
	 * @return mixed
	 */
	public function getSpec3()
	{
		return $this->spec3;
	}

	/**
	 * @param mixed $spec3
	 */
	public function setSpec3($spec3)
	{
		$this->spec3 = $spec3;
	}

	/**
	 * @return mixed
	 */
	public function getSpec3Spells()
	{
		return $this->spec3_spells;
	}

	/**
	 * @param mixed $spec3_spells
	 */
	public function setSpec3Spells($spec3_spells)
	{
		$this->spec3_spells = $spec3_spells;
	}

	/**
	 * @return mixed
	 */
	public function getSpec3Talents()
	{
		return $this->spec3_talents;
	}

	/**
	 * @param mixed $spec3_talents
	 */
	public function setSpec3Talents($spec3_talents)
	{
		$this->spec3_talents = $spec3_talents;
	}

	/**
	 * @return int
	 */
	public function getSpells()
	{
		return $this->spells;
	}

	/**
	 * @param int $spells
	 */
	public function setSpells($spells)
	{
		$this->spells = $spells;
	}

	/**
	 * @return int
	 */
	public function getSpellsTested()
	{
		return $this->spells_tested;
	}

	/**
	 * @param int $spells_tested
	 */
	public function setSpellsTested($spells_tested)
	{
		$this->spells_tested = $spells_tested;
	}

	/**
	 * @return int
	 */
	public function getSuccess()
	{
		return $this->success;
	}

	/**
	 * @param int $success
	 */
	public function setSuccess($success)
	{
		$this->success = $success;
	}

	/**
	 * @return int
	 */
	public function getTalents()
	{
		return $this->talents;
	}

	/**
	 * @param int $talents
	 */
	public function setTalents($talents)
	{
		$this->talents = $talents;
	}

	/**
	 * @return int
	 */
	public function getTalentsTested()
	{
		return $this->talents_tested;
	}

	/**
	 * @param int $talents_tested
	 */
	public function setTalentsTested($talents_tested)
	{
		$this->talents_tested = $talents_tested;
	}

	/**
	 * @return mixed
	 */
	public function getTested()
	{
		return $this->tested;
	}

	/**
	 * @param mixed $tested
	 */
	public function setTested($tested)
	{
		$this->tested = $tested;
	}

	/**
	 * @return mixed
	 */
	public function getTotal()
	{
		return $this->total;
	}

	/**
	 * @param mixed $total
	 */
	public function setTotal($total)
	{
		$this->total = $total;
	}
} 