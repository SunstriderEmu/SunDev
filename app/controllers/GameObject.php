<?php

// GET GAMEOBJECT ENTRY SCRIPT
$app->get('/object/entry/{entry}/smartai', function($entry) use($app) {
    $go		 	= new SUN\Domain\Gameobject(["entry" => $entry]);
    $manager	= new \SUN\DAO\SmartAIDAO($app);
    $manager2	= new \SUN\DAO\GameobjectDAO($app);
    $go->setName($manager2->findGOEntryName($go)->getName());
    $lines		= $manager->getGOEntryScript($go);

    return $app['twig']->render('smartai/go/entry.html.twig',
        array(
            "lines" 	=> $lines,
            "go" 		=> $go,
            "events" 	=> $manager->getEvents(),
            "actions" 	=> $manager->getActions(),
            "targets" 	=> $manager->getTargets(),
        ));
})->assert('entry', '\d+');

// GET GAMEOBJECT GUID SCRIPT
$app->get('/object/guid/{guid}/smartai', function($guid) use($app) {
    $go		 	= new SUN\Domain\Gameobject(["guid" => $guid]);
    $manager	= new \SUN\DAO\SmartAIDAO($app);
    $manager2	= new \SUN\DAO\GameobjectDAO($app);
    $go->setName($manager2->findGOEntryName($go)->getName());
    $lines		= $manager->getGOGuidScript($go);

    return $app['twig']->render('smartai/go/guid.html.twig',
        array(
            "lines" 	=> $lines,
            "go" 		=> $go,
            "events" 	=> $manager->getEvents(),
            "actions" 	=> $manager->getActions(),
            "targets" 	=> $manager->getTargets(),
        ));
})->assert('guid', '\d+');