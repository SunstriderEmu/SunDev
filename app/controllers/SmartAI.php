<?php

$app->get('/smartai', function () use ($app) {
	return $app['twig']->render('smartai/index.html.twig');
});

// SmartAI Tutorial: available entries
$app->get('/smartai/available', function () use ($app) {
	$manager	= new \SUN\DAO\SmartAIDAO($app);
	$entry = $manager->getAvailableEntry() + 1;
	return $app->redirect("/smartai/creature/entry/{$entry}");
});

// SmartAI Script
$app->get('/smartai/script/{script}', function($script) use($app) {
	$creature 	= new SUN\Domain\Creature(["entry" => substr($script, 0, -2)]);
	$manager	= new \SUN\DAO\SmartAIDAO($app);
	$manager2	= new \SUN\DAO\CreatureDAO($app);
	$creature->setName($manager2->findCreatureEntryName($creature)->getName());
	$lines		= $manager->getScript($script);

	return $app['twig']->render('smartai/script/script.html.twig',
		array(
			"lines" 	=> $lines,
			"script"	=> $script,
			"creature" 	=> $creature,
			"events" 	=> $manager->getEvents(),
			"actions" 	=> $manager->getActions(),
			"targets" 	=> $manager->getTargets(),
		));
})->assert('script', '\d+');

// GET EVENTS
$app->get('/smartai/events', function() use($app) {
	$manager	= new \SUN\DAO\SmartAIDAO($app);
	return $app['twig']->render('smartai/doc/events.html.twig', array("events" => $manager->getEvents()));
});

$app->get('/smartai/events/{id}', function($id) use($app) {
	$manager	= new \SUN\DAO\SmartAIDAO($app);
	return json_encode($manager->getEvent($id));
})->assert('id', '\d+');

// GET ACTIONS
$app->get('/smartai/actions', function() use($app) {
	$manager	= new \SUN\DAO\SmartAIDAO($app);
	return $app['twig']->render('smartai/doc/actions.html.twig', array("actions" => $manager->getActions()));
});

$app->get('/smartai/actions/{id}', function($id) use($app) {
	$manager	= new \SUN\DAO\SmartAIDAO($app);
	return json_encode($manager->getAction($id));
})->assert('id', '\d+');

// GET TARGETS
$app->get('/smartai/targets', function() use($app) {
	$manager	= new \SUN\DAO\SmartAIDAO($app);
	return $app['twig']->render('smartai/doc/targets.html.twig', array("targets" => $manager->getTargets()));
});

$app->get('/smartai/targets/{id}', function($id) use($app) {
	$manager	= new \SUN\DAO\SmartAIDAO($app);
	return json_encode($manager->getTarget($id));
})->assert('id', '\d+');