<?php

namespace SUN\Domain;

class Text implements \JsonSerializable {
	protected $entry;
	protected $groupid;
	protected $id;
	protected $text;
	protected $type;
	protected $language;
	protected $probability;
	protected $emote;
	protected $sound;
	protected $comment;

	use jsonSerializer;

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
	public function getGroupid()
	{
		return $this->groupid;
	}

	/**
	 * @param mixed $groupid
	 */
	public function setGroupid($groupid)
	{
		$this->groupid = $groupid;
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
	public function getLanguage()
	{
		return $this->language;
	}

	/**
	 * @param mixed $language
	 */
	public function setLanguage($language)
	{
		$this->language = $language;
	}

	/**
	 * @return mixed
	 */
	public function getProbability()
	{
		return $this->probability;
	}

	/**
	 * @param mixed $probability
	 */
	public function setProbability($probability)
	{
		$this->probability = $probability;
	}

	/**
	 * @return mixed
	 */
	public function getSound()
	{
		return $this->sound;
	}

	/**
	 * @param mixed $sound
	 */
	public function setSound($sound)
	{
		$this->sound = $sound;
	}

	/**
	 * @return mixed
	 */
	public function getText()
	{
		return $this->text;
	}

	/**
	 * @param mixed $text
	 */
	public function setText($text)
	{
		$this->text = $text;
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


}