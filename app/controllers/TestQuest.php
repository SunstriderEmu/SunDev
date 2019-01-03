<?php

use Symfony\Component\HttpFoundation\Request;

$app->get('/test/quest', function () use ($app) {

	$zones = [
		"global"		=> $app['dao.quest']->getGlobalProgress(),
		"hellfire"		=> $app['dao.quest']->getZone(3483),
		"zangar"		=> $app['dao.quest']->getZone(3521),
		"terokkar"		=> $app['dao.quest']->getZone(3519),
		"nagrand"		=> $app['dao.quest']->getZone(3518),
		"blades"		=> $app['dao.quest']->getZone(3522),
		"netherstorm"	=> $app['dao.quest']->getZone(3523),
		"shadowmoon"	=> $app['dao.quest']->getZone(3520),
		"shattrath"		=> $app['dao.quest']->getZone(3703),
	];
	$dungeons = [
		"ramparts"		=> $app['dao.quest']->getZone(3562),
		"furnace"		=> $app['dao.quest']->getZone(3713),
		"shattered"		=> $app['dao.quest']->getZone(3714),
		"slave"			=> $app['dao.quest']->getZone(3717),
		"underbog"		=> $app['dao.quest']->getZone(3716),
		"steamvault"	=> $app['dao.quest']->getZone(3715),
		"crypts"		=> $app['dao.quest']->getZone(3790),
		"sethekk"		=> $app['dao.quest']->getZone(3791),
		"shadow"		=> $app['dao.quest']->getZone(3789),
		"mana"			=> $app['dao.quest']->getZone(3792),
		"hillsbrad"		=> $app['dao.quest']->getZone(2367),
		"morass"		=> $app['dao.quest']->getZone(2366),
		"mechanar"		=> $app['dao.quest']->getZone(3849),
		"arcatraz"		=> $app['dao.quest']->getZone(3848),
		"botanica"		=> $app['dao.quest']->getZone(3847),
	];
	$raids = [
		"Gruul"		=> $app['dao.quest']->getZone(3923),
		"Maggy"		=> $app['dao.quest']->getZone(3836),
		"Karazhan"	=> $app['dao.quest']->getZone(3457),
		"SSC"		=> $app['dao.quest']->getZone(3607),
		"TK"		=> $app['dao.quest']->getZone(3485),
		"HS"		=> $app['dao.quest']->getZone(3606),
		"BT"		=> $app['dao.quest']->getZone(3959),
	];

	return $app['twig']->render('test/quest/index.html.twig', array(
		"zones" 	=> $zones,
		"dungeons" 	=> $dungeons,
		"raids" 	=> $raids,
	));
});

$app->get('/test/quest/zone/{zone}', function ($zone) use ($app) {
	return $app['twig']->render('test/quest/zone.html.twig', array(
		"quests" => $app['dao.quest']->getQuests($zone),
	));
})->assert('zone', '\d+');

$app->post('/test/quest/apply/status', function (Request $request) use ($app) {
	$app['dao.quest']->setStatus(json_decode($request->request->get('info')));
	return "Success";
});

$app->post('/test/quest/apply/comment', function (Request $request) use ($app) {
	var_dump($request = Request::createFromGlobals());
	$app['dao.quest']->setComment(json_decode($request->request->get('info')));
	return "Success";
});

$app->post('/test/quest/apply/tester', function (Request $request) use ($app) {
	$app['dao.quest']->setTester(json_decode($request->request->get('info')));
	return "Success";
});

// GET QUEST NAME
$app->get('/test/quest/{entry}/name', function ($entry) use ($app) {
    return $app['dao.quest']->getQuestName($entry);
})->assert('entry', '\d+');