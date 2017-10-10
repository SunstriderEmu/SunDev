<?php

namespace SUN\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

class ImportGameobjects extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('mapID', 'number', array(
                'constraints' => array(new Assert\NotBlank(), new Assert\Length(array('min' => 1, 'max' => 3)))
            ))
            ->getForm();
    }
    public function getName()
    {
        return 'import_gobject';
    }
}