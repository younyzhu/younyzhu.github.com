/**
 * Created by Yongnanzhu on 5/19/2014.
 */
var __bind = function (fn, me) {
    return function () {
        return fn.apply(me, arguments);
    };
};

function NodeLink(type, id, connectTo) {    //bubble
    this.type = type;
    this.connectionId = id;
    this.connectTo = connectTo;
}
function getWidgetCenter(index) {
    var $bubbleId = $('#bubble' + index);
    var posx = $bubbleId.offset().left;//offset() or position()
    var posy = $bubbleId.offset().top;
    return {x: posx + $bubbleId.width() / 2, y: posy + $bubbleId.height() / 2};
}
function getChartCenter(index) {
    var $chartId = $('#chart' + index);
    var posx = $chartId.offset().left;//offset() or position()
    var posy = $chartId.offset().top;
    return {x: posx + $chartId.width() / 2, y: posy + $chartId.height() / 2};
}

function updateBubblePos(index, x, y) {
    var $bubbleId = $('#bubble' + index);
    var posx = $bubbleId.offset().left;//offset() or position()
    var posy = $bubbleId.offset().top;
    $bubbleId.css({
        left: posx + x,
        top: posy + y
    });
    if(Bubbles[index]!== null)
    {
        var le = Bubbles[index].getlinkNodes().length;
        for (var i = 0; i < le; ++i) {
            var next = Bubbles[index].getlinkNodes()[i].connectTo;
            if (Bubbles[index].getlinkNodes()[i].connectionId !== null && Bubbles[index] !== null && Bubbles[next] !== null) {
                pathConnection.update(Bubbles[index].getlinkNodes()[i].connectionId, getWidgetCenter(index), getWidgetCenter(next));
            }
        }
    }
}
function currentToBoxPos(mousePosX, mousePosY) {
    var widthPercent = mousePosX / window.innerWidth;
    var heightPercent = mousePosY / (window.innerHeight - 50);
    var left = nvWidth * widthPercent;
    var top = 50 * heightPercent; //50 is the height of the navigation bar;
    return {x: left, y: top};
}
function addBubble(id, name, mousePosX, mousePosY, selectedFibers, deletedFibers, objectCenter) {
    var bubblediv = $(bubble_div(id, name, mousePosX, mousePosY));
    $("#bubble").append(bubblediv);
    var bubble = new Bubble(id, selectedFibers, deletedFibers, objectCenter);//just Id
    Bubbles.push(bubble);
    try {
        bubble.init();
        //bubble.fillScene(); //add to the init();
        bubble.animate();
    }
    catch (e) {
        var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
        bubble.container.append(errorReport + e);
    }
    var $bubbleId = $('#bubble' + id);
    var boxWidth = $bubbleId.width() / window.innerWidth * nvWidth;
    var boxHeight = $bubbleId.height() / (window.innerHeight - 50) * 50;
    var pos = currentToBoxPos(mousePosX, mousePosY);
    var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    var currentView = new Rectangle(navigationCanvas, pos.x, pos.y, boxWidth, boxHeight, color, true, id, "BUBBLE");
    navigationCanvas.addShape(currentView);

    $bubbleId.draggable({ containment: '#bgCanvas', scroll: false,  //just dragable, do not need to move
        drag: function (ev, ui) {
            var position = ui.position;  //drag stop position
            var currentPos = currentToBoxPos(position.left, position.top);
            var currentId = parseInt($(this).attr('id').replace(/bubble/, ''));
            for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
                if (navigationCanvas.shapes[i] === null)
                    continue;
                if (navigationCanvas.shapes[i].type === "BUBBLE" && navigationCanvas.shapes[i].Id === currentId)
                    navigationCanvas.updateRectPos(i, currentPos.x, currentPos.y);
            }
            if(Bubbles[currentId] !== null)
            {
                var le = Bubbles[currentId].getlinkNodes().length;
                for (var i = 0; i < le; ++i) {
                    var type = Bubbles[currentId].getlinkNodes()[i].type;
                    if (type === "BUBBLE") {
                        var next = Bubbles[currentId].getlinkNodes()[i].connectTo;
                        if (Bubbles[currentId].getlinkNodes()[i].connectionId !== null && Bubbles[currentId] !== null && Bubbles[next] !== null) {
                            pathConnection.update(Bubbles[currentId].getlinkNodes()[i].connectionId, getWidgetCenter(currentId), getWidgetCenter(next));
                        }
                    }
                    else if (type === "CHART") {
                        pathConnection.update(Bubbles[currentId].getlinkNodes()[i].connectionId, getWidgetCenter(currentId), getChartCenter(currentId));
                    }
                }
            }
        }
    });
    //To do:  here has a bug, when we adjust the canvas //This is fixed by adjust the trackball
    $('canvas').draggable({ containment: '#bgCanvas', scroll: false}).resizable({
        resize: function (ev, ui) {
            var size = ui.size;
            var width = size.width / window.innerWidth * nvWidth;
            var height = size.height / (window.innerHeight - 50) * 50;
            //navigationCanvas.updateRectResize(id, width, height);
            for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
                if (navigationCanvas.shapes[i] === null)
                    continue;
                if (navigationCanvas.shapes[i].type === "BUBBLE" && navigationCanvas.shapes[i].Id === id)
                    navigationCanvas.updateRectResize(i, width, height);
            }
            bubble.onDivResize(size.width, size.height);
            if(Bubbles[id] !== null)
            {
                var le = Bubbles[id].getlinkNodes().length;
                for (var i = 0; i < le; ++i) {
                    var type = Bubbles[id].getlinkNodes()[i].type;
                    if (type === "BUBBLE") {
                        var next = Bubbles[id].getlinkNodes()[i].connectTo;
                        if (Bubbles[id].getlinkNodes()[i].connectionId !== null && Bubbles[id] !== null && Bubbles[next] !== null) {
                            pathConnection.update(Bubbles[id].getlinkNodes()[i].connectionId, getWidgetCenter(id), getWidgetCenter(next));
                        }
                    }
                    else if (type === "CHART") {
                        pathConnection.update(Bubbles[id].getlinkNodes()[i].connectionId, getWidgetCenter(id), getChartCenter(id));
                    }
                }
            }
        }
    });
    var flag = true;
    var parent = $bubbleId.contextMenu({
        selector: '.dragheader',
        callback: function (key) {

            if (key === "delete") {
                parent.remove();

                for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
                    if (navigationCanvas.shapes[i] === null)
                        continue;
                    if (navigationCanvas.shapes[i].type === "BUBBLE" && navigationCanvas.shapes[i].Id === id)
                        navigationCanvas.remove(i);
                }
                if(Bubbles[id] !== null)
                {
                    var le = Bubbles[id].getlinkNodes().length;
                    for (var i = 0; i < le; ++i) {
                        var type = Bubbles[id].getlinkNodes()[i].type;
                        if (type === "BUBBLE") {
                            var next = Bubbles[id].getlinkNodes()[i].connectTo;
                            for (var j = 0; j < Bubbles[next].getlinkNodes().length; ++j) {
                                if (Bubbles[id].getlinkNodes()[i].connectionId === Bubbles[next].getlinkNodes()[j].connectionId)
                                    Bubbles[next].spliceNodeLink(j);
                            }
                        }
                        pathConnection.remove(Bubbles[id].getlinkNodes()[i].connectionId);
                    }
                    Bubbles[id].removeAllSelectors();
                    delete bubble;
                    Bubbles[id] = null;
                }
            }
            else if (key === "axes") {
                if (flag) {
                    Bubbles[id].showAxesHelper();
                    flag = false;
                }
                else {
                    Bubbles[id].hideAxesHelper();
                    flag = true;
                }
            }
            else if (key === "refine") {
                $("#bubble" + id).children().children("#select_menu").show();
            }
            else if (key === "faChart") {
                addChart(id, $bubbleId);
                var connection = new Connection(getWidgetCenter(id), getChartCenter(id));
                pathConnection.addConnection(connection);
                var connectId = pathConnection.connections.length - 1;

                var node1 = new NodeLink("CHART", connectId, id);    //if connect type ==="CHART", just connect to chart with the same id;
                Bubbles[id].addlinkNode(node1);
            }
            else if (key === "export") {
                if (bubble.fiberSelector.selectedFibers.length !== 0 || bubble.fiberSelector.deletedFibers.length !== 0) {
                    BUBBLE_COUNT++;
                    var posx = $bubbleId.offset().left;//offset() or position()
                    var posy = $bubbleId.offset().top;
                    var refinefiber = bubble.fiberSelector.getRefineFiberId();

                    addBubble(BUBBLE_COUNT, 'Refined fiber bundles', posx + $bubbleId.width() + 30, posy, refinefiber.selectedFibersId, refinefiber.deletedFibersId, bubble.mainCenter);

                    var connection = new Connection(getWidgetCenter(id), getWidgetCenter(BUBBLE_COUNT));
                    pathConnection.addConnection(connection);
                    var connectId = pathConnection.connections.length - 1;

                    var node1 = new NodeLink("BUBBLE", connectId, BUBBLE_COUNT);
                    Bubbles[id].addlinkNode(node1);
                    var node2 = new NodeLink("BUBBLE", connectId, id);
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
            "axes": {name: "Axes"},
            "refine": {name: "Refine fibers"},
            "export": {name: "Export"},
            "faChart": {name: "FA Chart"}
        }
    });

    parent.children(".dragheader").children(".open_para").click(function () {
        parent.children("#paraMenu").toggle();
    });
    var $bubbleRefineMenu = $("#bubble" + id).children().children();
    $bubbleRefineMenu.children('#add').click(function () {
        bubble.addSelector();
    });
    $bubbleRefineMenu.children("#remove").click(function () {
        bubble.removeSelector();
    });
    $bubbleRefineMenu.children("#and").click(function () {
        bubble.And();
        bubble.resetAllResult();
    });
    $bubbleRefineMenu.children("#delete").click(function () {
        bubble.Delete();
    });
    $bubbleRefineMenu.children("#or").click(function () {
        bubble.Or();
    });
    var $bubbleparaMenu = $("#bubble" + id).children().children().children();
    $bubbleparaMenu.children('select').change(function () {
        var optionSelected = $(this).find("option:selected");
        var valueSelected = optionSelected.val();
        bubble.resetRenderShape(valueSelected);
        //var textSelected   = optionSelected.text();
        //alert(valueSelected + textSelected);
    });
    $bubbleparaMenu.children('#load').click(function(){
        var selected_file = $('#input').get(0).files[0];
        if(selected_file === null)
        {
            alert( "Please select a file!" );
        }
        else
        { /*
            var reader = new FileReader();
            reader.readAsText( selected_file );
            reader.onerror = function()
            {
                progress.innerHTML = "Could not read file, error code is " + reader.error.code;
            };

            reader.onprogress = function(event)
            {
                if (event.lengthComputable){
                    load = event.loaded;
                    total = event.total;
                    progress.innerHTML = event.loaded + "/" + event.total;
                }
            };

            reader.onload = function()
            {
                var tempdata = "";
                tempdata = reader.result;
                if(tempdata!=null && load == total)
                {

                }
            };  */
        }
    });


    var $colorpickerField = $("#bubble" + id).children().children().children().children('#colorpickerField');
    $colorpickerField.ColorPicker({
        onSubmit: function (hsb, hex, rgb, el) {
            $(el).val(hex);

            $(el).ColorPickerHide();
        },
        onBeforeShow: function () {
            $(this).ColorPickerSetColor(this.value);
        },
        onChange: function (hsb, hex, rgb) {
            $colorpickerField.val(hex);
            bubble.resetAllColors(rgb);
        }
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
    tmp += '        </div>';
    tmp += '        <div id="para_items">';
    tmp += '            <div class="para">Input file:';
    tmp += '                <input type="file" id="input">';
    tmp += '                <button type="button" id="load">Load</button>';
    tmp += '            </div>';
    tmp += '            <div class="para">Shape:';
    tmp += '                <select id="shape">';
    tmp += '                    <option value="Line">Line</option>';
    tmp += '                    <option value="Ribbon">Ribbon</option>';
    tmp += '                    <option value="Tube">Tube</option>';
    tmp += '                </select>';
    tmp += '            </div>';
    tmp += '            <div class="para">Color:';
    tmp += '                <input type="text" maxlength="6" size="6" id="colorpickerField" value="00ff00">';
    tmp += '            </div>';
    tmp += '            <div class="para">Size</div>';
    tmp += '            <div class="para">Texture</div>';
    tmp += '        </div>';
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
        if(Bubbles[id] !== null)
        {
            var le = Bubbles[id].getlinkNodes().length;
            for (var i = 0; i < le; ++i) {
                var next = Bubbles[id].getlinkNodes()[i].connectTo;
                if (Bubbles[id].getlinkNodes()[i].connectionId !== null && Bubbles[id] !== null && Bubbles[next] !== null) {
                    pathConnection.update(Bubbles[id].getlinkNodes()[i].connectionId, getWidgetCenter(id), getWidgetCenter(next));
                }
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
function addChart(id, $bubbleId) {
    var posx = $bubbleId.offset().left;//offset() or position()
    var posy = $bubbleId.offset().top;
    var chartdiv = $(chart_div(id, "FA Line Chart", posx + $bubbleId.width() + 30, posy));
    $("#bubble").append(chartdiv);

    var $chartId = $('#chart' + id);
    var boxWidth = $chartId.width() / window.innerWidth * nvWidth;
    var boxHeight = $chartId.height() / (window.innerHeight - 50) * 50;
    var pos = currentToBoxPos(posx + $bubbleId.width() + 30, posy);
    var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    var currentView = new Rectangle(navigationCanvas, pos.x, pos.y, boxWidth, boxHeight, color, true, id, "CHART");
    navigationCanvas.addShape(currentView);

    var linechartCanvas = document.getElementById('chartCanvas' + id);
    var lineChart = new LineChart(id, linechartCanvas);

    var childs = Bubbles[id].mainGroup.children;
    for (var i = 0; i < childs.length; ++i) {
        for (var j = 0; j < childs[i].children.length; ++j) {
            lineChart.addItem(childs[i].children[j].id, childs[i].children[j].FA);
        }
    }
    /*
     var lines =  Bubbles[id].mainGroup.children[0].children;
     for(var i=0; i< lines.length; ++i)
     {
     lineChart.addItem(lines[i].id, lines[i].FA);
     }
     */
    /*
     var FA = Bubbles[id].mainGroup.children[0].FA;
     for (var i = 0; i < FA.length; ++i) {
     lineChart.addItem(i, FA[i]);
     }
     */

    var parent = $('#chart' + id).draggable({ containment: '#bgCanvas', scroll: false,  //just dragable, do not need to move
        drag: function (ev, ui) {
            var position = ui.position;  //drag stop position
            var currentPos = currentToBoxPos(position.left, position.top);
            //navigationCanvas.updateRectPos(id, currentPos.x, currentPos.y);
            var currentId = parseInt($(this).attr('id').replace(/chart/, ''));

            for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
                if (navigationCanvas.shapes[i] === null)
                    continue;
                if (navigationCanvas.shapes[i].type === "CHART" && navigationCanvas.shapes[i].Id === currentId)
                    navigationCanvas.updateRectPos(i, currentPos.x, currentPos.y);
            }
            if(Bubbles[currentId] !== null)
            {
                var le = Bubbles[currentId].getlinkNodes().length;
                for (var i = 0; i < le; ++i) {
                    var type = Bubbles[currentId].getlinkNodes()[i].type;
                    if (type === "CHART") {
                        pathConnection.update(Bubbles[currentId].getlinkNodes()[i].connectionId, getWidgetCenter(currentId), getChartCenter(currentId));
                    }
                }
            }
        }
    });
    $('#chartCanvas' + id).resizable({
        resize: function () {
            var $canvas = $('#chartCanvas' + id);
            var width_ = $canvas.width();
            var height_ = $canvas.height();
            $canvas.attr({width: width_, height: height_});
            lineChart.resize(width_, height_);
            var width = width_ / window.innerWidth * nvWidth;
            var height = height_ / (window.innerHeight - 50) * 50;
            for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
                if (navigationCanvas.shapes[i] === null)
                    continue;
                if (navigationCanvas.shapes[i].type === "CHART" && navigationCanvas.shapes[i].Id === id)
                    navigationCanvas.updateRectResize(i, width, height);
            }
        }
    });

    parent.children(".dragheader").children(".close").click(function () {
        for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
            if (navigationCanvas.shapes[i] === null)
                continue;
            if (navigationCanvas.shapes[i].type === "CHART" && navigationCanvas.shapes[i].Id === id)
                navigationCanvas.remove(i);
        }
        parent.remove();
        if(Bubbles[id] !== null)
        {
            var le = Bubbles[id].getlinkNodes().length;
            for (var i = 0; i < le; ++i) {
                var type = Bubbles[id].getlinkNodes()[i].type;
                if (type === "CHART") //if chart has node
                {
                    pathConnection.remove(Bubbles[id].getlinkNodes()[i].connectionId);
                    Bubbles[id].spliceNodeLink(i);
                    $('#chart' + id).remove();
                }
            }
        }
    });
}
function chart_div(id, name, mousePosX, mousePosY) {   //Every Bubble has a char to show FA value.
    var tmp = '';
    tmp += '<div id ="chart' + id + '" class="chart shadow drag" style="position: absolute; left:' + mousePosX + 'px; top:' + mousePosY + 'px; ">';
    tmp += '    <div id ="drag' + id + '" class="dragheader">' + name;
    tmp += '        <span class="close">X</span>';
    tmp += '    </div>';
    tmp += '    <canvas id ="chartCanvas' + id + '"width="250" height="250" >';
    tmp += '    </canvas>';
    tmp += '</div>';
    return tmp;
}