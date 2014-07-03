/**
 * Created by Yongnanzhu on 5/12/2014.
 */

//Global variable for counting the bubble number
var Bubbles = [];
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

$(document).ready(function () {
    THREEx.FullScreen.bindKey({ charCode: 'f'.charCodeAt(0) });
    var mousePosX, mousePosY;
    $('#bgCanvas').on('contextmenu', function (e) {
        mousePosX = e.clientX;
        mousePosY = e.clientY;
    });

    $('#bubble').contextMenu({
        selector: '#bgCanvas',
        callback: function (key) {
            //var m = "clicked: " + key;
            //window.console && console.log(m) || alert(m);
            if (key === 'Open_Bubble') {
                var bubble = new BubbleWidget(0,"xxx",mousePosX, mousePosY);
                bubble.initHtml();
            }
        },
        items: {
            "Open_Bubble": {name: "Open_bubble", disabled: false},
            "sep1": "---------"
        }
    });
    //$(".drag").draggable();
});