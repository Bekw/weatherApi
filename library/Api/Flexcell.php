<?php

class Api_Flexcell {
 
    var $excel;
    var $worksheet;

    function load($filename) {
        $this->excel = PHPExcel_IOFactory::load($filename);
        $this->excel->setActiveSheetIndex(0);
        $this->worksheet = $this->excel->getActiveSheet();

        //column начинается с нуля
        //row начинается с единицы

    }
    function setActiveSheet($index){
        $this->excel->setActiveSheetIndex($index);
        $this->worksheet = $this->excel->getActiveSheet();
    }
    function getActiveSheet(){
        return $this->worksheet;
    }
    function addSheet($x, $sheetIndex){
        $this->excel->addSheet($x, $sheetIndex);
    }
    function removeSheetByIndex($index){
        $this->excel->removeSheetByIndex($index);
    }
    function setFont($range, $size){
        $this->excel->getActiveSheet()->getStyle($range)->getFont()->setSize($size);
    }

    function test(){
        //$str = 'scan##';
        //echo substr('scan##tnved##', 0, strlen($str));
        //return;
        $cell = $this->getCellByValue('scan##', false);
        if ($cell != false)
            $this->worksheet->setCellValueByColumnAndRow($cell['col'], $cell['row'], 'bbb');
    }

    function export($name){
        ob_end_clean();

        header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
        header("Cache-Control: no-store, no-cache, must-revalidate");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        header('Content-Disposition: attachment;filename="'.$name.'.xls"');
        header('Content-Type: application/vnd.ms-excel');
        //header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        //header('Content-Disposition: attachment;filename="Report"');

        $objWriter = PHPExcel_IOFactory::createWriter($this->excel, 'Excel5');
        //$objWriter = new PHPExcel_Writer_Excel5($this->excel);
        ob_end_clean();

        $objWriter->save('php://output');
        $this->excel->disconnectWorksheets();
    }

    function getCellByValue($str, $full = true){
        $lstr = strlen($str);
        for ($i=1; $i<50; $i++){
            for ($j=0; $j<50; $j++){
                //полное вхождение текста
                if ($full){
                    if ($this->worksheet->getCellByColumnAndRow($j, $i) == $str ){
                        $cell['row'] = $i;
                        $cell['col'] = $j;
                        return $cell;
                    }
                }
                else{
                    //вхождение по первым буквам (длина искомой строки)
                    if (substr($this->worksheet->getCellByColumnAndRow($j, $i), 0, $lstr) == $str ){
                        $cell['row'] = $i;
                        $cell['col'] = $j;
                        return $cell;
                    }
                }

            }
        }
        return false;
    }

    function setSingleRowData($row){
        foreach ($row as $key => $value){
            //$key ключь он же индекс
            //$value значение
            $cell = $this->getCellByValue('##'.$key.'##');
            if ($cell != false)
                $this->worksheet->setCellValueByColumnAndRow($cell['col'], $cell['row'], $value);
        }
    }

    function setVariable($name, $value){
        $cell = $this->getCellByValue('var##'.$name.'##');
        if ($cell != false)
            $this->worksheet->setCellValueByColumnAndRow($cell['col'], $cell['row'], $value);
    }

    function setMultipleRowData($row, $dataset){
        //находим строку, в которой начинается scan##
        $first_cell = $this->getCellByValue($dataset.'##', false);
        //если элементов сканирования нет, то возвращаем false
        if ($first_cell == false)
            return false;
        //строка начала сканирования
        $first_row = $first_cell['row'];
        //добавляем n строк в файл
        if (count($row) > 1){
            $this->worksheet->insertNewRowBefore($first_row + 1, count($row)-1);
        }
        //создаем ассоциативный массив с первоначальными координатами необходимых элементов
        unset($cell_field);
        for ($j=0; $j<150; $j++){
            $str = $this->worksheet->getCellByColumnAndRow($j, $first_row);
            if (substr($str, 0, strlen($dataset)) == $dataset){
                $str = substr($str, strlen($dataset), strlen($str) - strlen($dataset) + 1 );
                $str = str_replace('##', '', $str);
                //теперь $str содержит название поля
                $cell_field[$str]['row'] = $first_row;
                $cell_field[$str]['col'] = $j;
            }
        }
        //заполняем таблица датасетом
        for ($i=0; $i < count($row); $i++){
            foreach ($row[$i] as $key => $value){
                if (isset($cell_field[$key]['col'])){
                    $this->worksheet->setCellValueByColumnAndRow($cell_field[$key]['col'] , $first_row + $i, $value);
                }
            }

        }

    }
 
}
?>