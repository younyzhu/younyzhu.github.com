<?php
    header("Content-type: application/json");
   $file_x ="./tmpData/";
   $file_x .= $_POST['name'];
   if (file_exists($file_x))
    {
        echo true;
    }
    else
    {
        echo false;
    }
?>


