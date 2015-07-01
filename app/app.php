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
$app->register(new Silex\Provider\FormServiceProvider());
$app->register(new Silex\Provider\ValidatorServiceProvider());
$app->register(new Silex\Provider\TranslationServiceProvider());
$app->register(new Silex\Provider\SecurityServiceProvider(), array(
	'security.firewalls' => array(
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
		'ROLE_ADMIN' => array('ROLE_FULL'),
		'ROLE_FULL' => array('ROLE_DEV', 'ROLE_TESTER'),
		'ROLE_DEV' => array(),
		'ROLE_TESTER' => array(),
	),
	'security.access_rules' => array(
		array('^/admin', 'ROLE_ADMIN'),
		array('^/classes', 'ROLE_TESTER'),
		array('^/dungeon', array('ROLE_DEV', 'ROLE_TESTER')),
		array('^/gossip', 'ROLE_DEV'),
		array('^/quests', 'ROLE_TESTER'),
		array('^/smartai', 'ROLE_DEV'),
		array('^/smartai/review/validate', 'ROLE_ADMIN'),
		array('^/waypoints', 'ROLE_DEV'),
	),
));
$app->register(new Silex\Provider\RememberMeServiceProvider());
$app->register(new Silex\Provider\SessionServiceProvider());
$app['dao.user'] = $app->share(function ($app) {
	return new SUN\DAO\UserDAO($app);
});

require_once __DIR__.'/connection.php';

require_once __DIR__.'/controllers/Home.php';
require_once __DIR__.'/controllers/SmartAI.php';
require_once __DIR__.'/controllers/SunQuest.php';
require_once __DIR__.'/controllers/SunDungeon.php';
require_once __DIR__.'/controllers/User.php';
