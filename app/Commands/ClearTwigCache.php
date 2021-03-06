<?php

/**
 * This file is covered by the AGPLv3 license, which can be found at the LICENSE file in the root of this project.
 * @copyright 2017-2019 subtitulamos.tv
 */

namespace App\Commands;

use App\Services\AssetManager as AssetManager;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ClearTwigCache extends Command
{
    protected function configure()
    {
        $this->setName('app:twig:clear-cache')
            ->setDescription('Clears the temporary folders created by twig')
            ->setHelp('Clears the files on the /tmp cache folder');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $cacheDir = __DIR__.'/../../tmp/twig';
        if (!\is_dir($cacheDir)) {
            $output->writeln('Twig template cache folder does not exist, nothing to clear');
            return;
        }

        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($cacheDir, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($files as $fileinfo) {
            $fn = ($fileinfo->isDir() ? 'rmdir' : 'unlink');
            $fn($fileinfo->getRealPath());
        }

        $output->writeln('Cleared Twig template cache');
    }
}
