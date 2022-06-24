<?php

class ParentController extends Zend_Controller_Action{

    protected $session;
    function getSessionParam($param_name, $second_value=0){
        if (isset($this->session->param[$param_name])){
            return $this->session->param[$param_name];
        } else{
            return $second_value;
        }
    }
    public function init(){
        $this->_redirector = $this->_helper->getHelper('Redirector');
        $this->_helper->AjaxContext()->addActionContext('index-json', 'json')->initContext('json');
        if ($this->getRequest ()->getActionName () == 'index-ajax-content'){
            $this->_helper->layout->disableLayout();
        }
        $ob = new Application_Model_DbTable_System();
    }

}

