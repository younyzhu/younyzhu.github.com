/**
 * Created by Yongnanzhu on 5/12/2014.
 */

//Global variable for counting the bubble number
var BUBBLE_COUNT = 0;
//var Bubbles = [];
var vcMenu_status = false;
var navigationCanvas = null;
var pathConnection = null;
var nvWidth = 0;

$(document).ready(function(){

    if ( ! Detector.webgl )
        Detector.addGetWebGLMessage();
    //Bubbles.push(0);//begin
    var mousePosX, mousePosY;
    $('#bgCanvas').on('contextmenu', function(e) {
        var m = "x: " + e.clientX + "y" + e.clientY;
        mousePosX = e.clientX;
        mousePosY = e.clientY;
        window.console && console.log(m);
    });
    $('#bubble').contextMenu({
        selector: '#bgCanvas',
        callback: function(key, options) {
            //var m = "clicked: " + key;
            //window.console && console.log(m) || alert(m);
            if(key === 'Open_Bubble')
            {
                BUBBLE_COUNT++;
                addBubble(BUBBLE_COUNT,'5 fiber bundles',mousePosX,mousePosY);

                /*$('#bubble'+BUBBLE_COUNT).css({
                 left : mousePosX,
                 top : mousePosY
                 }); */
            }
            else if(key === 'Open_VC_Menu')
            {
                if(vcMenu_status===false)
                {
                    addVisualCueMenu();
                    $('#vcMenu').css({
                        left: mousePosX,
                        top: mousePosY
                    });
                    vcMenu_status = true;
                }
                else
                {
                    alert("You opened the menu!");
                }
            }
            else if(key === 'Delete_All') //buble numer camer from 1...n
            {
                while(BUBBLE_COUNT)
                {   if(Bubbles[BUBBLE_COUNT] !==null)
                    {
                        $("#bubble"+BUBBLE_COUNT).remove();
                        /*if( Bubbles[BUBBLE_COUNT].connectionId !== null)
                        {
                            var nex = Bubbles[BUBBLE_COUNT].connectTo;
                            pathConnection.remove(Bubbles[BUBBLE_COUNT].connectionId);
                            Bubbles[nex].setConnection(null, null);
                        } */
                    }
                    BUBBLE_COUNT--;
                }
                BUBBLE_COUNT = 0;
                //Bubbles.length =1;
                if($('#vcMenu')!==undefined)
                {
                    $('#vcMenu').remove();
                }
                if(navigationCanvas!==undefined)
                {
                    navigationCanvas.clear();
                    navigationCanvas.shapes.length = 0;

                    navigationCanvas = new NavCanvas( document.getElementById('navCanvas'));
                    var currentView = new Rectangle(navigationCanvas, 0, 0, nvWidth, 50, 'rgba(255,255,255,0.7)', false );
                    navigationCanvas.addShape(currentView);
                }
            }
        },
        items: {
            "Open_Bubble": {name: "Open_bubble", disabled: false},
            "Open_VC_Menu": {name: "Open_vc_menu", disabled: false},
            "sep1": "---------",
            "Delete_All": {name: "Delete_all", disabled: false}
        }
    });
    $(".drag").draggable();
    //set navigation Bar
    navigationCanvas = new NavCanvas( document.getElementById('navCanvas'));
    nvWidth = 50 / (window.innerHeight -50)* window.innerWidth;
    var currentView = new Rectangle(navigationCanvas, 0, 0, nvWidth, 50, 'rgba(255,255,255,0.7)', false );
    navigationCanvas.addShape(currentView);
    pathConnection = new PathConnections( document.getElementById('bgCanvas'), window.innerWidth, window.innerHeight);

});