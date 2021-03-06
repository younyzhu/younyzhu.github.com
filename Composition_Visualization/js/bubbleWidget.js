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

function updateBubblePos(index, type, x, y) {
    if(type === "BUBBLE")
    {
        var $bubbleId = $('#bubble' + index);
        var posx = $bubbleId.offset().left;//offset() or position()
        var posy = $bubbleId.offset().top;
        $bubbleId.css({
            left: posx + x,
            top: posy + y
        });
        if (Bubbles[index] !== null) {
            var le = Bubbles[index].getlinkNodes().length;
            for (var i = 0; i < le; ++i) {
                var next = Bubbles[index].getlinkNodes()[i].connectTo;
                if (Bubbles[index].getlinkNodes()[i].connectionId !== null && Bubbles[index] !== null && Bubbles[next] !== null) {
                    pathConnection.update(Bubbles[index].getlinkNodes()[i].connectionId, getWidgetCenter(index), getWidgetCenter(next));
                }
            }
        }
    }
    else if(type === "CHART")
    {
        var $bubbleId = $('#chart' + index);
        var posx = $bubbleId.offset().left;//offset() or position()
        var posy = $bubbleId.offset().top;
        $bubbleId.css({
            left: posx + x,
            top: posy + y
        });
    }
    else if(type === "COMPARE")
    {
        var $bubbleId = $('#compare' + index);
        var posx = $bubbleId.offset().left;//offset() or position()
        var posy = $bubbleId.offset().top;
        $bubbleId.css({
            left: posx + x,
            top: posy + y
        });

        if (Compares[index] !== null) {
            var groups =Compares[index].group;
            for(var j=0; j< groups.length; ++j)
            {
                var le = Bubbles[ groups[j] ].getlinkNodes().length;
                for (var i = 0; i < le; ++i) {
                    var next = Bubbles[groups[j]].getlinkNodes()[i].connectTo;
                    if (Bubbles[groups[j]].getlinkNodes()[i].connectionId !== null && Bubbles[groups[j]] !== null && Bubbles[next] !== null) {
                        pathConnection.update(Bubbles[groups[j]].getlinkNodes()[i].connectionId, getWidgetCenter(groups[j]), getWidgetCenter(next));
                    }
                }
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
function addBubble(id, name, mousePosX, mousePosY, selectedFibers, deletedFibers, objectCenter, localFileName) {
    var bubblediv = $(bubble_div(id, name, mousePosX, mousePosY));
    $("#bubble").append(bubblediv);
    var bubble = new Model3d(id, selectedFibers, deletedFibers, objectCenter, null, localFileName);//just Id
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
            var bubbleType = $(this).attr('class').split(' ')[0]; //or .attr('class').replace(/^(\S*).*/, '$1');
            if(bubbleType === 'bubble')
            {
                for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
                    if (navigationCanvas.shapes[i] === null)
                        continue;
                    if (navigationCanvas.shapes[i].type === "BUBBLE" && navigationCanvas.shapes[i].Id === currentId)
                        navigationCanvas.updateRectPos(i, currentPos.x, currentPos.y);
                }
                if (Bubbles[currentId] !== null) {
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
            /*  //There is no need to add this.
            else if(bubbleType === "compare")
            {
                for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
                    if (navigationCanvas.shapes[i] === null)
                        continue;
                    if (navigationCanvas.shapes[i].type === "COMPARE" && navigationCanvas.shapes[i].Id === currentId)
                        navigationCanvas.updateRectPos(i, currentPos.x, currentPos.y);
                }
            }
            else if(bubbleType === "chart")
            {
                for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
                    if (navigationCanvas.shapes[i] === null)
                        continue;
                    if (navigationCanvas.shapes[i].type === "CHART" && navigationCanvas.shapes[i].Id === currentId)
                        navigationCanvas.updateRectPos(i, currentPos.x, currentPos.y);
                }
            } */
        }
    });

    //To do:  here has a bug, when we adjust the canvas //This is fixed by adjust the trackball
    $('canvas').draggable({ containment: '#bgCanvas', scroll: false}).resizable({
        resize: function (ev, ui) {
            var size = ui.size;
            var width = size.width / window.innerWidth * nvWidth;
            var height = size.height / (window.innerHeight - 50) * 50;

            for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
                if (navigationCanvas.shapes[i] === null)
                    continue;
                if (navigationCanvas.shapes[i].type === "BUBBLE" && navigationCanvas.shapes[i].Id === id)
                    navigationCanvas.updateRectResize(i, width, height);
            }
            bubble.onDivResize(size.width, size.height);
            if (Bubbles[id] !== null) {
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
                if (Bubbles[id] !== null) {  //This bubble is from the comparison group
                    if(Bubbles[id].compareId !== null)
                    {
                        var compareId =Bubbles[id].compareId;
                        var x, y, w, h, color;
                        for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
                            if (navigationCanvas.shapes[i] === null)
                                continue;
                            if (navigationCanvas.shapes[i].type === "COMPARE" && navigationCanvas.shapes[i].Id === compareId)
                            {

                                x= navigationCanvas.shapes[i].x;
                                y= navigationCanvas.shapes[i].y;
                                w= navigationCanvas.shapes[i].w;
                                h= navigationCanvas.shapes[i].h;
                                color = navigationCanvas.shapes[i].strokeColor;

                                navigationCanvas.remove(i);

                                var groups = Compares[compareId].group;
                                for(var j=0; j<groups.length; ++j)
                                {
                                    if(groups[j] === id)
                                    {
                                        groups.splice(j,1);
                                    }
                                }
                                var boxWidth = $("#bubble" + id).width() / window.innerWidth * nvWidth;
                                if( (w - boxWidth)>0)
                                {
                                    var compareView = new Rectangle(navigationCanvas, x, y, w - boxWidth, h, null, true, compareId, "COMPARE");
                                    navigationCanvas.addShape(compareView);
                                }
                                else
                                {
                                    $('#compare' + compareId).remove();
                                }
                                break;
                            }
                        }

                    }
                    else
                    {     //This bubble is just the bubble
                        for (var k = 0; k < navigationCanvas.shapes.length; ++k) {
                            if (navigationCanvas.shapes[k] === null)
                                continue;
                            if (navigationCanvas.shapes[k].type === "BUBBLE" && navigationCanvas.shapes[k].Id === id) {
                                navigationCanvas.remove(k);
                            }
                        }
                    }

                    var le = Bubbles[id].getlinkNodes().length;      //If the bubble has Node link
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
                parent.remove();
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
                //addChart(id, $bubbleId);
                var chart = new Chart(id);
                chart.initChart();
                //Charts.push(chart);
                Charts = chart;

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

                    addBubble(BUBBLE_COUNT, 'Refined fiber bundles', posx + $bubbleId.width() + 30, posy, refinefiber.selectedFibersId, refinefiber.deletedFibersId, bubble.mainCenter,bubble.localFileName);

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
    //var id = parseInt(parent.attr('id').replace(/bubble/, ''));
    $bubbleId.find(".open_para").click(function () {
        parent.children("#paraMenu").toggle();
    });
    /*
    parent.children(".dragheader").children(".open_para").click(function () {
        parent.children("#paraMenu").toggle();
    });
    */
    //var $bubbleRefineMenu = $("#bubble" + id).children().children().children();
    $bubbleId.find("#add").click(function () {
    //$bubbleRefineMenu.children('#add').click(function () {
        bubble.addSelector();
        if(bubble.COMPARE_FLAG)
        {
            var compareGroup = Compares[bubble.compareId].group;
            for(var i=0; i<compareGroup.length; ++i)
            {
                if( compareGroup[i] !== id)
                {
                    Bubbles[ compareGroup[i] ].addSelector();
                }
            }
        }
    });
    $bubbleId.find("#remove").click(function () {
    //$bubbleRefineMenu.children("#remove").click(function () {
        bubble.removeSelector();
        if(bubble.COMPARE_FLAG)
        {
            var compareGroup = Compares[bubble.compareId].group;
            for(var i=0; i<compareGroup.length; ++i)
            {
                if( compareGroup[i] !== id)
                {
                    Bubbles[ compareGroup[i] ].removeSelector();
                }
            }
        }
    });
    $bubbleId.find("#and").click(function () {
    //$bubbleRefineMenu.children("#and").click(function () {
        bubble.And();
        bubble.resetAllResult();
        if(bubble.COMPARE_FLAG)
        {
            var compareGroup = Compares[bubble.compareId].group;
            for(var i=0; i<compareGroup.length; ++i)
            {
                if( compareGroup[i] !== id)
                {
                    Bubbles[ compareGroup[i] ].And();
                    Bubbles[ compareGroup[i] ].resetAllResult();
                }
            }
        }
    });
    $bubbleId.find("#delete").click(function () {
    //$bubbleRefineMenu.children("#delete").click(function () {
        bubble.Delete();
        if(bubble.COMPARE_FLAG)
        {
            var compareGroup = Compares[bubble.compareId].group;
            for(var i=0; i<compareGroup.length; ++i)
            {
                if( compareGroup[i] !== id)
                {
                    Bubbles[ compareGroup[i] ].Delete();
                }
            }
        }
    });
    $bubbleId.find("#or").click(function () {
    //$bubbleRefineMenu.children("#or").click(function () {
        bubble.Or();
        if(bubble.COMPARE_FLAG)
        {
            var compareGroup = Compares[bubble.compareId].group;
            for(var i=0; i<compareGroup.length; ++i)
            {
                if( compareGroup[i] !== id)
                {
                    Bubbles[ compareGroup[i] ].Or();
                }
            }
        }
    });
    //var $bubbleparaMenu = $("#bubble" + id).children().children().children();
    $bubbleId.find("#select").click(function () {
    //$bubbleparaMenu.children('select').change(function () {
        var optionSelected = $(this).find("option:selected");
        var valueSelected = optionSelected.val();
        bubble.resetRenderShape(valueSelected);
    });
    $bubbleId.find("#load").click(function () {
    //$bubbleparaMenu.children('#load').click(function () {
        var selected_file = $bubbleId.find('#input').get(0).files[0];
        //var selected_file = $bubbleparaMenu.children('#input').get(0).files[0];
        if (selected_file === null) {
            alert("Please select a file!");
        }
        else {
            bubble.localFileName = selected_file;
            bubble.localRender();
        }
    });
    //var $plane = $("#bubble" + id).children().children().children().children("#plane");
    $bubbleId.find("#loadNii").click(function () {
    //$bubbleparaMenu.children('#loadNii').click(function () {
        //var selected_file = $bubbleparaMenu.children('#inputNii').get(0).files[0];
        var selected_file = $bubbleId.find('#inputNii').get(0).files[0];
        if (selected_file === null) {
            alert("Please select a NII file!");
        }
        else
        {
            bubble.niiFileName = selected_file;
            bubble.loadLocalNii();

        }
    });
    var $colorpickerField = $bubbleId.find("#colorpickerField");
    //var $colorpickerField = $("#bubble" + id).children().children().children().children('#colorpickerField');
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

    function toggle(i) {
        //var $sectionId = $("#bubble" + id).children().children().children("#section_" + i);
        var $sectionId = $bubbleId.find("#section_" + i);
        var scn = $sectionId.css('display');
        //var btn = $("#bubble" + id).children().children().children("#plus_" + i).children("#tog")[0];
        var btn = $bubbleId.find("#tog")[0];
        if (scn == "block") {
            $sectionId.hide();
            btn.innerHTML = "[+]";
        }
        else {
            $sectionId.show();
            btn.innerHTML = "[-]";
        }
    }

    function createToggle(i) {
        return function () {
            toggle(i);
        };
    }

    for (var i = 1; i <= 6; i++) {
        //$( "plus_" + i).addEventListener( 'click', createToggle( i ), false );
        $bubbleId.find("#plus_" + i).click(createToggle(i));
        //$("#bubble" + id).children().children().children("#plus_" + i).click(createToggle(i));
    }

    $bubbleId.find('#compareCheck').change(function(){
        $(this).val($(this).is(':checked'));
    });
}
function bubble_div(id, name, mousePosX, mousePosY) {
    var tmp = '';
    tmp += '<div id ="bubble' + id + '" class="bubble shadow drag" style="position: absolute; left:' + mousePosX + 'px; top:' + mousePosY + 'px; ">';    //$("#bubble" + id)
    tmp += '    <div id ="drag' + id + '" class="dragheader">';
    tmp += '        <input  type="checkbox" id ="compareCheck" title="Compare Check" name="value">';
    tmp += name;      //$("#bubble" + id).children();
    tmp += '        <span class="open_para">O</span>'; //$("#bubble" + id).children().children();
    tmp += '        <div id="select_menu">';//$("#bubble" + id).children().children().children();
    tmp += '            <span id="selector">';//$("#bubble" + id).children().children().children().children();
    tmp += '                <button class="selectItem" id = "add" > + </button>';
    tmp += '                <button class="selectItem" id = "remove" > - </button>';
    tmp += '            </span>';
    tmp += '            <span id="selector_operation">';
    tmp += '                <button class="selectItem" id = "and" > and </button>';
    tmp += '                <button class="selectItem" id = "delete" > delete </button>';
    tmp += '                <button class="selectItem" id  = "or"  > or </button>';
    tmp += '            </span>';
    tmp += '        </div>';
    tmp += '    </div>';

    tmp += '    <div id="container' + id + '" height="400" width="400">';//$("#bubble" + id).children();
    tmp += '    </div>';
    //
    tmp += '    <div id="paraMenu" class="widget shadow" style="position: absolute; left:385px; top:-17px; display: none">';//$("#bubble" + id).children();
    tmp += '        <div class="para_header"> ToolBox ';   //$("#bubble" + id).children().children();
    tmp += '        </div>';
    tmp += '        <ul id="para_items">';     //$("#bubble" + id).children().children();
    tmp += "            <li id='plus_1'> <span id='tog'>[+] </span> Input Model </li> ";//$("#bubble" + id).children().children().children();
    tmp += '            <div id= "section_1" style="display: none">';
    tmp += '                <input type="file" id="input" class="para">';
    //tmp += '                <div id="progress" class="para"></div>';
    tmp += '                <button type="button" id="load" class="para">Load</button>';
    tmp += '            </div>';
    tmp += "            <li id='plus_2'> <span id='tog'>[+] </span> Input Image </li> ";
    tmp += '            <div id= "section_2" style="display: none" class="para">';//$("#bubble" + id).children().children().children();
    tmp += '                 <input type="file" id="inputNii" class="para">';
    tmp += '                 <button type="button" id="loadNii" class="para">Load</button>';
    tmp += '                 <div id= "plane" style="display: none" class="para">';//$("#bubble" + id).children().children().children().children();
    tmp += '                    <div>';
    tmp += '                        <span class="para">Transparent: </span><input type="checkbox" id="transparent" class="para">';
    tmp += '                        <span class="para">Opacity: </span><input id ="opacity" name="value" >';
    tmp += '                    </div>';
    tmp += '                    <div>';
    tmp += '                        <span class="para">XY_Plane: </span><input type="checkbox" id="xyPlane" class="para">';
    tmp += '                        <span class="para">Position: </span><span class="para" id ="xypValue">0</span>';
    tmp += '                    </div>';
    tmp += '                    <div id="xySlider"  style="display: none" class="para"></div>';

    tmp += '                    <div>';
    tmp += '                        <span class="para">YZ_Plane: </span><input type="checkbox" id="yzPlane" class="para">';
    tmp += '                        <span class="para">Position: </span><span class="para" id ="yzpValue">0</span>';
    tmp += '                    </div>';
    tmp += '                    <div id="yzSlider"  style="display: none" class="para"></div>';

    tmp += '                    <div>';
    tmp += '                        <span class="para">XZ_Plane: </span><input type="checkbox" id="xzPlane" class="para">';
    tmp += '                        <span class="para">Position: </span><span class="para" id ="xzpValue">0</span>';
    tmp += '                    </div>';
    tmp += '                    <div id="xzSlider"  style="display: none" class="para"></div>';
    tmp += '                 </div>';

    tmp += '            </div>';
    tmp += "            <li id='plus_3'> <span id='tog'>[+] </span> Shape </li> ";
    tmp += '            <div id= "section_3" style="display: none" class="para">';
    tmp += '                <select id="shape" class="para">';
    tmp += '                    <option value="Line" class="para">Line</option>';
    tmp += '                    <option value="Ribbon" class="para">Ribbon</option>';
    tmp += '                    <option value="Tube" class="para">Tube</option>';
    tmp += '                </select>';
    tmp += '            </div>';
    tmp += "            <li id='plus_4' > <span id='tog'>[+] </span> Color </li> ";
    tmp += '            <div id= "section_4" style="display: none" class="para">';
    tmp += '                <input type="text" maxlength="6" size="6" id="colorpickerField" value="00ff00" class="para">';
    tmp += '            </div>';
    tmp += "            <li id='plus_5' > <span id='tog'>[+] </span> Size </li> ";
    tmp += '            <div id= "section_5" style="display: none" class="para">';
    tmp += '            </div>';
    tmp += "            <li id='plus_6' > <span id='tog'>[+] </span> Texture </li> ";
    tmp += '            <div id= "section_6" style="display: none" class="para">';
    tmp += '            </div>';
    tmp += '        </div>';
    tmp += '    </ul>';
    //
    tmp += '</div>';
    return tmp;
}
//This function is called when the navigation bar is move,actually,
//the navigation bar can move in horizontal direction
//So the whole bubble in screen space is just need to change the x-pos
function resetAllBubblesPos(xChange) {
    var $bubble = $('#bubble');
    $bubble.children('.bubble').each(function () {
        var offLeft = $(this).position().left;
        $(this).css({left: offLeft - xChange});
        var id = parseInt($(this).attr('id').replace(/bubble/, ''));
        if (Bubbles[id] !== null) {
            var le = Bubbles[id].getlinkNodes().length;
            for (var i = 0; i < le; ++i) {
                var next = Bubbles[id].getlinkNodes()[i].connectTo;
                if (Bubbles[id].getlinkNodes()[i].connectionId !== null && Bubbles[id] !== null && Bubbles[next] !== null) {
                    pathConnection.update(Bubbles[id].getlinkNodes()[i].connectionId, getWidgetCenter(id), getWidgetCenter(next));
                }
            }
        }
    });

    $bubble.children('.compare').each(function () {
        var offLeft = $(this).position().left;
        $(this).css({left: offLeft - xChange});
    });

    $bubble.children('.chart').each(function () {
        var offLeft = $(this).position().left;
        $(this).css({left: offLeft - xChange});
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
}/*
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
    var chartView = new Rectangle(navigationCanvas, pos.x, pos.y, boxWidth, boxHeight, color, true, id, "CHART");
    navigationCanvas.addShape(chartView);

    var linechartCanvas = document.getElementById('chartCanvas' + id);
    var lineChart = new LineChart(id, linechartCanvas);

    var childs = Bubbles[id].mainGroup.children;
    for (var i = 0; i < childs.length; ++i) {
        for (var j = 0; j < childs[i].children.length; ++j) {
            lineChart.addItem(childs[i].children[j].id, childs[i].children[j].FA);
        }
    }
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
            if (Bubbles[currentId] !== null) {
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
        if (Bubbles[id] !== null) {
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
}  */