/**
 * Created by Yongnanzhu on 5/12/2014.
 */

//Global variable for counting the bubble number
var BUBBLE_COUNT = 0;
var Bubbles = [];
var vcMenu_status = false;
var navigationCanvas = null;
var pathConnection = null;
var nvWidth = 0;
var Compares = [];
//var Charts = [];   //change to 1;     every chart belongs to a bubble
function getPositions(id) {

    var $bubble = $('#bubble' + id);
    var pos = $bubble.position(); //offset()
    var width = $bubble.width();
    var height = $bubble.height();
    //Get the left, right, top, bottom boundary of the Box
    return [
        [ pos.left, pos.left + width ],
        [ pos.top, pos.top + height ]
    ];
}

function checkElementExist(id) {
    return ($('bubble' + id).length > 0);
}

function checkCollisions(Id1, Id2) {
    if (checkElementExist(Id1) && checkElementExist(Id2))
        return false;
    var box1 = getPositions(Id1);
    var box2 = getPositions(Id2);
    return !((box2[0][0] > box1[0][1])//box2 left > box1 right
        || (box2[0][1] < box1[0][0])//box2 right < box1 left
        || (box2[1][1] < box1[1][0])//box2 bottom < box1 top
        || (box2[1][0] > box1[1][0])); //box2 top < box1 bottom
}
function updateNavigationRect(i) {
    var groups = Compares[i].group;
    var position;
    var color;
    for (var t = 0; t < groups.length; t++) {
        position = $("#bubble" + groups[t]).offset();
        var currentPos = currentToBoxPos(position.left, position.top);
        for (var k = 0; k < navigationCanvas.shapes.length; ++k) {
            if (navigationCanvas.shapes[k] === null)
                continue;
            if (navigationCanvas.shapes[k].type === "BUBBLE" && navigationCanvas.shapes[k].Id === groups[t]) {
                if (t === 0)
                    color = navigationCanvas.shapes[k].getColor();
                else
                    navigationCanvas.shapes[k].strokeColor = color;
                navigationCanvas.updateRectPos(k, currentPos.x, currentPos.y);
            }
        }
    }
}


$(document).ready(function () {

    if (!Detector.webgl)
        Detector.addGetWebGLMessage();
    Bubbles.push(0);//begin
    THREEx.FullScreen.bindKey({ charCode: 'f'.charCodeAt(0) });
    var mousePosX, mousePosY;
    $('#bgCanvas').on('contextmenu', function (e) {
        mousePosX = e.clientX;
        mousePosY = e.clientY;
        //var m = "x: " + e.clientX + "y" + e.clientY;
        //window.console && console.log(m);
    });

    $('#bubble').contextMenu({
        selector: '#bgCanvas',
        callback: function (key) {
            //var m = "clicked: " + key;
            //window.console && console.log(m) || alert(m);
            if (key === 'Open_Bubble') {
                BUBBLE_COUNT++;
                addBubble(BUBBLE_COUNT, 'DMRI brain bundles', mousePosX, mousePosY, null, null, null, null);
                //manageBubblePos(BUBBLE_COUNT);
                /*$('#bubble'+BUBBLE_COUNT).css({
                 left : mousePosX,
                 top : mousePosY
                 }); */
            }
            else if (key === 'Open_VC_Menu') {
                if (vcMenu_status === false) {
                    addVisualCueMenu();
                    var $vcMenu = $('#vcMenu');
                    $vcMenu.css({
                        left: mousePosX,
                        top: mousePosY
                    });
                    vcMenu_status = true;
                }
                else {
                    alert("You opened the menu!");
                }
            }
            else if (key == 'Compare') {
                var compareId = Compares.length;
                var comparedBubble = new Comparison(compareId);
                comparedBubble.findCheckedBubbles();
                if(comparedBubble.group.length>0)
                {
                    comparedBubble.groupComparedBubble();
                    Compares.push(comparedBubble);
                    updateNavigationRect(compareId);
                }
                else
                {
                      alert("You do not select any bubble! Please select the bubble you want to compare!");
                }
            }
            else if (key === 'Delete_All') //buble numer camer from 1...n
            {
                for(var i=0; i<Compares.length; ++i)
                {
                    Compares[i].removeCompareBubble();
                }
//                for(var i=0; i<Charts.length; ++i)
//                {
//                    Charts[i].removeChart();
//                }
                while (BUBBLE_COUNT) {
                    if (Bubbles[BUBBLE_COUNT] !== null) {

                        $("#bubble" + BUBBLE_COUNT).remove();
                        var le = Bubbles[BUBBLE_COUNT].getlinkNodes().length;

                        if (Bubbles[BUBBLE_COUNT].selectors.length) {
                            Bubbles[BUBBLE_COUNT].removeAllSelectors();
                        }
                        for (var i = 0; i < le; ++i) {
                            var next = Bubbles[BUBBLE_COUNT].getlinkNodes()[i].connectTo;
                            for (var j = 0; j < Bubbles[next].getlinkNodes().length; ++j) {
                                if (Bubbles[BUBBLE_COUNT].getlinkNodes()[i].connectionId === Bubbles[next].getlinkNodes()[j].connectionId)
                                    Bubbles[next].spliceNodeLink(j);
                            }
                            pathConnection.remove(Bubbles[BUBBLE_COUNT].getlinkNodes()[i].connectionId);
                        }
                        if(Bubbles[BUBBLE_COUNT].chart)
                        {
                            Bubbles[BUBBLE_COUNT].chart.removeChart();
                        }
                    }
                    BUBBLE_COUNT--;
                }
                BUBBLE_COUNT = 0;
                Bubbles.length = 1;
                if ($vcMenu !== undefined) {
                    $vcMenu.remove();
                }
                if (navigationCanvas !== undefined) {
                    navigationCanvas.clear();
                    navigationCanvas.shapes.length = 0;

                    navigationCanvas = new NavCanvas(document.getElementById('navCanvas'));
                    var currentView = new Rectangle(navigationCanvas, 0, 0, nvWidth, 50, 'rgba(255,255,255,0.7)', false);
                    navigationCanvas.addShape(currentView);
                }
            }
        },
        items: {
            "Open_Bubble": {name: "Open_bubble", disabled: false},
            "Open_VC_Menu": {name: "Open_vc_menu", disabled: false},
            "Compare": {name: "Compare", disabled: false},
            "sep1": "---------",
            "Delete_All": {name: "Delete_all", disabled: false}
        }
    });
    $(".drag").draggable();
    //set navigation Bar
    navigationCanvas = new NavCanvas(document.getElementById('navCanvas'));
    nvWidth = 50 / (window.innerHeight - 50) * window.innerWidth;
    var currentView = new Rectangle(navigationCanvas, 0, 0, nvWidth, 50, 'rgba(255,255,255,0.7)', false);
    navigationCanvas.addShape(currentView);
    pathConnection = new PathConnections(document.getElementById('bgCanvas'), window.innerWidth, window.innerHeight);

});