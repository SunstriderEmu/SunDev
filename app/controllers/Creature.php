<?php

use SUN\DAO\CreatureDAO;
use SUN\Domain\Creature;

// Creature Summary
$app->get('/creature', function() use($app) {
    return $app['twig']->render('creature/index.html.twig');
});

// Creature Summary
$app->get('/creature/entry/{entry}', function($entry) use($app) {
    $manager	= new CreatureDAO($app);
    return $app['twig']->render('creature/creature.html.twig', array(
        "creature"	=> $manager->getCreature($entry),
    ));
})->assert('entry', '\d+');

// Creature Summary
$app->get('/creature/entry/{entry}/stats', function($entry) use($app) {
    $manager	= new CreatureDAO($app);
    return $app['twig']->render('creature/stats.html.twig', array(
        "creature"	=> $manager->getCreature($entry)
    ));
})->assert('entry', '\d+');

// Creature Summary
$app->get('/creature/stats/{class}/{level}', function($class, $level) use($app) {
    $manager	= new CreatureDAO($app);
    return $app->json($manager->getStats($class, $level));
})->assert('class', '\d+')->assert('level', '\d+');

// CreatureText
$app->get('/creature/entry/{entry}/text', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    $manager	= new CreatureDAO($app);
    $creature->setName($manager->findCreatureEntryName($creature)->getName());
    return $app['twig']->render('creature/text.html.twig', array(
        "texts" 	=> $manager->getCreatureText($entry),
        "creature"	=> $creature,
    ));
})->assert('entry', '\d+');

// Immunities
$app->get('/creature/entry/{entry}/immune', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    $manager	= new CreatureDAO($app);
    return $app['twig']->render('creature/immunities.html.twig', array(
        "entry"		=> $entry,
        "name"		=> $manager->findCreatureEntryName($creature)->getName(),
        "immunities"=> $manager->getImmunities($entry),
    ));
})->assert('entry', '\d+');

// NPC Flag
$app->get('/creature/entry/{entry}/npcflag', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    $manager	= new CreatureDAO($app);
    return $app['twig']->render('creature/npcflag.html.twig', array(
        "entry"	=> $entry,
        "name"	=> $manager->findCreatureEntryName($creature)->getName(),
        "flag"  => $manager->getNPCFlag($entry),
    ));
})->assert('entry', '\d+');

// Unit Flag
$app->get('/creature/entry/{entry}/unitflag', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    $manager	= new CreatureDAO($app);
    return $app['twig']->render('creature/unitflag.html.twig', array(
        "entry"	=> $entry,
        "name"	=> $manager->findCreatureEntryName($creature)->getName(),
        "flag"  => $manager->getUnitFlag($entry),
    ));
})->assert('entry', '\d+');

// Unit Flag2
$app->get('/creature/entry/{entry}/unitflag2', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    $manager	= new CreatureDAO($app);
    return $app['twig']->render('creature/unitflag2.html.twig', array(
        "entry"	=> $entry,
        "name"	=> $manager->findCreatureEntryName($creature)->getName(),
        "flag"  => $manager->getUnitFlag2($entry),
    ));
})->assert('entry', '\d+');

// Dynamic Flags
$app->get('/creature/entry/{entry}/dynamicflag', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    $manager	= new CreatureDAO($app);
    return $app['twig']->render('creature/dynamicflag.html.twig', array(
        "entry"	=> $entry,
        "name"	=> $manager->findCreatureEntryName($creature)->getName(),
        "flag"  => $manager->getDynamicFlag($entry),
    ));
})->assert('entry', '\d+');

// Type Flags
$app->get('/creature/entry/{entry}/typeflag', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    $manager	= new CreatureDAO($app);
    return $app['twig']->render('creature/typeflag.html.twig', array(
        "entry"	=> $entry,
        "name"	=> $manager->findCreatureEntryName($creature)->getName(),
        "flag"  => $manager->getTypeFlag($entry),
    ));
})->assert('entry', '\d+');

// Flag extra
$app->get('/creature/entry/{entry}/flagextra', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    $manager	= new CreatureDAO($app);
    return $app['twig']->render('creature/flagextra.html.twig', array(
        "entry"	=> $entry,
        "name"	=> $manager->findCreatureEntryName($creature)->getName(),
        "flag"  => $manager->getFlagExtra($entry),
    ));
})->assert('entry', '\d+');

// Gossip
$app->get('/creature/entry/{entry}/gossip', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    $manager	= new CreatureDAO($app);
    $creature = $manager->getCreature($entry);
    $array = [
        "menus"      => [],
    ];
    return $app['twig']->render('creature/gossip.html.twig', array(
        "creature"	=> $creature,
        "gossip"    => $manager->addMenuAndChildren($creature['gossip_menu_id'], $array),
    ));
})->assert('entry', '\d+');

// SmartAI Entry
$app->get('/creature/entry/{entry}/smartai', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    $manager	= new \SUN\DAO\SmartAIDAO($app);
    $manager2   = new CreatureDAO($app);
    $creature->setName($manager2->findCreatureEntryName($creature)->getName());
    $lines		= $manager->getCreatureEntryScript($creature);

    return $app['twig']->render('smartai/creature/entry.html.twig',
        array(
            "lines" 	=> $lines,
            "creature" 	=> $creature,
            "events" 	=> $manager->getEvents(),
            "actions" 	=> $manager->getActions(),
            "targets" 	=> $manager->getTargets(),
        ));
})->assert('entry', '\d+');

// SmartAI Guid
$app->get('/creature/guid/{guid}/smartai', function($guid) use($app) {
    $creature 	= new Creature(["guid" => $guid]);
    $manager	= new \SUN\DAO\SmartAIDAO($app);
    $manager2   = new CreatureDAO($app);
    $lines		= $manager->getCreatureGuidScript($manager2->findCreatureGuidName($creature));

    return $app['twig']->render('smartai/creature/guid.html.twig',
        array(
            "lines" 	=> $lines,
            "creature" 	=> $creature,
            "events" 	=> $manager->getEvents(),
            "actions" 	=> $manager->getActions(),
            "targets" 	=> $manager->getTargets(),
        ));
})->assert('guid', '\d+');

// GET NAMES
$app->get('/creature/entry/{entry}/name', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    $manager	= new CreatureDAO($app);
    return $manager->findCreatureEntryName($creature)->getName();
})->assert('entry', '\d+');

$app->get('/creature/guid/{guid}/name', function($guid) use($app) {
    $creature 	= new Creature(["guid" => $guid]);
    $manager	= new CreatureDAO($app);
    return $manager->findCreatureGuidName($creature)->getName();
})->assert('guid', '\d+');

$app->get('/gameobject/entry/{entry}/name', function($entry) use($app) {
    $gameobject	= new SUN\Domain\Gameobject(["entry" => $entry]);
    $manager	= new \SUN\DAO\SmartAIDAO($app);
    return $manager->findGOEntryName($gameobject)->getName();
})->assert('entry', '\d+');

$app->get('/gameobject/guid/{guid}/name', function($guid) use($app) {
    $gameobject	= new SUN\Domain\Gameobject(["guid" => $guid]);
    $manager	= new \SUN\DAO\SmartAIDAO($app);
    return $manager->findGOGuidName($gameobject)->getName();
})->assert('guid', '\d+');

// GET NAMES
$app->get('/creature/{name}/search', function($name) use($app) {
    return $app->json(json_encode($app['dao.creature']->search($name)));
});