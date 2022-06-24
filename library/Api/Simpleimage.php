<?php
 
/*
* File: SimpleImage.php
* Author: Simon Jarvis
* Copyright: 2006 Simon Jarvis
* Date: 08/11/06
* Link: http://www.white-hat-web-design.co.uk/articles/php-image-resizing.php
*
* This program is free software; you can redistribute it and/or
* modify it under the terms of the GNU General Public License
* as published by the Free Software Foundation; either version 2
* of the License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details:
* http://www.gnu.org/licenses/gpl.html
*
*/
 
class Api_Simpleimage {
 
   var $image;
   var $image_type;
   var $image_info;
 
   function load($filename) {
      $image_info = getimagesize($filename);
      $this->image_info = $image_info;
      $this->image_type = $image_info[2];
      if( $this->image_type == IMAGETYPE_JPEG ) {
          $this->image = imagecreatefromjpeg($filename);
      } elseif( $this->image_type == IMAGETYPE_GIF ) {
          $this->image = imagecreatefromgif($filename);
      } elseif( $this->image_type == IMAGETYPE_PNG ) {
          $this->image = imagecreatefrompng($filename);
      }
   }

   function save($filename) {
       if( $this->image_type == IMAGETYPE_JPEG ) {
           imagejpeg($this->image, $filename, 75);
       } elseif( $this->image_type == IMAGETYPE_GIF ) {
           imagegif($this->image, $filename);
       } elseif( $this->image_type == IMAGETYPE_PNG ) {
           imagepng($this->image, $filename);
       }
   }
   function output($image_type=IMAGETYPE_JPEG) {
 
      if( $image_type == IMAGETYPE_JPEG ) {
         imagejpeg($this->image);
      } elseif( $image_type == IMAGETYPE_GIF ) {
 
         imagegif($this->image);
      } elseif( $image_type == IMAGETYPE_PNG ) {
 
         imagepng($this->image);
      }
   }
   function getWidth() {
 
      return imagesx($this->image);
   }
   function getHeight() {
 
      return imagesy($this->image);
   }
   function resizeToHeight($height) {
 
      $ratio = $height / $this->getHeight();
      $width = $this->getWidth() * $ratio;
      $this->resize($width,$height);
   }
 
   function resizeToWidth($width) {
      $ratio = $width / $this->getWidth();
      $height = $this->getheight() * $ratio;
      $this->resize($width,$height);
   }
 
   function scale($scale) {
      $width = $this->getWidth() * $scale/100;
      $height = $this->getheight() * $scale/100;
      $this->resize($width,$height);
   }
 
   function resize($width,$height) {
      /*
       $new_image = imagecreatetruecolor($width, $height);
       if( $this->image_type == IMAGETYPE_PNG) {
           imagecolortransparent($this->image, imagecolorallocatealpha($this->image, 0, 0, 0, 127));
           imagealphablending($this->image, false);
           imagesavealpha($this->image, true);
       }


      imagecopyresampled($new_image, $this->image, 0, 0, 0, 0, $width, $height, $this->getWidth(), $this->getHeight());
      $this->image = $new_image;
    */

       $newImg = imagecreatetruecolor($width, $height);
       if( $this->image_type == IMAGETYPE_PNG) {
           imagealphablending($newImg, false);
           imagesavealpha($newImg, true);
           $transparent = imagecolorallocatealpha($newImg, 255, 255, 255, 127);
           imagefilledrectangle($newImg, 0, 0, $width, $height, $transparent);
       }
       imagecopyresampled($newImg, $this->image, 0, 0, 0, 0, $width, $height, $this->image_info[0], $this->image_info[1]);
       $this->image = $newImg;
   }
	/*
   function resize_hard($width, $height){
   		$w = $width;
   		$h = $height;
   		$w_src = $this->getWidth();
   		$h_src = $this->getHeight();
   		
   		if ($w >= $w_src && $h >= $h_src) return;
   		
   		//создаём пустую квадратную картинку 
         // важно именно truecolor!, иначе будем иметь 8-битный результат 
         $dest = imagecreatetruecolor($w,$h); 

         // вырезаем квадратную серединку по x, если фото горизонтальное 
         if ($h_src/$w_src < $h/$w)
		 	imagecopyresampled ($dest, $this->image, 0, ($h-$h_src*$w/$w_src)/2, 0, 0, $w, $h_src*$w/$w_src, $w_src, $h_src);                          
         if ($h_src/$w_src> $h/$w) 
         	imagecopyresampled ($dest, $this->image, ($w-$w_src*$h/$h_src)/2, 0, 0, 0, $w_src*$h/$h_src, $h, $w_src, $h_src); 
         // квадратная картинка масштабируется без вырезок 
         if ($w_src==$h_src) 
         	imagecopyresampled($dest, $this->image, 0, 0, 0, 0, $w, $w, $w_src, $w_src);
         $this->image = $dest; 
   	
   }*/

