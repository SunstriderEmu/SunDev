<?php

namespace SUN\DAO;

class ConditionDAO extends DAO
{
    /**
     * @param $id
     * @return mixed
     */
    public function search($id)
    {
        $conditions = $this->getDb('test')->fetchAll('SELECT * FROM conditions WHERE (SourceGroup = :condition OR SourceEntry = :condition OR ConditionValue1 = :condition OR ConditionValue2 = :condition OR ConditionValue3 = :condition)', array('condition' => intval($id)));
        return $conditions;
    }
}