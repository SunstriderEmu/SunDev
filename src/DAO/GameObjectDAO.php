<?php

namespace SUN\DAO;

use SUN\Domain\Gameobject;

class GameobjectDAO extends DAO
{
    public function getObject($entry)
    {
        return new Gameobject($this->getDb('test')->fetchAssoc('SELECT * FROM gameobject_template WHERE entry = ?', array($entry)));
    }

    public function findGOEntryName(Gameobject $gameObject)
    {
        $name = $this->getDb('test')->fetchAssoc('SELECT name FROM gameobject_template WHERE entry = ?', array($gameObject->getEntry()));
        $gameObject->setName($name['name']);
        return $gameObject;
    }

    public function findGOGuidName(Gameobject $gameObject)
    {
        $name = $this->getDb('test')->fetchAssoc('SELECT ct.name FROM gameobject c JOIN gameobject_template ct ON ct.entry = c.id WHERE guid = ?', array($gameObject->getEntry()));
        $gameObject->setName($name['name']);
        return $gameObject;
    }

    public function search($name)
    {
        return $this->getDb('test')->fetchAll("SELECT entry, type, name FROM gameobject_template WHERE name LIKE '%{$name}%'");
    }
}