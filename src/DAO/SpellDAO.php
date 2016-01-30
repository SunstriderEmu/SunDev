<?php

namespace SUN\DAO;

class SpellDAO extends DAO
{
    public function search($name)
    {
        return $this->getDb('test')->fetchAll("SELECT entry, spellName1, rank3 FROM spell_template WHERE spellName1 LIKE '%{$name}%'");
    }
}