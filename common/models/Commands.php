<?php
namespace common\models;

use Yii;
use yii\base\NotSupportedException;
use yii\behaviors\TimestampBehavior;
use yii\db\ActiveRecord;
use yii\db\ActiveQuery;
use yii\web\IdentityInterface;


class Commands extends ActiveRecord
{
 	private $_data = array();

    public static function tableName()
    {
        return 'Commands';
    }

    public function setAdditionalData($name, $val)
    {
    	$this->_data[$name] = $val;
    }

    public function getAdditionalData($name)
    {
    	return $this->_data[$name];
    }

    public function getAdditionalDataArr()
    {
    	return array_merge($this->_data, array());
    }

    public static function find()
    {
        return new CommandsQuery(get_called_class());
    }

    public function t()
	{

	}

	public function getGlobal()
	{
		return true;
	}

	public function updateLinkedProperty()
	{
		if (!empty($this->LINKED_PROPERTY))
		{
          $lprop=$this->getGlobal($this->getAttribute('LINKED_OBJECT').'.'.$this->getAttribute('LINKED_PROPERTY'));
          $field = 	($this->TYPE =='custom') ? 'DATA' : 'CUR_VALUE';

          if ($lprop != $this->getAttribute($field))
          {
            $this->setAttribute($field, $lprop);
            $this->update();
          }
        }
	}

}

class SelectboxCommand extends Commands
{

	public function t()
	{
		$data=explode("\n", str_replace("\r", "", $this->getAttribute('DATA')));
      $this->setAdditionalData('OPTIONS', array());
      foreach($data as $line) {
       $line=trim($line);
       if ($line!='') {
        $option=array();
        $tmp=explode('|', $line);
        $option['VALUE'] = $tmp[0];
        if ($tmp[1]!='') {
         $option['TITLE'] = $tmp[1];
        } else {
         $option['TITLE']  = $option['VALUE'];
        }
        if ($option['VALUE'] == $this->getAttribute('CUR_VALUE')) {
         $option['SELECTED'] = 1;
        }
        $this->setAdditionalData('OPTIONS', array_merge($this->getAdditionalData('OPTIONS'), $option));
       }
      }
	}

}

class TimeboxCommand extends Commands
{
	public function t()
	{
		$tmp=explode(':', $this->getAttribute('CUR_VALUE'));
	      if (@is_numeric($tmp[0]) && @is_numeric($tmp[1]))
	      {
	        $value1=(int)$tmp[0];
	        $value2=(int)$tmp[1];

	        for($h=0;$h<=23;$h++) {
	         $v=$h;
	         if ($v<10) {
	          $v='0'.$v;
	         }
	         $selected=0;
	         if ($h==$value1) {
	          $selected=1;
	         }
	         $this->setAdditionalData('OPTIONS1', array_merge($this->getAdditionalData('OPTIONS1'), array('VALUE'=>$v, 'SELECTED'=>$selected)));
	        }
	        for($h=0;$h<=59;$h++) {
	         $v=$h;
	         if ($v<10) {
	          $v='0'.$v;
	         }
	         $selected=0;
	         if ($h==$value2) {
	          $selected=1;
	         }
	         $this->setAdditionalData('OPTIONS2', array_merge($this->getAdditionalData('OPTIONS2'), array('VALUE'=>$v, 'SELECTED'=>$selected)));
	        }
	        $res[$i]=$item;
	           //print_r($item);exit;
	      }
	}
}



class CommandsQuery extends ActiveQuery
{

	public function transformPopulation(array $models)
    {
    	$ret = array();
        foreach ($models as $model) {
        	switch ($model->getAttribute('TYPE'))
        	{
        		case 'selectbox':
        			$ret[] = self::objectToObject($model, "common\models\SelectboxCommand");
        			break;
        		
        		case 'timebox':
        			$ret[] = self::objectToObject($model, "common\models\TimeboxCommand");
        			break;
        		default:
        			$ret[] = $model;
        			break;
        	}
        }
        //$ret = $models;
        //$ret[0]->print1();
        return $ret;
    }

    static function cast($sourceObject, $destination)
	{
	    if (is_string($destination)) {
	        $destination = new $destination();
	    }
	    $sourceReflection = new \ReflectionObject($sourceObject);
	    $destinationReflection = new \ReflectionObject($destination);
	    $sourceProperties = $sourceReflection->getProperties();
	    foreach ($sourceProperties as $sourceProperty) {
	        $sourceProperty->setAccessible(true);
	        $name = $sourceProperty->getName();
	        $value = $sourceProperty->getValue($sourceObject);
	        if ($destinationReflection->hasProperty($name)) {
	            $propDest = $destinationReflection->getProperty($name);
	            $propDest->setAccessible(true);
	            $propDest->setValue($destination,$value);
	        } else {
	            $destination->$name = $value;
	        }
	    }
	    return $destination;
	}

	static function objectToObject($instance, $className) {
    return unserialize(sprintf(
        'O:%d:"%s"%s',
        strlen($className),
        $className,
        strstr(strstr(serialize($instance), '"'), ':')
    ));
}
   
}
































class A 
{
	static function objectToObject($instance, $className) {
    return unserialize(sprintf(
        'O:%d:"%s"%s',
        strlen($className),
        $className,
        strstr(strstr(serialize($instance), '"'), ':')
    ));
}


static function cast($sourceObject, $destination)
{
    if (is_string($destination)) {
        $destination = new $destination();
    }
    $sourceReflection = new \ReflectionObject($sourceObject);
    $destinationReflection = new \ReflectionObject($destination);
    $sourceProperties = $sourceReflection->getProperties();
    foreach ($sourceProperties as $sourceProperty) {
        $sourceProperty->setAccessible(true);
        $name = $sourceProperty->getName();
        $value = $sourceProperty->getValue($sourceObject);
        if ($destinationReflection->hasProperty($name)) {
            $propDest = $destinationReflection->getProperty($name);
            $propDest->setAccessible(true);
            $propDest->setValue($destination,$value);
        } else {
            $destination->$name = $value;
        }
    }
    return $destination;
}
}


class B Extends A
{
	public function convert()
	{
		
	}
}

class C Extends A
{
	public function print1()
	{
		die('asd');
	}

}