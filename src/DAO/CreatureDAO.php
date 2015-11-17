<?php

namespace SUN\DAO;

use SUN\Domain\Creature;
use SUN\Domain\Text;

class CreatureDAO extends DAO {
    public function getCreature($entry) {
        $creature = $this->test->fetchAssoc('SELECT * from creature_template WHERE entry = ?', array($entry));
        $minStats = $this->test->fetchAssoc('SELECT * from creature_classlevelstats WHERE class = ? AND level = ?', array($creature['unit_class'], $creature['minlevel']));
        $maxStats = $this->test->fetchAssoc('SELECT * from creature_classlevelstats WHERE class = ? AND level = ?', array($creature['unit_class'], $creature['maxlevel']));

        $total = $this->test->fetchAssoc('SELECT COUNT(*) as count, map from creature WHERE id = ?', array($entry));
        $creature['total'] = $total['count'];

        $zone = $this->dbc->fetchAssoc('SELECT name FROM dbc_areatable WHERE ref_map = ?', array($total['map']));
        $creature['zone'] = $zone['name'];

        $creature['texts'] = $this->test->fetchAll('SELECT text, type FROM creature_text WHERE entry = ?', array($entry));

        $creature['minhp'] = $creature['HealthModifier'] * $minStats["basehp{$creature['exp']}"];
        $creature['minmp'] = $creature['ManaModifier'] * $minStats["basemana"];
        $creature['minarmor'] = $creature['ArmorModifier'] * $minStats["basearmor"];

        if($creature['minlevel'] != $creature['maxlevel']) {
            $creature['maxhp'] = $creature['HealthModifier'] * $maxStats["basehp{$creature['exp']}"];
            $creature['maxmp'] = $creature['ManaModifier'] * $maxStats["basemana"];
            $creature['maxarmor'] = $creature['ArmorModifier'] * $maxStats["basearmor"];
        }

        if($creature['exp'] != 0)
            $base_damage = "damage_exp{$creature['exp']}";
        else
            $base_damage = "damage_base";

        $creature['melee']['minlevel']['base']  = $creature['DamageModifier'] * $minStats[$base_damage];
        $creature['melee']['minlevel']['ap']    = $creature['DamageModifier'] * ($minStats['attackpower'] / 14) * ($creature['BaseAttackTime'] / 1000);
        $creature['melee']['minlevel']['min']   = $creature['DamageModifier'] * ($minStats[$base_damage] + ($minStats['attackpower'] / 14) * ($creature['BaseAttackTime'] / 1000));
        $creature['melee']['minlevel']['max']   = $creature['DamageModifier'] * ($minStats[$base_damage] + ($minStats['attackpower'] / 14) * ($creature['BaseAttackTime'] / 1000)) * (1 + $creature['BaseVariance']);
        $creature['melee']['minlevel']['avg']   = ($creature['melee']['minlevel']['min'] + $creature['melee']['minlevel']['max']) / 2 / ($creature['BaseAttackTime'] / 1000);

        $creature['ranged']['minlevel']['base']  = $creature['DamageModifier'] * $minStats[$base_damage];
        $creature['ranged']['minlevel']['ap']    = $creature['DamageModifier'] * ($minStats['rangedattackpower'] / 14) * ($creature['RangeAttackTime'] / 1000);
        $creature['ranged']['minlevel']['min']   = $creature['DamageModifier'] * ($minStats[$base_damage] + ($minStats['rangedattackpower'] / 14) * ($creature['RangeAttackTime'] / 1000));
        $creature['ranged']['minlevel']['max']   = $creature['DamageModifier'] * ($minStats[$base_damage] + ($minStats['rangedattackpower'] / 14) * ($creature['RangeAttackTime'] / 1000)) * (1 + $creature['RangeVariance']);
        $creature['ranged']['minlevel']['avg']   = ($creature['ranged']['minlevel']['min'] + $creature['ranged']['minlevel']['max']) / 2 / ($creature['RangeAttackTime'] / 1000);

        if($creature['minlevel'] != $creature['maxlevel']) {
            $creature['melee']['maxlevel']['base']  = $creature['DamageModifier'] * $maxStats[$base_damage];
            $creature['melee']['maxlevel']['ap']    = $creature['DamageModifier'] * ($maxStats['attackpower'] / 14) * ($creature['BaseAttackTime'] / 1000);
            $creature['melee']['maxlevel']['min']   = $creature['DamageModifier'] * ($maxStats[$base_damage] + ($maxStats['attackpower'] / 14) * ($creature['BaseAttackTime'] / 1000));
            $creature['melee']['maxlevel']['max']   = $creature['DamageModifier'] * ($maxStats[$base_damage] + ($maxStats['attackpower'] / 14) * ($creature['BaseAttackTime'] / 1000)) * (1 + $creature['BaseVariance']);
            $creature['melee']['maxlevel']['avg']   = ($creature['melee']['maxlevel']['min'] + $creature['melee']['maxlevel']['max']) / 2 / ($creature['BaseAttackTime'] / 1000);

            $creature['ranged']['maxlevel']['base']  = $creature['DamageModifier'] * $maxStats[$base_damage];
            $creature['ranged']['maxlevel']['ap']    = $creature['DamageModifier'] * ($maxStats['rangedattackpower'] / 14) * ($creature['RangeAttackTime'] / 1000);
            $creature['ranged']['maxlevel']['min']   = $creature['DamageModifier'] * ($maxStats[$base_damage] + ($maxStats['rangedattackpower'] / 14) * ($creature['RangeAttackTime'] / 1000));
            $creature['ranged']['maxlevel']['max']   = $creature['DamageModifier'] * ($maxStats[$base_damage] + ($maxStats['rangedattackpower'] / 14) * ($creature['RangeAttackTime'] / 1000)) * (1 + $creature['RangeVariance']);
            $creature['ranged']['maxlevel']['avg']   = ($creature['ranged']['maxlevel']['min'] + $creature['ranged']['maxlevel']['max']) / 2 / ($creature['RangeAttackTime'] / 1000);
        }
        return $creature;
    }

