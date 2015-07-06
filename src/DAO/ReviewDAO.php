<?php

namespace SUN\DAO;

use PDO;

class ReviewDAO extends DAO {
	/*
	 * SET REVIEW
	 */
	public function createReview($review) {
		if(!isset($review->path))
			$review->path = "0";

		$query = $this->tools->prepare('INSERT INTO smart_review (entryorguid, source_type, path, user, date, validation_date, validation_user, state) VALUES (:entry, :source_type, :path, :user, :date, null, null, 0)
										ON DUPLICATE KEY UPDATE path = :path, date = :date, user = :user, validation_date = null, validation_user = null, state = 0');
		$query->bindValue(':entry', $review->entryorguid, PDO::PARAM_STR);
		$query->bindValue(':source_type', $review->source_type, PDO::PARAM_STR);
		$query->bindValue(':path', $review->path, PDO::PARAM_STR);
		$query->bindValue(':user', $review->user, PDO::PARAM_STR);
		$query->bindValue(':date', time(), PDO::PARAM_STR);
		return $query->execute();
	}

	/*
	 * DELETE REVIEW
	 */
	public function setReview($review) {
		$query = $this->tools->prepare('UPDATE smart_review SET validation_date = :date, validation_user = :user, state = :state WHERE entryorguid = :entry AND source_type = :source_type');
		$query->bindValue(':date', time(), PDO::PARAM_STR);
		$query->bindValue(':user', $review->user, PDO::PARAM_STR);
		$query->bindValue(':state', $review->state, PDO::PARAM_STR);
		$query->bindValue(':entry', $review->entryorguid, PDO::PARAM_STR);
		$query->bindValue(':source_type', $review->source_type, PDO::PARAM_STR);
		return $query->execute();
	}

	/*
	 * GET REVIEW
	 */
	public function getReview() {
		$query = $this->tools->query('SELECT * FROM smart_review');
		$query->execute();
		return $query->fetchAll();

		$scripts = [];
		$identifier = "";
		foreach($fetch as $script) {
			switch($script['source_type']) {
				case "0":
					$source = "creature/";
					if($script['entryorguid'] > 0) {
						$identifier = "entry/";
						$creature 	= new \SUN\Domain\Creature(["entry" => $script['entryorguid']]);
						$name = $this->findCreatureEntryName($creature);
					} else {
						$identifier = "guid/";
						$creature 	= new \SUN\Domain\Creature(["guid" => $script['entryorguid']]);
						$name = $this->findCreatureGuidName($creature);
					}
					break;
				case "1":
					$source = "object/";
					if($script['entryorguid'] > 0) {
						$identifier = "entry/";
						$go		 	= new \SUN\Domain\Gameobject(["entry" => $script['entryorguid']]);
						$name = $this->findGOEntryName($go);
					} else {
						$identifier = "guid/";
						$go		 	= new \SUN\Domain\Gameobject(["guid" => $script['entryorguid']]);
						$name = $this->findGOGuidName($go);
					}
					break;
				case "3":
					$source = "waypoints/";
					break;
				case "4":
					$source = "creature/";
					$identifier = "entry/";
					$creature 	= new \SUN\Domain\Creature(["entry" => $script['entryorguid']]);
					$name = $this->findCreatureEntryName($creature);
					break;
				case "9":
					$source = "script/";
					$creature 	= new \SUN\Domain\Creature(["entry" => substr($script['entryorguid'], 0, -2)]);
					$name = $this->findCreatureEntryName($creature);
					break;
				default: return;
			}

			$manager = new UserDAO($this->app);
			$username = $manager->find($script['user']);

			$scripts[] = [
				"name"			=> $name->getName(),
				"link"  		=> $source . $identifier . $script['entryorguid'],
				"id"			=> $script['entryorguid'],
				"type"			=> $source,
				"source_type" 	=> $script['source_type'],
				"user"			=> $username->getUsername(),
				"date"			=> $script['date'],
			];
		}
		return $scripts;
	}
} 