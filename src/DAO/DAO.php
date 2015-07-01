<?php

namespace SUN\DAO;

class DAO {
	protected $app;
	protected $dbc;
	protected $world;
	protected $tools;

	/**
	 * @param \Silex\Application $app
	 */
	public function __construct(\Silex\Application $app)
	{
		$this->app = $app;
		$this->dbc = $app['dbs']['dbc'];
		$this->world = $app['dbs']['world'];
		$this->tools = $app['dbs']['suntools'];
	}
} 