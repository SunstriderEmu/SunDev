<?php

$app->get('/creature/entry/{entry}/equip', function ($entry) use ($app) {
	$manager = new \SUN\DAO\EquipDAO($app);
	return $app['twig']->render('equip/index.html.twig', [
		"entry"	=> $entry,
		"equip"	=> $manager->getEquipment($entry),
	]);
});

$app->get('/item/{entry}/displayid', function ($entry) use ($app) {
	$manager	= new \SUN\DAO\SmartAIDAO($app);
	return $manager->getItemDisplay($entry);
});


// APPLY TEST SCRIPT
$app->post('/equip/apply', function() use($app) {
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