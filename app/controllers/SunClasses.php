<?php

$app->get('/classes', function () use ($app) {
	$manager = new SUN\DAO\ClassesDAO($app);
	$global = $manager->getGlobal();
	$classes = [
		"druid"		=> $manager->getClass(11),
		"hunter"	=> $manager->getClass(3),
		"mage"		=> $manager->getClass(8),
		"paladin"	=> $manager->getClass(2),
		"priest"	=> $manager->getClass(5),
		"rogue"		=> $manager->getClass(4),
		"shaman"	=> $manager->getClass(7),
		"warlock"	=> $manager->getClass(9),
		"warrior"	=> $manager->getClass(1),
	];

	return $app['twig']->render('classes/index.html.twig', array(
		"classes"	=> $classes,
		"global" 	=> $global,
	));
});

$app->get('/classes/{class}', function ($class) use ($app) {
	$manager	= new SUN\DAO\ClassesDAO($app);
	$class		= $manager->getClass($manager->getIndex($class));
	return $app['twig']->render('classes/display.html.twig', array(
		"class" => $class,
	));
});

$app->post('/classes/apply', function () use ($app) {
	$info  = json_decode($_POST['info']);
	$manager= new SUN\DAO\ClassesDAO($app);
	$manager->setInfo($info);
	return "Success";
});