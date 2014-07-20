<?php
   header("Content-type: application/json");
   $keepData = $_POST['keepData'];
   $keepname = $_POST['keepname'];
   $file = fopen($keepname,'w+');
   fwrite($file, $keepData);
   fclose($file);

   $data = $_POST['json'];
   $name = $_POST['name'];
   $file1 = fopen($name,'w+');
   fwrite($file1, $data);
   fclose($file1);
?>


