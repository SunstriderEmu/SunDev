<?php

use SUN\DAO\ToolsDAO;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\Response;
use SUN\Form\Type\ImportGameobjects;

// Import gameobjects batch
$app->match('/tools/import_gobjects', function(Request $request) use($app) {
	$form = $app['form.factory']->create(new ImportGameobjects());
	$form->handleRequest($request);
    if ($form->isValid()) {
        $form_data = $form->getData();
		$fileContent = GenerateImportGobFileContent($form_data['mapID']);
		$response = new Response($fileContent);
		$disposition = $response->headers->makeDisposition(
			ResponseHeaderBag::DISPOSITION_ATTACHMENT,
			'import.txt'
		);
		$response->headers->set('Content-Disposition', $disposition);
		return $response;
    }
	
    return $app['twig']->render('tools/import_gobjects.html.twig', array('form' => $form->createView()));
});


function GenerateImportGobFileContent($map_id)
{
	global $app;
	
	$file_content = "{$map_id}".PHP_EOL;
	$gameobjects = $app['dao.tools']->getTCGameobjects($map_id);
	
	foreach($gameobjects as $gameobject)
		$file_content .= "{$gameobject['id']} {$gameobject['position_x']} {$gameobject['position_y']} {$gameobject['position_z']} {$gameobject['rotation0']} {$gameobject['rotation1']} {$gameobject['rotation2']} {$gameobject['rotation3']} {$gameobject['spawntimesecs']} {$gameobject['spawnMask']}".PHP_EOL;

	return $file_content;
}