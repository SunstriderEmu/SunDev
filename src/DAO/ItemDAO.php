<?php

namespace SUN\DAO;

use Doctrine\DBAL\Connection;

class ItemDAO extends DAO
{
	public function getItemName($id)
    {
		$item = $this->getDb('test')->fetchAssoc('SELECT name FROM item_template WHERE entry = ?', array((int) $id));
		return $item['name'];
	}

	public function getItemDisplay($id)
    {
		$item = $this->getDb('test')->fetchAssoc('SELECT displayid FROM item_template WHERE entry = ?', array((int) $id));
		return $item['displayid'];
	}
}