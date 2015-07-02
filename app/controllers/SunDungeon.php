<?php

$app->get('/dungeon', function () use ($app) {
	$stats = new SUN\DAO\SunDungeonDAO($app);

	$hellfire = [
		"ramparts"		=> $stats->getMap(540),
		"furnace"		=> $stats->getMap(542),
		"shattered"		=> $stats->getMap(543),
		];
	$coilfang = [
		"slave"			=> $stats->getMap(547),
		"underbog"		=> $stats->getMap(546),
		"steamvault"	=> $stats->getMap(545),
		];
	$auchindoun = [
		"crypts"		=> $stats->getMap(558),
		"sethekk"		=> $stats->getMap(556),
		"shadow"		=> $stats->getMap(555),
		"mana"			=> $stats->getMap(557),
		];
	$time = [
		"hillsbrad"		=> $stats->getMap(560),
		"morass"		=> $stats->getMap(269),
	];
	$tk = [
		"mechanar"		=> $stats->getMap(554),
		"arcatraz"		=> $stats->getMap(552),
		"botanica"		=> $stats->getMap(553),
	];

	return $app['twig']->render('dungeons/index.html.twig', array(
		"hellfire" 		=> $hellfire,
		"coilfang" 		=> $coilfang,
		"auchindoun" 	=> $auchindoun,
		"time" 			=> $time,
		"tk" 			=> $tk,
	));
});

$app->get('/dungeon/{dungeon}', function ($dungeon) use ($app) {
	$manager	= new SUN\DAO\SunDungeonDAO($app);
	$creatures	= $manager->getCreatures($dungeon);
	return $app['twig']->render('dungeons/dungeon.html.twig', array(
		"creatures" => $creatures,
		"map"		=> $dungeon,
	));
});

$app->post('/dungeon/apply/status', function () use ($app) {
	$creature  = json_decode($_POST['info']);
	$manager= new SUN\DAO\SunDungeonDAO($app);
	$manager->setStatus($creature);
	return "Success";
});

$app->post('/dungeon/apply/tester', function () use ($app) {
	$creature  = json_decode($_POST['info']);
	$manager= new SUN\DAO\SunDungeonDAO($app);
	$manager->setTester($creature);
	return "Success";
});

$app->post('/dungeon/apply/comment', function () use ($app) {
	$creature  = json_decode($_POST['info']);
	$manager= new SUN\DAO\SunDungeonDAO($app);
	$manager->setComment($creature);
	return "Success";
});