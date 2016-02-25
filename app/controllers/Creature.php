<?php

use SUN\DAO\CreatureDAO;
use SUN\Domain\Creature;

// Creature Summary
$app->get('/creature', function() use($app) {
    return $app['twig']->render('creature/index.html.twig');
});

// Creature Summary
$app->get('/creature/entry/{entry}', function($entry) use($app) {
    return $app['twig']->render('creature/creature.html.twig', array(
        "creature"	=> $app['dao.creature']->getCreature($entry),
    ));
})->assert('entry', '\d+');

// Creature Summary
$app->get('/creature/entry/{entry}/stats', function($entry) use($app) {
    return $app['twig']->render('creature/stats.html.twig', array(
        "creature"	=> $app['dao.creature']->getCreature($entry)
    ));
})->assert('entry', '\d+');

// Creature Summary
$app->get('/creature/stats/{class}/{level}', function($class, $level) use($app) {
    return $app->json($app['dao.creature']->getStats($class, $level));
})->assert('class', '\d+')->assert('level', '\d+');

// CreatureText
$app->get('/creature/entry/{entry}/text', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    $creature->setName($app['dao.creature']->findCreatureEntryName($creature)->getName());
    return $app['twig']->render('creature/text.html.twig', array(
        "texts" 	=> $app['dao.creature']->getCreatureText($entry),
        "creature"	=> $creature,
    ));
})->assert('entry', '\d+');

// Immunities
$app->get('/creature/entry/{entry}/immune', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    return $app['twig']->render('creature/immunities.html.twig', array(
        "entry"		=> $entry,
        "creature"	=> array('name' => $app['dao.creature']->findCreatureEntryName($creature)->getName()),
        "immunities"=> $app['dao.creature']->getImmunities($entry),
    ));
})->assert('entry', '\d+');

// NPC Flag
$app->get('/creature/entry/{entry}/npcflag', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    return $app['twig']->render('creature/npcflag.html.twig', array(
        "entry"	=> $entry,
        "creature"	=> array('name' => $app['dao.creature']->findCreatureEntryName($creature)->getName()),
        "flag"  => $app['dao.creature']->getNPCFlag($entry),
    ));
})->assert('entry', '\d+');

// Unit Flag
$app->get('/creature/entry/{entry}/unitflag', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    return $app['twig']->render('creature/unitflag.html.twig', array(
        "entry"	=> $entry,
        "creature"	=> array('name' => $app['dao.creature']->findCreatureEntryName($creature)->getName()),
        "flag"  => $app['dao.creature']->getUnitFlag($entry),
    ));
})->assert('entry', '\d+');

// Unit Flag2
$app->get('/creature/entry/{entry}/unitflag2', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    return $app['twig']->render('creature/unitflag2.html.twig', array(
        "entry"	=> $entry,
        "creature"	=> array('name' => $app['dao.creature']->findCreatureEntryName($creature)->getName()),
        "flag"  => $app['dao.creature']->getUnitFlag2($entry),
    ));
})->assert('entry', '\d+');

// Dynamic Flags
$app->get('/creature/entry/{entry}/dynamicflag', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    return $app['twig']->render('creature/dynamicflag.html.twig', array(
        "entry"	=> $entry,
        "creature"	=> array('name' => $app['dao.creature']->findCreatureEntryName($creature)->getName()),
        "flag"  => $app['dao.creature']->getDynamicFlag($entry),
    ));
})->assert('entry', '\d+');

// Type Flags
$app->get('/creature/entry/{entry}/typeflag', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    return $app['twig']->render('creature/typeflag.html.twig', array(
        "entry"	=> $entry,
        "creature"	=> array('name' => $app['dao.creature']->findCreatureEntryName($creature)->getName()),
        "flag"  => $app['dao.creature']->getTypeFlag($entry),
    ));
})->assert('entry', '\d+');

// Flag extra
$app->get('/creature/entry/{entry}/flagextra', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    return $app['twig']->render('creature/flagextra.html.twig', array(
        "entry"	=> $entry,
        "creature"	=> array('name' => $app['dao.creature']->findCreatureEntryName($creature)->getName()),
        "flag"  => $app['dao.creature']->getFlagExtra($entry),
    ));
})->assert('entry', '\d+');

// Equip
$app->get('/creature/entry/{entry}/equip', function ($entry) use ($app) {
    $creature 	= new Creature(["entry" => $entry]);
	return $app['twig']->render('creature/equip.html.twig', [
		"entry"	=> $entry,
        "creature"	=> array('name' => $app['dao.creature']->findCreatureEntryName($creature)->getName()),
		"equip"	=> $app['dao.creature']->getEquipment($entry),
	]);
});

// Gossip
$app->get('/creature/entry/{entry}/gossip', function($entry) use($app) {
    $creature = $app['dao.creature']->getCreature($entry);
    $array = [
        "menus"      => [],
    ];
    return $app['twig']->render('creature/gossip.html.twig', array(
        "creature"	=> $creature,
        "gossip"    => $app['dao.creature']->addMenuAndChildren($creature['gossip_menu_id'], $array),
    ));
})->assert('entry', '\d+');

// SmartAI Entry
$app->get('/creature/entry/{entry}/smartai', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    $creature->setName($app['dao.creature']->findCreatureEntryName($creature)->getName());
    $lines		= $app['dao.smartai']->getCreatureEntryScript($creature);

    return $app['twig']->render('smartai/creature/entry.html.twig',
        array(
            "lines" 	=> $lines,
            "creature" 	=> $creature,
            "events" 	=> $app['dao.smartai']->getEvents(),
            "actions" 	=> $app['dao.smartai']->getActions(),
            "targets" 	=> $app['dao.smartai']->getTargets(),
        ));
})->assert('entry', '\d+');

// SmartAI Guid
$app->get('/creature/guid/{guid}/smartai', function($guid) use($app) {
    $creature 	= new Creature(["guid" => $guid]);
    $lines		= $app['dao.smartai']->getCreatureGuidScript($app['dao.creature']->findCreatureGuidName($creature));

    return $app['twig']->render('smartai/creature/guid.html.twig',
        array(
            "lines" 	=> $lines,
            "creature" 	=> $creature,
            "events" 	=> $app['dao.smartai']->getEvents(),
            "actions" 	=> $app['dao.smartai']->getActions(),
            "targets" 	=> $app['dao.smartai']->getTargets(),
        ));
})->assert('guid', '\d+');

// GET NAMES
$app->get('/creature/entry/{entry}/name', function($entry) use($app) {
    $creature 	= new Creature(["entry" => $entry]);
    return $app['dao.creature']->findCreatureEntryName($creature)->getName();
})->assert('entry', '\d+');

$app->get('/creature/guid/{guid}/name', function($guid) use($app) {
    $creature 	= new Creature(["guid" => $guid]);
    return $app['dao.creature']->findCreatureGuidName($creature)->getName();
})->assert('guid', '\d+');

// GET NAMES
$app->get('/creature/{name}/search', function($name) use($app) {
    return $app->json(json_encode($app['dao.creature']->search($name)));
});