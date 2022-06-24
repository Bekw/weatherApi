<?

/**********Database common functions*************************************************************************/

//Записывает ошибки базы в лог файл
function _write_error_db_log($method, $error){
    $dir = $_SERVER['DOCUMENT_ROOT']. '/log/error_db';
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }
    $file_name = $dir . "/" . date('Y.m.d') . ".log";
    $timezone  = 5;
    $cur_time = gmdate("d.m.Y H:i:s", time() + 3600*($timezone+date("I")));
    file_put_contents($file_name, $cur_time.";".$method.";"."user_id=".getCurUser().";Error:".$error."\n", FILE_APPEND);
}

//Записывает в лог файл процедуры, которые отрабатывают больше 1 секунды
function _write_long_time_db_log($method, $start_time){
    $dir = $_SERVER['DOCUMENT_ROOT']. '/log/long_time_db';
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }
    $file_name = $dir . "/" . date('Y.m.d') . ".log";
    $time = microtime(true) - $start_time;
    if ($time > 1){
        $timezone  = 5;
        $cur_time = gmdate("d.m.Y H:i:s", time() + 3600*($timezone+date("I")));
        file_put_contents($file_name, $cur_time.";".$method.";"."user_id=".getCurUser()." ". $time."\n", FILE_APPEND);
    }
}

//Записывает все вызывающиеся процедуры
function _write_db_functions($sql, $params){
    $session = new Zend_Session_Namespace('Global');
    if (isset($session->is_db_func_log)){
        if ($session->is_db_func_log){
            if ($sql != "admin.menu_read_recursive('cur',:employee_id, :menu_pid, :menu_global_id)"){
                $dir = $_SERVER['DOCUMENT_ROOT']. '/log/db_func';
                if (!file_exists($dir)) {
                    mkdir($dir, 0777, true);
                }
                $timezone  = 5;
                $cur_time = gmdate("d.m.Y H:i:s", time() + 3600*($timezone+date("I")));
                $file_name = $dir . "/" . Zend_Session::getId() . ".log";
                file_put_contents($file_name, $cur_time." ". $sql . "<br/>" . json_encode($params) . "<br/><br/>", FILE_APPEND);
            }
        }
    }
}


//Получить только текст ошибки из DB
function _getErrorClean($method, $error){
    $re = '/{[^@]*}/';
    $str = $error;
    preg_match_all($re, $str, $matches, PREG_SET_ORDER, 0);
    if (count($matches) > 0) {
        $str = $matches[0][0];
        $str = str_replace('{', '', $str);
        $str = str_replace('}', '', $str);
    } else {
        $str = 'Произошла необработанная ошибка в БД ' . $error ;
        _write_error_db_log($method, $error);
    }
    return $str;
}
//Получить всю ошибку из DB
function _getErrorDebug($error){
    return $error;
}

/**********Other common functions*************************************************************************/

//Записывает системные ошибки в лог
function _write_error_php_log($error, $method = "DEFAULT"){
    $dir = $_SERVER['DOCUMENT_ROOT']. '/log/error_php_log';
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }
    $file_name = $dir . "/" . date('Y.m.d') . ".log";
    $timezone  = 5;
    $cur_time = gmdate("d.m.Y H:i:s", time() + 3600*($timezone+date("I")));
    file_put_contents($file_name, $cur_time.";".$method.";"."user_id=".getCurUser().";Error:".$error."\n", FILE_APPEND);
}
//Идентификатор пользователя берется либо из сотрудников (employee_tab), либо из user_tab, в зависимости от типа входа в систему
function getCurUser(){
    $user_id = 0;
    if (Zend_Auth::getInstance()->hasIdentity()){
        $identity = Zend_Auth::getInstance()->getStorage()->read();
        if (isset($identity->user_id)){
            $user_id = $identity->user_id;
        }
    }
    return $user_id;
}
//Идентификатор пользователя берется либо из сотрудников (employee_tab), либо из user_tab, в зависимости от типа входа в систему
function getCurRole(){
    $role_id = 0;
    if (Zend_Auth::getInstance()->hasIdentity()){
        $identity = Zend_Auth::getInstance()->getStorage()->read();
        if (isset($identity->role_id)){
            $role_id = $identity->role_id;
        }
    }
    return $role_id;
}

function getCurClient(){
    $user_id = 0;
    if (Zend_Auth::getInstance()->hasIdentity()){
        $identity = Zend_Auth::getInstance()->getStorage()->read();
        if (isset($identity->client_id)){
            $user_id = $identity->client_id;
        }
    }
    return $user_id;
}
function getCurEmployee(){
    $user_id = 0;
    if (Zend_Auth::getInstance()->hasIdentity()){
        $identity = Zend_Auth::getInstance()->getStorage()->read();
        if (isset($identity->employee_id)){
            $user_id = $identity->employee_id;
        }
    }
    return $user_id;
}

function getCurProvider(){
    $provider_id = 0;
    if (Zend_Auth::getInstance()->hasIdentity()){
        $identity = Zend_Auth::getInstance()->getStorage()->read();
        if (isset($identity->provider_id)){
            $provider_id = $identity->provider_id;
        }
    }
    if ($provider_id == null){
        return 0;
    }
    return $provider_id;
}
function getCurPositionCode(){
    $position_code = '';
    if (Zend_Auth::getInstance()->hasIdentity()){
        $identity = Zend_Auth::getInstance()->getStorage()->read();
        if (isset($identity->position_code)){
            $position_code = $identity->position_code;
        }
    }
    if ($position_code == null){
        return '';
    }
    return $position_code;
}

//Проверка есть ли право
function _check_grant_boolean($grant_code){
    $ob = new Application_Model_DbTable_System();
    $result = $ob->check_grant_boolean($grant_code);
    return $result['value'];
}

function set_array($a, $b){

    foreach ($b as $key=>$value){
        $a[$key] = $value;
    }
    return $a;
}

function is_checked_html($a){
    if ($a == 1){
        return "checked";
    } else {
        return "";
    }
}

function is_selected_html($a, $b){
    if ($a == $b){
        return " selected";
    } else {
        return "";
    }
}

function is_visible($position_code){
    if (getCurPositionCode() == 'ADMIN'){
        return "";
    }
    $arr = explode(',', $position_code);
    if (in_array(getCurPositionCode(), $arr)){
        return "";
    } else {
        return " hidden ";
    }
}

function tenge($number){
    if ($number == null) return $number;
    if ($number == '') return $number;
    try{
        if ($number == round($number))
            return number_format($number, 0, '.', '&nbsp;');
        else
            return number_format($number, 2, '.', '&nbsp;');
    } catch(Exception $e){
        return $number;
    }
}

function tenge_text($number){
    if ($number == null) return $number;
    if ($number == '') return $number;
    try{
        if ($number == round($number))
            return number_format($number, 0, '.', ' ');
        else
            return number_format($number, 2, '.', ' ');
    } catch(Exception $e){
        return $number;
    }
}

function log_mobile_sync($what, $msg, $status = "OK"){
    $file = $_SERVER['DOCUMENT_ROOT']."/log/okk/".date("Y.m.d H")."-00.txt";
    file_put_contents($file, date("d.m.y H:i:s").":" .$what." ".$status."\n\n", FILE_APPEND);
    file_put_contents($file, $msg."\n\n", FILE_APPEND);
}


