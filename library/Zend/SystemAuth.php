<?php

class Zend_SystemAuth extends Zend_Auth{

    public function __construct() {
        $this->setStorage(new Zend_Auth_Storage_Session('system_auth'));
        // do other stuff
    }

}
?>