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
$app->register(new Silex\Provider\MonologServiceProvider(), array(
	'monolog.logfile' => __DIR__.'/../logs/sunstrider.log',
	'monolog.name' => 'SUN',
	'monolog.level' => $app['monolog.level']
));
$app->register(new Silex\Provider\HttpFragmentServiceProvider());
$app->register(new Silex\Provider\ServiceControllerServiceProvider());

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


require_once __DIR__.'/connection.php';

require_once __DIR__.'/controllers/Home.php';
require_once __DIR__.'/controllers/Review.php';
require_once __DIR__.'/controllers/SmartAI.php';
require_once __DIR__.'/controllers/SunQuest.php';
require_once __DIR__.'/controllers/SunDungeon.php';
require_once __DIR__.'/controllers/SunClasses.php';
require_once __DIR__.'/controllers/User.php';
require_once __DIR__.'/controllers/Waypoints.php';
