<?php

class Api_Project
{
	public function testMethod()
	{
		return "hello world2";
	}
    public function setAuth($login, $password)
    {
        $authAdapter = new Zend_Auth_Adapter_DbTable(Zend_Db_Table::getDefaultAdapter());
        $authAdapter->setTableName('user_tab');
        $authAdapter->setIdentityColumn('email');
        $authAdapter->setCredentialColumn('password');

        $authAdapter->setIdentity($login);
        $authAdapter->setCredential(md5($password));
        $auth = Zend_Auth::getInstance();
        $result = $auth->authenticate($authAdapter);

        if ($result->isValid()){
            $identity = $authAdapter->getResultRowObject();
            $authStorage = $auth->getStorage();
            $authStorage->write($identity);
            return true;
        }
        else{
            return false;
        }

        return false;
    }




}







