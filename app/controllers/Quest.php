<?php

use Symfony\Component\HttpFoundation\Request;


$app->get('/quest/{name}/search', function($name) use($app) {
    return $app->json(json_encode($app['dao.quest']->search($name)));
});

$app->get('/quest', function() use($app) {
    return $app['twig']->render('quest/index.html.twig');
});

$app->get('/quest/{entry}', function($entry) use($app) {
    $quest = $app['dao.quest']->find($entry);
    return $app['twig']->render('quest/quest.html.twig', array('quest' => $quest));
});