<?php

// VALIDATE SCRIPT
$app->post('/review/edit', function() use($app) {
	if(isset($_POST['sql'])) {
		$script = json_decode($_POST['sql']);
		$manager = new \SUN\DAO\DAO($app);
		if(isset($script->update)) {
			$manager->setQuery($script->update, 'test');
			$manager->setQuery($script->update, 'world');
		}
		if(isset($script->delete)) {
			$manager->setQuery($script->delete, 'test');
			$manager->setQuery($script->delete, 'world');
		}
		if(isset($script->insert)) {
			$manager->setQuery($script->insert, 'test');
			$manager->setQuery($script->insert, 'world');
		}
	}
	$review = json_decode($_POST['review']);
	$manager= new \SUN\DAO\ReviewDAO($app);
	$manager->setReview($review);
	
	return "Success";
});

// SEND REVIEW
$app->post('/review/new', function() use($app) {
	if(isset($_POST['sql'])) {
		$script = json_decode($_POST['sql']);
		$manager = new \SUN\DAO\DAO($app);
		if(isset($script->update)) {
			$manager->setQuery($script->update, 'test');
		}
		if(isset($script->delete)) {
			$manager->setQuery($script->delete, 'test');
		}
		if(isset($script->insert)) {
			$manager->setQuery($script->insert, 'test');
		}
	}
	$script = json_decode($_POST['review']);
	$manager= new \SUN\DAO\ReviewDAO($app);
	$manager->createReview($script);
	return "Success";
});