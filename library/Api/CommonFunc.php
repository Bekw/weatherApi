<?php
    function clearParam($param){
        $pos = strpos($param,'-p1');
        if($pos > 0){
            $str = substr($param,$pos+2,3);
            if(preg_match("/^[\d\+]+$/",$str) == true){
                return substr($param,0,strlen($param)-5);
            }
            else{
                return $param;
            }
        }
        else{
            return $param;
        }
    }

    function move_uploaded_file_smart($tmpFile, $newFile){
        /*
        $str = $_SERVER['DOCUMENT_ROOT'].'/documents/';
        if (strpos($newFile, $str) !== false){
            $newFile = str_replace($str, $str . date('Y.m.d').'/', $newFile);
        }*/
        $path_parts = pathinfo($newFile);
        if (!file_exists($path_parts['dirname'])) {
            mkdir($path_parts['dirname'], 0777, true);
        }
        if(move_uploaded_file($tmpFile, $newFile)) {
            return true;
        } else {
            return false;
        }

    }
    function getHttpHost(){
        if(isset($_SERVER['HTTPS'])){
            $protocol = ($_SERVER['HTTPS'] && $_SERVER['HTTPS'] != "off") ? "https" : "http";
        }
        else{
            $protocol = 'http';
        }
        return $protocol . "://" . $_SERVER['HTTP_HOST'];
    }

    function checkForMobile(){
        $phone_array = array('iphone', 'android', 'pocket', 'palm', 'windows ce', 'windowsce', 'cellphone', 'opera mobi', 'ipod', 'small', 'sharp', 'sonyericsson', 'symbian', 'opera mini', 'nokia', 'htc_', 'samsung', 'motorola', 'smartphone', 'blackberry', 'playstation portable', 'tablet browser');
        $agent = strtolower( $_SERVER['HTTP_USER_AGENT'] );
        foreach ($phone_array as $value) {
            if (strpos($agent, $value) !== false ) return true;
        }

        return false;
    }

function json_fix_cyr($json_str) {
    $cyr_chars = array (
        '\u0430' => 'а', '\u0410' => 'А',
        '\u0431' => 'б', '\u0411' => 'Б',
        '\u0432' => 'в', '\u0412' => 'В',
        '\u0433' => 'г', '\u0413' => 'Г',
        '\u0434' => 'д', '\u0414' => 'Д',
        '\u0435' => 'е', '\u0415' => 'Е',
        '\u0451' => 'ё', '\u0401' => 'Ё',
        '\u0436' => 'ж', '\u0416' => 'Ж',
        '\u0437' => 'з', '\u0417' => 'З',
        '\u0438' => 'и', '\u0418' => 'И',
        '\u0439' => 'й', '\u0419' => 'Й',
        '\u043a' => 'к', '\u041a' => 'К',
        '\u043b' => 'л', '\u041b' => 'Л',
        '\u043c' => 'м', '\u041c' => 'М',
        '\u043d' => 'н', '\u041d' => 'Н',
        '\u043e' => 'о', '\u041e' => 'О',
        '\u043f' => 'п', '\u041f' => 'П',
        '\u0440' => 'р', '\u0420' => 'Р',
        '\u0441' => 'с', '\u0421' => 'С',
        '\u0442' => 'т', '\u0422' => 'Т',
        '\u0443' => 'у', '\u0423' => 'У',
        '\u0444' => 'ф', '\u0424' => 'Ф',
        '\u0445' => 'х', '\u0425' => 'Х',
        '\u0446' => 'ц', '\u0426' => 'Ц',
        '\u0447' => 'ч', '\u0427' => 'Ч',
        '\u0448' => 'ш', '\u0428' => 'Ш',
        '\u0449' => 'щ', '\u0429' => 'Щ',
        '\u044a' => 'ъ', '\u042a' => 'Ъ',
        '\u044b' => 'ы', '\u042b' => 'Ы',
        '\u044c' => 'ь', '\u042c' => 'Ь',
        '\u044d' => 'э', '\u042d' => 'Э',
        '\u044e' => 'ю', '\u042e' => 'Ю',
        '\u044f' => 'я', '\u042f' => 'Я',

        '\r' => '',
        '\n' => '<br />',
        '\t' => ''
    );

    foreach ($cyr_chars as $cyr_char_key => $cyr_char) {
        $json_str = str_replace($cyr_char_key, $cyr_char, $json_str);
    }
    return $json_str;
}

