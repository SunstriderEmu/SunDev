<?php

namespace SUN\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

class AccountEdit extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', 'text', array(
                'constraints' => array(new Assert\NotBlank(), new Assert\Length(array('min' => 3, 'max' => 32))),
                'disabled'  => true,
            ))
            ->add('gmlevel', ChoiceType::class, array(
                'choices' => [
                    'Player'       => 0,
                    'GM Rank 1'    => 1,
                    'GM Rank 2'    => 2,
                    'GM Rank 3'    => 3,
                    'GM Rank 4'    => 4,
                    'GM Rank 5'    => 5
                ],
                'choices_as_values' => true
            ))
            ->getForm();
    }
    public function getName()
    {
        return 'user';
    }
}