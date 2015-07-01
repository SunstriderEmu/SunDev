<?php
namespace SUN\DAO;

use PDO;

class ProgressionDAO
{
	protected $app;
	protected $dbc;
	private $world;
	private $tools;

	/**
	 * @param \Silex\Application $app
	 */
	public function __construct(\Silex\Application $app)
	{
		$this->app = $app;
		$this->dbc = $app['dbs']['dbc'];
		$this->world = $app['dbs']['world'];
		$this->tools = $app['dbs']['suntools'];
	}

	/**
	 * Classes Progression
	 */
	public function countClassesTested($category, $status) {
		$query = $this->tools->prepare('SELECT (SUM(CASE WHEN tested = :status THEN 1 ELSE 0 END)) AS count
                                FROM suntools.class_test_' . $category);
		$query->bindValue(':status', $status, PDO::PARAM_INT);
		$query->execute();
		$countStatus = $query->fetch();

		return $countStatus['count'];
	}

	public function countClassesSpells() {
		$query = $this->tools->prepare('SELECT tested FROM suntools.class_test_spells');
		$query->execute();

		return $query->rowCount();
	}

	public function countClassesTalents() {
		$query = $this->tools->prepare('SELECT tested FROM suntools.class_test_talents');
		$query->execute();

		return $query->rowCount();
	}

	public function getClassesSuccessPercent() {
		$totalSuccess 	= $this->countClassesTested("talents", 2) + $this->countClassesTested("spells", 2);
		$total 			= $this->countClassesSpells() + $this->countClassesTalents();
		return ($totalSuccess / $total) * 100;
	}

} 