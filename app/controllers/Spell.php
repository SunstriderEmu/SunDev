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

// spell_area
$app->get('/spell/{id}/area', function($id) use($app) {
    $info = $app['dao.spell']->getSpellArea($id);
    return $app['twig']->render('spell/area.html.twig', array(
            'spell' => $info[0],
            'area'  => $info[1],
    ));
})->assert('id', '\d+');

// spell_proc_event
$app->get('/spell/{id}/proc', function($id) use($app) {
    $spell = $app['dao.spell']->getSpellProc($id);
    return $app['twig']->render('spell/proc.html.twig', array(
            'spell' => $spell,
    ));
})->assert('id', '\d+');