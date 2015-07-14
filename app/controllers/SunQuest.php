<?php

$app->get('/quests', function () use ($app) {
	$stats = new SUN\DAO\SunQuestDAO($app);

	$zones = [
		"global"		=> $stats->getGlobalProgress(),
		"hellfire"		=> $stats->getZone(3483),
		"zangar"		=> $stats->getZone(3521),
		"terokkar"		=> $stats->getZone(3519),
		"nagrand"		=> $stats->getZone(3518),
		"blades"		=> $stats->getZone(3522),
		"netherstorm"	=> $stats->getZone(3523),
		"shadowmoon"	=> $stats->getZone(3520),
		"shattrath"		=> $stats->getZone(3703),
	];
	$dungeons = [
		"ramparts"		=> $stats->getZone(3562),
		"furnace"		=> $stats->getZone(3713),
		"shattered"		=> $stats->getZone(3714),
		"slave"			=> $stats->getZone(3717),
		"underbog"		=> $stats->getZone(3716),
		"steamvault"	=> $stats->getZone(3715),
		"crypts"		=> $stats->getZone(3790),
		"sethekk"		=> $stats->getZone(3791),
		"shadow"		=> $stats->getZone(3789),
		"mana"			=> $stats->getZone(3792),
		"hillsbrad"		=> $stats->getZone(2367),
		"morass"		=> $stats->getZone(2366),
		"mechanar"		=> $stats->getZone(3849),
		"arcatraz"		=> $stats->getZone(3848),
		"botanica"		=> $stats->getZone(3847),
	];
	$raids = [
		"Gruul"		=> $stats->getZone(3923),
		"Maggy"		=> $stats->getZone(3836),
		"Karazhan"	=> $stats->getZone(3457),
		"SSC"		=> $stats->getZone(3607),
		"TK"		=> $stats->getZone(3485),
		"HS"		=> $stats->getZone(3606),
		"BT"		=> $stats->getZone(3959),
	];

	return $app['twig']->render('quests/index.html.twig', array(
		"zones" 	=> $zones,
		"dungeons" 	=> $dungeons,
		"raids" 	=> $raids,
	));
});

$app->get('/quests/zone/{zone}', function ($zone) use ($app) {
	$manager	= new SUN\DAO\SunQuestDAO($app);
	$quests		= $manager->getQuests($zone);
	return $app['twig']->render('quests/zone.html.twig', array(
		"quests" => $quests,
	));
})->assert('zone', '\d+');

$app->post('/quests/apply/status', function () use ($app) {
	$quest  = json_decode($_POST['info']);
	$manager= new SUN\DAO\SunQuestDAO($app);
	$manager->setStatus($quest);
	return "Success";
});