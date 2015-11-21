<?php

namespace SUN\Twig;

use Silex\Application;
use SUN\Domain\Creature;
use SUN\Domain\Gameobject;
use SUN\DAO\CreatureDAO;
use SUN\DAO\GameobjectDAO;
use SUN\DAO\SmartAIDAO;

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
			"getItemName" 			=> new \Twig_Filter_Method($this, "getItemName"),
			"getSpellName" 			=> new \Twig_Filter_Method($this, "getSpellName"),
			"getCreatureName" 		=> new \Twig_Filter_Method($this, "getCreatureName"),
			"getGOName" 			=> new \Twig_Filter_Method($this, "getGOEntryName"),
			"getScriptName" 		=> new \Twig_Filter_Method($this, "getScriptName"),
			"getScript" 			=> new \Twig_Filter_Method($this, "getScript"),
			"getUsername" 			=> new \Twig_Filter_Method($this, "getUsername"),
			"getStateName" 			=> new \Twig_Filter_Method($this, "getStateName"),
			"getGold" 				=> new \Twig_Filter_Method($this, "getGold"),
			"getRank" 				=> new \Twig_Filter_Method($this, "getRank"),
			"getType" 				=> new \Twig_Filter_Method($this, "getType"),
			"getFamily" 			=> new \Twig_Filter_Method($this, "getFamily"),
			"getUnitClass" 			=> new \Twig_Filter_Method($this, "getUnitClass"),
			"getInhabitType" 		=> new \Twig_Filter_Method($this, "getInhabitType"),
			"getGossipOptionIcon" 	=> new \Twig_Filter_Method($this, "getGossipOptionIcon"),
			"getFaction" 			=> new \Twig_Filter_Method($this, "getFaction"),
			"getReviewComment" 		=> new \Twig_Filter_Method($this, "getReviewComment"),
		);
	}

	public function getItemName($id) {
		$item = $this->test->fetchAssoc('SELECT name FROM item_template WHERE entry = ?', array($id));
		return $item['name'];
	}

	public function getCreatureName($id) {
		if($id > 0) {
			$creature 	= new Creature(["entry" => $id]);
			$manager	= new CreatureDAO($this->app);
			return $manager->findCreatureEntryName($creature)->getName();
		} else {
			$creature 	= new Creature(["guid" => abs($id)]);
			$manager	= new CreatureDAO($this->app);
			return $manager->findCreatureGuidName($creature)->getName();
		}
	}

	public function getGOName($id) {
		if($id > 0) {
			$gameobject	= new Gameobject(["entry" => $id]);
			$manager	= new GameobjectDAO($this->app);
			return $manager->findGOEntryName($gameobject)->getName();
		} else {
			$gameobject	= new Gameobject(["guid" => $id]);
			$manager	= new GameobjectDAO($this->app);
			return $manager->findGOGuidName($gameobject)->getName();
		}
	}

	public function getScriptName($script) {
		$creature 	= new Creature(["entry" => substr($script, 0, -2)]);
		$manager	= new CreatureDAO($this->app);
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

	public function getGossipOptionIcon($icon) {
		switch($icon) {
			case 0: echo "<img src='/img/gossip/GossipGossipIcon.png' alt='Chat' />"; break;
			case 1: echo "<img src='/img/gossip/VendorGossipIcon.png' alt='Vendor' />"; break;
			case 2: echo "<img src='/img/gossip/TaxiGossipIcon.png' alt='Taxi' />"; break;
			case 3: echo "<img src='/img/gossip/TrainerGossipIcon.png' alt='Chat' />"; break;
			case 4: echo "<img src='/img/gossip/BinderGossipIcon.png' alt='Binder' />"; break;
			case 5: echo "<img src='/img/gossip/HealerGossipIcon.png' alt='Healer' />"; break;
			case 6: echo "<img src='/img/gossip/BankerGossipIcon.png' alt='Banker' />"; break;
			case 7: echo "<img src='/img/gossip/PetitionGossipIcon.png' alt='Petition' />"; break;
			case 8: echo "<img src='/img/gossip/TabardGossipIcon.png' alt='Tabard' />"; break;
			case 9: echo "<img src='/img/gossip/BattleMasterGossipIcon.png' alt='Battle Master' />"; break;
			case 10: echo "<img src='/img/gossip/UI-Quest-BulletPoint.png' alt='Chat' />"; break;
		}
	}

	public function getFaction($faction) {
		switch($faction) {
			case 690:  echo "<img src='/img/quests/horde.png' alt='Horde' /><span>Horde</span>"; break;
			case 1101: echo "<img src='/img/quests/alliance.png' alt='Alliance' /><span>Alliance</span>"; break;
			default: echo "";
		}
	}

	public function getReviewComment($script) {
		switch($script['source_type']){
			// SmartAI
			case 0: // SmartAI Creature
				if($script['entryorguid'] > 0)
					echo "<a href=\"/creature/entry/{$script['entryorguid']}/smartai\">{$this->getCreatureName($script['entryorguid'])} - SmartAI</a>";
				else
					echo "<a href=\"/creature/guid/".abs($script['entryorguid'])."/smartai\">{$this->getCreatureName($script['entryorguid'])} - SmartAI</a>";
				break;
			case 1: // SmartAI GameObject
				if($script['entryorguid'] > 0)
					echo "<a href=\"/object/entry/{$script['entryorguid']}/smartai\">{$this->getGOName($script['entryorguid'])} - SmartAI</a>";
				else
					echo "<a href=\"/object/guid/".abs($script['entryorguid'])."/smartai\">{$this->getGOName($script['entryorguid'])} - SmartAI</a>";
				break;
			case 9: // SmartAI Script
				echo "<a href=\"/smartai/script/{$script['entryorguid']}\">{$this->getScriptName($script['entryorguid'])} - Script {$this->getScript($script['entryorguid'])}</a>";
				break;

			// Creature
			case 10: // Creature Stats
				echo "<a href=\"/creature/entry/{$script['entryorguid']}/stats\">{$this->getCreatureName($script['entryorguid'])} - Stats</a>";
				break;
			case 11: // Creature Equipment
				echo "<a href=\"/creature/entry/{$script['entryorguid']}/equip\">{$this->getCreatureName($script['entryorguid'])} - Equipment</a>";
				break;
			case 12: // Creature Text
				echo "<a href=\"/creature/entry/{$script['entryorguid']}/text\">{$this->getCreatureName($script['entryorguid'])} - Text</a>";
				break;
			case 20: // Creature NPC Flag
				echo "<a href=\"/creature/entry/{$script['entryorguid']}/npcflag\">{$this->getCreatureName($script['entryorguid'])} - NPC Flag</a>";
				break;
			case 21: // Creature Unit Flag
				echo "<a href=\"/creature/entry/{$script['entryorguid']}/unitflag\">{$this->getCreatureName($script['entryorguid'])} - Unit Flag</a>";
				break;
			case 22: // Creature Unit Flag 2
				echo "<a href=\"/creature/entry/{$script['entryorguid']}/unitflag2\">{$this->getCreatureName($script['entryorguid'])} - Unit Flag 2</a>";
				break;
			case 23: // Creature Dynamic Flag
				echo "<a href=\"/creature/entry/{$script['entryorguid']}/dynamicflag\">{$this->getCreatureName($script['entryorguid'])} - Dynamic Flag</a>";
				break;
			case 24: // Creature Type Flag
				echo "<a href=\"/creature/entry/{$script['entryorguid']}/typeflag\">{$this->getCreatureName($script['entryorguid'])} - Type Flag</a>";
				break;
			case 25: // Creature Flag Extra
				echo "<a href=\"/creature/entry/{$script['entryorguid']}/flagextra\">{$this->getCreatureName($script['entryorguid'])} - Flag Extra</a>";
				break;
			case 26: // Creature Immunities
				echo "<a href=\"/creature/entry/{$script['entryorguid']}/immunities\">{$this->getCreatureName($script['entryorguid'])} - Immunities</a>";
				break;

			// Loot
			case 50: // Creature Loot
				echo "<a href=\"/loot/creature/{$script['entryorguid']}\">Creature Loot {$script['entryorguid']}</a>";
				break;
			case 51: // Disenchant Loot
				echo "<a href=\"/loot/disenchant/{$script['entryorguid']}\">Disenchant Loot {$script['entryorguid']}</a>";
				break;
			case 52: // Fishing Loot
				echo "<a href=\"/loot/fishing/{$script['entryorguid']}\">Fishing Loot {$script['entryorguid']}</a>";
				break;
			case 53: // GameObject Loot
				echo "<a href=\"/loot/gameobject/{$script['entryorguid']}\">GameObject Loot {$script['entryorguid']}</a>";
				break;
			case 54: // Item Loot
				echo "<a href=\"/loot/item/{$script['entryorguid']}\">Item Loot {$script['entryorguid']}</a>";
				break;
			case 55: // Pickpocket Loot
				echo "<a href=\"/loot/pickpocket/{$script['entryorguid']}\">Pickpocket Loot {$script['entryorguid']}</a>";
				break;
			case 56: // Prospecting Loot
				echo "<a href=\"/loot/prospecting/{$script['entryorguid']}\">Prospecting Loot {$script['entryorguid']}</a>";
				break;
			case 57: // Quest Mail Loot
				echo "<a href=\"/loot/questmail/{$script['entryorguid']}\">Quest Mail Loot {$script['entryorguid']}</a>";
				break;
			case 58: // Reference Loot
				echo "<a href=\"/loot/reference/{$script['entryorguid']}\">Reference Loot {$script['entryorguid']}</a>";
				break;
			case 59: // Skinning Loot
				echo "<a href=\"/loot/skinning/{$script['entryorguid']}\">Skinning Loot {$script['entryorguid']}</a>";
				break;

			//Waypoints
			case 70: // Set Path
				echo "<a href=\"/creature/entry/{$script['entryorguid']}\">{$this->getCreatureName($script['entryorguid'])} - Set Path {$script['info1']}</a>";
				break;
			case 71: // Pause
				echo "<a href=\"/creature/entry/{$script['entryorguid']}\">Path {$script['entryorguid']} - Point {$script['info1']} - Set Pause {$script['info2']}ms</a>";
				break;
			default: return "Error: Entry:{$script['entryorguid']} - Source_type:{$script['source_type']}";
		}
	}
} 