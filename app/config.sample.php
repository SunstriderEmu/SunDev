<?php

/**
 * DEBUG
 */
$app['debug']= false;

/**
 * DATABASE
 */
$app['dbs.options'] = [
    'auth' => [
        'driver'    => 'pdo_mysql',
        'host'      => '127.0.0.1',
        'dbname'    => 'sun_auth',
        'user'      => 'root',
        'password'  => '',
        'charset'   => 'utf8',
        'port'		=> '',
    ],
    'dbc' => [
        'driver'    => 'pdo_mysql',
        'host'      => '127.0.0.1',
        'dbname'    => 'sun_dbc',
        'user'      => 'root',
        'password'  => '',
        'charset'   => 'utf8',
        'port'		=> '',
    ],
    'tools' => [
        'driver'    => 'pdo_mysql',
        'host'      => '127.0.0.1',
        'dbname'    => 'sun_tools',
        'user'      => 'root',
        'password'  => '',
        'charset'   => 'utf8',
        'port'		=> '',
    ],
    'world' => [
        'driver'    => 'pdo_mysql',
        'host'      => '127.0.0.1',
        'dbname'    => 'sun_world',
        'user'      => 'root',
        'password'  => '',
        'charset'   => 'utf8',
        'port'		=> '',
    ],
    'test' => [
        'driver'    => 'pdo_mysql',
        'host'      => '127.0.0.1',
        'dbname'    => 'sun_world',
        'user'      => 'root',
        'password'  => '',
        'charset'   => 'utf8',
        'port'		=> '',
    ],
    'local' => [
        'driver'    => 'pdo_mysql',
        'host'      => '127.0.0.1',
        'dbname'    => 'sun_world',
        'user'      => 'root',
        'password'  => '',
        'charset'   => 'utf8',
        'port'		=> '',
    ],
];