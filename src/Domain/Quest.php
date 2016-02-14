<?php

namespace SUN\Domain;

class Quest {
	protected $entry;
	protected $name;
	protected $race;

	protected $itemid;
	protected $itemname;

	protected $idstarter;
	protected $starter;
	protected $idender;
	protected $ender;

	protected $objidstarter;
	protected $objstarter;
	protected $objidender;
	protected $objender;

	protected $startTxt;
	protected $progTxt;
	protected $endTxt;
	protected $txtEvent;
	protected $pathEvent;
	protected $timeEvent;
	protected $Exp;
	protected $Stuff;
	protected $Gold;
	protected $emotNPC;
	protected $spellNPC;
	protected $placeNPC;
	protected $workObj;
	protected $baObj;
	protected $comment;
	protected $tester;

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
	public function getExp()
	{
		return $this->Exp;
	}

	/**
	 * @param mixed $Exp
	 */
	public function setExp($Exp)
	{
		$this->Exp = $Exp;
	}

	/**
	 * @return mixed
	 */
	public function getGold()
	{
		return $this->Gold;
	}

	/**
	 * @param mixed $Gold
	 */
	public function setGold($Gold)
	{
		$this->Gold = $Gold;
	}

	/**
	 * @return mixed
	 */
	public function getStuff()
	{
		return $this->Stuff;
	}

	/**
	 * @param mixed $Stuff
	 */
	public function setStuff($Stuff)
	{
		$this->Stuff = $Stuff;
	}

	/**
	 * @return mixed
	 */
	public function getBaObj()
	{
		return $this->baObj;
	}

	/**
	 * @param mixed $baObj
	 */
	public function setBaObj($baObj)
	{
		$this->baObj = $baObj;
	}

	/**
	 * @return mixed
	 */
	public function getEmotNPC()
	{
		return $this->emotNPC;
	}

	/**
	 * @param mixed $emotNPC
	 */
	public function setEmotNPC($emotNPC)
	{
		$this->emotNPC = $emotNPC;
	}

	/**
	 * @return mixed
	 */
	public function getEndTxt()
	{
		return $this->endTxt;
	}

	/**
	 * @param mixed $endTxt
	 */
	public function setEndTxt($endTxt)
	{
		$this->endTxt = $endTxt;
	}

	/**
	 * @return mixed
	 */
	public function getEnder()
	{
		return $this->ender;
	}

	/**
	 * @param mixed $ender
	 */
	public function setEnder($ender)
	{
		$this->ender = $ender;
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
	public function getIdender()
	{
		return $this->idender;
	}

	/**
	 * @param mixed $idender
	 */
	public function setIdender($idender)
	{
		$this->idender = $idender;
	}

	/**
	 * @return mixed
	 */
	public function getIdstarter()
	{
		return $this->idstarter;
	}

	/**
	 * @param mixed $idstarter
	 */
	public function setIdstarter($idstarter)
	{
		$this->idstarter = $idstarter;
	}

	/**
	 * @return mixed
	 */
	public function getItemid()
	{
		return $this->itemid;
	}

	/**
	 * @param mixed $itemid
	 */
	public function setItemid($itemid)
	{
		$this->itemid = $itemid;
	}

	/**
	 * @return mixed
	 */
	public function getItemname()
	{
		return $this->itemname;
	}

	/**
	 * @param mixed $itemname
	 */
	public function setItemname($itemname)
	{
		$this->itemname = $itemname;
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
	public function getObjender()
	{
		return $this->objender;
	}

	/**
	 * @param mixed $objender
	 */
	public function setObjender($objender)
	{
		$this->objender = $objender;
	}

	/**
	 * @return mixed
	 */
	public function getObjidender()
	{
		return $this->objidender;
	}

	/**
	 * @param mixed $objidender
	 */
	public function setObjidender($objidender)
	{
		$this->objidender = $objidender;
	}

	/**
	 * @return mixed
	 */
	public function getObjidstarter()
	{
		return $this->objidstarter;
	}

	/**
	 * @param mixed $objidstarter
	 */
	public function setObjidstarter($objidstarter)
	{
		$this->objidstarter = $objidstarter;
	}

	/**
	 * @return mixed
	 */
	public function getObjstarter()
	{
		return $this->objstarter;
	}

	/**
	 * @param mixed $objstarter
	 */
	public function setObjstarter($objstarter)
	{
		$this->objstarter = $objstarter;
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

	/**
	 * @return mixed
	 */
	public function getPathEvent()
	{
		return $this->pathEvent;
	}

	/**
	 * @param mixed $pathEvent
	 */
	public function setPathEvent($pathEvent)
	{
		$this->pathEvent = $pathEvent;
	}

	/**
	 * @return mixed
	 */
	public function getPlaceNPC()
	{
		return $this->placeNPC;
	}

	/**
	 * @param mixed $placeNPC
	 */
	public function setPlaceNPC($placeNPC)
	{
		$this->placeNPC = $placeNPC;
	}

	/**
	 * @return mixed
	 */
	public function getProgTxt()
	{
		return $this->progTxt;
	}

	/**
	 * @param mixed $progTxt
	 */
	public function setProgTxt($progTxt)
	{
		$this->progTxt = $progTxt;
	}

	/**
	 * @return mixed
	 */
	public function getRace()
	{
		return $this->race;
	}

	/**
	 * @param mixed $race
	 */
	public function setRace($race)
	{
		$this->race = $race;
	}

	/**
	 * @return mixed
	 */
	public function getSpellNPC()
	{
		return $this->spellNPC;
	}

	/**
	 * @param mixed $spellNPC
	 */
	public function setSpellNPC($spellNPC)
	{
		$this->spellNPC = $spellNPC;
	}

	/**
	 * @return mixed
	 */
	public function getStartTxt()
	{
		return $this->startTxt;
	}

	/**
	 * @param mixed $startTxt
	 */
	public function setStartTxt($startTxt)
	{
		$this->startTxt = $startTxt;
	}

	/**
	 * @return mixed
	 */
	public function getTxtEvent()
	{
		return $this->txtEvent;
	}

	/**
	 * @param mixed $txtEvent
	 */
	public function setTxtEvent($txtEvent)
	{
		$this->txtEvent = $txtEvent;
	}

	/**
	 * @return mixed
	 */
	public function getStarter()
	{
		return $this->starter;
	}

	/**
	 * @param mixed $starter
	 */
	public function setStarter($starter)
	{
		$this->starter = $starter;
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
	public function getTextEvent()
	{
		return $this->textEvent;
	}

	/**
	 * @param mixed $textEvent
	 */
	public function setTextEvent($textEvent)
	{
		$this->textEvent = $textEvent;
	}

	/**
	 * @return mixed
	 */
	public function getTimeEvent()
	{
		return $this->timeEvent;
	}

	/**
	 * @param mixed $timeEvent
	 */
	public function setTimeEvent($timeEvent)
	{
		$this->timeEvent = $timeEvent;
	}

	/**
	 * @return mixed
	 */
	public function getWorkObj()
	{
		return $this->workObj;
	}

	/**
	 * @param mixed $workObj
	 */
	public function setWorkObj($workObj)
	{
		$this->workObj = $workObj;
	}


}