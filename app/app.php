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
		'ROLE_ADMIN' 		=> array('ROLE_DEV', 'ROLE_SUPERUSER'),
		'ROLE_SUPERUSER'	=> array('ROLE_USER_LIST', 'ROLE_USER_ADD', 'ROLE_USER_EDIT', 'ROLE_USER_REMOVE'),
		'ROLE_DEV' 			=> array('ROLE_CREATURE', 'ROLE_GO', 'ROLE_LOOT', 'ROLE_SPELL'),
		'ROLE_CREATURE' 	=> array('ROLE_CREATURE_EVENTAI', 'ROLE_CREATURE_LOOT', 'ROLE_CREATURE_EQUIP'),
		'ROLE_LOOT' 		=> array('ROLE_CREATURE_LOOT', 'ROLE_LOOT_DISENCHANT', 'ROLE_LOOT_FISHING', 'ROLE_GO_LOOT', 'ROLE_LOOT_ITEM', 'ROLE_LOOT_PICKPOCKET', 'ROLE_LOOT_PROSPECT', 'ROLE_LOOT_QUESTMAIL', 'ROLE_LOOT_REFERENCE', 'ROLE_LOOT_SKINNING'),
	),
	'security.access_rules' => array(
		// Admin
		array('^/admin', 'ROLE_ADMIN'),

		// User
		array('^/user$', 				'ROLE_USER_LIST'),
		array('^/user/add', 			'ROLE_USER_ADD'),
		array('^/user/[0-9]+/edit$', 	'ROLE_USER_EDIT'),
		array('^/user/[0-9]+/delete$', 	'ROLE_USER_REMOVE'),

		// Creature
		array('^/creature/entry/[0-9]+$', 				array('ROLE_CREATURE')),
		array('^/creature/entry/[0-9]+/eventai$', 		array('ROLE_CREATURE_EVENTAI')),
		array('^/creature/entry/[0-9]+/loot$', 			array('ROLE_CREATURE_LOOT')),
		array('^/creature/entry/[0-9]+/equip$', 		array('ROLE_CREATURE_EQUIP')),

		// GameObject
		array('^/gameobject/entry/[0-9]+',	'ROLE_GO'),

		// Spell
		array('^/spell', 	'ROLE_SPELL'),

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
$app['dao.eventai'] = $app->share(function ($app) {
	return new SUN\DAO\EventAIDAO($app);
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

require_once __DIR__.'/controllers/Creature.php';
require_once __DIR__.'/controllers/Home.php';
require_once __DIR__.'/controllers/GameObject.php';
require_once __DIR__.'/controllers/Item.php';
require_once __DIR__.'/controllers/Loot.php';
require_once __DIR__.'/controllers/Spell.php';
require_once __DIR__.'/controllers/User.php';
require_once __DIR__.'/controllers/Account.php';