    public function getStats($class, $level) {
        return $this->test->fetchAssoc('SELECT * FROM creature_classlevelstats WHERE level = ? AND class = ?', array($level, $class));
    }

    public function findCreatureEntryName(Creature $creature) {
        $name = $this->test->fetchAssoc('SELECT name FROM creature_template WHERE entry = ?', array($creature->getEntry()));
        $creature->setName($name['name']);
        return $creature;
    }

    public function findCreatureGuidName(Creature $creature) {
        $name = $this->test->fetchAssoc('SELECT ct.name FROM creature c JOIN creature_template ct ON ct.entry = c.id WHERE guid = ?', array($creature->getGuid()));
        $creature->setName($name['name']);
        return $creature;
    }

    public function getImmunities($entry) {
        $immunities = $this->test->fetchAssoc('SELECT mechanic_immune_mask as mask FROM creature_template WHERE entry = ?', array($entry));
        return $immunities['mask'];
    }

    public function getNPCFlag($entry) {
        $flag = $this->test->fetchAssoc('SELECT npcflag FROM creature_template WHERE entry = ?', array($entry));
        return $flag['npcflag'];
    }

    public function getUnitFlag($entry) {
        $flag = $this->test->fetchAssoc('SELECT unit_flags FROM creature_template WHERE entry = ?', array($entry));
        return $flag['unit_flags'];
    }

    public function getUnitFlag2($entry) {
        $flag = $this->test->fetchAssoc('SELECT unit_flags2 FROM creature_template WHERE entry = ?', array($entry));
        return $flag['unit_flags2'];
    }

    public function getDynamicFlag($entry) {
        $flag = $this->test->fetchAssoc('SELECT dynamicflags FROM creature_template WHERE entry = ?', array($entry));
        return $flag['dynamicflags'];
    }

    public function getTypeFlag($entry) {
        $flag = $this->test->fetchAssoc('SELECT type_flags FROM creature_template WHERE entry = ?', array($entry));
        return $flag['type_flags'];
    }

    public function getFlagExtra($entry) {
        $flag = $this->test->fetchAssoc('SELECT flags_extra FROM creature_template WHERE entry = ?', array($entry));
        return $flag['flags_extra'];
    }

    public function getCreatureText($entry) {
        $all = $this->test->fetchAll('SELECT * FROM creature_text WHERE entry = ?', array($entry));
        $texts = [];
        foreach($all as $text) {
            $texts[] = new Text($text);
        }
        return $texts;
    }
}