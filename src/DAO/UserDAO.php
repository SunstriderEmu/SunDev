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
		$row = $this->tools->fetchAssoc('SELECT * FROM user WHERE id = ?', array($id));
		if ($row)
			return $this->buildDomainObject($row);
		else
			throw new \Exception("No user matching id " . $id);
	}

	/**
	 * {@inheritDoc}
	 */
	public function loadUserByUsername($username)
	{
		$row = $this->tools->fetchAssoc('SELECT * FROM user WHERE name = ?', array($username));
		if ($row)
			return $this->buildDomainObject($row);
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
	 * Creates a User object based on a DB row.
	 *
	 * @param array $row The DB row containing User data.
	 * @return \SUN\Domain\User
	 */
	protected function buildDomainObject($row) {
		$user = new User();
		$user->setId($row['id']);
		$user->setUsername($row['name']);
		$user->setPassword($row['password']);
		$user->setSalt($row['salt']);
		$user->setRoles($row['role']);
		return $user;
	}
	/**
	 * Saves a user into the database.
	 *
	 * @param \SUN\Domain\User $user The user to save
	 */
	public function save(User $user) {
		$userData = array(
			'name' => $user->getUsername(),
			'salt' => $user->getSalt(),
			'password' => $user->getPassword(),
			'role' => $user->getRole()
		);

		if ($user->getId()) {
			// The user has already been saved : update it
			$this->tools->update('user', $userData, array('id' => $user->getId()));
		} else {
			// The user has never been saved : insert it
			$this->tools->insert('user', $userData);
			// Get the id of the newly created user and set it on the entity.
			$id = $this->tools->lastInsertId();
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
		$this->tools->delete('user', array('id' => $id));
	}

	/**
	 * Returns a list of all users, sorted by role and name.
	 *
	 * @return array A list of all users.
	 */
	public function findAll() {
		$result = $this->tools->fetchAll('SELECT * FROM user ORDER BY id');

		// Convert query result to an array of domain objects
		$entities = array();
		foreach ($result as $row) {
			$id = $row['id'];
			$entities[$id] = $this->buildDomainObject($row);
		}
		return $entities;
	}
}