function send_to_post_express($result){
    $opts = array(
        'http'=>array(
            'method'  => 'POST',
            'header'  => 'Content-type: text/xml',
            'charset' => 'utf-8',
            'content' => $result
        )
    );

    $context = stream_context_create($opts);
    if (!$contents = @file_get_contents('https://home.courierexe.ru/api/', false, $context)) {
        if (!$curl = curl_init()) {
            $this->errors = 'Возможно не поддерживается передача по HTTPS. Проверьте наличие open_ssl';
            return false;
        }
        curl_setopt($curl, CURLOPT_URL, 'https://home.courierexe.ru/api/');
        curl_setopt($curl, CURLOPT_POSTFIELDS, $result);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-type: text/xml; charset=utf-8'));
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $contents = curl_exec($curl);
        curl_close($curl);
    }

    if (!$contents) {
        $this->errors = 'Ошибка сервиса';
        return false;
    }
    return $contents;
}

function sizeFilter( $bytes ){
    $label = array( 'B', 'KB', 'MB', 'GB', 'TB', 'PB' );
    for( $i = 0; $bytes >= 1024 && $i < ( count( $label ) -1 ); $bytes /= 1024, $i++ );
    return( round( $bytes, 2 ) . " " . $label[$i] );
}

function zeroToNull($s){
    if ($s === "0" || $s === "")
        return null;
    else
        return $s;
}

function zeroToNullInt($s){
    if ($s === 0 || $s === "")
        return null;
    else
        return $s;
}

function log_kkb($what, $error, $status = "ERROR"){
    $file = $_SERVER['DOCUMENT_ROOT']."/log_kkb/".date("Y.m.d H")."-00.txt";
    if (file_exists($file)){
        file_put_contents($file, date("d.m.y H:i:s").":" .$what." ".$status." ". mb_substr($error, 0, 1000)."\n\n", FILE_APPEND);
    }  else {
        file_put_contents($file, date("d.m.y H:i:s").":" .$what." ".$status." ". mb_substr($error, 0, 1000)."\n\n", FILE_APPEND);
    }
}
function log_sql($func, $str, $p, $error){
    $file = $_SERVER['DOCUMENT_ROOT']."/log_sql/".date("Y.m.d H")."-00.txt";
    if (file_exists($file)){
        file_put_contents($file, date("d.m.y H:i:s").":" .$func."\n\n".$error." \n\n".$str."\n\n".json_encode($p)."\n\n", FILE_APPEND);
    }  else {
        file_put_contents($file, date("d.m.y H:i:s").":" .$func."\n\n".$error." \n\n".$str."\n\n".json_encode($p)."\n\n", FILE_APPEND);
    }
}

function log_unisender($what, $error, $status = "ERROR"){
    $file = $_SERVER['DOCUMENT_ROOT']."/log_unisender/".date("Y.m.d H")."-00.txt";
    if (file_exists($file)){
        file_put_contents($file, date("d.m.y H:i:s").":" .$what." ".$status." ". mb_substr($error, 0, 1000)."\n\n", FILE_APPEND);
    }  else {
        file_put_contents($file, date("d.m.y H:i:s").":" .$what." ".$status." ". mb_substr($error, 0, 1000)."\n\n", FILE_APPEND);
    }
}

function log_weather_api($what, $error, $status = "OK"){
    $file = $_SERVER['DOCUMENT_ROOT']."/log/log_api_weather/".date("Y.m.d H")."-00.txt";
    if (file_exists($file)){
        file_put_contents($file, date("d.m.y H:i:s").":" .$what." ".$status." ". $error ."\n\n", FILE_APPEND);
    }  else {
        file_put_contents($file, date("d.m.y H:i:s").":" .$what." ".$status." ". $error ."\n\n", FILE_APPEND);
    }
}

