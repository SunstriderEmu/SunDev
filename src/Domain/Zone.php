<?php

namespace SUN\Domain;

class Zone implements \JsonSerializable
{
	use jsonSerializer;

	protected $id;
	protected $total;
	protected $tested = 0;
	protected $name;
	protected $success = 0;
	protected $working = 0;
	protected $bugged = 0;
	protected $no = 0;

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
	public function getBugged()
	{
		return $this->bugged;
	}

	/**
	 * @param mixed $bugged
	 */
	public function setBugged($bugged)
	{
		$this->bugged = $bugged;
	}

	/**
	 * @return mixed
	 */
	public function getId()
	{
		return $this->id;
	}

	/**
	 * @param mixed $id
	 */
	public function setId($id)
	{
		$this->id = $id;
	}

	/**
	 * @return mixed
	 */
	public function getNo()
	{
		return $this->no;
	}

	/**
	 * @param mixed $no
	 */
	public function setNo($no)
	{
		$this->no = $no;
	}

	/**
	 * @return mixed
	 */
	public function getSuccess()
	{
		return $this->success;
	}

	/**
	 * @param mixed $success
	 */
	public function setSuccess($success)
	{
		$this->success = $success;
	}

	/**
	 * @return mixed
	 */
	public function getWorking()
	{
		return $this->working;
	}

	/**
	 * @param mixed $working
	 */
	public function setWorking($working)
	{
		$this->working = $working;
	}

} 