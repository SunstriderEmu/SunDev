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
			"getItemName" 		=> new \Twig_Filter_Method($this, "getItemName"),
			"getSpellName" 		=> new \Twig_Filter_Method($this, "getSpellName"),
			"getCreatureName" 	=> new \Twig_Filter_Method($this, "getCreatureName"),
			"getGOName" 		=> new \Twig_Filter_Method($this, "getGOEntryName"),
			"getScriptName" 	=> new \Twig_Filter_Method($this, "getScriptName"),
			"getScript" 		=> new \Twig_Filter_Method($this, "getScript"),
			"getUsername" 		=> new \Twig_Filter_Method($this, "getUsername"),
			"getStateName" 		=> new \Twig_Filter_Method($this, "getStateName"),
			"getGold" 			=> new \Twig_Filter_Method($this, "getGold"),
			"getRank" 			=> new \Twig_Filter_Method($this, "getRank"),
			"getType" 			=> new \Twig_Filter_Method($this, "getType"),
			"getFamily" 		=> new \Twig_Filter_Method($this, "getFamily"),
			"getUnitClass" 		=> new \Twig_Filter_Method($this, "getUnitClass"),
			"getInhabitType" 	=> new \Twig_Filter_Method($this, "getInhabitType"),
		);
	}

	public function getItemName($id) {
		$item = $this->test->fetchAssoc('SELECT name FROM item_template WHERE entry = ?', array($id));
		return $item['name'];
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
		$user = $this->tools->fetchAssoc('SELECT name FROM user WHERE id = ?', array($user));
		return $user['name'];
	}

	public function getStateName($state) {
		switch($state) {
			case 1: return "Accepted"; break;
			case 2: return "Rejected"; break;
			default: return "Pending";
		}
	}

	public function getGold($money) {
		$copper = $money % 100;
		$silver = floor(($money % 10000) / 100);
		$gold = floor($money / 10000);
		$result = "";
		if($gold > 0)
			$result .= "{$gold}<img src='/img/gold.png' alt='Gold' /> ";
		if($silver > 0)
			$result .= "{$silver}<img src='/img/silver.png' alt='Silver' /> ";
		$result .= "{$copper}<img src='/img/copper.png' alt='Copper' />";
		echo $result;
	}
	
	public function getRank($rank) {
		switch($rank) {
			case 1: echo "Elite"; break;
			case 2: echo "Rare Elite"; break;
			case 3: echo "<img src='/img/boss.gif' alt='Boss' /> Boss"; break;
			case 4: echo "Rare"; break;
			default: echo "Normal";
		}
	}

	public function getType($type) {
		switch($type) {
			case 1: echo "Beast"; break;
			case 2: echo "Dragonkin"; break;
			case 3: echo "Demon"; break;
			case 4: echo "Elemental"; break;
			case 5: echo "Giant"; break;
			case 6: echo "Undead"; break;
			case 7: echo "Humanoid"; break;
			case 8: echo "Critter"; break;
			case 9: echo "Mechanical"; break;
			case 10: echo "Not specified"; break;
			case 11: echo "Totem"; break;
			case 12: echo "Non-combat Pet"; break;
			case 13: echo "Gas Cloud"; break;
			default: echo "None";
		}
	}

	public function getFamily($family) {
		switch($family) {
			case 1:	echo "Wolf"; break;
			case 2:	echo "Cat"; break;
			case 3:	echo "Spider"; break;
			case 4:	echo "Bear"; break;
			case 5:	echo "Boar"; break;
			case 6:	echo "Crocolisk"; break;
			case 7:	echo "Carrion Bird"; break;
			case 8:	echo "Crab"; break;
			case 9:	echo "Gorilla"; break;
			case 11:echo "Raptor"; break;
			case 12:echo "Tallstrider"; break;
			case 15:echo "Felhunter"; break;
			case 16:echo "Voidwalker"; break;
			case 17:echo "Succubus"; break;
			case 19:echo "Doomguard"; break;
			case 20:echo "Scorpid"; break;
			case 21:echo "Turtle"; break;
			case 23:echo "Imp"; break;
			case 24:echo "Bat"; break;
			case 25:echo "Hyena"; break;
			case 26:echo "Owl"; break;
			case 27:echo "Wind Serpent"; break;
			case 28:echo "Remote Control"; break;
			case 29:echo "Felguard"; break;
			case 30:echo "Dragonhawk"; break;
			case 31:echo "Ravager"; break;
			case 32:echo "Warp Stalker"; break;
			case 33:echo "Sporebat"; break;
			case 34:echo "Nether Ray"; break;
			case 35:echo "Serpent"; break;
			case 37:echo "Moth"; break;
			case 38:echo "Chimaera"; break;
			case 39:echo "Devilsaur"; break;
			case 40:echo "Ghoul"; break;
			case 41:echo "Silithid"; break;
			case 42:echo "Worm"; break;
			case 43:echo "Rhino"; break;
			case 44:echo "Wasp"; break;
			case 45:echo "Core Hound"; break;
			case 46:echo "Spirit Beast"; break;
			default:echo "None"; break;
		}
	}

	public function getUnitClass($class) {
		switch($class) {
			case 1: echo "Warrior"; break;
			case 2: echo "Paladin"; break;
			case 4: echo "Rogue"; break;
			case 8: echo "Mage"; break;
			default: echo "Error";
		}
	}

	public function getInhabitType($type) {
		switch($type) {
			case 1: echo "Groud"; break;
			case 2: echo "Water"; break;
			case 3: echo "Ground & Water"; break;
			case 4: echo "Flying"; break;
			case 5: echo "Ground & Flying"; break;
			case 6: echo "Water & Flying"; break;
			case 76: echo "All"; break;
			default: echo "Error";
		}
	}
} 