<?php

namespace SUN\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class UserAdminEdit extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', TextType::class, array(
                'constraints' => array(new Assert\NotBlank(), new Assert\Length(array('min' => 3, 'max' => 50)))
            ))
            ->add('roles', ChoiceType::class, array(
                'choices' => [
                    'General' => [
                        'Admin' 		=> 'ROLE_ADMIN',
                        'Dev & Tester' 	=> 'ROLE_FULL',
                        'Dev' 			=> 'ROLE_DEV',
                        'Test' 			=> 'ROLE_TESTER',
                    ],
                    'Review' => [
                        'All'		=> 'ROLE_REVIEW',
                        'Add'		=> 'ROLE_REVIEW_ADD',
                        'Validate' 	=> 'ROLE_REVIEW_VALIDATE',
                        'Refuse' 	=> 'ROLE_REVIEW_REFUSE',
                    ],
                    'User' => [
                        'All'		=> 'ROLE_SUPERUSER',
                        'Browse' 	=> 'ROLE_USER_LIST',
                        'Add' 		=> 'ROLE_USER_ADD',
                        'Edit' 		=> 'ROLE_USER_EDIT',
                        'Delete' 	=> 'ROLE_USER_DELETE',
                    ],
                    'Account' => [
                        'All'		=> 'ROLE_ACCOUNT',
                        'Browse' 	=> 'ROLE_ACCOUNT_LIST',
                        'Add' 		=> 'ROLE_ACCOUNT_ADD',
                        'Edit' 		=> 'ROLE_ACCOUNT_EDIT',
                        'Delete' 	=> 'ROLE_ACCOUNT_DELETE',
                    ],
                    'Classes' => [
                        'All' 		=> 'ROLE_CLASSES',
                        'Druid' 	=> 'ROLE_CLASSES_DRUID',
                        'Hunter' 	=> 'ROLE_CLASSES_HUNTER',
                        'Mage' 		=> 'ROLE_CLASSES_MAGE',
                        'Paladin' 	=> 'ROLE_CLASSES_PALADIN',
                        'Priest' 	=> 'ROLE_CLASSES_PRIEST',
                        'Rogue' 	=> 'ROLE_CLASSES_ROGUE',
                        'Shaman' 	=> 'ROLE_CLASSES_SHAMAN',
                        'Warlock' 	=> 'ROLE_CLASSES_WARLOCK',
                        'Warrior' 	=> 'ROLE_CLASSES_WARRIOR',
                    ],
                    'Creature' => [
                        'All' 		=> 'ROLE_CREATURE',
                        'SmartAI' 	=> 'ROLE_CREATURE_SMARTAI',
                        'Stats' 	=> 'ROLE_CREATURE_STATS',
                        'Loot' 		=> 'ROLE_CREATURE_LOOT',
                        'Equip' 	=> 'ROLE_CREATURE_EQUIP',
                        'Text' 		=> 'ROLE_CREATURE_TEXT',
                        'Immune' 	=> 'ROLE_CREATURE_IMMUNE',
                        'Gossip' 	=> 'ROLE_CREATURE_GOSSIP',
                        'DynFlag' 	=> 'ROLE_CREATURE_FLAG_DYN',
                        'ExtraFlag' => 'ROLE_CREATURE_FLAG_EXTRA',
                        'NPCFlag' 	=> 'ROLE_CREATURE_FLAG_NPC',
                        'TypeFlag' 	=> 'ROLE_CREATURE_FLAG_TYPE',
                        'UnitFlag' 	=> 'ROLE_CREATURE_FLAG_UNIT',
                    ],
                    'Quests' => [
                        'Write' 	=> 'ROLE_QUESTS_WRITE',
                        'Read' 		=> 'ROLE_QUESTS_READ',
                    ],
                    'Dungeons' => [
                        'Write' 	=> 'ROLE_DUNGEONS_WRITE',
                        'Read' 		=> 'ROLE_DUNGEONS_READ',
                    ],
                    'Spell' => [
                        'All' 		=> 'ROLE_SPELL',
                    ],
                    'Loots' => [
                        'All' 			=> 'ROLE_LOOT',
                        'Creature' 		=> 'ROLE_CREATURE_LOOT',
                        'Disenchant' 	=> 'ROLE_LOOT_DISENCHANT',
                        'Fishing' 		=> 'ROLE_LOOT_FISHING',
                        'Gameobject' 	=> 'ROLE_LOOT_GAMEOBJECT',
                        'Item' 			=> 'ROLE_LOOT_ITEM',
                        'Pickpocket' 	=> 'ROLE_LOOT_PICKPOCKET',
                        'Prospect' 		=> 'ROLE_LOOT_PROSPECT',
                        'Quest mail' 	=> 'ROLE_LOOT_QUESTMAIL',
                        'Reference' 	=> 'ROLE_LOOT_REFERENCE',
                        'Skinning' 		=> 'ROLE_LOOT_SKINNING',
                    ],
                    'Waypoints' => [
                        'All' 			=> 'ROLE_WAYPOINTS',
                    ],
                ],
                'choices_as_values' => true,
                'multiple' => true,
                'expanded' => false,
            ))
            ->getForm();
    }
    public function getName()
    {
        return 'user';
    }
}