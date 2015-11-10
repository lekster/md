<?php
namespace frontend\controllers;

use Yii;
use common\models\LoginForm;
use frontend\models\PasswordResetRequestForm;
use frontend\models\ResetPasswordForm;
use frontend\models\SignupForm;
use frontend\models\ContactForm;
use yii\base\InvalidParamException;
use yii\web\BadRequestHttpException;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use common\models\Commands;


/**
 * Site controller
 */
class MdController extends Controller
{
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout', 'signup'],
                'rules' => [
                    [
                        'actions' => ['signup'],
                        'allow' => true,
                        'roles' => ['?'],
                    ],
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }
    public function actionMenu($id = 0)
    {

        $tree = $this->generateCommandMenuTree(null, false, $id);
        return $this->render('menu2.twig' ,[
                'RESULT' => $tree,
                'username' => '123',

                'ONE_ITEM_MODE' => 0,
                'PARENT_TITLE' => 'PARENT_TITLE',
                'IFRAME_MODE' => 0,
                'PARENT_ID' => 0,
                'PARENT_PARENT_ID' => 0,
                'PARENT_AUTO_UPDATE' => 0,
            ]);
    }


    protected function checkAccess()
    {
      return true;
    }

    protected function getGlobal()
    {
      return 0;
    }


    protected function removeDenyMenu()
    {

    }


