<?php

// API
$app->get('/api', function () use ($app) {
    $classes    = $app['dao.class']->getGlobal();
    $quests     = $app['dao.quest']->getGlobalProgress();
    $dungeons   = $app['dao.dungeon']->getGlobalProgress();
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