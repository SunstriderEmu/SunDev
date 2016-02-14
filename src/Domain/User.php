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
	 * Salt that was originally used to encode the password.
	 *
	 * @var string
	 */
	private $role;

	/**
	 * Role.
	 * Values : ROLE_USER or ROLE_ADMIN.
	 *
	 * @var string
	 */
	private $roles;

	/**
	 * @param array $data
	 */
	public function __construct($data = null)
	{
		$this->hydrate($data);
	}

	/**
	 * @param array $data
	 */
	public function hydrate($data)
	{
		if($data != null)
		{

			foreach($data as $key => $value) {
				$method = 'set' . ucfirst($key);
				$method = implode('_', array_map('ucfirst', explode('_', $method)));
				$method = str_replace("_", "", $method);

				if(method_exists($this, $method))
					$this->$method($value);
			}
		}
	}

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

	public function setRoles($roles)
    {
		$this->roles = (array) $roles;
	}

	/**
	 * @inheritDoc
	 */
	public function getRoles()
	{
		return $this->roles;
	}

	/**
	 * @inheritDoc
	 */
	public function eraseCredentials() {
		// Nothing to do here
	}

	public function isGranted($role)
	{
		return in_array($role, $this->getRoles());
	}
}