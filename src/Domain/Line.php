<?php
namespace SUN\Domain;

class Line implements \JsonSerializable
{
	use jsonSerializer;

	protected $entryorguid;
	protected $id;
	protected $source_type;
	protected $comment;

	protected $event_type;
	protected $event_chance;
	protected $event_phase_mask;
	protected $event_flags;
	protected $link;
	protected $event_param1;
	protected $event_param2;
	protected $event_param3;
	protected $event_param4;

	// SmartAI
	protected $action_type;
	protected $action_param1;
	protected $action_param2;
	protected $action_param3;
	protected $action_param4;
	protected $action_param5;
	protected $action_param6;
	
	protected $target_type;
	protected $target_flags;
	protected $target_param1;
	protected $target_param2;
	protected $target_param3;
	protected $target_x;
	protected $target_y;
	protected $target_z;
	protected $target_o;

	// EventAI
	protected $event_inverse_phase_mask;

	protected $action1_type;
	protected $action1_param1;
	protected $action1_param2;
	protected $action1_param3;
	protected $action2_type;
	protected $action2_param1;
	protected $action2_param2;
	protected $action2_param3;
	protected $action3_type;
	protected $action3_param1;
	protected $action3_param2;
	protected $action3_param3;

	public function __construct(array $data) {
		$this->hydrate($data);
	}

	/**
	 * @return mixed
	 */
	public function getEntryorguid()
	{
		return $this->entryorguid;
	}

