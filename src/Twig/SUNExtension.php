<?php

namespace SUN\Twig;

use Silex\Application;
use SUN\Domain\Creature;
use SUN\Domain\Gameobject;
use SUN\DAO\CreatureDAO;
use SUN\DAO\GameObjectDAO;

class SUNExtension extends \Twig_Extension
{
	protected $app;

	/**
	 * @param Application $app
	 */
	public function __construct(Application $app)
	{
		$this->app = $app;
	}

    protected function getDb($name)
    {
        return $this->app['dbs'][$name];
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
			"getCreatureType" 		=> new \Twig_Filter_Method($this, "getCreatureType"),
			"getObjectType" 		=> new \Twig_Filter_Method($this, "getObjectType"),
			"getFamily" 			=> new \Twig_Filter_Method($this, "getFamily"),
			"getUnitClass" 			=> new \Twig_Filter_Method($this, "getUnitClass"),
			"getInhabitType" 		=> new \Twig_Filter_Method($this, "getInhabitType"),
			"getGossipOptionIcon" 	=> new \Twig_Filter_Method($this, "getGossipOptionIcon"),
			"getFaction" 			=> new \Twig_Filter_Method($this, "getFaction"),
			"getReviewComment" 		=> new \Twig_Filter_Method($this, "getReviewComment"),
			"getObjectDataName"		=> new \Twig_Filter_Method($this, "getObjectDataName"),
		);
	}

	public function getItemName($id) {
		$item = $this->getDb('test')->fetchAssoc('SELECT name FROM item_template WHERE entry = ?', array($id));
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
		$user = $this->getDb('tools')->fetchAssoc('SELECT username FROM user WHERE id = ?', array($user));
		return $user['username'];
	}

	public function getStateName($state) {
		switch($state) {
			case 0: return "Pending"; break;
			case 1: return "Accepted"; break;
			case 2: return "Rejected"; break;
			default: return "WIP";
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

	public function getCreatureType($type) {
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
			case 7: echo "All"; break;
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

	public function getObjectType($type)
	{
		switch($type)
		{
			case "0": return "Door"; break;
			case "1": return "Button"; break;
			case "2": return "Quest Giver"; break;
			case "3": return "Chest"; break;
			case "4": return "Binder"; break;
			case "5": return "Generic"; break;
			case "6": return "Trap"; break;
			case "7": return "Chair"; break;
			case "8": return "Spell focus"; break;
			case "9": return "Text"; break;
			case "10": return "Goober"; break;
			case "11": return "Transport"; break;
			case "12": return "Area Damage"; break;
			case "13": return "Camera"; break;
			case "14": return "Map Object"; break;
			case "15": return "MO Transport"; break;
			case "16": return "Duel Flag"; break;
			case "17": return "Fishing Node"; break;
			case "18": return "Ritual"; break;
			case "19": return "Mailbox"; break;
			case "20": return "Auction House"; break;
			case "21": return "Guard Post"; break;
			case "22": return "Spell Caster"; break;
			case "23": return "Meeting Stone"; break;
			case "24": return "Flag Stand"; break;
			case "25": return "Fishing Hole"; break;
			case "26": return "Flag Drop"; break;
			case "27": return "Mini Game"; break;
			case "28": return "Lottery Kiosk"; break;
			case "29": return "Capture Point"; break;
			case "30": return "Aura Generator"; break;
			case "31": return "Dungeon Difficulty"; break;
			case "32": return "Barber Chair"; break;
			case "33": return "Destructible Building"; break;
			case "34": return "Guild Bank"; break;
			case "35": return "Trap Door"; break;
			default: return "Unsupported type";
		}
	}

	public function getObjectDataName($type, $data)
	{
		switch($type)
		{
			case "0":
				switch($data)
				{
					case "0": return "startOpen"; break;
					case "1": return "open"; break;
					case "2": return "autoClose"; break;
					case "3": return "noDamageImmune"; break;
					case "4": return "openTextID"; break;
					case "5": return "closeTextID"; break;
				}
				break;
			case "1":
				switch($data)
				{
					case "0": return "startOpen"; break;
					case "1": return "open"; break;
					case "2": return "autoClose"; break;
					case "3": return "linkedTrap"; break;
					case "4": return "noDamageImmune"; break;
					case "5": return "large"; break;
					case "6": return "openTextID"; break;
					case "7": return "closeTextID"; break;
					case "8": return "losOK"; break;
				}
				break;
			case "2":
				switch($data)
				{
					case "0": return "open"; break;
					case "1": return "questList"; break;
					case "2": return "pageMaterial"; break;
					case "3": return "gossipID"; break;
					case "4": return "customAnim"; break;
					case "5": return "noDamageImmune"; break;
					case "6": return "openTextID"; break;
					case "7": return "losOK"; break;
					case "8": return "allowMounted"; break;
					case "9": return "large"; break;
				}
				break;
			case "3":
				switch($data)
				{
					case "0": return "open"; break;
					case "1": return "chestLoot"; break;
					case "2": return "chestRestockTime"; break;
					case "3": return "consumable"; break;
					case "4": return "minRestock"; break;
					case "5": return "maxRestock"; break;
					case "6": return "lootedEvent"; break;
					case "7": return "linkedTrap"; break;
					case "8": return "questID"; break;
					case "9": return "level"; break;
					case "10": return "losOK"; break;
					case "11": return "leaveLoot"; break;
					case "12": return "notInCombat"; break;
					case "13": return "log loot"; break;
					case "14": return "openTextID"; break;
					case "15": return "use group loot rules"; break;
				}
				break;
			case "4":
			case "12":
			case "28":
				return "Not used";
				break;
			case "5":
				switch($data)
				{
					case "0": return "floatingTooltip"; break;
					case "1": return "highlight"; break;
					case "2": return "serverOnly"; break;
					case "3": return "large"; break;
					case "4": return "floatOnWater"; break;
					case "5": return "questID"; break;
				}
				break;
			case "6":
				switch($data)
				{
					case "0": return "open"; break;
					case "1": return "level"; break;
					case "2": return "diameter"; break;
					case "3": return "spell"; break;
					case "4": return "type (0 trap with no despawn after cast. 1 trap despawns after cast. 2 bomb casts on spawn)"; break;
					case "5": return "cooldown"; break;
					case "6": return "unknown"; break;
					case "7": return "startDelay"; break;
					case "8": return "serverOnly"; break;
					case "9": return "stealthed"; break;
					case "10": return "large"; break;
					case "11": return "stealthAffected"; break;
					case "12": return "ope,TextID"; break;
				}
				break;
			case "7":
				switch($data)
				{
					case "0": return "Chair Slots"; break;
					case "1": return "Chair Orientation"; break;
				}
				break;
			case "8":
				switch($data)
				{
					case "0": return "Spell Focus Type"; break;
					case "1": return "Diameter"; break;
					case "2": return "Linked Trap"; break;
					case "3": return "Server Only"; break;
					case "4": return "Quest ID"; break;
					case "5": return "Large"; break;
					case "6": return "Floating Tooltip"; break;
				}
				break;
			case "9":
				switch($data)
				{
					case "0": return "Page ID"; break;
					case "1": return "Language"; break;
					case "2": return "Page Material"; break;
				}
				break;
			case "10":
				switch($data)
				{
					case "0": return "Open"; break;
					case "1": return "Quest ID"; break;
					case "2": return "Event ID"; break;
					case "3": return "Unknown"; break;
					case "4": return "Custom Anim"; break;
					case "5": return "Consumable (boolean)"; break;
					case "6": return "Cooldown in sec"; break;
					case "7": return "Page ID"; break;
					case "8": return "Language"; break;
					case "9": return "Page Material"; break;
					case "10": return "Spell ID"; break;
					case "11": return "No Damage Immune (boolean)"; break;
					case "12": return "Linked Trap"; break;
					case "13": return "Large"; break;
					case "14": return "Open Text ID"; break;
					case "15": return "Close Text ID"; break;
					case "16": return "LoS OK (boolean) (BG related)"; break;
					case "17": return "Gossip ID"; break;
				}
				break;
			case "13":
				switch($data)
				{
					case "0": return "Open (LockId from Lock.dbc)"; break;
					case "1": return "Camera (from CinematicCamera.dbc)"; break;
				}
				break;
			case "15":
				switch($data)
				{
					case "0": return "Taxi Path ID"; break;
					case "1": return "Move Speed"; break;
					case "2": return "Accel Rate"; break;
					case "3": return "Unknown"; break;
					case "4": return "Unknown"; break;
					case "5": return "Unknown"; break;
					case "6": return "Unknown"; break;
					case "7": return "Unknown"; break;
					case "8": return "Unknown"; break;
				}
				break;
			case "11":
			case "14":
			case "16":
			case "17":
			case "19":
			case "34":
				return "No data used.";
				break;
			case "18":
				switch($data)
				{
					case "0": return "Casters"; break;
					case "1": return "Spell ID"; break;
					case "2": return "Anim Spell ID"; break;
					case "3": return "Ritual Persistent (boolean)"; break;
					case "4": return "Caster Target Spell ID"; break;
					case "5": return "Caster Target Spell Targets (boolean)"; break;
					case "6": return "Casters Grouped (boolean)"; break;
				}
				break;
			case "20":
				switch($data)
				{
					case "0": return "Action House ID"; break;
				}
				break;
			case "21":
				switch($data)
				{
					case "0": return "Creature ID"; break;
					case "1": return "Unknown"; break;
				}
				break;
			case "22":
				switch($data)
				{
					case "0": return "Spell ID"; break;
					case "1": return "Charges"; break;
					case "2": return "Party Only (boolean)"; break;
				}
				break;
			case "23":
				switch($data)
				{
					case "0": return "Min Level"; break;
					case "1": return "%ax Level"; break;
					case "2": return "Area ID"; break;
				}
				break;
			case "24":
				switch($data)
				{
					case "0": return "Open (Lock ID from Lock.dbc)"; break;
					case "1": return "PickUp Spell ID"; break;
					case "2": return "Radius"; break;
					case "3": return "Return Aura (Spell ID)"; break;
					case "4": return "Return Spell (Spell ID)"; break;
					case "5": return "No Damage Immune (boolean)"; break;
					case "6": return "Unknown"; break;
					case "7": return "LoS OK (boolean)"; break;
				}
				break;
			case "25":
				switch($data)
				{
					case "0": return "Radius"; break;
					case "1": return "Chest Loot"; break;
					case "2": return "MinRestock"; break;
					case "3": return "MaxRestock"; break;
				}
				break;
			case "26":
				switch($data)
				{
					case "0": return "Open (LockId from Lock.dbc)"; break;
					case "1": return "Event ID"; break;
					case "2": return "PickUp Spell (Spell ID)"; break;
					case "3": return "No Damage Immune (boolean)"; break;
				}
				break;
			case "27":
				switch($data)
				{
					case "0": return "areatrigger_teleport.id"; break;
				}
				break;
			case "29":
				switch($data)
				{
					case "0": return "Radius"; break;
					case "1": return "Server Side Spell"; break;
					case "2": return "World State 1"; break;
					case "3": return "World State 2"; break;
					case "4": return "Win Event ID 1"; break;
					case "5": return "Win Event ID 2"; break;
					case "6": return "Contested Event ID 1"; break;
					case "7": return "Contested Event ID 2"; break;
					case "8": return "Progress Event ID 1"; break;
					case "9": return "Progress Event ID 2"; break;
					case "10": return "Neutral Event ID 1"; break;
					case "11": return "Neutral Event ID 2"; break;
					case "12": return "Neutral Percent"; break;
					case "13": return "World State 3"; break;
					case "14": return "Min Superiority"; break;
					case "15": return "Max Superiority"; break;
					case "16": return "Min Time in sec"; break;
					case "17": return "Max Time in sec"; break;
					case "18": return "Large"; break;
				}
				break;
			case "30":
				switch($data) {
					case "0": return "Start Open (boolean)"; break;
					case "1": return "Radius"; break;
					case "2": return "Aura ID 1 (Spell ID)"; break;
					case "3": return "Condition ID 1"; break;
				}
				break;
			case "31":
				switch($data)
				{
					case "0": return "Map ID"; break;
					case "1": return "Difficulty (0 = 5 and 10 man normal, 1 = 5 man heroic + 25 normal)"; break;
				}
				break;
			case "32":
				return "Used for barbier chairs.";
				break;
			case "33":
				switch($data)
				{
					case "0": return "Intact Num Hits"; break;
					case "1": return "Credit Proxy Creature"; break;
					case "2": return "State 1 Name"; break;
					case "3": return "Intact Event"; break;
					case "4": return "Damaged Display ID"; break;
					case "5": return "Damaged Num Hits"; break;
					case "6": return "Empty 3"; break;
					case "7": return "Empty 4"; break;
					case "8": return "Empty 5"; break;
					case "9": return "Damaged Event"; break;
					case "10": return "Destroyed Display ID"; break;
					case "11": return "Empty 7"; break;
					case "12": return "Empty 8"; break;
					case "13": return "Empty 9"; break;
					case "14": return "Destroyed Event"; break;
					case "15": return "Empty 10"; break;
					case "16": return "Debuilding Time Secs"; break;
					case "17": return "Empty 11"; break;
					case "18": return "Destructible Data"; break;
					case "19": return "Rebuilding Event"; break;
					case "20": return "Empty 12"; break;
					case "21": return "Empty 13"; break;
					case "22": return "Damage Event"; break;
					case "23": return "Empty 14"; break;
				}
				break;
			case "35":
				switch($data)
				{
					case "0": return "When to pause"; break;
					case "1": return "Start Open"; break;
					case "2": return "Auto Close"; break;
				}
				break;
			default: return "Unsupported type";
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
					echo "<a href=\"/gameobject/entry/{$script['entryorguid']}/smartai\">{$this->getGOName($script['entryorguid'])} - SmartAI</a>";
				else
					echo "<a href=\"/gameobject/guid/".abs($script['entryorguid'])."/smartai\">{$this->getGOName($script['entryorguid'])} - SmartAI</a>";
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
				echo "<a href=\"/creature/entry/{$script['entryorguid']}/immune\">{$this->getCreatureName($script['entryorguid'])} - Immunities</a>";
				break;

			// Loot
			case 50: // Creature Loot
				echo "<a href=\"/creature/{$script['entryorguid']}/loot\">Creature Loot {$script['entryorguid']}</a>";
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