/**
 * Created by Yongnanzhu on 5/19/2014.
 */
var __bind = function (fn, me) {
    return function () {
        return fn.apply(me, arguments);
    };
};

function NodeLink(id, connectTo) {
    this.connectionId = id;
    this.connectTo = connectTo;
}
function getWidgetCenter(index) {
    var $bubbleId = $('#bubble' + index);
    var posx = $bubbleId.offset().left;//offset() or position()
    var posy = $bubbleId.offset().top;
    return {x: posx + $bubbleId.width() / 2, y: posy + $bubbleId.height() / 2};
}
function updateBubblePos(index, x, y) {
    var $bubbleId = $('#bubble' + index);
    var posx = $bubbleId.offset().left;//offset() or position()
    var posy = $bubbleId.offset().top;
    $bubbleId.css({
        left: posx + x,
        top: posy + y
    });

    var le = Bubbles[index].getlinkNodes().length;
    for (var i = 0; i < le; ++i) {
        var next = Bubbles[index].getlinkNodes()[i].connectTo;
        if (Bubbles[index].getlinkNodes()[i].connectionId !== null && Bubbles[index] !== null && Bubbles[next] !== null) {
            pathConnection.update(Bubbles[index].getlinkNodes()[i].connectionId, getWidgetCenter(index), getWidgetCenter(next));
        }
    }
}

