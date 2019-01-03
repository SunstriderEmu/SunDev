<?php

use Silex\Provider\FormServiceProvider;

$app->register(new FormServiceProvider());
$app->register(new Silex\Provider\UrlGeneratorServiceProvider());
$app->register(new Silex\Provider\DoctrineServiceProvider());
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));
$app['twig'] = $app->share($app->extend('twig', function(Twig_Environment $twig) {
	$twig->addExtension(new Twig_Extensions_Extension_Text());
	return $twig;
}));
$app["twig"] = $app->share($app->extend("twig", function (Twig_Environment $twig) use ($app) {
	$twig->addExtension(new SUN\Twig\SUNExtension($app));

	return $twig;
}));
$app->register(new Silex\Provider\FormServiceProvider());
$app->register(new Silex\Provider\ValidatorServiceProvider());
$app->register(new Silex\Provider\TranslationServiceProvider());
$app->register(new Silex\Provider\SecurityServiceProvider(), array(
	'security.firewalls' => array(
		'api' => array(
			'pattern' => '^/api$',
		),
		'login' => array(
			'pattern' => '^/login$',
		),
		'secured' => array(
			'pattern' => '^/',
			'anonymous' => false,
			'logout' => true,
			'form' => array('login_path' => '/login', 'check_path' => '/login_check'),
			'users' => $app->share(function () use ($app) {
				return new SUN\DAO\UserDAO($app);
			}),
		),
	),
	'security.role_hierarchy' => array(
		'ROLE_ADMIN' 		=> array('ROLE_FULL', 'ROLE_SUPERUSER', 'ROLE_ACCOUNT', 'ROLE_REVIEW'),
		'ROLE_REVIEW'		=> array('ROLE_REVIEW_ADD', 'ROLE_REVIEW_ADD', 'ROLE_REVIEW_VALIDATE', 'ROLE_REVIEW_REFUSE'),
		'ROLE_SUPERUSER'	=> array('ROLE_USER_LIST', 'ROLE_USER_ADD', 'ROLE_USER_EDIT', 'ROLE_USER_REMOVE'),
		'ROLE_ACCOUNT'		=> array('ROLE_ACCOUNT_LIST', 'ROLE_ACCOUNT_ADD', 'ROLE_ACCOUNT_EDIT', 'ROLE_ACCOUNT_REMOVE', 'ROLE_ACCOUNT_COMMANDS'),
		'ROLE_FULL'			=> array('ROLE_DEV', 'ROLE_TESTER'),
		'ROLE_DEV' 			=> array('ROLE_CREATURE', 'ROLE_GO', 'ROLE_DUNGEONS_WRITE', 'ROLE_LOOT', 'ROLE_QUESTS_WRITE', 'ROLE_WAYPOINTS', 'ROLE_SPELL', 'ROLE_TOOLS'),
		'ROLE_TESTER' 		=> array('ROLE_QUESTS_WRITE', 'ROLE_CLASSES', 'ROLE_DUNGEONS_WRITE'),
		'ROLE_CREATURE' 	=> array('ROLE_CREATURE_SMARTAI', 'ROLE_CREATURE_STATS', 'ROLE_CREATURE_LOOT', 'ROLE_CREATURE_EQUIP', 'ROLE_CREATURE_TEXT', 'ROLE_CREATURE_IMMUNE', 'ROLE_CREATURE_GOSSIP', 'ROLE_CREATURE_FLAG_DYN', 'ROLE_CREATURE_FLAG_EXTRA', 'ROLE_CREATURE_FLAG_NPC', 'ROLE_CREATURE_FLAG_TYPE', 'ROLE_CREATURE_FLAG_UNIT'),
		'ROLE_GO'			=> array('ROLE_GO_DATA', 'ROLE_GO_LOOT', 'ROLE_GO_SMARTAI'),
		'ROLE_CLASSES' 		=> array('ROLE_CLASSES_DRUID', 'ROLE_CLASSES_HUNTER', 'ROLE_CLASSES_MAGE', 'ROLE_CLASSES_PALADIN', 'ROLE_CLASSES_PRIEST', 'ROLE_CLASSES_ROGUE', 'ROLE_CLASSES_SHAMAN', 'ROLE_CLASSES_WARLOCK', 'ROLE_CLASSES_WARRIOR'),
		'ROLE_LOOT' 		=> array('ROLE_CREATURE_LOOT', 'ROLE_LOOT_DISENCHANT', 'ROLE_LOOT_FISHING', 'ROLE_GO_LOOT', 'ROLE_LOOT_ITEM', 'ROLE_LOOT_PICKPOCKET', 'ROLE_LOOT_PROSPECT', 'ROLE_LOOT_QUESTMAIL', 'ROLE_LOOT_REFERENCE', 'ROLE_LOOT_SKINNING'),
		'ROLE_TOOLS'        => array('ROLE_TOOLS_IMPORT_GAMEOBJECTS'),
	),
	'security.access_rules' => array(
		// Admin
		array('^/admin', 'ROLE_ADMIN'),

		// User
		array('^/user$', 				'ROLE_USER_LIST'),
		array('^/user/add', 			'ROLE_USER_ADD'),
		array('^/user/[0-9]+/edit$', 	'ROLE_USER_EDIT'),
		array('^/user/[0-9]+/delete$', 	'ROLE_USER_REMOVE'),

		// Account
		array('^/account$', 				'ROLE_ACCOUNT_LIST'),
		array('^/account/add', 				'ROLE_ACCOUNT_ADD'),
		array('^/account/[0-9]+/edit$', 	'ROLE_ACCOUNT_EDIT'),
		array('^/account/[0-9]+/remove$', 	'ROLE_ACCOUNT_REMOVE'),
		array('^/account/commands', 		'ROLE_ACCOUNT_COMMANDS'),

		// Class
		array('^/class$', 		array('ROLE_CLASSES', 'ROLE_CLASSES_DRUID', 'ROLE_CLASSES_HUNTER', 'ROLE_CLASSES_MAGE', 'ROLE_CLASSES_PALADIN', 'ROLE_CLASSES_PRIEST', 'ROLE_CLASSES_ROGUE', 'ROLE_CLASSES_SHAMAN', 'ROLE_CLASSES_WARLOCK', 'ROLE_CLASSES_WARRIOR')),
		array('^/class/druid', 	'ROLE_CLASSES_DRUID'),
		array('^/class/hunter', 	'ROLE_CLASSES_HUNTER'),
		array('^/class/mage', 	'ROLE_CLASSES_MAGE'),
		array('^/class/paladin', 	'ROLE_CLASSES_PALADIN'),
		array('^/class/priest', 	'ROLE_CLASSES_PRIEST'),
		array('^/class/rogue', 	'ROLE_CLASSES_ROGUE'),
		array('^/class/shaman', 	'ROLE_CLASSES_SHAMAN'),
		array('^/class/warlock', 	'ROLE_CLASSES_WARLOCK'),
		array('^/class/warrior', 	'ROLE_CLASSES_WARRIOR'),

		// Creature
		array('^/creature/entry/[0-9]+$', 				array('ROLE_CREATURE')),
		array('^/creature/entry/[0-9]+/smartai$', 		array('ROLE_CREATURE_SMARTAI')),
		array('^/creature/entry/[0-9]+/stats$', 		array('ROLE_CREATURE_STATS')),
		array('^/creature/entry/[0-9]+/loot$', 			array('ROLE_CREATURE_LOOT')),
		array('^/creature/entry/[0-9]+/equip$', 		array('ROLE_CREATURE_EQUIP')),
		array('^/creature/entry/[0-9]+/text$', 			array('ROLE_CREATURE_TEXT')),
		array('^/creature/entry/[0-9]+/immune$', 		array('ROLE_CREATURE_IMMUNE')),
		array('^/creature/entry/[0-9]+/gossip$', 		array('ROLE_CREATURE_GOSSIP')),
		array('^/creature/entry/[0-9]+/dynamicflag$', 	array('ROLE_CREATURE_FLAG_DYN')),
		array('^/creature/entry/[0-9]+/extraflag$', 	array('ROLE_CREATURE_FLAG_EXTRA')),
		array('^/creature/entry/[0-9]+/npcflag$', 		array('ROLE_CREATURE_FLAG_NPC')),
		array('^/creature/entry/[0-9]+/typeflag$', 		array('ROLE_CREATURE_FLAG_TYPE')),
		array('^/creature/entry/[0-9]+/unitflag$', 		array('ROLE_CREATURE_FLAG_UNIT')),

		// GameObject
		array('^/gameobject/entry/[0-9]+$', 			array('ROLE_GO')),
		array('^/gameobject/entry/[0-9]+/data$', 		array('ROLE_GO_DATA')),
		array('^/gameobject/entry/[0-9]+/smartai$', 	array('ROLE_GO_SMARTAI')),

		// Spell
		array('^/spell', 	'ROLE_SPELL'),

		// Condition
		array('^/condition', 'ROLE_CONDITION'),

		// Quest
		array('^/quest', 	array('ROLE_QUESTS_WRITE', 'ROLE_QUESTS_READ')),

		// Dungeon
		array('^/dungeon', array('ROLE_DUNGEONS_WRITE', 'ROLE_DUNGEONS_READ')),

		// Waypoints
		array('^/waypoints','ROLE_WAYPOINTS'),

		// Loot
		array('^/loot$', 					array('ROLE_LOOT', 'ROLE_CREATURE_LOOT', 'ROLE_LOOT_DISENCHANT', 'ROLE_LOOT_FISHING', 'ROLE_LOOT_GAMEOBJECT', 'ROLE_LOOT_ITEM', 'ROLE_LOOT_PICKPOCKET', 'ROLE_LOOT_PROSPECT', 'ROLE_LOOT_QUESTMAIL', 'ROLE_LOOT_REFERENCE', 'ROLE_LOOT_SKINNING')),
		array('^/loot/disenchant/[0-9]+$', 	'ROLE_LOOT_DISENCHANT'),
		array('^/loot/fishing/[0-9]+$', 	'ROLE_LOOT_FISHING'),
		array('^/loot/gameobject/[0-9]+$', 	'ROLE_GO_LOOT'),
		array('^/loot/item/[0-9]+$', 		'ROLE_LOOT_ITEM'),
		array('^/loot/pickpocket/[0-9]+$', 	'ROLE_LOOT_PICKPOCKET'),
		array('^/loot/prospect/[0-9]+$', 	'ROLE_LOOT_PROSPECT'),
		array('^/loot/questmail/[0-9]+$', 	'ROLE_LOOT_QUESTMAIL'),
		array('^/loot/reference/[0-9]+$', 	'ROLE_LOOT_REFERENCE'),
		array('^/loot/skinning/[0-9]+$', 	'ROLE_LOOT_SKINNING'),
		
		// Tools
		array('^/tools/import_gobjects/', 	'ROLE_TOOLS_IMPORT_GAMEOBJECTS'),

		// Review
		array('^/dev', 			'ROLE_REVIEW_ADD', 		'POST'),
		array('^/dev/validate', 'ROLE_REVIEW_VALIDATE', 'POST'),
		array('^/dev/refuse', 	'ROLE_REVIEW_REFUSE', 	'POST'),
	),
));
$app->register(new Silex\Provider\RememberMeServiceProvider());
$app->register(new Silex\Provider\SessionServiceProvider());
$app['dao.user'] = $app->share(function ($app) {
	return new SUN\DAO\UserDAO($app);
});

