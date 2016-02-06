<?php

use Symfony\Component\HttpFoundation\Request;

$app->get('/', function() use($app) {
	return $app['twig']->render('index.html.twig', array(
		"myreviews" => $app['dao.review']->getUserReviews(0, 7),
		"wip" 		=> $app['dao.review']->getWIP(),
		"reviews" 	=> $app['dao.review']->getReviews(),
	));
});

$app->get('/login', function(Request $request) use ($app) {
	return $app['twig']->render('auth/login.html.twig', array(
		'error'         => $app['security.last_error']($request),
		'last_username' => $app['session']->get('_security.last_username'),
	));
})->bind('login');