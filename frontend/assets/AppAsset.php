<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace frontend\assets;

use yii\web\AssetBundle;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/site.css',
        'css/sm-blue.css',
        'css/sm-core-css.css',
        'js/md/jquerymobile/jquery.mobile-1.2.0.min.css',
    ];
    public $js = [
        'js/md/jquery.smartmenus.js',
        'js/md/jquerymobile/jquery-1.8.3.min.js',
        'js/md/jquerymobile/custom-scripting.js',
        'js/md/jquerymobile/jquery.mobile-1.2.0.min.js',
        'js/md/js/jquery.jplayer.min.js',

    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}

/*
<link rel="stylesheet" href="/jquerymobile/jquery.mobile-1.2.0.min.css" />
<script type="text/javascript" src="/jquerymobile/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="/jquerymobile/custom-scripting.js"></script>               
<script type="text/javascript" src="/jquerymobile/jquery.mobile-1.2.0.min.js"></script>
<script type="text/javascript" src="/js/jquery.jplayer.min.js"></script>
*/