function addBubble(id, name, mousePosX, mousePosY, selectedFibers, deletedFibers, objectCenter) {
    var bubblediv = $(bubble_div(id, name, mousePosX, mousePosY));
    $("#bubble").append(bubblediv);
    var bubble = new Bubble(id, selectedFibers, deletedFibers, objectCenter);
    Bubbles.push(bubble);
    try {
        bubble.init();
        bubble.fillScene();
        bubble.animate();
    }
    catch (e) {
        var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
        bubble.container.append(errorReport + e);
    }

    function currentToBoxPos(mousePosX, mousePosY) {
        var widthPercent = mousePosX / window.innerWidth;
        var heightPercent = mousePosY / (window.innerHeight - 50);
        var left = nvWidth * widthPercent;
        var top = 50 * heightPercent; //50 is the height of the navigation bar;
        return {x: left, y: top};
    }

    var $bubbleId = $('#bubble' + id);
    var boxWidth = $bubbleId.width() / window.innerWidth * nvWidth;
    var boxHeight = $bubbleId.height() / (window.innerHeight - 50) * 50;
    var pos = currentToBoxPos(mousePosX, mousePosY);
    var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    var currentView = new Rectangle(navigationCanvas, pos.x, pos.y, boxWidth, boxHeight, color, true);
    navigationCanvas.addShape(currentView);

    $(".bubble").draggable({ containment: '#bgCanvas', scroll: false,
        drag: function (ev, ui) {
            var position = ui.position;  //drag stop position
            var currentPos = currentToBoxPos(position.left, position.top);
            var currentId = parseInt($(this).attr('id').replace(/bubble/, ''));
            navigationCanvas.updateRectPos(currentId, currentPos.x, currentPos.y);

            var le = Bubbles[id].getlinkNodes().length;
            for (var i = 0; i < le; ++i) {
                var next = Bubbles[currentId].getlinkNodes()[i].connectTo;
                if (Bubbles[currentId].getlinkNodes()[i].connectionId !== null && Bubbles[currentId] !== null && Bubbles[next] !== null) {
                    pathConnection.update(Bubbles[currentId].getlinkNodes()[i].connectionId, getWidgetCenter(currentId), getWidgetCenter(next));
                }
            }
        },
        stop: function (ev, ui) {
            var position = ui.position;  //drag stop position
            var currentPos = currentToBoxPos(position.left, position.top);
            var currentId = parseInt($(this).attr('id').replace(/bubble/, ''));
            navigationCanvas.updateRectPos(currentId, currentPos.x, currentPos.y);

            var le = Bubbles[id].getlinkNodes().length;
            for (var i = 0; i < le; ++i) {
                var next = Bubbles[currentId].getlinkNodes()[i].connectTo;
                if (Bubbles[currentId].getlinkNodes()[i].connectionId !== null && Bubbles[currentId] !== null && Bubbles[next] !== null) {
                    pathConnection.update(Bubbles[currentId].getlinkNodes()[i].connectionId, getWidgetCenter(currentId), getWidgetCenter(next));
                }
            }
        }
    });
    $("canvas").draggable({ containment: '#bgCanvas', scroll: false}).resizable({
        resize: function () {
            var width = $bubbleId.width() / window.innerWidth * nvWidth;
            var height = $bubbleId.height() / (window.innerHeight - 50) * 50;
            navigationCanvas.updateRectResize(id, width, height);

            var le = Bubbles[id].getlinkNodes().length;
            for (var i = 0; i < le; ++i) {
                var next = Bubbles[id].getlinkNodes()[i].connectTo;
                if (Bubbles[id].getlinkNodes()[i].connectionId !== null && Bubbles[id] !== null && Bubbles[next] !== null) {
                    pathConnection.update(Bubbles[id].getlinkNodes()[i].connectionId, getWidgetCenter(id), getWidgetCenter(next));
                }
            }
        }
    });

    var parent = $bubbleId.contextMenu({
        selector: '.dragheader',
        callback: function (key) {
            if (key === "delete") {
                parent.remove();
                navigationCanvas.remove(id);
                var le = Bubbles[id].getlinkNodes().length;
                for (var i = 0; i < le; ++i) {
                    var next = Bubbles[id].getlinkNodes()[i].connectTo;
                    for (var j = 0; j < Bubbles[next].getlinkNodes().length; ++j) {
                        if (Bubbles[id].getlinkNodes()[i].connectionId === Bubbles[next].getlinkNodes()[j].connectionId)
                            Bubbles[next].spliceNodeLink(j);
                    }

                    pathConnection.remove(Bubbles[id].getlinkNodes()[i].connectionId);
                }
                delete bubble;
                Bubbles[id] = null;
            }
            else if (key === "refine") {
                $("#bubble" + id).children().children("#select_menu").show();
            }
            else if (key === "export") {
                if (bubble.fiberSelector.selectedFibers.length !==0 || bubble.fiberSelector.deletedFibers.length !==0 ) {
                    BUBBLE_COUNT++;
                    var posx = $bubbleId.offset().left;//offset() or position()
                    var posy = $bubbleId.offset().top;
                    var refinefiber = bubble.fiberSelector.getRefineFiberId();

                    addBubble(BUBBLE_COUNT, 'Refined fiber bundles', posx + $bubbleId.width() + 30, posy,refinefiber.selectedFibersId, refinefiber.deletedFibersId, bubble.mainCenter );

                    var connection = new Connection(getWidgetCenter(id), getWidgetCenter(BUBBLE_COUNT));
                    pathConnection.addConnection(connection);
                    var connectId = pathConnection.connections.length - 1;

                    var node1 = new NodeLink(connectId, BUBBLE_COUNT);
                    Bubbles[id].addlinkNode(node1);
                    var node2 = new NodeLink(connectId, id);
                    Bubbles[BUBBLE_COUNT].addlinkNode(node2);
                    //Bubbles[id].setConnection(connectId,BUBBLE_COUNT);
                    //Bubbles[BUBBLE_COUNT].setConnection(connectId,id);
                }
                else {
                    alert('Please refine a model, before export the certain your refined result!');
                }
            }

        },
        items: {
            "delete": {name: "Delete"},
            "refine": {name: "Refine fibers"},
            "export": {name: "Export"}
        }
    });

    parent.children(".dragheader").children(".open_para").click(function () {
        parent.children("#paraMenu").toggle();
    });
    var $bubbleRefineMenu = $("#bubble" + id).children().children();
    $bubbleRefineMenu.children('#add').click(function(){
        bubble.addSelector();
    });
    $bubbleRefineMenu.children("#remove").click(function(){
        bubble.removeSelector();
    });
    $bubbleRefineMenu.children("#and").click(function(){
        bubble.And();
    });
    $bubbleRefineMenu.children("#delete").click(function(){
        bubble.Delete();
    });
    $bubbleRefineMenu.children("#or").click(function(){
        bubble.Or();
    });
}
function bubble_div(id, name, mousePosX, mousePosY) {
    var tmp = '';
    tmp += '<div id ="bubble' + id + '" class="bubble shadow drag" style="position: absolute; left:' + mousePosX + 'px; top:' + mousePosY + 'px; ">';
    tmp += '    <div id ="drag' + id + '" class="dragheader">' + name;
    tmp += '        <span class="open_para">O</span>';
    tmp += '        <div id="select_menu">';
    tmp += '            <button class="selectItem" id = "add" > + </button>';
    tmp += '            <button class="selectItem" id = "remove" > - </button>';
    tmp += '            <button class="selectItem" id = "and" > and </button>';
    tmp += '            <button class="selectItem" id = "delete" > delete </button>';
    tmp += '            <button class="selectItem" id = "or"  > or </button>';
    tmp += '        </div>';
    tmp += '    </div>';

    tmp += '    <div id="container' + id + '" height="400" width="400">';

    tmp += '    </div>';
    //
    tmp += '    <div id="paraMenu" class="widget shadow" style="position: absolute; left:385px; top:-17px; display: none">';
    tmp += '        <div class="para_header">Parameter';
    //tmp += '<span class="close_para">X</span>';
    tmp += '        </div>';
    tmp += '        <ul id="para_items">';
    tmp += '            <li class="para">Size</li>';
    tmp += '                <li class="para">Texture</li>';
    tmp += '                <li class="para">Shape</li>';
    tmp += '        </ul>';
    tmp += '    </div>';
    //
    tmp += '</div>';
    return tmp;
}
//This function is called when the navigation bar is move,actually,
//the navigation bar can move in horizontal direction
//So the whole bubble in screen space is just need to change the x-pos
function resetAllBubblesPos(xChange) {
    $('#bubble').children('.bubble').each(function () {
        var offLeft = $(this).position().left;
        $(this).css({left: offLeft - xChange});
        var id = parseInt($(this).attr('id').replace(/bubble/, ''));
        var le = Bubbles[id].getlinkNodes().length;
        for (var i = 0; i < le; ++i) {
            var next = Bubbles[id].getlinkNodes()[i].connectTo;
            if (Bubbles[id].getlinkNodes()[i].connectionId !== null && Bubbles[id] !== null && Bubbles[next] !== null) {
                pathConnection.update(Bubbles[id].getlinkNodes()[i].connectionId, getWidgetCenter(id), getWidgetCenter(next));
            }
        }

    });
}
function getWidgetInformation(index) {
    var $bubbleId = $('#bubble' + index);
    var width = $bubbleId.width();
    var height = $bubbleId.height();
    var posx = $bubbleId.offset().left;//offset() or position()
    var posy = $bubbleId.offset().top;
    var center = {x: posx + $bubbleId.width() / 2, y: posy + $bubbleId.height() / 2};
    return {w: width, h: height, left: posx, top: posy, center: center};
}
function manageBubblePos(index) {
    /*
     var childs = $('#bubble').children('.bubble');
     for(var i=0; i<childs.length; ++i)
     {
     if(i!==index)
     {

     if(checkCollisions(i,index))
     {
     // alert("Collision!");
     var $bubbleId = $('#bubble'+i);
     var $bubbleIndex = $('#bubble'+index);
     // $bubbleId.animate({ "left": "-="+step1+"px" }, "fast" );

     var bubble1 = getWidgetInformation(i);
     var bubble2 = getWidgetInformation(index);

     var center = {x:(bubble1.center.x+bubble2.center.x)/2.0, y:(bubble1.center.y+bubble2.center.y)/2.0};

     if(Math.abs(center.x-bubble1.center.x) < bubble1.w/2.0 || Math.abs(center.y-bubble1.center.y) < bubble1.h/2.0)
     {
     var Wlen = (bubble1.w/2 +bubble2.w/2) - Math.abs(bubble2.center.x - bubble1.center.x);
     var Hlen = (bubble1.h/2 +bubble2.h/2) - Math.abs(bubble2.center.y - bubble1.center.y);
     var step11 = Wlen * (bubble1.w)/(bubble1.w +bubble2.w);
     var step12 = Wlen * (bubble2.w)/(bubble1.w +bubble2.w);
     var step21 = Hlen * (bubble1.h)/(bubble1.h +bubble2.h);
     var step22 = Hlen * (bubble2.h)/(bubble1.h +bubble2.h);
     var IdLeft, IdTop;
     var IndexLeft, IndexTop;
     if(bubble1.center.x <center.x)
     {
     IdLeft = "-="+step11+"px";
     IndexLeft = "+="+step12+"px";
     }
     else
     {
     IdLeft = "+="+step11+"px";
     IndexLeft = "-="+step12+"px";
     }

     if(bubble1.center.y <center.y)
     {
     IdTop = "+="+step21+"px" ;
     IndexTop = "-="+ step22 +"px" ;
     }
     else
     {
     IdTop = "-="+step21+"px" ;
     IndexTop = "+="+ step22 +"px" ;
     }
     $bubbleId.animate({"left": IdLeft, "top": IdTop });
     $bubbleIndex.animate({ "left": IndexLeft, "top": IndexTop  } );
     }
     }
     }
     }
     */
    $('#bubble').children('.bubble').each(function () {
        var id = parseInt($(this).attr('id').replace(/bubble/, ''));
        if (id !== index) {

            if (checkCollisions(id, index)) {
                // alert("Collision!");
                var $bubbleId = $('#bubble' + id);
                var $bubbleIndex = $('#bubble' + index);
                // $bubbleId.animate({ "left": "-="+step1+"px" }, "fast" );

                var bubble1 = getWidgetInformation(id);
                var bubble2 = getWidgetInformation(index);

                var center = {x: (bubble1.center.x + bubble2.center.x) / 2.0, y: (bubble1.center.y + bubble2.center.y) / 2.0};

                if (Math.abs(center.x - bubble1.center.x) < bubble1.w / 2.0 || Math.abs(center.y - bubble1.center.y) < bubble1.h / 2.0) {
                    var Wlen = (bubble1.w / 2 + bubble2.w / 2) - Math.abs(bubble2.center.x - bubble1.center.x);
                    var Hlen = (bubble1.h / 2 + bubble2.h / 2) - Math.abs(bubble2.center.y - bubble1.center.y);
                    var step11 = Wlen * (bubble1.w) / (bubble1.w + bubble2.w);
                    var step12 = Wlen * (bubble2.w) / (bubble1.w + bubble2.w);
                    var step21 = Hlen * (bubble1.h) / (bubble1.h + bubble2.h);
                    var step22 = Hlen * (bubble2.h) / (bubble1.h + bubble2.h);
                    var IdLeft, IdTop;
                    var IndexLeft, IndexTop;
                    if (bubble1.center.x < center.x) {
                        IdLeft = "-=" + step11 + "px";
                        IndexLeft = "+=" + step12 + "px";
                    }
                    else {
                        IdLeft = "+=" + step11 + "px";
                        IndexLeft = "-=" + step12 + "px";
                    }

                    if (bubble1.center.y < center.y) {
                        IdTop = "+=" + step21 + "px";
                        IndexTop = "-=" + step22 + "px";
                    }
                    else {
                        IdTop = "-=" + step21 + "px";
                        IndexTop = "+=" + step22 + "px";
                    }
                    $bubbleId.animate({"left": IdLeft, "top": IdTop });
                    $bubbleIndex.animate({ "left": IndexLeft, "top": IndexTop  });
                }
            }
        }
    });
}

function bubble_visual_cue() {
    var tmp = '';
    tmp += '<div id="vcMenu" class="widget shadow drag" style="position: absolute; left:0px; top:400px;">';
    tmp += '<div class="dragheader">Visual Cue';
    tmp += '<span class="close">X</span>';
    tmp += '</div>';
    tmp += '<ul id="vitems">';
    tmp += '    <li class="cue1">Size</li>';
    tmp += '    <li class="cue2">Texture</li>';
    tmp += '    <li class="cue3">Shape</li>';
    tmp += '    <li class="cue4">Color</li>';
    tmp += '    <li class="cue5">Orientation</li>';
    tmp += '    <li class="cue6">Value</li>';
    tmp += '</ul>';
    tmp += '</div>';
    return tmp;
}
function addVisualCueMenu() {
    var vcdiv = $(bubble_visual_cue());
    $('body').append(vcdiv);
    $(".drag").draggable();
    var parent = $('#vcMenu');
    parent.children(".dragheader").children(".close").click(function () {
        parent.remove();
        vcMenu_status = false
    });
}