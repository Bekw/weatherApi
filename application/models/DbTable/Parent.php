<?php

class Application_Model_DbTable_Parent extends Zend_Db_Table_Abstract
{
    public function set_session(){
        try{
            $user_id = getCurUser();
            if ($user_id > 0){
                //$user_id = $user_id + 1; //Для тестирования доступов
                $db = Zend_Db_Table::getDefaultAdapter();
                $db->query('set session "myapp.user_id"= '.$user_id);
            }
        }
        catch(exception $e){
            _write_error_db_log(__FUNCTION__, $e->getMessage());
        }
    }

    public function get_session_notice(){
        try{
            $db = Zend_Db_Table::getDefaultAdapter();
            $row = $db->fetchRow('select get_session_notice() id');
            $result = $row['id'];
            if ($result == ''){
                return array();
            } else{
                $tmp = explode('@', $result);
                array_pop($tmp);
                return $tmp;
            }
        }
        catch(exception $e){
            _write_error_db_log(__FUNCTION__, $e->getMessage());
        }
    }

    public function get_session_user_id()
    {
        try{
            $db = Zend_Db_Table::getDefaultAdapter();
            $stmt = $db->query("select get_session_user_id() user_id;");
            $rows = $stmt->fetchAll();
            return $rows;
        } catch(Exception $e){
            _write_error_db_log(__FUNCTION__, $e->getMessage());
        }
    }

    //Получение множественных данных
    public function readSP($method, $sql, $p=0, $cur2 = false){
        $this->set_session();
        _write_db_functions($sql, $p);
        $start_time = microtime(true);
        try{
            $db = Zend_Db_Table::getDefaultAdapter();
            $db->beginTransaction();
            if ($p === 0){
                $db->query('select '.$sql);
            } else {
                $db->query('select '.$sql, $p);
            }
            $stmt = $db->query("FETCH ALL FROM cur;");
            $rows = $stmt->fetchAll();
            if (!empty($rows)) {
                $result['value'] = $rows;
            }
            else{
                $result['value'] = array();
            }

            if ($cur2){
                $stmt = $db->query("FETCH ALL FROM cur2;");
                $rows = $stmt->fetchAll();
                if (!empty($rows)) {
                    $result['value2'] = $rows;
                }
                else{
                    $result['value2'] = array();
                }
            }

            $db->commit();
            $result['status'] = true;
        }
        catch(exception $e){
            $db->rollBack();
            $result['value'] = array();
            $result['error'] = _getErrorClean($method, $e->getMessage());
            $result['error_debug'] = _getErrorDebug($e->getMessage());
            $result['status'] = false;
        }
        _write_long_time_db_log($method, $start_time);
        return $result;
    }
    //Получение одной строки данных
    public function getSP($method, $sql, $p=0){
        $this->set_session();
        _write_db_functions($sql, $p);
        $start_time = microtime(true);
        try{
            $db = Zend_Db_Table::getDefaultAdapter();
            $db->beginTransaction();
            if ($p === 0){
                $db->query('select '.$sql);
            } else {
                $db->query('select '.$sql, $p);
            }
            $stmt = $db->query("FETCH ALL FROM cur;");
            $db->commit();
            $rows = $stmt->fetch();
            if (!empty($rows)) {
                $result['value'] = $rows;
            }
            else{
                $result['value'] = null;
            }
            $result['status'] = true;
        }
        catch(exception $e){
            $db->rollBack();
            $result['value'] = null;
            $result['error'] = _getErrorClean($method, $e->getMessage());
            $result['error_debug'] = _getErrorDebug($e->getMessage());
            $result['status'] = false;
        }
        _write_long_time_db_log($method, $start_time);
        return $result;
    }
    //Получение одного значения
    public function scalarSP($method, $sql, $p, $result_column){
        $this->set_session();
        _write_db_functions($sql, $p);
        $start_time = microtime(true);
        try{
            $db = Zend_Db_Table::getDefaultAdapter();
            $row = $db->fetchRow('select '.$sql, $p);
            if (!empty($row)) {
                $result['value'] = $row[$result_column];
            }
            else{
                $result['value'] = null;
            }
            $result['status'] = true;
        }
        catch(exception $e){
            $result['value'] = null;
            $result['error'] = _getErrorClean($method, $e->getMessage());
            $result['error_debug'] = _getErrorDebug($e->getMessage());
            $result['status'] = false;
        }
        _write_long_time_db_log($method, $start_time);
        return $result;
    }
    //Выполнение insert, update, delete
    public function execSP($method, $sql, $p, $result_column=0, $db=null){
        $this->set_session();
        _write_db_functions($sql, $p);
        $start_time = microtime(true);
        try{
            if ($db == null){
                $db = Zend_Db_Table::getDefaultAdapter();
            }
            $row = $db->fetchRow('select '.$sql, $p);
            if (!empty($row)) {
                if ($result_column === 0){
                    $result['value'] = null;
                } else {
                    $result['value'] = $row[$result_column];
                }
            }
            else{
                $result['value'] = null;
            }
            $result['status'] = true;
            $result['notice'] = $this->get_session_notice();
        }
        catch(exception $e){
            $result['value'] = null;
            $result['notice'] = array();
            $result['error'] = _getErrorClean($method, $e->getMessage());
            $result['error_debug'] = _getErrorDebug($e->getMessage());
            $result['status'] = false;
        }
        _write_long_time_db_log($method, $start_time);
        return $result;
    }

}

