<?php
require_once 'ParentController.php';

class SystemController extends ParentController{

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
        $actions_except = array('login',
                                'send-mail',
                                'check-mail');
        if (!in_array($action_name, $actions_except)){
            if (!(new Zend_SystemAuth())::getInstance()->setStorage(new Zend_Auth_Storage_Session('system_auth'))->hasIdentity()){
                $this->_redirect('/system/login');
            }
            if (getCurEmployee() == 0){
                (new Zend_SystemAuth())::getInstance()->setStorage(new Zend_Auth_Storage_Session('system_auth'))->clearIdentity();
                $this->_redirect('/dict/index');
            }
        }
        if ((new Zend_SystemAuth())::getInstance()->setStorage(new Zend_Auth_Storage_Session('system_auth'))->hasIdentity()){
            $this->user_id = getCurEmployee();
            $identity = (new Zend_SystemAuth())::getInstance()->getStorage()->read();
//            $this->role = $identity->role_id;
//            $this->name = $identity->fio;
//            $this->city_id = $identity->city_id;
        }
    }

    public function dbLogAction(){
        $dir = $_SERVER['DOCUMENT_ROOT']. '/log/db_func';
        $file_name = $dir . "/" . Zend_Session::getId() . ".log";

        if($this->getRequest()->isPost()){
            $a = $this->_getAllParams();
            if (isset($a['btn_active'])){
                $this->session->is_db_func_log = true;
            }
            if (isset($a['btn_clear'])){
                if (file_exists($file_name)) {
                    unlink($file_name);
                    $this->session->is_db_func_log = false;
                }
            }
        }
        if (file_exists($file_name)) {
            $a = file_get_contents($file_name);
            $this->view->content = $a;
        }

    }

    public function indexJsonAction(){
        $mode = $this->_getParam('mode', '');
        $this->view->mode = $mode;

    }

    public function blankAction(){
    }


    private function login($login, $password, $finger, $code_key){
        $authAdapter = new Zend_Auth_Adapter_DbTable(Zend_Db_Table::getDefaultAdapter());
        $authAdapter->setTableName('admin.employee_view');
        $authAdapter->setIdentityColumn('email');
        $authAdapter->setCredentialColumn('passwd');

        $authAdapter->setIdentity(strtolower(trim($login)));
        $authAdapter->setCredential($password);
        $auth = (new Zend_SystemAuth())::getInstance();
        $auth->setStorage(new Zend_Auth_Storage_Session('system_auth'));
        $result = $auth->authenticate($authAdapter);

        if ($result->isValid()){
            $identity = $authAdapter->getResultRowObject();
            $authStorage = $auth->getStorage();
            $authStorage->write($identity);
            if($identity->is_active == 0){
                (new Zend_SystemAuth())::getInstance()->setStorage(new Zend_Auth_Storage_Session('system_auth'))->clearIdentity();
                return 'blocked';
            }
            $ob = new Application_Model_DbTable_System();

            return 'valid';
        }
        else{
            return 'no_valid';
        }
    }

    public function loginAction(){
        $ob = new Application_Model_DbTable_System();
        if ((new Zend_SystemAuth())::getInstance()->setStorage(new Zend_Auth_Storage_Session('system_auth'))->hasIdentity()){
            $row = $ob->get_first_menu_action();
            $row = $row['value'];
            $this->_redirect($row['menu_action'].'menu_global_id/'.$row['menu_id']);
        }
        $this->_helper->layout()->disableLayout();
        if($this->getRequest()->isPost()){
            $this->view->login = $this->_getParam('login', 'empty');
            $password = $this->_getParam('password', 'empty');
            $finger = $this->_getParam('finger', '');
            $code_key = $this->_getParam('code_key', '');
            $validate = $this->login($this->view->login, $password, $finger, $code_key);
            if ($validate == 'valid'){
                $ob->employee_set_last_login();
                $row = $ob->get_first_menu_action();
                $row = $row['value'];
                if($row['position_id'] != 1){
                    $this->_redirect('/system/index');
                }else{
                    $this->_redirect($row['menu_action'].'menu_global_id/'.$row['menu_id']);
                }
            } else if($validate == 'blocked'){
                $this->view->error = "Пользватель заблокирован";
            } else{
                $this->view->error = "Неверный логин или пароль";
            }
        }
    }

    public function indexAction(){
        $ob = new Application_Model_DbTable_System();

    }

    public function logoutAction(){
        $this->_helper->viewRenderer->setNoRender(true);
        (new Zend_SystemAuth())::getInstance()->setStorage(new Zend_Auth_Storage_Session('system_auth'))->clearIdentity();
        $this->_redirect('/dict/index');
    }
}

