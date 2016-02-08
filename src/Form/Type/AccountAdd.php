<?php

namespace SUN\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

class AccountAdd extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', 'text', array(
                'constraints' => array(new Assert\NotBlank(), new Assert\Length(array('min' => 3, 'max' => 32)))
            ))
            ->add('password', 'repeated', array(
                'type'            => 'password',
                'invalid_message' => 'The password fields must match.',
                'options'         => array('required' => true),
                'first_options'   => array('label' => 'Password'),
                'second_options'  => array('label' => 'Repeat password'),
            ))
            ->add('access', ChoiceType::class, array(
                'choices' => [
                    'Player'    => 0,
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