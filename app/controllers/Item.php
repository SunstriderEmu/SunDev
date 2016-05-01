<?php

// Find item's displayid
$app->get('/item/{entry}/displayid', function ($entry) use ($app) {
	return $app['dao.item']->getItemDisplay($entry);
})->assert('entry', '\d+');

// Find item's name
$app->get('/item/{entry}/name', function ($entry) use ($app) {
    return $app['dao.item']->getItemName($entry);
})->assert('entry', '\d+');