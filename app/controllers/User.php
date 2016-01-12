<?php

use Symfony\Component\HttpFoundation\Request;
use SUN\Domain\User;
use SUN\Form\Type\UserAdd;
use SUN\Form\Type\UserEdit;

// Login
$app->get('/login', function(Request $request) use ($app) {
	return $app['twig']->render('auth/login.html.twig', array(
		'error'         => $app['security.last_error']($request),
		'last_username' => $app['session']->get('_security.last_username'),
	));
})->bind('login');

// Users
$app->get('/user', function() use ($app) {
	return $app['twig']->render('user/user.html.twig', array(
		'users' => $app['dao.user']->findAll(),
	));
});

// Add a user
$app->match('/user/add', function(Request $request) use ($app) {
	$form = $app['form.factory']->create(new UserAdd());

	$form->handleRequest($request);
	if ($form->isValid()) {
		$user = new User($form->getData());
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
	return $app['twig']->render('user/user_add_form.html.twig', array(
		'title' => 'New user',
		'userForm' => $form->createView()
	));
});

// Edit an existing user
$app->match('/user/{id}/edit', function($id, Request $request) use ($app) {
	$user = $app['dao.user']->find($id);
	$userForm = $app['form.factory']->create(new UserEdit(), $user);
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
	return $app['twig']->render('user/user_edit_form.html.twig', array(
		'title' => 'Edit user',
		'userForm' => $userForm->createView()));
});

// Remove a user
$app->get('/user/{id}/delete', function($id, Request $request) use ($app) {
	$app['dao.user']->delete($id);
	$app['session']->getFlashBag()->add('success', 'The user was succesfully removed.');
	return $app->redirect('/user');
});