/**
 * Created by Yongnanzhu on 5/12/2014.
 */

//Global variable for counting the bubble number
var graphs = [];
var springy = null;
var Data = {};
Data.compartments = [];
Data.arrows = [];
Data.inhibitions = [];
Data.activations = [];
Data.compartmentId = [];
var str = [];
var processedIdex =0;
$(document).ready(function () {

    $.ajax({
        type: "GET",
        url: "getXmlFileName.php",
        cache: false,
        success: function(result){
            if(result instanceof Array)
            {
                if(result.length!==0)
                {
                    str = result;
                    var control = new Control();
                }
            }
        }
    });
});