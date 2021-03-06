<?php

/**
 * This file is covered by the AGPLv3 license, which can be found at the LICENSE file in the root of this project.
 * @copyright 2017-2019 subtitulamos.tv
 */

namespace App\Controllers;

use Slim\Views\Twig;

class HomeController
{
    public function view($response, Twig $twig)
    {
        return $twig->render($response, 'index.twig', [
            'catchphrase' => ''
        ]);
    }

    public function bannedNotice($response, Twig $twig)
    {
        return $twig->render($response, 'errors/banned_error.twig');
    }
}
