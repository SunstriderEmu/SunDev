<?php

$app->get('/waypoints', function () use ($app) {
	return $app['twig']->render('waypoints/index.html.twig');
});

$app->get('/waypoints/path/{path}', function ($path) use ($app) {
	$manager	= new SUN\DAO\PathDAO($app);
	$path		= $manager->getPath($path);
	return json_encode($path);
});

$app->get('/waypoints/entry/{entry}', function ($entry) use ($app) {
	$creature 	= new SUN\Domain\Creature(["entry" => $entry]);
	$manager	= new SUN\DAO\CreatureDAO($app);
	$path		= new SUN\DAO\PathDAO($app);
	$info = [
		"name"	=> $manager->findCreatureEntryName($creature)->getName(),
		"free"	=>	$path->getEntryPath($entry),
	];
	return json_encode($info);
});