	/**
	 * @param mixed $entryorguid
	 */
	public function setEntryorguid($entryorguid)
	{
		$this->entryorguid = $entryorguid;
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
	public function getSourceType()
	{
		return $this->source_type;
	}

	/**
	 * @param mixed $source_type
	 */
	public function setSourceType($source_type)
	{
		$this->source_type = $source_type;
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
	public function getEventType()
	{
		return $this->event_type;
	}

	/**
	 * @param mixed $event_type
	 */
	public function setEventType($event_type)
	{
		$this->event_type = $event_type;
	}

	/**
	 * @return mixed
	 */
	public function getEventChance()
	{
		return $this->event_chance;
	}

	/**
	 * @param mixed $event_chance
	 */
	public function setEventChance($event_chance)
	{
		$this->event_chance = $event_chance;
	}

	/**
	 * @return mixed
	 */
	public function getEventPhaseMask()
	{
		return $this->event_phase_mask;
	}

	/**
	 * @param mixed $event_phase_mask
	 */
	public function setEventPhaseMask($event_phase_mask)
	{
		$this->event_phase_mask = $event_phase_mask;
	}

	/**
	 * @return mixed
	 */
	public function getEventFlags()
	{
		return $this->event_flags;
	}

	/**
	 * @param mixed $event_flags
	 */
	public function setEventFlags($event_flags)
	{
		$this->event_flags = $event_flags;
	}

	/**
	 * @return mixed
	 */
	public function getLink()
	{
		return $this->link;
	}

	/**
	 * @param mixed $link
	 */
	public function setLink($link)
	{
		$this->link = $link;
	}

	/**
	 * @return mixed
	 */
	public function getEventParam1()
	{
		return $this->event_param1;
	}

	/**
	 * @param mixed $event_param1
	 */
	public function setEventParam1($event_param1)
	{
		$this->event_param1 = $event_param1;
	}

	/**
	 * @return mixed
	 */
	public function getEventParam2()
	{
		return $this->event_param2;
	}

	/**
	 * @param mixed $event_param2
	 */
	public function setEventParam2($event_param2)
	{
		$this->event_param2 = $event_param2;
	}

	/**
	 * @return mixed
	 */
	public function getEventParam3()
	{
		return $this->event_param3;
	}

	/**
	 * @param mixed $event_param3
	 */
	public function setEventParam3($event_param3)
	{
		$this->event_param3 = $event_param3;
	}

	/**
	 * @return mixed
	 */
	public function getEventParam4()
	{
		return $this->event_param4;
	}

	/**
	 * @param mixed $event_param4
	 */
	public function setEventParam4($event_param4)
	{
		$this->event_param4 = $event_param4;
	}

	/**
	 * @return mixed
	 */
	public function getActionType()
	{
		return $this->action_type;
	}

	/**
	 * @param mixed $action_type
	 */
	public function setActionType($action_type)
	{
		$this->action_type = $action_type;
	}

	/**
	 * @return mixed
	 */
	public function getActionParam1()
	{
		return $this->action_param1;
	}

	/**
	 * @param mixed $action_param1
	 */
	public function setActionParam1($action_param1)
	{
		$this->action_param1 = $action_param1;
	}

	/**
	 * @return mixed
	 */
	public function getActionParam2()
	{
		return $this->action_param2;
	}

	/**
	 * @param mixed $action_param2
	 */
	public function setActionParam2($action_param2)
	{
		$this->action_param2 = $action_param2;
	}

	/**
	 * @return mixed
	 */
	public function getActionParam3()
	{
		return $this->action_param3;
	}

	/**
	 * @param mixed $action_param3
	 */
	public function setActionParam3($action_param3)
	{
		$this->action_param3 = $action_param3;
	}

	/**
	 * @return mixed
	 */
	public function getActionParam4()
	{
		return $this->action_param4;
	}

	/**
	 * @param mixed $action_param4
	 */
	public function setActionParam4($action_param4)
	{
		$this->action_param4 = $action_param4;
	}

	/**
	 * @return mixed
	 */
	public function getActionParam5()
	{
		return $this->action_param5;
	}

	/**
	 * @param mixed $action_param5
	 */
	public function setActionParam5($action_param5)
	{
		$this->action_param5 = $action_param5;
	}

	/**
	 * @return mixed
	 */
	public function getActionParam6()
	{
		return $this->action_param6;
	}

	/**
	 * @param mixed $action_param6
	 */
	public function setActionParam6($action_param6)
	{
		$this->action_param6 = $action_param6;
	}

	/**
	 * @return mixed
	 */
	public function getTargetType()
	{
		return $this->target_type;
	}

	/**
	 * @param mixed $target_type
	 */
	public function setTargetType($target_type)
	{
		$this->target_type = $target_type;
	}

	/**
	 * @return mixed
	 */
	public function getTargetFlags()
	{
		return $this->target_flags;
	}

	/**
	 * @param mixed $target_flags
	 */
	public function setTargetFlags($target_flags)
	{
		$this->target_flags = $target_flags;
	}

	/**
	 * @return mixed
	 */
	public function getTargetParam1()
	{
		return $this->target_param1;
	}

	/**
	 * @param mixed $target_param1
	 */
	public function setTargetParam1($target_param1)
	{
		$this->target_param1 = $target_param1;
	}

	/**
	 * @return mixed
	 */
	public function getTargetParam2()
	{
		return $this->target_param2;
	}

	/**
	 * @param mixed $target_param2
	 */
	public function setTargetParam2($target_param2)
	{
		$this->target_param2 = $target_param2;
	}

	/**
	 * @return mixed
	 */
	public function getTargetParam3()
	{
		return $this->target_param3;
	}

	/**
	 * @param mixed $target_param3
	 */
	public function setTargetParam3($target_param3)
	{
		$this->target_param3 = $target_param3;
	}

	/**
	 * @return mixed
	 */
	public function getTargetX()
	{
		return $this->target_x;
	}

	/**
	 * @param mixed $target_x
	 */
	public function setTargetX($target_x)
	{
		$this->target_x = $target_x;
	}

	/**
	 * @return mixed
	 */
	public function getTargetY()
	{
		return $this->target_y;
	}

	/**
	 * @param mixed $target_y
	 */
	public function setTargetY($target_y)
	{
		$this->target_y = $target_y;
	}

	/**
	 * @return mixed
	 */
	public function getTargetZ()
	{
		return $this->target_z;
	}

	/**
	 * @param mixed $target_z
	 */
	public function setTargetZ($target_z)
	{
		$this->target_z = $target_z;
	}

	/**
	 * @return mixed
	 */
	public function getTargetO()
	{
		return $this->target_o;
	}

	/**
	 * @param mixed $target_o
	 */
	public function setTargetO($target_o)
	{
		$this->target_o = $target_o;
	}

	/**
	 * @return mixed
	 */
	public function getEventInversePhaseMask()
	{
		return $this->event_inverse_phase_mask;
	}

	/**
	 * @param mixed $event_inverse_phase_mask
	 */
	public function setEventInversePhaseMask($event_inverse_phase_mask)
	{
		$this->event_inverse_phase_mask = $event_inverse_phase_mask;
	}

	/**
	 * @return mixed
	 */
	public function getAction1Type()
	{
		return $this->action1_type;
	}

	/**
	 * @param mixed $action1_type
	 */
	public function setAction1Type($action1_type)
	{
		$this->action1_type = $action1_type;
	}

	/**
	 * @return mixed
	 */
	public function getAction1Param1()
	{
		return $this->action1_param1;
	}

	/**
	 * @param mixed $action1_param1
	 */
	public function setAction1Param1($action1_param1)
	{
		$this->action1_param1 = $action1_param1;
	}

	/**
	 * @return mixed
	 */
	public function getAction1Param2()
	{
		return $this->action1_param2;
	}

	/**
	 * @param mixed $action1_param2
	 */
	public function setAction1Param2($action1_param2)
	{
		$this->action1_param2 = $action1_param2;
	}

	/**
	 * @return mixed
	 */
	public function getAction1Param3()
	{
		return $this->action1_param3;
	}

	/**
	 * @param mixed $action1_param3
	 */
	public function setAction1Param3($action1_param3)
	{
		$this->action1_param3 = $action1_param3;
	}

	/**
	 * @return mixed
	 */
	public function getAction2Type()
	{
		return $this->action2_type;
	}

	/**
	 * @param mixed $action2_type
	 */
	public function setAction2Type($action2_type)
	{
		$this->action2_type = $action2_type;
	}

	/**
	 * @return mixed
	 */
	public function getAction2Param1()
	{
		return $this->action2_param1;
	}

	/**
	 * @param mixed $action2_param1
	 */
	public function setAction2Param1($action2_param1)
	{
		$this->action2_param1 = $action2_param1;
	}

	/**
	 * @return mixed
	 */
	public function getAction2Param2()
	{
		return $this->action2_param2;
	}

	/**
	 * @param mixed $action2_param2
	 */
	public function setAction2Param2($action2_param2)
	{
		$this->action2_param2 = $action2_param2;
	}

	/**
	 * @return mixed
	 */
	public function getAction2Param3()
	{
		return $this->action2_param3;
	}

	/**
	 * @param mixed $action2_param3
	 */
	public function setAction2Param3($action2_param3)
	{
		$this->action2_param3 = $action2_param3;
	}

	/**
	 * @return mixed
	 */
	public function getAction3Type()
	{
		return $this->action3_type;
	}

	/**
	 * @param mixed $action3_type
	 */
	public function setAction3Type($action3_type)
	{
		$this->action3_type = $action3_type;
	}

	/**
	 * @return mixed
	 */
	public function getAction3Param1()
	{
		return $this->action3_param1;
	}

	/**
	 * @param mixed $action3_param1
	 */
	public function setAction3Param1($action3_param1)
	{
		$this->action3_param1 = $action3_param1;
	}

	/**
	 * @return mixed
	 */
	public function getAction3Param2()
	{
		return $this->action3_param2;
	}

	/**
	 * @param mixed $action3_param2
	 */
	public function setAction3Param2($action3_param2)
	{
		$this->action3_param2 = $action3_param2;
	}

	/**
	 * @return mixed
	 */
	public function getAction3Param3()
	{
		return $this->action3_param3;
	}

	/**
	 * @param mixed $action3_param3
	 */
	public function setAction3Param3($action3_param3)
	{
		$this->action3_param3 = $action3_param3;
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
} 