<?php

/**
 * DEBUG
 */
$app['debug']= false;
$app['monolog.level'] = 'WARNING';

/**
 * DATABASE
 */
$app['dbs.options'] = [
    'dbc' => [
        'driver'    => 'pdo_mysql',
        'host'      => '127.0.0.1',
        'dbname'    => 'dbc',
        'user'      => 'root',
        'password'  => '',
        'charset'   => 'utf8',
        'port'		=> '',
    ],
    'suntools' => [
        'driver'    => 'pdo_mysql',
        'host'      => '127.0.0.1',
        'dbname'    => 'suntools',
        'user'      => 'root',
        'password'  => '',
        'charset'   => 'utf8',
        'port'		=> '',
    ],
    'world' => [
        'driver'    => 'pdo_mysql',
        'host'      => '127.0.0.1',
        'dbname'    => 'world',
        'user'      => 'root',
        'password'  => '',
        'charset'   => 'utf8',
        'port'		=> '',
    ],
    'test_world' => [
        'driver'    => 'pdo_mysql',
        'host'      => '127.0.0.1',
        'dbname'    => 'world',
        'user'      => 'root',
        'password'  => '',
        'charset'   => 'utf8',
        'port'		=> '',
    ],
];