    /**
        * @return array
    */
    public function generateCommandMenuTree($id, $isAdminAction, $parentItemId = null)
    {

        //$parent = (int)$_GET['parent'];
        $parent = null;
        
        //$id = $this->id;
        

        //global $save_qry;
        $save_qry = null;


        //globals

        $session = new \stdClass();
        $menu_loaded = null;


        //GET
        // если установлен $parentNodeId - то берем дерево с родительским элементом $parentNodeId
          //если установлен $itemId - дополнительно фильтруем по ID
          //если установлен $partentItemId - дополнительно фильтруем по PARENT_ID
        //иначе
          //если установлен $itemId - дополнительно фильтруем по ID и PARENT_ID = 0
          //если установлен $partentItemId - дополнительно фильтруем по PARENT_ID  - этот кейс не имеет смысла


        $parentNodeId = null; //$_GET['parent']
        $itemId = null; 
        //$parentItemId = 87;


        //this
       
        $pda = 1;
        $owner_name = 'panel';
        /*****************************************/


         $out['MENU_LOADED']=$menu_loaded;
         $menu_loaded=1;
         $out['PDA']=1;


  
     $out['MENU_LOADED']=$menu_loaded;

     $menu_loaded=1;

     if ($pda) {
      $out['PDA']=1;
     }

      if ($owner_name =='panel') {
       $out['CONTROLPANEL']=1;
      }

      $qry="1";
      // search filters
      if (!$isAdminAction) {


              if ($parentNodeId) {
               $qry.=" AND (commands.ID='".(int)$parentNodeId."' OR commands.PARENT_ID='".$parentNodeId."')";
               $out['IFRAME_MODE']=1;
              }


              if (is_numeric($parentItemId))
              {
               $qry.=" AND PARENT_ID='".$parentItemId."'";
               $parent_rec = Commands::find()->where(['id' => $parentItemId])->all();
               //$parent_rec['TITLE']=processTitle($parent_rec['TITLE'], $this);
               foreach($parent_rec as $k=>$v) {
                $out['PARENT_'.$k]=$v->getAttributes();
               }
              } elseif (is_numeric($itemId))

              {
               $qry.=" AND ID=".(int)$itemId;
               $out['ONE_ITEM_MODE']=1;
               $pda=1;
               $out['PDA']=1;
              } elseif (!isset($parentNodeId) || !$parentNodeId) {
               $qry.=" AND PARENT_ID=0";
              }
      }
      else
      {
        //берем все
        $qry="1";
      }
      //1 AND PARENT_ID='87

      // FIELDS ORDER
      $sortby="PRIORITY DESC, TITLE";
      $out['SORTBY']=$sortby;

      // SEARCH RESULTS
     $res =  Commands::find()
            ->where($qry)
            ->orderBy($sortby)
            ->all();         

      //проверяем ACL (убираем недоступные)      
      
            
      if (!$isAdminAction)
      {
           $total=count($res);
           $res2=array();
           for($i=0;$i<$total;$i++) {
            if ($this->checkAccess('menu', $res[$i]->getAttribute('ID'))) {
             $res2[]=$res[$i];
            }
           }
           $res=$res2;
           unset($res2);
      }


      //чудо цикл
      if (isset($res[0]) && $res[0]->getAttribute('ID')) {
       $total=count($res);
       for($i=0;$i<$total;$i++) 
       {
              // some action for every record if required
             if (isset($res[$i+1]) && !is_null($res[$i+1]->getAttribute('INLINE'))) {
              $res[$i]->setAttribute('INLINE', 1);
             }

             $item=$res[$i];
             if ($item->getAttribute('VISIBLE_DELAY')) {
              $out['VISIBLE_DELAYS']++;
             }

             if ($item->getAttribute('EXT_ID') && !$isAdminAction) {
                  $visible_delay=$item->getAttribute('VISIBLE_DELAY');
                  $tmp=Commands::find()->where(['id' => (int)$item->getAttribute('EXT_ID')])->one();
                  if ($tmp->getAttribute('ID')) {
                   $item=$tmp;
                   $item->setAttribute('VISIBLE_DELAY', $visible_delay);
                   $res[$i]=$item;
                  }
             } elseif ($item->getAttribute('EXT_ID') && $isAdminAction) {
                  $tmp=Commands::find()->where(['id' => (int)$item->getAttribute('EXT_ID')])->one();
                  if ($tmp->getAttribute('ID')) {
                   $item->setAttribute('TITLE', $item->getAttribute('TITLE').' ('.$tmp->getAttribute('TITLE').')');
                   $res[$i]=$item;
                  }
             }

             //апдейтим линкованные значения
             //это жесть при каждом апдейте запрашивать значения, хотя мы же их показываем, так что получается пойдет

             $item->updateLinkedProperty();

             //кастомная фигня для отображения конкретных типов меню
             //вообще надо делать ITEM кокретным подкллассом и перегружать метод отрисовки
             //иначе костыли

             $item->t();

             
               if ($owner_name!='panel') {
                $res[$i]->TITLE = $res[$i]->TITLE; //, $this);
                if ($res[$i]->TYPE =='custom')
                {
                 $res[$i]->DATA = $res[$i]->DATA; //, $this);
                }
               }


                foreach($res[$i] as $k=>$v) {
                 if (!is_array($res[$i][$k]) && $k!='DATA') {
                  $res[$i][$k]=addslashes($v);
                 }
                }

                //$tmp=SQLSelectOne("SELECT COUNT(*) as TOTAL FROM commands WHERE PARENT_ID='".$res[$i]['ID']."'");
                $tmp=Commands::find()->where(['id' => $res[$i]->getAttribute('ID')])->one();
                if ($tmp->getAttribute('TOTAL')) {
                 $res[$i]->setAttribute('RESULT', $tmp->getAttribute('TOTAL'));
                }
       }

       if ($isAdminAction) {
          $res=$this->buildTree_commands($res);
       }


      $out['RESULT'] = array();
      foreach ($res as $val)
      {
         $out['RESULT'][] = $val->getAttributes();
      } 
      //$out['RESULT']=$res;
       
       
      }

return $out;

        return [
            'asd' => 123,
            'vbn' => 456,
        ];
    }

   function buildTree_commands($res, $parent_id=0, $level=0) {
        $total=count($res);
        $res2=array();
        for($i=0;$i<$total;$i++) {
         if ($res[$i]['PARENT_ID']==$parent_id) {
          $res[$i]->setAdditionalData('LEVEL', $level);
          $res[$i]->setAdditionalData('RESULT', $this->buildTree_commands($res, $res[$i]['ID'], ($level+1)));
          $res2[]=$res[$i];
         }
        }
        $total2=count($res2);
        if ($total2) {
         return $res2;
        }
 }


}
