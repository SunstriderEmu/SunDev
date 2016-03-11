<?php

// Summary
$app->get('/areatrigger', function() use($app) {
    return $app['twig']->render('areatrigger/index.html.twig');
});

// AreaTrigger
$app->get('/areatrigger/{entry}', function($entry) use($app) {
    return $app['twig']->render('areatrigger/areatrigger.html.twig');
})->assert('entry', '\d+');

// SmartAI
$app->get('/areatrigger/{entry}/smartai', function($entry) use($app) {
    $lines	= $app['dao.smartai']->getAreaTriggerScript($entry);
    return $app['twig']->render('smartai/areatrigger/entry.html.twig',
        array(
            "lines" 	=> $lines,
            "entry" 	=> $entry,
            "events" 	=> $app['dao.smartai']->getEvents(),
            "actions" 	=> $app['dao.smartai']->getActions(),
            "targets" 	=> $app['dao.smartai']->getTargets(),
        ));
})->assert('entry', '\d+');