<?php
use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use yii\captcha\Captcha;
use common\models\Commands;

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \frontend\models\ContactForm */

$this->title = 'Contact';
$this->params['breadcrumbs'][] = $this->title;

///http://devzone.zend.com/1886/creating-web-page-templates-with-php-and-twig-part-1/
//использовать twig
echo "<pre>" . var_export($tree, true) . "</pre>";

$post=Commands::find()->all();
/*foreach ($post as $p) {
	echo "<pre>";
	//print_r($p->getAttribute('CUR_VALUE'));
	print_r($p->CUR_VALUE);
	echo "</pre>";
}*/

?>
<div class="site-contact">
    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        If you have business inquiries or other questions, please fill out the following form to contact us. Thank you.
    </p>

    <div class="row">
        <div class="col-lg-5">
            
        </div>
    </div>

</div>


