<?php

namespace SUN\DAO;

use SUN\Domain\Tools;
use Doctrine\DBAL\Connection;

class ToolsDAO extends DAO
{
	public function getTCGameobjects($map_id)
	{
		return $this->getDb('trinity')->fetchAll("SELECT * FROM gameobject WHERE map = {$map_id}");
	}
}