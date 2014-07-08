<?php
   header("Content-type: application/json");
   $json = $_POST['json'];
   $name = $_POST['name'];
   $info = json_encode($json);
   $file = fopen($name,'w+');
   fwrite($file, $info);
   fclose($file);
?>


