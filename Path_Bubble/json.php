<?php
   header("Content-type: application/json");
   $json = $_POST['json'];
   $name = $_POST['name'];
   $file = fopen($name,'w+');
   fwrite($file, $json);
   fclose($file);

   $file = fopen("./data/data.json",'w+');
   fwrite($file, $json);
   fclose($file);

   $log = $_POST['log'];
   $logName = $_POST['logName'];
   $file = fopen($logName,'w+');
   fwrite($file, $log);
   fclose($file);
?>


