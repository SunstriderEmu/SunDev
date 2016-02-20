<?php

namespace SUN\DAO;

use Exception;

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
		
		if(!$review->user)
			$review->user = $this->app['security.token_storage']->getToken()->getUser()->getId();

		return $this->getDb('tools')->executeQuery('INSERT INTO smart_review (entryorguid, source_type, info1, info2, info3, user, date, validation_date, validation_user, state) VALUES (:entry, :source_type, :info1, :info2, :info3, :user, :date, null, null, :state)
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
		$check = $this->getDb('tools')->fetchAssoc('SELECT entryorguid FROM smart_review WHERE entryorguid = ? AND source_type = ?', array(intval($review->entryorguid), intval($review->source_type)));
		
		if($check == null)
			$this->createReview($review);
		
		return $this->getDb('tools')->executeQuery('UPDATE smart_review SET validation_date = ?, validation_user = ?, state = ? WHERE entryorguid = ? AND source_type = ?',
			   array(time(), intval($review->validation_user), intval($review->state), intval($review->entryorguid), intval($review->source_type)));
	}

	/**
	 * Get the user's reviews per week.
	 *
	 * @return mixed
	 */
	public function getUserReviews($start, $end) {
		if($start == 0)
			$start = 'NOW()';
		else
			$start = "NOW() - INTERVAL {$start} DAY";
		
		return $this->getDb('tools')->fetchAll("SELECT *,  UNIX_TIMESTAMP(NOW() - INTERVAL {$end} DAY), UNIX_TIMESTAMP({$start}) FROM smart_review WHERE state >= 0 AND (date BETWEEN UNIX_TIMESTAMP(NOW() - INTERVAL {$end} DAY) AND UNIX_TIMESTAMP({$start})) AND user = ?", array((int) $this->app['security.token_storage']->getToken()->getUser()->getId()));
	}

	/**
	 * Get all the reviews to validate or refuse.
	 *
	 * @return mixed
	 */
	public function getReviews() {
		return $this->getDb('tools')->fetchAll("SELECT * FROM smart_review WHERE state = 0");
	}

	/**
	 * Get all the user's WIP.
	 *
	 * @return mixed
	 */
	public function getWIP() {
		return $this->getDb('tools')->fetchAll("SELECT * FROM smart_review WHERE state = -1 and user = ?", array((int) $this->app['security.token_storage']->getToken()->getUser()->getId()));
	}
	
	/**
	 * Return the reviews made this week or from the $start to $end.
	 *
	 * @return mixed
	 */
	public function getWeeklyReviews($start = null, $end = null)
	{	
		if($start > $end)
			throw new Exception('Your starting date is higher than your end date.');
	 
		$result = [];
		if($start == null && $end == null)
		{
			$week = 'NOW()';
			$result['stats'] = $this->getDb('tools')->fetchAll("SELECT u.username, SUM(if(state = 1, 1, 0)) AS ok, SUM(if(state = 2, 1, 0)) AS bug FROM smart_review r LEFT JOIN user u ON u.id = r.user WHERE date BETWEEN UNIX_TIMESTAMP(STR_TO_DATE(CONCAT(YEARWEEK({$week}), ' Monday'), '%X%V %W')) AND UNIX_TIMESTAMP(STR_TO_DATE(CONCAT(YEARWEEK({$week}) + 1, ' Sunday'), '%X%V %W')) GROUP BY user");
			$result['reviews'] = $this->getDb('tools')->fetchAll("SELECT *, STR_TO_DATE(CONCAT(YEARWEEK({$week}), ' Monday'), '%X%V %W') as start, STR_TO_DATE(CONCAT(YEARWEEK({$week}) + 1, ' Sunday'), '%X%V %W') as end, u.username as user_name, us.username as user_validation_name FROM smart_review r LEFT JOIN user u ON u.id = r.user LEFT JOIN user us ON us.id = r.validation_user WHERE date BETWEEN UNIX_TIMESTAMP(STR_TO_DATE(CONCAT(YEARWEEK({$week}), ' Monday'), '%X%V %W')) AND UNIX_TIMESTAMP(STR_TO_DATE(CONCAT(YEARWEEK({$week}) + 1, ' Sunday'), '%X%V %W')) AND state > 0;");
		}
		else {
			$result['stats'] = $this->getDb('tools')->fetchAll("SELECT u.username, SUM(if(state = 1, 1, 0)) AS ok, SUM(if(state = 2, 1, 0)) AS bug FROM smart_review r LEFT JOIN user u ON u.id = r.user WHERE date BETWEEN ? AND ? GROUP BY user", array(strtotime($start), strtotime($end)));
			$result['reviews'] = $this->getDb('tools')->fetchAll("SELECT user, state, entryorguid, source_type, path, info1, info2, info3, date, validation_date, u.username as user_name, us.username as user_validation_name FROM smart_review r LEFT JOIN user u ON u.id = r.user LEFT JOIN user us ON us.id = r.validation_user WHERE state > 0 AND (date BETWEEN ? AND ?)", array(strtotime($start), strtotime($end)));
		}
		return $result;
	}
} 