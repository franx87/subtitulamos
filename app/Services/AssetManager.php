<?php

/**
 * This file is covered by the AGPLv3 license, which can be found at the LICENSE file in the root of this project.
 * @copyright 2017 subtitulamos.tv
 */

namespace App\Services;

class AssetManager
{
    /**
     * Manifest associative array with thecss  asset-version bindings
     *
     * @var string
     */
    private $cssManifest = [];

    /**
     * Webpack-generated associative array with the asset-version bindings
     *
     * @var string
     */

    private $webpackManifest = [];

    /**
     * Path of the asset directory
     * @var string
     */
    public const ASSET_PATH = __DIR__.'/../../resources/assets';

    /**
     * Path of the manifest file
     * @var string
     */
    public const CSS_MANIFEST_PATH = self::ASSET_PATH.'/css-manifest.json';

    /**
     * Path of the manifest file
     * @var string
     */
    public const WEBPACK_MANIFEST_PATH = self::ASSET_PATH.'/manifest.json';

    /**
     * Path of the deploy directory
     * @var string
     */
    public const DEPLOY_PATH = __DIR__.'/../../public';

    public function __construct()
    {
        $this->loadManifest();
    }

    /**
     * (Re)load the manifest file from its path
     *
     * @return bool
     */
    public function loadManifest()
    {
        $contents = @\file_get_contents(self::CSS_MANIFEST_PATH);
        if (!empty($contents)) {
            $this->cssManifest = \json_decode($contents, true);
        }

        $contents = @\file_get_contents(self::WEBPACK_MANIFEST_PATH);
        if (!empty($contents)) {
            $this->webpackManifest = \json_decode($contents, true);
        }
    }

    public function buildManifest($path, $relativeRoute, &$manifest)
    {
        foreach (new \DirectoryIterator($path) as $fileInfo) {
            if ($fileInfo->isDot()) {
                continue;
            }

            if ($fileInfo->isDir()) {
                $this->buildManifest($path.'/'.$fileInfo->getFilename(), $relativeRoute.'/'.$fileInfo->getFilename(), $manifest);
                continue;
            }

            $ext = $fileInfo->getExtension();
            if (!$fileInfo->isFile() || !\in_array($fileInfo->getExtension(), ['css'])) {
                continue;
            }

            $fileName = $fileInfo->getFilename();
            $fullPath = $fileInfo->getPathname();
            $ver = mb_substr(hash_file('md5', $fullPath), 0, 8);

            $newName = str_replace('.'.$ext, '', $fileName).'-'.$ver.'.'.$ext;

            if (!file_exists(self::DEPLOY_PATH.'/css'.$relativeRoute.'/')) {
                mkdir(self::DEPLOY_PATH.'/css'.$relativeRoute, 0755);
            }

            \copy(self::ASSET_PATH.'/css'.$relativeRoute.'/'.$fileName, self::DEPLOY_PATH.'/css'.$relativeRoute.'/'.$newName);

            $k = $relativeRoute != '' ? mb_substr($relativeRoute, 1).'/'.$fileName : $fileName;
            $manifest[$k] = 'css'.$relativeRoute.'/'.$newName;
        }
    }

    /**
     * @return void
     */
    public function redeployCSS()
    {
        $manifest = [];
        $this->buildManifest(self::ASSET_PATH.'/css', '', $manifest);

        \file_put_contents(self::CSS_MANIFEST_PATH, \json_encode($manifest));
        $this->cssManifest = $manifest;
    }

    public function getCssVersionedName($assetName)
    {
        if (DEBUG === true) {
            $v = feature_on('DEBUG_CSS_NOCACHE') !== true ? mb_substr(hash_file('md5', self::ASSET_PATH.'/css/'.$assetName), 0, 8) : time();
            return 'css/'.$assetName.'?v='.$v;
        }

        return isset($this->cssManifest[$assetName]) ? $this->cssManifest[$assetName] : 'err';
    }

    public function getWebpackVersionedName($assetName)
    {
        return isset($this->webpackManifest[$assetName]) ? $this->webpackManifest[$assetName] : '???';
    }
}
