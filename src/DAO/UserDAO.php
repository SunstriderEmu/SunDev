<?php

namespace SUN\DAO;

use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use SUN\Domain\User;

class UserDAO extends DAO implements UserProviderInterface
{
	/**
	 * @param $id
	 * @return User
	 * @throws \Exception
	 */
	public function find($id) {
		$row = $this->getDb('tools')->fetchAssoc('SELECT * FROM user WHERE id = ?', array($id));
		if ($row){
			$user = new User();
			$user->setId($row['id']);
			$user->setUsername($row['username']);
			$user->setPassword($row['password']);
			$user->setSalt($row['salt']);
			$user->setRoles(unserialize(base64_decode($row['roles'])));
			return $user;
		}
		else
			throw new \Exception("No user matching id " . $id);
	}

	/**
	 * {@inheritDoc}
	 */
	public function loadUserByUsername($username)
	{
		$row = $this->getDb('tools')->fetchAssoc('SELECT * FROM user WHERE username = ?', array($username));
		if ($row){
			$user = new User();
			$user->setId($row['id']);
			$user->setUsername($row['username']);
			$user->setPassword($row['password']);
			$user->setSalt($row['salt']);
			$user->setRoles(unserialize(base64_decode($row['roles'])));
			return $user;
		}
		else
			throw new UsernameNotFoundException(sprintf('User "%s" not found.', $username));
	}

	/**
	 * {@inheritDoc}
	 */
	public function refreshUser(UserInterface $user)
	{
		$class = get_class($user);
		if (!$this->supportsClass($class)) {
			throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $class));
		}
		return $this->loadUserByUsername($user->getUsername());
	}

	/**
	 * {@inheritDoc}
	 */
	public function supportsClass($class)
	{
		return 'SUN\Domain\User' === $class;
	}

	/**
	 * Saves a user into the database.
	 *
	 * @param \SUN\Domain\User $user The user to save
	 */
	public function save(User $user) {
		$userData = array(
			'username' 	=> $user->getUsername(),
			'salt' 		=> $user->getSalt(),
			'password' 	=> $user->getPassword(),
			'roles' 	=> base64_encode(serialize($user->getRoles()))
		);

		if ($user->getId()) {
			// The user has already been saved : update it
			$this->getDb('tools')->update('user', $userData, array('id' => $user->getId()));
		} else {
			// The user has never been saved : insert it
			$this->getDb('tools')->insert('user', $userData);
			// Get the id of the newly created user and set it on the entity.
			$id = $this->getDb('tools')->lastInsertId();
			$user->setId($id);
		}
	}

	/**
	 * Removes a user from the database.
	 *
	 * @param @param integer $id The user id.
	 */
	public function delete($id) {
		// Delete the user
		$this->getDb('tools')->delete('user', array('id' => $id));
	}

	/**
	 * Returns a list of all users, sorted by role and name.
	 *
	 * @return array A list of all users.
	 */
	public function findAll() {
		$result = $this->getDb('tools')->fetchAll('SELECT * FROM user ORDER BY id');

		// Convert query result to an array of domain objects
		$entities = array();
		foreach ($result as $row) {
			$id = $row['id'];
			$user = new User();
			$user->setId($row['id']);
			$user->setUsername($row['username']);
			$user->setPassword($row['password']);
			$user->setSalt($row['salt']);
			$user->setRoles(unserialize(base64_decode($row['roles'])));
			$entities[$id] = $user;
		}
		return $entities;
	}
}