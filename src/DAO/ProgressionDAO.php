<?php
namespace SUN\DAO;

class ProgressionDAO extends DAO
{
	/**
	 * Classes Progression
	 */
	public function countClassesTested($category, $status) {
		$countStatus = $this->getDb('tools')->fetchAssoc("SELECT (SUM(CASE WHEN tested = ? THEN 1 ELSE 0 END)) AS count FROM class_test_{$category}", array($status));
		return $countStatus['count'];
	}

	public function countClassesSpells() {
		return $this->getDb('tools')->executeQuery('SELECT tested FROM class_test_spells')->rowCount();
	}

	public function countClassesTalents() {
		return $this->getDb('tools')->executeQuery('SELECT tested FROM class_test_talents')->rowCount();
	}

	public function getClassesSuccessPercent() {
		$totalSuccess 	= $this->countClassesTested("talents", 2) + $this->countClassesTested("spells", 2);
		$total 			= $this->countClassesSpells() + $this->countClassesTalents();
		return ($totalSuccess / $total) * 100;
	}

} 