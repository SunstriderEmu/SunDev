<?php
namespace SUN\Domain;

class Line implements \JsonSerializable {
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

	use jsonSerializer;

	public function __construct(array $data) {
		$this->hydrate($data);
	}

	public function getEntryorguid() {
		return $this->entryorguid;
	}

	public function setEntryorguid($entryorguid) {
		$this->entryorguid = $entryorguid;
	}

	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getSourceType() {
		return $this->source_type;
	}

	public function setSourceType($source_type) {
		$this->source_type = $source_type;
	}

	public function getComment() {
		return $this->comment;
	}

	public function setComment($comment) {
		$this->comment = utf8_encode($comment);
	}

	/*
	 * Event
	 */
	public function getEventType() {
		return $this->event_type;
	}

	public function setEventType($event_type) {
		$this->event_type = $event_type;
	}

	public function getEventChance() {
		return $this->event_chance;
	}

	public function setEventChance($event_chance) {
		$this->event_chance = $event_chance;
	}

	public function getEventPhaseMask() {
		return $this->event_phase_mask;
	}

	public function setEventPhaseMask($event_phase_mask) {
		$this->event_phase_mask = $event_phase_mask;
	}

	public function getEventFlags() {
		return $this->event_flags;
	}

	public function setEventFlags($event_flags) {
		$this->event_flags = $event_flags;
	}

	public function getLink() {
		return $this->link;
	}

	public function setLink($link) {
		$this->link = $link;
	}

	public function getEventParam1() {
		return $this->event_param1;
	}

	public function setEventParam1($event_param1) {
		$this->event_param1 = $event_param1;
	}

	public function getEventParam2() {
		return $this->event_param2;
	}

	public function setEventParam2($event_param2) {
		$this->event_param2 = $event_param2;
	}

	public function getEventParam3() {
		return $this->event_param3;
	}

	public function setEventParam3($event_param3) {
		$this->event_param3 = $event_param3;
	}

	public function getEventParam4() {
		return $this->event_param4;
	}

	public function setEventParam4($event_param4) {
		$this->event_param4 = $event_param4;
	}
	
	
	/*
	 * Action
	 */
	public function getActionType() {
		return $this->action_type;
	}

	public function setActionType($action_type) {
		$this->action_type = $action_type;
	}

	public function getActionParam1() {
		return $this->action_param1;
	}

	public function setActionParam1($action_param1) {
		$this->action_param1 = $action_param1;
	}

	public function getActionParam2() {
		return $this->action_param2;
	}

	public function setActionParam2($action_param2) {
		$this->action_param2 = $action_param2;
	}

	public function getActionParam3() {
		return $this->action_param3;
	}

	public function setActionParam3($action_param3) {
		$this->action_param3 = $action_param3;
	}

	public function getActionParam4() {
		return $this->action_param4;
	}

	public function setActionParam4($action_param4) {
		$this->action_param4 = $action_param4;
	}

	public function getActionParam5() {
		return $this->action_param5;
	}

	public function setActionParam5($action_param5) {
		$this->action_param5 = $action_param5;
	}

	public function getActionParam6() {
		return $this->action_param6;
	}

	public function setActionParam6($action_param6) {
		$this->action_param6 = $action_param6;
	}
	
	
	/*
	 * Target
	 */
	public function getTargetType() {
		return $this->target_type;
	}

	public function setTargetType($target_type) {
		$this->target_type = $target_type;
	}
	public function getTargetFlags() {
		return $this->target_flags;
	}

	public function setTargetFlags($target_flags) {
		$this->target_flags = $target_flags;
	}
	
	public function getTargetParam1() {
		return $this->target_param1;
	}

	public function setTargetParam1($target_param1) {
		$this->target_param1 = $target_param1;
	}
	
	public function getTargetParam2() {
		return $this->target_param2;
	}

	public function setTargetParam2($target_param2) {
		$this->target_param2 = $target_param2;
	}
	
	public function getTargetParam3() {
		return $this->target_param3;
	}

	public function setTargetParam3($target_param3) {
		$this->target_param3 = $target_param3;
	}

	public function getTargetX() {
		return $this->target_x;
	}

	public function setTargetX($target_x) {
		$this->target_x = $target_x;
	}

	public function getTargetY() {
		return $this->target_y;
	}

	public function setTargetY($target_y) {
		$this->target_y = $target_y;
	}

	public function getTargetZ() {
		return $this->target_z;
	}

	public function setTargetZ($target_z) {
		$this->target_z = $target_z;
	}

	public function getTargetO() {
		return $this->target_o;
	}

	public function setTargetO($target_o) {
		$this->target_o = $target_o;
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