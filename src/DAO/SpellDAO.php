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

	public function getSpellArea($id)
    {
        $sql = 'SELECT sa.spell as entry, st.spellName1 as spellName, sa.area, sa.quest_start, qt1.Title as quest_start_name, sa.quest_end, qt2.Title as quest_end_name, sa.aura_spell, sa.racemask, sa.gender, sa.autocast, sa.quest_start_status, sa.quest_end_status
                FROM spell_area sa
                JOIN spell_template st ON sa.spell = st.entry 
                LEFT JOIN quest_template qt1 ON qt1.entry = sa.quest_start
                LEFT JOIN quest_template qt2 ON qt2.entry = sa.quest_end
                WHERE sa.spell = ?';
        $spell = $this->getDb('test')->fetchAssoc($sql, array($id));
        $area = $this->getDb('dbc')->fetchAssoc('SELECT * FROM dbc_areatable WHERE id = ?', array($spell['area']));
        return [$spell, $area];
    }

    public function getSpellProc($id)
    {
        $sql = 'SELECT spe.entry, st.spellName1 as name, spe.SchoolMask ,spe.SpellFamilyName ,spe.SpellFamilyMask ,spe.procFlags ,spe.procEx ,spe.ppmRate ,spe.CustomChance ,spe.Cooldown
                FROM spell_proc_event spe
                JOIN spell_template st ON spe.entry = st.entry 
                WHERE spe.entry = ?';
        return $this->getDb('test')->fetchAssoc($sql, array($id));
    }
}