$app['dao'] = $app->share(function ($app) {
	return new SUN\DAO\DAO($app);
});
$app['dao.review'] = $app->share(function ($app) {
	return new SUN\DAO\ReviewDAO($app);
});
$app['dao.class'] = $app->share(function ($app) {
	return new SUN\DAO\ClassDAO($app);
});
$app['dao.quest'] = $app->share(function ($app) {
	return new SUN\DAO\QuestDAO($app);
});
$app['dao.dungeon'] = $app->share(function ($app) {
	return new SUN\DAO\DungeonDAO($app);
});
$app['dao.smartai'] = $app->share(function ($app) {
	return new SUN\DAO\SmartAIDAO($app);
});
$app['dao.loot'] = $app->share(function ($app) {
	return new SUN\DAO\LootDAO($app);
});


$app['dao.creature'] = $app->share(function ($app) {
	return new SUN\DAO\CreatureDAO($app);
});
$app['dao.object'] = $app->share(function ($app) {
	return new SUN\DAO\GameObjectDAO($app);
});
$app['dao.spell'] = $app->share(function ($app) {
	return new SUN\DAO\SpellDAO($app);
});
$app['dao.item'] = $app->share(function ($app) {
	return new SUN\DAO\ItemDAO($app);
});
$app['dao.tools'] = $app->share(function ($app) {
	return new SUN\DAO\ToolsDAO($app);
});