function send_to_unisender($post, $type){
    $url = '';
    if($type == 1){
        $url = 'https://api.unisender.com/ru/api/sendEmail?format=json';
    }else if($type == 2){
        $url = 'https://api.unisender.com/ru/api/checkEmail?format=json';
    }
    // Устанавливаем соединение
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_URL,$url);
    $result = curl_exec($ch);
    return $result;
}

function stage_status_color($stage_status_color){
    $color_stage = '';
    switch ($stage_status_color){
        case -1: $color_stage = ''; break;
        case 1: $color_stage = 'yellow'; break;
        case 2: $color_stage = 'red'; break;
        case 3: $color_stage = 'orange'; break;
        case 4: $color_stage = 'lightgreen'; break;
    }
    return $color_stage;
}



function buildTree(array $elements, $parentId = 0) {
    $branch = array();

    foreach ($elements as $element) {
        if ($element['check_list_pid'] == $parentId) {
            $children = buildTree($elements, $element['check_list_id']);
            if ($children) {
                $element['child'] = $children;
            }
            $branch[] = $element;
        }
    }

    return $branch;
}

function num_padezh($num){
    if($num == ''){
        return 'НЕ УКАЗАНО В РЕКВИЗИТАХ';
    }
    $nul = 'ноль';
    $ten = array(
        array('','одного','двух','трех','четырех','пяти','шести','семи', 'восьми','девяти'),
    );
    $a20 = array('десяти','одиннадцати','двенадцати','тринадцати','четырнадцати' ,'пятнадцати','шестнадцати','семнадцати','восемнадцати','девятнадцати');
    $tens = array(2=>'двадцати','тридцати','сорока','пятидесяти','шестидесяти','семидесяти' ,'восемидесяти','девяноста');
    $hundred = array('','ста','двести','триста','четыреста','пятиста','шестиста', 'семита','восемиста','девятиста');
    $unit = array(
        array('' ,'' ,'', 1),
        array('' ,'' ,'' ,0),
        array('тысячи' ,1),
        array('миллион' ,0),
        array('миллиард',0),
    );

    list($n) = explode('.',sprintf("%015.2f", floatval($num)));
    $out = array();
    if (intval($n) > 0) {
        foreach(str_split($n, 3) as $uk => $v)
        {
            if (!intval($v)) continue;
            $uk = sizeof($unit)-$uk-1;
            $gender = $unit[$uk][3];
            list($i1,$i2,$i3) = array_map('intval',str_split($v,1));

            $out[] = $hundred[$i1];
            if ($i2>1) $out[]= $tens[$i2].' '.$ten[$gender][$i3];
            else $out[]= $i2>0 ? $a20[$i3] : $ten[$gender][$i3];

            if ($uk>1) $out[]= morph($v,$unit[$uk][0],$unit[$uk][1],$unit[$uk][2]);
        }
    }
    else $out[] = $nul;
    return trim(preg_replace('/ {2,}/', ' ', join(' ',$out)));
}

function num2str($num){
    $nul = 'ноль';
    $ten = array(
        array('','один','два','три','четыре','пять','шесть','семь', 'восемь','девять'),
        array('','одна','две','три','четыре','пять','шесть','семь', 'восемь','девять'),
    );
    $a20 = array('десять','одиннадцать','двенадцать','тринадцать','четырнадцать' ,'пятнадцать','шестнадцать','семнадцать','восемнадцать','девятнадцать');
    $tens = array(2=>'двадцать','тридцать','сорок','пятьдесят','шестьдесят','семьдесят' ,'восемьдесят','девяносто');
    $hundred = array('','сто','двести','триста','четыреста','пятьсот','шестьсот', 'семьсот','восемьсот','девятьсот');
    $unit = array(
        array('' ,'' ,'', 1),
        array('' ,'' ,'' ,0),
        array('тысяча' ,'тысячи' ,'тысяч' ,1),
        array('миллион' ,'миллиона','миллионов' ,0),
        array('миллиард','милиарда','миллиардов',0),
    );

    list($n) = explode('.',sprintf("%015.2f", floatval($num)));
    $out = array();
    if (intval($n) > 0) {
        foreach(str_split($n, 3) as $uk => $v)
        {
            if (!intval($v)) continue;
            $uk = sizeof($unit)-$uk-1;
            $gender = $unit[$uk][3];
            list($i1,$i2,$i3) = array_map('intval',str_split($v,1));

            $out[] = $hundred[$i1];
            if ($i2>1) $out[]= $tens[$i2].' '.$ten[$gender][$i3];
            else $out[]= $i2>0 ? $a20[$i3] : $ten[$gender][$i3];

            if ($uk>1) $out[]= morph($v,$unit[$uk][0],$unit[$uk][1],$unit[$uk][2]);
        }
    }
    else $out[] = $nul;
    return trim(preg_replace('/ {2,}/', ' ', join(' ',$out)));
}
function morph($n, $f1, $f2, $f5){
    $n = abs(intval($n)) % 100;
    if ($n>10 && $n<20) return $f5;
    $n = $n % 10;
    if ($n>1 && $n<5) return $f2;
    if ($n==1) return $f1;
    return $f5;
}

