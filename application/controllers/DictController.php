<?php
require_once 'ParentController.php';

class DictController extends ParentController{

    public function preDispatch(){
        $action_name =  (Zend_Controller_Front::getInstance()->getRequest()->getActionName());
        //Прописать action-ы в которых нужна сессия
        if ($action_name == 'notification-list' || $action_name == 'myaction2'){
            $params = $this->_getAllParams();
            foreach ($params as $key => $value) {
                $this->session->param[$key] = $value;
            }
        }
    }

    public function init(){
        $this->_helper->layout->setLayout('layout-system');
        parent::init();
        $this->user_id = 0;
        $action_name =  (Zend_Controller_Front::getInstance()->getRequest()->getActionName());
        $actions_except = array('login','index');
    }

    public function indexJsonAction(){
        $mode = $this->_getParam('mode', '');
        $this->view->mode = $mode;
        $ob = new Application_Model_DbTable_Dict();
        if($mode == 'upd-request'){
            $a = $this->_getAllParams();
            $result = $ob->request_upd($a);
            $this->view->result = $result;
        }
    }

    public function indexAction(){
        $this->_helper->layout->disableLayout();
        $city_name = $this->_getParam('city_name', '');
        $api_key = 'ca91f038697a1a3bcb5645c1c784b3e8';

        $url = 'https://api.openweathermap.org/data/2.5/weather?q='.$city_name.'&appid='.$api_key;

        $weather_data = json_decode(file_get_contents($url), true);

        $this->view->temp = round($weather_data['main']['temp'] - 273.15);
        $this->view->temp_max = round($weather_data['main']['temp_max'] - 273.15);
        $this->view->temp_min = round($weather_data['main']['temp_min'] - 273.15);
        $this->view->city_name = $city_name;
        $this->view->date = $today = date("F j, Y");
    }

}


