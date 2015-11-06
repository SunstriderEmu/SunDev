<?php

// GET SPELL NAME
$app->get('/spell/{entry}/name', function ($entry) use ($app) {
    $manager	= new \SUN\DAO\SmartAIDAO($app);
    return $manager->getSpellName($entry);
})->assert('entry', '\d+');

// GET QUEST NAME
$app->get('/quest/{entry}/name', function ($entry) use ($app) {
    $manager	= new \SUN\DAO\SmartAIDAO($app);
    return $manager->getQuestName($entry);
})->assert('entry', '\d+');

// GET ITEM NAME
$app->get('/item/{entry}/name', function ($entry) use ($app) {
    $manager	= new \SUN\DAO\SmartAIDAO($app);
    return $manager->getItemName($entry);
})->assert('entry', '\d+');