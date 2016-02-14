<?php

namespace SUN\Domain;

class Gameobject {
	protected $entry;
	protected $guid;
	protected $name;
	protected $type;
	protected $displayId;
	protected $castBarCaption;
	protected $faction;
	protected $flags;
	protected $size;
	protected $data0;
	protected $data1;
	protected $data2;
	protected $data3;
	protected $data4;
	protected $data5;
	protected $data6;
	protected $data7;
	protected $data8;
	protected $data9;
	protected $data10;
	protected $data11;
	protected $data12;
	protected $data13;
	protected $data14;
	protected $data15;
	protected $data16;
	protected $data17;
	protected $data18;
	protected $data19;
	protected $data20;
	protected $data21;
	protected $data22;
	protected $data23;
	protected $AIName;
	protected $ScriptName;

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
    public function getScriptName()
    {
        return $this->ScriptName;
    }

    /**
     * @param mixed $ScriptName
     */
    public function setScriptName($ScriptName)
    {
        $this->ScriptName = $ScriptName;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param mixed $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * @return mixed
     */
    public function getDisplayId()
    {
        return $this->displayId;
    }

    /**
     * @param mixed $displayId
     */
    public function setDisplayId($displayId)
    {
        $this->displayId = $displayId;
    }

    /**
     * @return mixed
     */
    public function getCastBarCaption()
    {
        return $this->castBarCaption;
    }

    /**
     * @param mixed $castBarCaption
     */
    public function setCastBarCaption($castBarCaption)
    {
        $this->castBarCaption = $castBarCaption;
    }

    /**
     * @return mixed
     */
    public function getFaction()
    {
        return $this->faction;
    }

    /**
     * @param mixed $faction
     */
    public function setFaction($faction)
    {
        $this->faction = $faction;
    }

    /**
     * @return mixed
     */
    public function getFlags()
    {
        return $this->flags;
    }

    /**
     * @param mixed $flags
     */
    public function setFlags($flags)
    {
        $this->flags = $flags;
    }

    /**
     * @return mixed
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * @param mixed $size
     */
    public function setSize($size)
    {
        $this->size = $size;
    }

    /**
     * @return mixed
     */
    public function getData0()
    {
        return $this->data0;
    }

    /**
     * @param mixed $data0
     */
    public function setData0($data0)
    {
        $this->data0 = $data0;
    }

    /**
     * @return mixed
     */
    public function getData1()
    {
        return $this->data1;
    }

    /**
     * @param mixed $data1
     */
    public function setData1($data1)
    {
        $this->data1 = $data1;
    }

    /**
     * @return mixed
     */
    public function getData2()
    {
        return $this->data2;
    }

    /**
     * @param mixed $data2
     */
    public function setData2($data2)
    {
        $this->data2 = $data2;
    }

    /**
     * @return mixed
     */
    public function getData3()
    {
        return $this->data3;
    }

    /**
     * @param mixed $data3
     */
    public function setData3($data3)
    {
        $this->data3 = $data3;
    }

    /**
     * @return mixed
     */
    public function getData4()
    {
        return $this->data4;
    }

    /**
     * @param mixed $data4
     */
    public function setData4($data4)
    {
        $this->data4 = $data4;
    }

    /**
     * @return mixed
     */
    public function getData5()
    {
        return $this->data5;
    }

    /**
     * @param mixed $data5
     */
    public function setData5($data5)
    {
        $this->data5 = $data5;
    }

    /**
     * @return mixed
     */
    public function getData6()
    {
        return $this->data6;
    }

    /**
     * @param mixed $data6
     */
    public function setData6($data6)
    {
        $this->data6 = $data6;
    }

    /**
     * @return mixed
     */
    public function getData7()
    {
        return $this->data7;
    }

    /**
     * @param mixed $data7
     */
    public function setData7($data7)
    {
        $this->data7 = $data7;
    }

    /**
     * @return mixed
     */
    public function getData8()
    {
        return $this->data8;
    }

    /**
     * @param mixed $data8
     */
    public function setData8($data8)
    {
        $this->data8 = $data8;
    }

    /**
     * @return mixed
     */
    public function getData9()
    {
        return $this->data9;
    }

    /**
     * @param mixed $data9
     */
    public function setData9($data9)
    {
        $this->data9 = $data9;
    }

    /**
     * @return mixed
     */
    public function getData10()
    {
        return $this->data10;
    }

    /**
     * @param mixed $data10
     */
    public function setData10($data10)
    {
        $this->data10 = $data10;
    }

    /**
     * @return mixed
     */
    public function getData11()
    {
        return $this->data11;
    }

    /**
     * @param mixed $data11
     */
    public function setData11($data11)
    {
        $this->data11 = $data11;
    }

    /**
     * @return mixed
     */
    public function getData12()
    {
        return $this->data12;
    }

    /**
     * @param mixed $data12
     */
    public function setData12($data12)
    {
        $this->data12 = $data12;
    }

    /**
     * @return mixed
     */
    public function getData13()
    {
        return $this->data13;
    }

    /**
     * @param mixed $data13
     */
    public function setData13($data13)
    {
        $this->data13 = $data13;
    }

    /**
     * @return mixed
     */
    public function getData14()
    {
        return $this->data14;
    }

    /**
     * @param mixed $data14
     */
    public function setData14($data14)
    {
        $this->data14 = $data14;
    }

    /**
     * @return mixed
     */
    public function getData15()
    {
        return $this->data15;
    }

    /**
     * @param mixed $data15
     */
    public function setData15($data15)
    {
        $this->data15 = $data15;
    }

    /**
     * @return mixed
     */
    public function getData16()
    {
        return $this->data16;
    }

    /**
     * @param mixed $data16
     */
    public function setData16($data16)
    {
        $this->data16 = $data16;
    }

    /**
     * @return mixed
     */
    public function getData17()
    {
        return $this->data17;
    }

    /**
     * @param mixed $data17
     */
    public function setData17($data17)
    {
        $this->data17 = $data17;
    }

    /**
     * @return mixed
     */
    public function getData18()
    {
        return $this->data18;
    }

    /**
     * @param mixed $data18
     */
    public function setData18($data18)
    {
        $this->data18 = $data18;
    }

    /**
     * @return mixed
     */
    public function getData19()
    {
        return $this->data19;
    }

    /**
     * @param mixed $data19
     */
    public function setData19($data19)
    {
        $this->data19 = $data19;
    }

    /**
     * @return mixed
     */
    public function getData20()
    {
        return $this->data20;
    }

    /**
     * @param mixed $data20
     */
    public function setData20($data20)
    {
        $this->data20 = $data20;
    }

    /**
     * @return mixed
     */
    public function getData21()
    {
        return $this->data21;
    }

    /**
     * @param mixed $data21
     */
    public function setData21($data21)
    {
        $this->data21 = $data21;
    }

    /**
     * @return mixed
     */
    public function getData22()
    {
        return $this->data22;
    }

    /**
     * @param mixed $data22
     */
    public function setData22($data22)
    {
        $this->data22 = $data22;
    }

    /**
     * @return mixed
     */
    public function getData23()
    {
        return $this->data23;
    }

    /**
     * @param mixed $data23
     */
    public function setData23($data23)
    {
        $this->data23 = $data23;
    }

    /**
     * @return mixed
     */
    public function getAIName()
    {
        return $this->AIName;
    }

    /**
     * @param mixed $AIName
     */
    public function setAIName($AIName)
    {
        $this->AIName = $AIName;
    }
} 