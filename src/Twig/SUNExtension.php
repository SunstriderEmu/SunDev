<?php

namespace SUN\Twig;

use Silex\Application;
use SUN\Domain\Creature;
use SUN\Domain\Gameobject;
use SUN\DAO\SmartAIDAO;
use PDO;

class SUNExtension extends \Twig_Extension {
	protected $app;
	protected $dbc;
	protected $world;
	protected $tools;
	protected $test;

	/**
	 * @param Application $app
	 */
	public function __construct(Application $app)
	{
		$this->app = $app;
		$this->dbc = $app['dbs']['dbc'];
		$this->world = $app['dbs']['world'];
		$this->tools = $app['dbs']['suntools'];
		$this->test = $app['dbs']['test_world'];
	}

	public function getName() {
		return "SUN";
	}

	public function getFilters()
	{
		return array(
			"getCreatureName" 	=> new \Twig_Filter_Method($this, "getCreatureName"),
			"getGOName" 		=> new \Twig_Filter_Method($this, "getGOEntryName"),
			"getScriptName" 	=> new \Twig_Filter_Method($this, "getScriptName"),
			"getScript" 		=> new \Twig_Filter_Method($this, "getScript"),
			"getUsername" 		=> new \Twig_Filter_Method($this, "getUsername"),
			"getStateName" 		=> new \Twig_Filter_Method($this, "getStateName"),
		);
	}

	public function getCreatureName($id) {
		if($id > 0) {
			$creature 	= new Creature(["entry" => $id]);
			$manager	= new SmartAIDAO($this->app);
			return $manager->findCreatureEntryName($creature)->getName();
		} else {
			$creature 	= new Creature(["guid" => $id]);
			$manager	= new SmartAIDAO($this->app);
			return $manager->findCreatureGuidName($creature)->getName();
		}
	}

	public function getGOName($id) {
		if($id > 0) {
			$gameobject	= new Gameobject(["entry" => $id]);
			$manager	= new SmartAIDAO($this->app);
			return $manager->findGOEntryName($gameobject)->getName();
		} else  {
			$gameobject	= new Gameobject(["guid" => $id]);
			$manager	= new SmartAIDAO($this->app);
			return $manager->findGOGuidName($gameobject)->getName();
		}
	}

	public function getScriptName($script) {
		$creature 	= new Creature(["entry" => substr($script, 0, -2)]);
		$manager	= new SmartAIDAO($this->app);
		return $manager->findCreatureEntryName($creature)->getName();
	}

	public function getScript($script) {
		return substr($script, -2);
	}

	public function getUsername($user) {
		$query = $this->tools->prepare('SELECT name FROM user WHERE id = :id');
		$query->bindValue(':id', $user, PDO::PARAM_INT);
		$query->execute();
		$name = $query->fetch();
		return $name['name'];
	}

	public function getStateName($state) {
		switch($state) {
			case 1: return "Accepted"; break;
			case 2: return "Rejected"; break;
			default: return "Pending";
		}
	}
} 