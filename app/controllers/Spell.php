<?php

$app->get('/spell', function() use($app) {
    return $app['twig']->render('spell/index.html.twig');
});
// GET NAMES
$app->get('/spell/{name}/search', function($name) use($app) {
    return $app->json(json_encode($app['dao.spell']->search($name)));
});