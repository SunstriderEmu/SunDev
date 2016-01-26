<?php

// API
$app->get('/api', function () use ($app) {
    $classes    = $app['dao.classes']->getGlobal();
    $quests     = $app['dao.quests']->getGlobalProgress();
    $dungeons   = $app['dao.dungeons']->getGlobalProgress();
    $data = [
        'classes'   => [
            'bugged'    => $classes->getBugged() / $classes->getTotal() * 100,
            'success'   => $classes->getSuccess() / $classes->getTotal() * 100,
        ],
        'quests'    => [
            'bugged'    => $quests->getBugged() / ($quests->getTotal() * 14) * 100,
            'working'   => $quests->getWorking() / ($quests->getTotal() * 14) * 100,
            'success'   => ($quests->getSuccess() + $quests->getNo()) / ($quests->getTotal() * 14) * 100,
        ],
        'dungeons'  => [
            'bugged'    => $dungeons->getBugged() / $dungeons->getTotal() * 100,
            'working'   => $dungeons->getWorking() / $dungeons->getTotal() * 100,
            'success'   => $dungeons->getSuccess() / $dungeons->getTotal() * 100,
        ],
        'security'  => 0,
        'charge'    => 0,
    ];
    return $app->json($data);
});

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