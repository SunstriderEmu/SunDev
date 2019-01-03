<?php

$app->get('/condition', function() use($app) {
    return $app['twig']->render('condition/index.html.twig');
});

$app->get('/condition/add', function() use($app) {
    return $app['twig']->render('condition/add.html.twig');
});

$app->get('/condition/search/{id}', function($id) use($app) {
    return json_encode($app['dao.condition']->search(intval($id)));
});
