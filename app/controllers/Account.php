<?php

use Symfony\Component\HttpFoundation\Request;
use SUN\Domain\User;
use SUN\Form\Type\AccountAdd;
use SUN\Form\Type\AccountEdit;

// Accounts
$app->get('/account', function() use ($app) {
    $accounts = $app['dbs']['auth']->fetchAll('SELECT a.id, username, gmlevel FROM account a JOIN account_access ac ON a.id = ac.id LIMIT 0, 100');
    return $app['twig']->render('account/account.html.twig', array(
        'accounts' => $accounts,
    ));
});

// Add an account
$app->match('/account/add', function(Request $request) use ($app) {
    $form = $app['form.factory']->create(new AccountAdd());

    $form->handleRequest($request);
    if ($form->isValid()) {
        $account = $form->getData();
        $accountData = [
            'username'      => strtoupper($account['username']),
            'sha_pass_hash' => sha1(strtoupper($account['username']).':'.strtoupper($account['password'])),
        ];
        $app['dbs']['auth']->insert('account', $accountData);
        if($account['access'] > 0) {
            $id = $app['dbs']['auth']->fetchAssoc('SELECT id FROM account WHERE username = ?', array(strtoupper($account['username'])));
            $accessData = [
                'id'        => $id['id'],
                'gmlevel'   => $account['access']
            ];
            $app['dbs']['auth']->insert('account_access', $accessData);
        }
        $app['session']->getFlashBag()->add('success', 'The user was successfully created.');
    }
    return $app['twig']->render('account/account_add_form.html.twig', array(
        'title' => 'New account',
        'form' => $form->createView()
    ));
});

// Edit an existing account
$app->match('/account/{id}/edit', function($id, Request $request) use ($app) {
    $account = $app['dbs']['auth']->fetchAssoc('SELECT username, gmlevel FROM account a JOIN account_access ac ON a.id = ac.id WHERE a.id = ?', array($id));
    $form = $app['form.factory']->create(new AccountEdit(), $account);
    $form->handleRequest($request);
    if ($form->isValid()) {
        $access = $form->getData();
        $access = [ 'gmlevel' => $access['gmlevel'] ];

        $app['dbs']['auth']->update('account_access', $access, array('id' => $id));
        $app['session']->getFlashBag()->add('success', 'The user was successfully updated.');
    }
    return $app['twig']->render('account/account_edit_form.html.twig', array(
        'title' => 'Edit account',
        'form' => $form->createView()));
});

// Remove an account
$app->get('/account/{id}/delete', function($id) use ($app) {
    $app['dbs']['auth']->delete('account', array('id' => $id));
    $app['dbs']['auth']->delete('account_access', array('id' => $id));
    $app['session']->getFlashBag()->add('success', 'The user was succesfully removed.');
    return $app->redirect('/account');
});