require_once __DIR__.'/config.php';

$app->register(new Silex\Provider\HttpFragmentServiceProvider());
$app->register(new Silex\Provider\ServiceControllerServiceProvider());
if (isset($app['debug']) && $app['debug']) {
	$app->register(new Silex\Provider\WebProfilerServiceProvider(), array(
		'profiler.cache_dir' 	=> __DIR__.'/../var/profiler',
		'profiler.mount_prefix' => '/_profiler',
	));
}
if($app['debug'] == false) {
	$app->error(function (\Exception $e, $code) use ($app) {
		switch ($code) {
			case 403:
				$message = 'Access denied.';
				break;
			case 404:
				$message = 'The requested resource could not be found.';
				break;
			default:
				$message = "Something went wrong.";
		}
		return $app['twig']->render('error.html.twig', array('message' => $message));
	});
}

require_once __DIR__.'/controllers/API.php';
require_once __DIR__.'/controllers/AreaTrigger.php';
require_once __DIR__.'/controllers/Creature.php';
require_once __DIR__.'/controllers/Condition.php';
require_once __DIR__.'/controllers/Home.php';
require_once __DIR__.'/controllers/GameObject.php';
require_once __DIR__.'/controllers/Item.php';
require_once __DIR__.'/controllers/Review.php';
require_once __DIR__.'/controllers/SmartAI.php';
require_once __DIR__.'/controllers/Class.php';
require_once __DIR__.'/controllers/Dungeon.php';
require_once __DIR__.'/controllers/Loot.php';
require_once __DIR__.'/controllers/Quest.php';
require_once __DIR__.'/controllers/TestQuest.php';
require_once __DIR__.'/controllers/Spell.php';
require_once __DIR__.'/controllers/User.php';
require_once __DIR__.'/controllers/Account.php';
require_once __DIR__.'/controllers/Waypoints.php';
require_once __DIR__.'/controllers/Tools.php';
