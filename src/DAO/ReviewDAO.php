<?php

namespace SUN\DAO;

class ReviewDAO extends DAO {
	/**
	 * Create a review.
	 *
	 * @param $review
	 * @return mixed
	 */
	public function createReview($review) {
		if(!isset($review->info1))
			$review->info1 = 0;
		if(!isset($review->info2))
			$review->info2 = 0;
		if(!isset($review->info3))
			$review->info3 = 0;

		return $this->tools->executeQuery('INSERT INTO smart_review (entryorguid, source_type, info1, info2, info3, user, date, validation_date, validation_user, state) VALUES (:entry, :source_type, :info1, :info2, :info3, :user, :date, null, null, :state)
										   ON DUPLICATE KEY UPDATE info1 = :info1, info2 = :info2, info3 = :info3, date = :date, user = :user, validation_date = null, validation_user = null, state = :state',
				array(
					"entry" 		=> intval($review->entryorguid),
					"source_type" 	=> intval($review->source_type),
					"info1"			=> intval($review->info1),
					"info2" 		=> intval($review->info2),
					"info3"			=> intval($review->info3),
					"user"			=> intval($review->user),
					"state"			=> intval($review->state),
					"date"			=> time()
				));
	}

	/**
	 * Update a review.
	 *
	 * @param $review
	 * @return mixed
	 */
	public function updateReview($review) {
		return $this->tools->executeQuery('UPDATE smart_review SET validation_date = ?, validation_user = ?, state = ? WHERE entryorguid = ? AND source_type = ?',
			   array(time(), intval($review->validation_user), intval($review->state), intval($review->entryorguid), intval($review->source_type)));
	}

	/**
	 * Get all the reviews.
	 *
	 * @return mixed
	 */
	public function getReviews() {
		return $this->tools->fetchAll('SELECT * FROM smart_review');
	}
} 