function num_padezh2($number, $one, $two, $five) {
    if($number == ''){
        return 'НЕ УКАЗАНО В РЕКВИЗИТАХ';
    }
    if (($number - $number % 10) % 100 != 10) {
        if ($number % 10 == 1) {
            $result = $one;
        } elseif ($number % 10 >= 2 && $number % 10 <= 4) {
            $result = $two;
        } else {
            $result = $five;
        }
    } else {
        $result = $five;
    }
    return $result;
};

function russian_date($date, $year_short = false){
    if($date == ''){
        return 'НЕ УКАЗАНО В РЕКВИЗИТАХ';
    }
    $date=explode(".", $date);
    switch ($date[1]){
        case 1: $m='января'; break;
        case 2: $m='февраля'; break;
        case 3: $m='марта'; break;
        case 4: $m='апреля'; break;
        case 5: $m='мая'; break;
        case 6: $m='июня'; break;
        case 7: $m='июля'; break;
        case 8: $m='августа'; break;
        case 9: $m='сентября'; break;
        case 10: $m='октября'; break;
        case 11: $m='ноября'; break;
        case 12: $m='декабря'; break;
    }
    if($year_short){
        return '«'.$date[0].'» '.$m.' '.$date[2].' г.';
    }else{
        return '«'.$date[0].'» '.$m.' '.$date[2].' года';
    }
}

function short_fio($fio){
    if($fio == '' or is_null($fio)){
        return 'НЕ УКАЗАНО В РЕКВИЗИТАХ';
    }
    $words = explode(" ", $fio);
    $short_fio = "";
    foreach ($words as $key => $w) {
        if(!in_array($key, array(1, 2))){
            $short_fio .= $w.' ';
        }else{
            $short_fio .= mb_substr($w, 0,1, 'UTF-8').'. ';
        }
    }
    return $short_fio;
}

function mb_ucfirst($string, $encoding)
{
    $strlen = mb_strlen($string, $encoding);
    $firstChar = mb_substr($string, 0, 1, $encoding);
    $then = mb_substr($string, 1, $strlen - 1, $encoding);
    return mb_strtoupper($firstChar, $encoding) . $then;
}

function formatSizeUnits($url){
    if (file_exists($_SERVER['DOCUMENT_ROOT'].$url)) {
        $bytes = filesize($_SERVER['DOCUMENT_ROOT'].$url);
        if ($bytes >= 1073741824){
            $bytes = round(number_format($bytes / 1073741824, 2)) . ' GB';
        }
        elseif ($bytes >= 1048576){
            $bytes = round(number_format($bytes / 1048576, 2)) . ' MB';
        }
        elseif ($bytes >= 1024){
            $bytes = round(number_format($bytes / 1024, 2)) . ' KB';
        }
        elseif ($bytes > 1){
            $bytes = round($bytes) . ' B';
        }
        elseif ($bytes == 1){
            $bytes = round($bytes) . ' B';
        }
        else{
            $bytes = '0 bytes';
        }
    } else {
        $bytes = 'NONE';
    }


    return $bytes;
}
function subArraysToString($ar, $sep = ', ') {
    $str = '';
    foreach ($ar as $val) {
        $str .= implode($sep, $val);
        $str .= $sep; // add separator between sub-arrays
    }
    $str = rtrim($str, $sep); // remove last separator
    return $str;
}
?>