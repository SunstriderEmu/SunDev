<?php

use Symfony\Component\HttpFoundation\Request;
use SUN\Domain\User;
use SUN\Form\Type\UserType;

// Users
$app->get('/admin/user', function() use ($app) {
	return $app['twig']->render('user.html.twig', array(
		'users' => $app['dao.user']->findAll(),
	));
});

// Add a user
$app->match('/admin/user/add', function(Request $request) use ($app) {
	$user = new User();
	$userForm = $app['form.factory']->create(new UserType(), $user);

	$userForm->handleRequest($request);
	if ($userForm->isSubmitted() && $userForm->isValid()) {
		// generate a random salt value
		$salt = substr(md5(time()), 0, 23);
		$user->setSalt($salt);
		$plainPassword = $user->getPassword();
		// find the default encoder
		$encoder = $app['security.encoder.digest'];
		// compute the encoded password
		$password = $encoder->encodePassword($plainPassword, $user->getSalt());
		$user->setPassword($password);
		$app['dao.user']->save($user);
		$app['session']->getFlashBag()->add('success', 'The user was successfully created.');
	}
	return $app['twig']->render('user_form.html.twig', array(
		'title' => 'New user',
		'userForm' => $userForm->createView()
	));
});

// Edit an existing user
$app->match('/admin/user/{id}/edit', function($id, Request $request) use ($app) {
	$user = $app['dao.user']->find($id);
	$userForm = $app['form.factory']->create(new UserType(), $user);
	$userForm->handleRequest($request);
	if ($userForm->isSubmitted() && $userForm->isValid()) {
		$plainPassword = $user->getPassword();
		// find the encoder for the user
		$encoder = $app['security.encoder_factory']->getEncoder($user);
		// compute the encoded password
		$password = $encoder->encodePassword($plainPassword, $user->getSalt());
		$user->setPassword($password);
		$app['dao.user']->save($user);
		$app['session']->getFlashBag()->add('success', 'The user was succesfully updated.');
	}
	return $app['twig']->render('user_form.html.twig', array(
		'title' => 'Edit user',
		'userForm' => $userForm->createView()));
});

// Remove a user
$app->get('/admin/user/{id}/delete', function($id, Request $request) use ($app) {
	$app['dao.user']->delete($id);
	$app['session']->getFlashBag()->add('success', 'The user was succesfully removed.');
	return $app->redirect('/admin/userm');
});