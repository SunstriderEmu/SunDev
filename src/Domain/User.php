<?php

namespace SUN\Domain;

use Symfony\Component\Security\Core\User\UserInterface;

class User implements UserInterface
{
	/**
	 * User id.
	 *
	 * @var integer
	 */
	private $id;

	/**
	 * User name.
	 *
	 * @var string
	 */
	private $username;

	/**
	 * User password.
	 *
	 * @var string
	 */
	private $password;

	/**
	 * Salt that was originally used to encode the password.
	 *
	 * @var string
	 */
	private $salt;

	/**
	 * Role.
	 * Values : ROLE_USER or ROLE_ADMIN.
	 *
	 * @var string
	 */
	private $role;

	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	/**
	 * @inheritDoc
	 */
	public function getUsername() {
		return $this->username;
	}

	public function setUsername($username) {
		$this->username = $username;
	}

	/**
	 * @inheritDoc
	 */
	public function getPassword() {
		return $this->password;
	}

	public function setPassword($password) {
		$this->password = $password;
	}

	/**
	 * @inheritDoc
	 */
	public function getSalt()
	{
		return $this->salt;
	}

	public function setSalt($salt)
	{
		$this->salt = $salt;
	}

	public function getRole()
	{
		return $this->role;
	}

	public function setRole($role) {
		switch($role) {
			case "0": $this->role = "ROLE_TESTER"; break;
			case "1": $this->role = "ROLE_DEV"; break;
			case "2": $this->role = "ROLE_FULL"; break;
			case "3": $this->role = "ROLE_ADMIN"; break;
			default:  return;
		}
	}

	/**
	 * @inheritDoc
	 */
	public function getRoles()
	{
		return array($this->getRole());
	}

	/**
	 * @inheritDoc
	 */
	public function eraseCredentials() {
		// Nothing to do here
	}
}