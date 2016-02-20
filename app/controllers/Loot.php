<?php

$app->get('/loot', function() use($app) {
	return $app['twig']->render('loot/index.html.twig');
});

$app->get('/creature/entry/{id}/loot', function($id) use($app) {
	$loot	= $app['dao.loot']->getCreatureLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->get('/loot/disenchant/{id}', function($id) use($app) {
	$loot	= $app['dao.loot']->getDisenchantLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->get('/loot/fishing/{id}', function($id) use($app) {
	$loot	= $app['dao.loot']->getFishingLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->get('/loot/gameobject/{id}', function($id) use($app) {
	$loot	= $app['dao.loot']->getGOLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->get('/loot/item/{id}', function($id) use($app) {
	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $app['dao.loot']->getItemLoot($id),
		"item" => $app['dao.item']->getItemName($id),
	));
})->assert('id', '\d+');

$app->get('/loot/pickpocket/{id}', function($id) use($app) {
	$loot	= $app['dao.loot']->getPickpocketLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->get('/loot/prospect/{id}', function($id) use($app) {
	$loot	= $app['dao.loot']->getProspectLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
});

$app->get('/loot/questmail/{id}', function($id) use($app) {
	$loot	= $app['dao.loot']->getQuestMailLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->get('/loot/reference/new', function() use($app) {
	$entry	= $app['dao.loot']->getReferenceLastId() + 1;
	var_dump($entry);

	return $app->redirect("/loot/reference/{$entry}");
});

$app->get('/loot/reference/{id}', function($id) use($app) {
	$loot	= $app['dao.loot']->getReferenceLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->get('/loot/skinning/{id}', function($id) use($app) {
	$loot	= $app['dao.loot']->getSkinningLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');