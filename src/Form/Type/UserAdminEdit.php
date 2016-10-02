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
                        'Dev' 			=> 'ROLE_DEV',
                    ],
                    'User' => [
                        'All'		=> 'ROLE_SUPERUSER',
                        'Browse' 	=> 'ROLE_USER_LIST',
                        'Add' 		=> 'ROLE_USER_ADD',
                        'Edit' 		=> 'ROLE_USER_EDIT',
                        'Delete' 	=> 'ROLE_USER_DELETE',
                    ],
                    'Creature' => [
                        'All' 		=> 'ROLE_CREATURE',
                        'EventAI' 	=> 'ROLE_CREATURE_EVENTAI',
                        'Loot' 		=> 'ROLE_CREATURE_LOOT',
                        'Equip' 	=> 'ROLE_CREATURE_EQUIP',
                    ],
                    'GameObject' => [
                        'All' 		=> 'ROLE_GO',
                    ],
                    'Spell' => [
                        'All' 		=> 'ROLE_SPELL',
                    ],
                    'Loots' => [
                        'All' 			=> 'ROLE_LOOT',
                        'Creature' 		=> 'ROLE_CREATURE_LOOT',
                        'Disenchant' 	=> 'ROLE_LOOT_DISENCHANT',
                        'Fishing' 		=> 'ROLE_LOOT_FISHING',
                        'Gameobject' 	=> 'ROLE_GO_LOOT',
                        'Item' 			=> 'ROLE_LOOT_ITEM',
                        'Pickpocket' 	=> 'ROLE_LOOT_PICKPOCKET',
                        'Prospect' 		=> 'ROLE_LOOT_PROSPECT',
                        'Quest mail' 	=> 'ROLE_LOOT_QUESTMAIL',
                        'Reference' 	=> 'ROLE_LOOT_REFERENCE',
                        'Skinning' 		=> 'ROLE_LOOT_SKINNING',
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