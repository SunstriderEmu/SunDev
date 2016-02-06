<?php

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