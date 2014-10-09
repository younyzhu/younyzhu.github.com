<?php
    header("Content-type: application/json");
   $file_x ="./tmpData/";
   $file_x .= $_POST['name'];
   if (fileExists($file_x))
    {
        echo true;
    }
    else
    {
        echo false;
    }
    function fileExists($path){
    return (@fopen($path,"r")==true);
    }
?>


