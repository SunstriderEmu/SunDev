<?php

$app->get('/smartai', function () use ($app) {
	return $app['twig']->render('smartai/index.html.twig');
});

// SmartAI Tutorial: available entries
$app->get('/smartai/available', function () use ($app) {
	$entry = $app['dao.smartai']->getAvailableEntry() + 1;
	return $app->redirect("/creature/entry/{$entry}/smartai");
});

// SmartAI Script
$app->get('/smartai/script/{script}', function($script) use($app) {
	$creature 	= new SUN\Domain\Creature(["entry" => substr($script, 0, -2)]);
	$creature->setName($app['dao.creature']->findCreatureEntryName($creature)->getName());
	$lines		= $app['dao.smartai']->getScript($script);
	
	return $app['twig']->render('smartai/script/script.html.twig',
		array(
			"lines" 	=> $lines,
			"script"	=> $script,
			"creature" 	=> $creature,
			"events" 	=> $app['dao.smartai']->getEvents(),
			"actions" 	=> $app['dao.smartai']->getActions(),
			"targets" 	=> $app['dao.smartai']->getTargets(),
		));
})->assert('script', '\d+');

// GET EVENTS
$app->get('/smartai/events', function() use($app) {
	return $app['twig']->render('smartai/doc/events.html.twig', array("events" => $app['dao.smartai']->getEvents()));
});

$app->get('/smartai/events/{id}', function($id) use($app) {
	return json_encode($app['dao.smartai']->getEvent($id));
})->assert('id', '\d+');

// GET ACTIONS
$app->get('/smartai/actions', function() use($app) {
	return $app['twig']->render('smartai/doc/actions.html.twig', array("actions" => $app['dao.smartai']->getActions()));
});

$app->get('/smartai/actions/{id}', function($id) use($app) {
	return json_encode($app['dao.smartai']->getAction($id));
})->assert('id', '\d+');

// GET TARGETS
$app->get('/smartai/targets', function() use($app) {
	return $app['twig']->render('smartai/doc/targets.html.twig', array("targets" => $app['dao.smartai']->getTargets()));
});

$app->get('/smartai/targets/{id}', function($id) use($app) {
	return json_encode($app['dao.smartai']->getTarget($id));
})->assert('id', '\d+');