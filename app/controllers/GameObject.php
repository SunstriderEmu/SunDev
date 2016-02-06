<?php

use SUN\Domain\Gameobject;

// GameObject Summary
$app->get('/object', function() use($app) {
    return $app['twig']->render('object/index.html.twig');
});

// GameObject Summary
$app->get('/object/entry/{entry}', function($entry) use($app) {
    return $app['twig']->render('object/object.html.twig', array(
        "object"	=> $app['dao.object']->getObject($entry),
    ));
})->assert('entry', '\d+');

// GET GAMEOBJECT ENTRY SCRIPT
$app->get('/object/entry/{entry}/smartai', function($entry) use($app) {
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
$app->get('/object/guid/{guid}/smartai', function($guid) use($app) {
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

$app->get('/object/entry/{entry}/name', function($entry) use($app) {
    $gameobject	= new SUN\Domain\Gameobject(["entry" => $entry]);
    return $app['dao.object']->findGOEntryName($gameobject)->getName();
})->assert('entry', '\d+');

$app->get('/object/guid/{guid}/name', function($guid) use($app) {
    $gameobject	= new SUN\Domain\Gameobject(["guid" => $guid]);
    return $app['dao.object']->findGOGuidName($gameobject)->getName();
})->assert('guid', '\d+');

// Search by name
$app->get('/object/{name}/search', function($name) use($app) {
    return $app->json(json_encode($app['dao.object']->search($name)));
});