<?php

$app->get('/spell', function() use($app) {
    return $app['twig']->render('spell/index.html.twig');
});

// Find spell by name
$app->get('/spell/{name}/search', function($name) use($app) {
    return $app->json(json_encode($app['dao.spell']->search($name)));
});

// Find spell name by entry
$app->get('/spell/{entry}/name', function ($entry) use ($app) {
    return $app['dao.spell']->getSpellName($entry);
})->assert('entry', '\d+');