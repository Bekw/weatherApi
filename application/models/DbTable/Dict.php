<?php

class Application_Model_DbTable_Dict extends Application_Model_DbTable_Parent{
    /* samples
    public function checkToken($token,$user_id){
        $p['user_id'] = $user_id;
        $p['token'] = $token;
        $result = $this->scalarSP('check_token(:user_id, :token) cnt', $p, 'cnt');
        return $result;
    }

    public function get_student($student_id){
        $p['student_id_'] = $student_id;
        $result = $this->getSP("get_student('cur', :student_id_)", $p);
        return $result;
    }

    public function get_control_student($student_id){
        $p['student_id'] = $student_id;
        $result = $this->readSP("get_control_student('cur',:student_id)",$p);
        return $result;
    }

    */
}