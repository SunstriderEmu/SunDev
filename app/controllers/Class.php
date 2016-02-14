<?php

$app->get('/class', function () use ($app) {
	$global = $app['dao.class']->getGlobal();
	$classes = [
		"druid"		=> $app['dao.class']->getClass(11),
		"hunter"	=> $app['dao.class']->getClass(3),
		"mage"		=> $app['dao.class']->getClass(8),
		"paladin"	=> $app['dao.class']->getClass(2),
		"priest"	=> $app['dao.class']->getClass(5),
		"rogue"		=> $app['dao.class']->getClass(4),
		"shaman"	=> $app['dao.class']->getClass(7),
		"warlock"	=> $app['dao.class']->getClass(9),
		"warrior"	=> $app['dao.class']->getClass(1),
	];

	return $app['twig']->render('class/index.html.twig', array(
		"classes"	=> $classes,
		"global" 	=> $global,
	));
});

$app->get('/class/{class}', function ($class) use ($app) {
	$class		= $app['dao.class']->getClass($app['dao.class']->getIndex($class));
	return $app['twig']->render('class/display.html.twig', array(
		"class" => $class,
	));
});

$app->post('/class/apply', function () use ($app) {
	$info  = json_decode($_POST['info']);
	$app['dao.class']->setInfo($info);
	return "Success";
});