<?php

namespace SUN\DAO;

class SpellDAO extends DAO
{
    public function search($name)
    {
        return $this->getDb('test')->fetchAll("SELECT entry, spellName1, rank3 FROM spell_template WHERE spellName1 LIKE '%{$name}%'");
    }

	public function getSpellName($id)
    {
		$spell = $this->getDb('test')->fetchAssoc('SELECT spellName1 FROM spell_template WHERE entry = ?', array($id));
		return $spell['spellName1'];
	}
}