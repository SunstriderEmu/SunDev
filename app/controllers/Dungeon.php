<?php

$app->get('/dungeon', function () use ($app) {
	$hellfire = [
		"ramparts"		=> $app['dao.dungeon']->getMap(540),
		"furnace"		=> $app['dao.dungeon']->getMap(542),
		"shattered"		=> $app['dao.dungeon']->getMap(543),
		];
	$coilfang = [
		"slave"			=> $app['dao.dungeon']->getMap(547),
		"underbog"		=> $app['dao.dungeon']->getMap(546),
		"steamvault"	=> $app['dao.dungeon']->getMap(545),
		];
	$auchindoun = [
		"crypts"		=> $app['dao.dungeon']->getMap(558),
		"sethekk"		=> $app['dao.dungeon']->getMap(556),
		"shadow"		=> $app['dao.dungeon']->getMap(555),
		"mana"			=> $app['dao.dungeon']->getMap(557),
		];
	$time = [
		"hillsbrad"		=> $app['dao.dungeon']->getMap(560),
		"morass"		=> $app['dao.dungeon']->getMap(269),
	];
	$tk = [
		"mechanar"		=> $app['dao.dungeon']->getMap(554),
		"arcatraz"		=> $app['dao.dungeon']->getMap(552),
		"botanica"		=> $app['dao.dungeon']->getMap(553),
	];

	return $app['twig']->render('dungeon/index.html.twig', array(
		"hellfire" 		=> $hellfire,
		"coilfang" 		=> $coilfang,
		"auchindoun" 	=> $auchindoun,
		"time" 			=> $time,
		"tk" 			=> $tk,
	));
});

$app->get('/dungeon/{dungeon}', function ($dungeon) use ($app) {
	$creatures	= $app['dao.dungeon']->getCreatures($dungeon);
	return $app['twig']->render('dungeon/dungeon.html.twig', array(
		"creatures" => $creatures,
		"map"		=> $dungeon,
	));
})->assert('dungeon', '\d+');

$app->post('/dungeon/apply/status', function () use ($app) {
	$creature  = json_decode($_POST['info']);
	$app['dao.dungeon']->setStatus($creature);
	return "Success";
});

$app->post('/dungeon/apply/tester', function () use ($app) {
	$creature  = json_decode($_POST['info']);
	$app['dao.dungeon']->setTester($creature);
	return "Success";
});

$app->post('/dungeon/apply/comment', function () use ($app) {
	$creature  = json_decode($_POST['info']);
	$app['dao.dungeon']->setComment($creature);
	return "Success";
});