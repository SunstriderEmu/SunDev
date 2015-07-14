<?php

$app->get('/loot', function() use($app) {
	return $app['twig']->render('loot/index.html.twig');
});

$app->get('/loot/creature/{id}', function($id) use($app) {
	$manager= new \SUN\DAO\LootDAO($app);
	$loot	= $manager->getCreatureLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->get('/loot/disenchant/{id}', function($id) use($app) {
	$manager= new \SUN\DAO\LootDAO($app);
	$loot	= $manager->getDisenchantLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->get('/loot/fishing/{id}', function($id) use($app) {
	$manager= new \SUN\DAO\LootDAO($app);
	$loot	= $manager->getFishingLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->get('/loot/gameobject/{id}', function($id) use($app) {
	$manager= new \SUN\DAO\LootDAO($app);
	$loot	= $manager->getGOLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->get('/loot/item/{id}', function($id) use($app) {
	$manager= new \SUN\DAO\LootDAO($app);
	$loot	= $manager->getItemLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->get('/loot/pickpocket/{id}', function($id) use($app) {
	$manager= new \SUN\DAO\LootDAO($app);
	$loot	= $manager->getPickpocketLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->get('/loot/prospect/{id}', function($id) use($app) {
	$manager= new \SUN\DAO\LootDAO($app);
	$loot	= $manager->getProspectLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
});

$app->get('/loot/questmail/{id}', function($id) use($app) {
	$manager= new \SUN\DAO\LootDAO($app);
	$loot	= $manager->getQuestMailLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->get('/loot/reference/{id}', function($id) use($app) {
	$manager= new \SUN\DAO\LootDAO($app);
	$loot	= $manager->getReferenceLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
});

$app->get('/loot/skinning/{id}', function($id) use($app) {
	$manager= new \SUN\DAO\LootDAO($app);
	$loot	= $manager->getSkinningLoot($id);

	return $app['twig']->render('loot/loot.html.twig', array(
		"loot" => $loot,
	));
})->assert('id', '\d+');

$app->post('/loot/apply', function() use($app) {
	$script = json_decode($_POST['sql']);
	$manager= new \SUN\DAO\DAO($app);
	if(isset($script->update)) {
		$manager->setQuery($script->update, 'test');
	}
	if(isset($script->delete)) {
		$manager->setQuery($script->delete, 'test');
	}
	if(isset($script->insert)) {
		$manager->setQuery($script->insert, 'test');
	}
	return "Success";
});