   function jcrop($x1, $y1, $x2, $y2,$Wi){
     $w = $this->getWidth();
     $h = $this->getHeight();
     if ($w >= $h){
        $x1 = round($this->getWidth()*$x1/400);
        $x2 = round($this->getWidth()*$x2/400);
        $y1 = round($this->getHeight()*$y1/(400*$h/$w));
     }
     else{
        $x1 = round($this->getWidth()*$x1/(400*$w/$h));
         $x2 = round($this->getWidth()*$x2/(400*$w/$h));
         $y1 = round($this->getHeight()*$y1/400);
     }
     $w =($x2 - $x1);
     $h = $w;
     //$h = $y2 - $y1;
     $dest = imagecreatetruecolor($w,$h);
     imagecopyresampled($dest,$this->image, 0, 0, $x1, $y1, $w, $h, $w, $h);
     $this->image=$dest;
     $this->resize_square($Wi,$Wi);
     $dest=$this->image;
     $w=$this->getWidth();
     $r = $w/2-1; //радиус окружности
     $a = $w/2; //центр окружности
       for($x=0;$x<$w;$x++){
           for($y=0;$y<$w;$y++){
               $d = sqrt( ($a - $x)*($a - $x) + ($a - $y)*($a - $y));
               if ($d > $r) {
                   imagealphablending($dest, false);
                   imagesavealpha($dest,true);
                   $red = imagecolorallocatealpha($dest, 255, 0, 0, 127);
                   imagesetpixel($dest, $x, $y, $red);
               }
               if ($d >= $r - 4 and $d <= $r) {
                   imagealphablending($dest, false);
                   imagesavealpha($dest,true);
                   $color = imagecolorat($dest, $x, $y);
                   $rc = ($color >> 16) & 0xFF;
                   $gc = ($color >> 8) & 0xFF;
                   $bc = $color & 0xFF;

                   $red = imagecolorallocatealpha($dest, $rc,$gc,$bc, 31*($d - ($w/2 - 5) ));
                   imagesetpixel($dest, $x, $y, $red);
               }
           }
       }
       $this->image = $dest;
   }
   
   function resize_square($width, $height){
   		$w = $width;
   		$h = $height;
   		$w_src = $this->getWidth();
   		$h_src = $this->getHeight();
   		
   		if ($w >= $w_src && $h >= $h_src) return;
   		
   		//создаём пустую квадратную картинку 
         // важно именно truecolor!, иначе будем иметь 8-битный результат 
         $dest = imagecreatetruecolor($w,$h); 

         // вырезаем квадратную серединку по x, если фото горизонтальное 
         if ($w_src >= $h_src){
		 	imagecopyresampled ($dest, $this->image, 0, 0, $w_src/2 - $h_src/2, 0, $w, $h, $h_src, $h_src);                          
         } else {
       		imagecopyresampled ($dest, $this->image, 0, 0, 0, ($h_src - $w_src)/4 , $w, $h, $w_src, $w_src);                          
         }
		 $this->image = $dest; 
   	
   }
   
	function resize_avatar($width, $height){
   		$w = $width;
   		$h = $height;
   		$w_src = $this->getWidth();
   		$h_src = $this->getHeight();
   		
   		if ($w >= $w_src && $h >= $h_src) return;
   		
   		//создаём пустую квадратную картинку 
         // важно именно truecolor!, иначе будем иметь 8-битный результат 
         $dest = imagecreatetruecolor($w,$h); 

         // вырезаем квадратную серединку по x, если фото горизонтальное 
         if ($w_src>$h_src)
         imagecopyresampled($dest, $this->image, 0, 0,
                          round((max($w_src,$h_src)-min($w_src,$h_src))/2),
                          0, $w, $w, min($w_src,$h_src), min($w_src,$h_src));
                          
         // вырезаем квадратную верхушку по y, 
         // если фото вертикальное (хотя можно тоже серединку) 
         if ($w_src<$h_src) 
         imagecopyresampled ($dest, $this->image, 0, 0, 0, 0, $w, $w,
                          min($w_src,$h_src), min($w_src,$h_src)); 
         // квадратная картинка масштабируется без вырезок 
         if ($w_src==$h_src) 
         imagecopyresampled($dest, $this->image, 0, 0, 0, 0, $w, $w, $w_src, $w_src);
         $this->image = $dest; 
   	
   }

    function resize_with_proportions($max_side){

        $w_src = $this->getWidth();
        $h_src = $this->getHeight();

        if ($w_src > $h_src) {
            $w = $max_side;
            $h = $max_side / $w_src * $h_src;
        } else {
            $h = $max_side;
            $w = $max_side / $h_src * $w_src;
        }


        if ($w >= $w_src && $h >= $h_src) return;

        //создаём пустую картинку
        // важно именно truecolor!, иначе будем иметь 8-битный результат
        $dest = imagecreatetruecolor($w,$h);
        imagecopyresampled($dest, $this->image, 0, 0, 0, 0, $w, $h, $this->getWidth(), $this->getHeight());

        $this->image = $dest;

    }
 
}
?>