<?php
   header("Content-type: application/json");
   $keepData = $_POST['keepData'];
   $keepname = $_POST['keepname'];
   $file = fopen($keepname,'w+');
   fwrite($file, $keepData);
   fclose($file);

   $data = array($_POST['json']);;
   $arrlength=count($data);
   for($x=0;$x<$arrlength;$x++) {
   $file1 = fopen($x,'w+');
   fwrite($file1, $data[$x]);
   fclose($file1);
    }
?>


