<?php

use SUN\Domain\Gameobject;

// GameObject Summary
$app->get('/gameobject', function() use($app) {
    return $app['twig']->render('gameobject/index.html.twig');
});

// GameObject Summary
$app->get('/gameobject/entry/{entry}', function($entry) use($app) {
    return $app['twig']->render('gameobject/gameobject.html.twig', array(
        "object"	=> $app['dao.object']->getObject($entry),
    ));
})->assert('entry', '\d+');

// GET GAMEOBJECT ENTRY SCRIPT
$app->get('/gameobject/entry/{entry}/smartai', function($entry) use($app) {
    $go		 	= new SUN\Domain\Gameobject(["entry" => $entry]);
    $go->setName($app['dao.object']->findGOEntryName($go)->getName());
    $lines		= $app['dao.smartai']->getGOEntryScript($go);

    return $app['twig']->render('smartai/go/entry.html.twig',
        array(
            "lines" 	=> $lines,
            "go" 		=> $go,
            "events" 	=> $app['dao.smartai']->getEvents(),
            "actions" 	=> $app['dao.smartai']->getActions(),
            "targets" 	=> $app['dao.smartai']->getTargets(),
        ));
})->assert('entry', '\d+');

// GET GAMEOBJECT GUID SCRIPT
$app->get('/gameobject/guid/{guid}/smartai', function($guid) use($app) {
    $go		 	= new SUN\Domain\Gameobject(["guid" => $guid]);
    $go->setName($app['dao.object']->findGOEntryName($go)->getName());
    $lines		= $app['dao.smartai']->getGOGuidScript($go);

    return $app['twig']->render('smartai/go/guid.html.twig',
        array(
            "lines" 	=> $lines,
            "go" 		=> $go,
            "events" 	=> $app['dao.smartai']->getEvents(),
            "actions" 	=> $app['dao.smartai']->getActions(),
            "targets" 	=> $app['dao.smartai']->getTargets(),
        ));
})->assert('guid', '\d+');

$app->get('/gameobject/entry/{entry}/name', function($entry) use($app) {
    $gameobject	= new SUN\Domain\Gameobject(["entry" => $entry]);
    return $app['dao.object']->findGOEntryName($gameobject)->getName();
})->assert('entry', '\d+');

$app->get('/gameobject/guid/{guid}/name', function($guid) use($app) {
    $gameobject	= new SUN\Domain\Gameobject(["guid" => $guid]);
    return $app['dao.object']->findGOGuidName($gameobject)->getName();
})->assert('guid', '\d+');

// Search by name
$app->get('/gameobject/{name}/search', function($name) use($app) {
    return $app->json(json_encode($app['dao.object']->search($name)));
});