<?php

namespace SUN\DAO;

use PDO;

class ReviewDAO extends DAO {
	/*
	 * CREATE REVIEW
	 */
	public function createReview($review) {
		if(!isset($review->path))
			$review->path = "0";
		if(!isset($review->info1))
			$review->info1 = "0";
		if(!isset($review->info2))
			$review->info2 = "0";
		if(!isset($review->info3))
			$review->info3 = "0";

		$query = $this->tools->prepare('INSERT INTO smart_review (entryorguid, source_type, path, info1, info2, info3, user, date, validation_date, validation_user, state) VALUES (:entry, :source_type, :path, :info1, :info2, :info3, :user, :date, null, null, 0)
										ON DUPLICATE KEY UPDATE path = :path, info1 = :info1, info2 = :info2, info3 = :info3, date = :date, user = :user, validation_date = null, validation_user = null, state = 0');
		$query->bindValue(':entry', $review->entryorguid, PDO::PARAM_STR);
		$query->bindValue(':source_type', $review->source_type, PDO::PARAM_STR);
		$query->bindValue(':path', $review->path, PDO::PARAM_STR);
		$query->bindValue(':info1', $review->info1, PDO::PARAM_STR);
		$query->bindValue(':info2', $review->info2, PDO::PARAM_STR);
		$query->bindValue(':info3', $review->info3, PDO::PARAM_STR);
		$query->bindValue(':user', $review->user, PDO::PARAM_STR);
		$query->bindValue(':date', time(), PDO::PARAM_STR);
		return $query->execute();
	}

	/*
	 * EDIT REVIEW
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
	}
} 