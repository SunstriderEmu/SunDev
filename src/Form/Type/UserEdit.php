<?php

namespace SUN\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;

class UserEdit extends AbstractType
{
	public function buildForm(FormBuilderInterface $builder, array $options)
	{
		$builder
			->add('password', RepeatedType::class, array(
				'type'            => PasswordType::class,
				'invalid_message' => 'The password fields must match.',
				'options'         => array('required' => true),
				'first_options'   => array('label' => 'Password'),
				'second_options'  => array('label' => 'Repeat password'),
			))
			->getForm();
	}
	public function getName()
	{
		return 'user';
	}
}