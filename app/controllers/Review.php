<?php

/**
 * Development: Apply on test realm
 */
$app->post('/dev/apply', function() use($app) {
	// Check if there is an AJAX request, if the $_POST values exists and if the ROLE_DEV is granted
	if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest' && !isset($_POST['sql']) && !isset($_POST['info']) && !$app['security.authorization_checker']->isGranted('ROLE_DEV'))
		throw new \Symfony\Component\Config\Definition\Exception\Exception;

	$data['script'] = json_decode($_POST['sql']);
	$data['review'] = json_decode($_POST['info']);

	$manager = new \SUN\DAO\DAO($app);
	$manager->setScript($data, 'test');
	$manager = new \SUN\DAO\ReviewDAO($app);
	$data['review']->state = -1;
	$data['review']->user = $app['security.token_storage']->getToken()->getUser()->getId();
	$manager->createReview($data['review']);

	return "Script applied on test";
});


/**
 * Development: Send a review
 */
$app->post('/dev/review', function() use($app) {
	// Check if there is an AJAX request, if the $_POST values exists and if the ROLE_DEV is granted
	if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest' && !isset($_POST['sql']) && !isset($_POST['info']) && !$app['security.authorization_checker']->isGranted('ROLE_DEV'))
		throw new \Symfony\Component\Config\Definition\Exception\Exception;

	$data['script'] = json_decode($_POST['sql']);
	$data['review'] = json_decode($_POST['info']);

	$manager = new \SUN\DAO\ReviewDAO($app);
	$data['review']->state = 0;
	$data['review']->user = $app['security.token_storage']->getToken()->getUser()->getId();
	$manager->createReview($data['review']);

	$manager = new \SUN\DAO\DAO($app);

	$manager->setScript($data, 'test');
	return "New review sent";
});

/**
 * Admin: Validate a review, apply on test and live realm
 */
$app->post('/dev/validate', function() use($app) {
	if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest' && !isset($_POST['sql']) && !isset($_POST['info']) && !$app['security.authorization_checker']->isGranted('ROLE_ADMIN'))
		throw new \Symfony\Component\Config\Definition\Exception\Exception;

	$data['script'] = json_decode($_POST['sql']);
	$data['review'] = json_decode($_POST['info']);

	$manager = new \SUN\DAO\DAO($app);
	$manager->setScript($data, 'test');
	$manager->setScript($data, 'world');
	$manager = new \SUN\DAO\ReviewDAO($app);
	$data['review']->state = 1;
	$data['review']->validation_user = $app['security.token_storage']->getToken()->getUser()->getId();
	$manager->updateReview($data['review']);

	return "Review accepted";
});

/**
 * Admin: Refuse a review, apply on test realm
 */
$app->post('/dev/refuse', function() use($app) {
	if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest' && !isset($_POST['sql']) && !isset($_POST['info']) && !$app['security.authorization_checker']->isGranted('ROLE_ADMIN'))
		throw new \Symfony\Component\Config\Definition\Exception\Exception;

	$data['script'] = json_decode($_POST['sql']);
	$data['review'] = json_decode($_POST['info']);

	$manager = new \SUN\DAO\DAO($app);
	$manager->setScript($data, 'test');
	$manager = new \SUN\DAO\ReviewDAO($app);
	$data['review']->state = 2;
	$data['review']->validation_user = $app['security.token_storage']->getToken()->getUser()->getId();
	$manager->updateReview($data['review']);

	return "Review refused";
});