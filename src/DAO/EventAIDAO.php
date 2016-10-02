<?php

namespace SUN\DAO;

use SUN\Domain\Creature;
use SUN\Domain\Gameobject;
use SUN\Domain\Line;

class EventAIDAO extends DAO
{
    /**
     * Get the next available entry for the EventAI Tutorial.
     *
     * @return mixed
     */
    public function getAvailableEntry()
    {
        return $this->getDb('test')->fetchAssoc('SELECT creature_id FROM creature_ai_scripts WHERE creature_id BETWEEN 50000 AND 50099 ORDER BY creature_id DESC LIMIT 1');
    }

    /**
     * Get the Creature EventAI.
     *
     * @param Creature $creature
     * @return array
     */
    public function getCreatureEntryScript(Creature $creature)
    {
        $all = $this->getDb('test')->fetchAll('SELECT * FROM creature_ai_scripts WHERE creature_id = ?', array($creature->getEntry()));
        $lines = [];
        foreach($all as $line)
            $lines[$line['id']] = new Line($line);
        return $lines;
    }

    /**
     * Get all the SmartAI Events.
     *
     * @return array
     */
    public function getEvents()
    {
        $fetch = $this->getDb('tools')->fetchAll('SELECT * FROM eventai_events');
        $events = [];
        foreach($fetch as $event)
            $events[$event['id']] = $event;
        return $events;
    }

    /**
     * Get the #id SmartAI Event.
     *
     * @param $id
     * @return mixed
     */
    public function getEvent($id)
    {
        return $this->getDb('tools')->fetchAssoc('SELECT * FROM eventai_events WHERE id = ?', array($id));
    }

    /**
     * Get all the SmartAI Actions.
     *
     * @return array
     */
    public function getActions()
    {
        $fetch = $this->getDb('tools')->fetchAll('SELECT * FROM eventai_actions');
        $actions = [];
        foreach($fetch as $action)
            $actions[$action['id']] = $action;
        return $actions;
    }

    /**
     * Get the #id SmartAI Action.
     *
     * @param $id
     * @return mixed
     */
    public function getAction($id)
    {
        return $this->getDb('tools')->fetchAssoc('SELECT * FROM eventai_actions WHERE id = ?', array($id));
    }

    /**
     * Get all the SmartAI Targets.
     *
     * @return array
     */
    public function getTargets()
    {
        $fetch = $this->getDb('tools')->fetchAll('SELECT * FROM eventai_targets');
        $targets = [];
        foreach($fetch as $target)
            $targets[$target['id']] = $target;
        return $targets;
    }

    /**
     * Get the #id SmartAI Target.
     *
     * @param $id
     * @return mixed
     */
    public function getTarget($id)
    {
        return $this->getDb('tools')->fetchAssoc('SELECT * FROM eventai_targets WHERE id = ?', array($id));
    }
}