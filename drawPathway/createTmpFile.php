<?php
   header("Content-type: application/json");
   $file_x ="./tmpData/";
   $file_x .= $_POST['name'];
   $createFile = touch($file_x);
   echo (file_exists($file_x));
?>


