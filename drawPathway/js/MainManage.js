/**
 * Created by Yongnan on 7/2/2014.
 */
function MainManage(canvas) {
    this.canvas = canvas;
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
    this.ctx = canvas.getContext('2d');

    this.valid = false; // when set to false, the canvas will redraw everything
    this.shapes = [];  // the collection of things to be drawn on the 2d canvas

    this.dragging = false; // Keep track of when we are dragging
    this.resizeDragging = false; // Keep track of resize
    this.expectResize = -1; // save the # of the selection handle

    this.Ctrl = false;
    this.Shift = false;
    this.Alt = false;

    this.selection = [];

    // New, holds the 8 tiny boxes that will be our selection handles
    // the selection handles will be in this order:
    // 0  1  2
    // 3     4
    // 5  6  7
    this.selectionHandles = [];
    for (var i = 0; i < 8; i += 1)
    {
        this.selectionHandles.push(new Complex(this));   //here we just keep 8 rectangle for resizing
    }
    var _this = this;
    //canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
    // Up, down, and move are for dragging

    log.Control = [];   //For ctrl key event
    log.Shift =[];
    log.Alt =[];
    $(document).bind('keydown', function (e){

        if(e.keyCode === 71)//Ctrl    //changed to G/g 71
        {
            var control ={};  //log event
            control.time = (new Date()).toLocaleTimeString();
            control.log = "Ctrl key down for multi selection.";
            log.Control.push(control);

            _this.Ctrl = true;
        }
        else if(e.keyCode === 16) //Shift
        {
            var shift ={};  //log event
            shift.time = (new Date()).toLocaleTimeString();
            shift.log = "Shift key down for selecting reaction.";
            log.Shift.push(shift);

            _this.Shift = true;
        }
        else if(e.keyCode === 18) //Alt
        {
            var alt ={};  //log event
            alt.time = (new Date()).toLocaleTimeString();
            alt.log = "Alt key down for selecting the same colors.";
            log.Alt.push(alt);

            _this.Alt = true;
        }
    });
    /*document.addEventListener('keydown',function(e){
        if(e.keyCode === 17)//Ctrl
        {
            var control ={};  //log event
            control.time = (new Date()).toLocaleTimeString();
            control.log = "Ctrl key down for multi selection.";
            log.Control.push(control);

            _this.Ctrl = true;
        }
        else if(e.keyCode === 16) //Shift
        {
            var shift ={};  //log event
            shift.time = (new Date()).toLocaleTimeString();
            shift.log = "Shift key down for selecting reaction.";
            log.Shift.push(shift);

            _this.Shift = true;
        }
        else if(e.keyCode === 18) //Alt
        {
            var alt ={};  //log event
            alt.time = (new Date()).toLocaleTimeString();
            alt.log = "Alt key down for selecting the same colors.";
            log.Alt.push(alt);

            _this.Alt = true;
        }
    },true); */
    //document.addEventListener('keyup',function(e){
    $(document).bind('keyup', function (e)
    {
        if(e.which === 71)//Ctrl
        {
            var control ={};  //log event
            control.time = (new Date()).toLocaleTimeString();
            control.log = "Ctrl key up, this time select " + _this.selection.length + " elements";
            log.Control.push(control);

            _this.Ctrl = false;
            for(i=0; i< _this.selection.length; ++i)
                _this.selection[i].flag = false;
            _this.selection.length = 0;
            _this.valid = false;
        }
        else if(e.which === 16) //Shift
        {
            var shift ={};  //log event
            shift.time = (new Date()).toLocaleTimeString();
            shift.log = "Shift key up";
            log.Shift.push(shift);
            _this.Shift = false;
            _this.valid = false;
        }
        else if(e.which === 18) //Alt
        {
            var alt ={};  //log event
            alt.time = (new Date()).toLocaleTimeString();
            alt.log = "Alt key up";
            log.Alt.push(alt);
            _this.Alt = false;
            _this.valid = false;
        }
    });
    var oldMouseX;
    var oldMouseY;
    log.MouseDown = [];
    canvas.addEventListener('mousedown', function (e) {
        if (_this.expectResize !== -1) {
            _this.resizeDragging = true;
            return;
        }
        if(! _this.Ctrl )
        {
            for(i=0; i< _this.selection.length; ++i)
                _this.selection[i].flag = false;
            _this.selection.length = 0;
        }
        var mouse = _this.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        for (i = _this.shapes.length - 1; i >= 0; i--) {
            if (_this.shapes[i] === null || _this.shapes[i].type === "J" || _this.shapes[i].type === "I" || _this.shapes[i].type === "A")
                continue;
            if (_this.shapes[i].contains(mx, my))
            {
                oldMouseX = mx;
                oldMouseY = my;
                _this.shapes[i].flag = true;
                for(var j=0; j<_this.selection.length; j++)
                {
                    if(_this.selection[j] === _this.shapes[i])
                        break;
                }
                if(j>= _this.selection.length)
                    if(_this.Ctrl && _this.shapes[i].type !== "M")
                    {
                        var mousedown ={};  //log event
                        mousedown.time = (new Date()).toLocaleTimeString();
                        mousedown.pos = {x:mx, y:my};
                        mousedown.log = _this.shapes[i].type + " "+ _this.shapes[i].id + " Selected for multi-selection";
                        log.MouseDown.push(mousedown);

                        _this.selection.push(_this.shapes[i]);
                    }
                    else if(_this.Ctrl && _this.shapes[i].type === "M")
                    {
                        _this.shapes[i].flag = false;

                        var mousedown ={};  //log event
                        mousedown.time = (new Date()).toLocaleTimeString();
                        mousedown.pos = {x:mx, y:my};
                        mousedown.log = "Click the compartment, when doing Multi-selection, but it will not be selected as the default setting";
                        log.MouseDown.push(mousedown);

                    }
                    else if(!_this.Ctrl)
                    {
                        var mousedown ={};  //log event
                        mousedown.time = (new Date()).toLocaleTimeString();
                        mousedown.pos = {x:mx, y:my};
                        if(_this.shapes[i].id !== undefined)
                            mousedown.log = _this.shapes[i].type + " " + _this.shapes[i].id + " Selected(single selection)";
                        else
                            mousedown.log = _this.shapes[i].type + " " + " Selected(single selection)";
                        log.MouseDown.push(mousedown);
                        _this.selection.push(_this.shapes[i]);
                    }
                _this.dragging = true;
                _this.valid = false;
                return;
            }
        }
        this.style.cursor = 'auto';
    }, true);
    log.MouseMove = [];
    log.MouseResize = [];
    function arrayContainArray(array2, array1)
    {
        var flag = false;
        for(var i=0; i<array1.length; ++i)
        {
            for(var j=0; j<array2.length; ++j)
            {
                if(array1[i] === array2[j])
                {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }
    canvas.addEventListener('mousemove', function (e) {
        var mouse = _this.getMouse(e),
            mx = mouse.x,
            my = mouse.y,
            oldx, oldy, i, cur;
        var offsetX, offsetY;
        if (_this.dragging)
        {
            // We don't want to drag the object by its top-left corner, we want to drag it
            // from where we clicked. Thats why we saved the offset and use it here
            offsetX = mouse.x - oldMouseX;
            offsetY = mouse.y - oldMouseY;
            oldMouseX = mouse.x;
            oldMouseY = mouse.y;
            for(i=0; i< _this.selection.length; ++i)
            {
                if(_this.Ctrl && _this.selection[i].type !== "VISUALIZATION" &&_this.selection[i].type !== "M")
                {
                    _this.selection[i].x += offsetX;  //mouse move relative to the navigation viewpoint
                    _this.selection[i].y += offsetY;
                    var tmpData = [];
                    var currentData ={};
                    currentData.time = (new Date()).toLocaleTimeString();
                    currentData.Status = "Move";
                    currentData.type = _this.selection[i].type;
                    currentData.id = _this.selection[i].id;
                    currentData.offset = {x: offsetX, y:offsetY};
                    tmpData.push(currentData);
                    if(_this.Shift && (_this.selection[i].type === "B" ||_this.selection[i].type === "K" ||_this.selection[i].type === "T"))
                    {
                        var mousemove ={};  //log event
                        mousemove.time = (new Date()).toLocaleTimeString();
                        mousemove.toPos = {x:mx, y:my};
                        mousemove.offset = {x:offsetX, y:offsetY};
                        mousemove.log = "Shift pressed down.\n  ";
                        for(var jj=0; jj<_this.selection[i].connections.length; ++jj)
                        {
                            if(_this.selection[i].compartmentId === _this.selection[i].connections[jj].compartmentId)
                            {
                                _this.selection[i].connections[jj].x += offsetX;  //mouse move relative to the navigation viewpoint
                                _this.selection[i].connections[jj].y += offsetY;

                                mousemove.log += _this.selection[i].connections[jj].type + " "+ _this.selection[i].connections[jj].id+ "is moved. \n  ";
                                var currentData ={};
                                currentData.time = (new Date()).toLocaleTimeString();
                                currentData.Status = "Move";
                                currentData.type = _this.selection[i].connections[jj].type;
                                currentData.id = _this.selection[i].connections[jj].id;
                                currentData.offset = {x: offsetX, y:offsetY};
                                tmpData.push(currentData);
                            }
                        }
                        log.MouseMove.push(mousemove);
                    }
                    var mousemove ={};  //log event
                    mousemove.time = (new Date()).toLocaleTimeString();
                    mousemove.toPos = {x:mx, y:my};
                    mousemove.offset = {x:offsetX, y:offsetY};
                    mousemove.log = _this.shapes[i].type + " is Dragged(Multi-selection).";
                    log.MouseMove.push(mousemove);
                    changeLog.push(tmpData);
                }
                else if(!_this.Ctrl&&_this.selection[i].type !== "M")
                {
                    _this.selection[i].x += offsetX;  //mouse move relative to the navigation viewpoint
                    _this.selection[i].y += offsetY;

                    var mousemove ={};  //log event
                    mousemove.time = (new Date()).toLocaleTimeString();
                    mousemove.toPos = {x:mx, y:my};
                    mousemove.offset = {x:offsetX, y:offsetY};
                    if(_this.shapes[i].id !== undefined)
                        mousemove.log = _this.shapes[i].type + " "+_this.shapes[i].id + " is Dragged";
                    else
                        mousemove.log = _this.shapes[i].type +  " is Dragged";
                    log.MouseMove.push(mousemove);

                    var tmpData = [];
                    var currentData ={};
                    currentData.time = (new Date()).toLocaleTimeString();
                    currentData.Status = "Move";
                    currentData.type = _this.selection[i].type;
                    currentData.id = _this.selection[i].id;
                    currentData.offset = {x: offsetX, y:offsetY};
                    tmpData.push(currentData);

                    if(_this.Shift && (_this.selection[i].type === "B" ||_this.selection[i].type === "K" ||_this.selection[i].type === "T"))
                    {
                        var mousemove ={};  //log event
                        mousemove.time = (new Date()).toLocaleTimeString();
                        mousemove.toPos = {x:mx, y:my};
                        mousemove.offset = {x:offsetX, y:offsetY};
                        mousemove.log = "Shift pressed down.\n  ";
                        for(var jj=0; jj<_this.selection[i].connections.length; ++jj)
                        {
                            if(_this.selection[i].compartmentId === _this.selection[i].connections[jj].compartmentId)
                            {
                                _this.selection[i].connections[jj].x += offsetX;  //mouse move relative to the navigation viewpoint
                                _this.selection[i].connections[jj].y += offsetY;
                                mousemove.log += _this.selection[i].connections[jj].type + " "+ _this.selection[i].connections[jj].id+ "is moved. \n  ";
                                var currentData ={};
                                currentData.time = (new Date()).toLocaleTimeString();
                                currentData.Status = "Move";
                                currentData.type = _this.selection[i].connections[jj].type;
                                currentData.id = _this.selection[i].connections[jj].id;
                                currentData.offset = {x: offsetX, y:offsetY};
                                tmpData.push(currentData);
                            }
                        }
                        log.MouseMove.push(mousemove);
                    }
                    if(_this.Alt && (_this.selection[i].type !== "B" ||_this.selection[i].type !== "K" ||_this.selection[i].type !== "T"))
                    {
                        var mousemove ={};  //log event
                        mousemove.time = (new Date()).toLocaleTimeString();
                        mousemove.toPos = {x:mx, y:my};
                        mousemove.offset = {x:offsetX, y:offsetY};
                        mousemove.log = "Alt pressed down.\n  ";
                        if(_this.selection[i].compartmentId in  Bubbles.compartments && _this.selection[i].colors.length >0)
                        {
                            var compartment= Bubbles.compartments[_this.selection[i].compartmentId];
                            for(var kk=0; kk<compartment.complexs.length; ++kk)
                            {
                                if(compartment.complexs[kk].colors.length===0)
                                    continue;
                                if(arrayContainArray(compartment.complexs[kk].colors,_this.selection[i].colors ) )
                                {
                                    if(_this.selection[i] !== compartment.complexs[kk])
                                    {
                                        compartment.complexs[kk].x += offsetX;  //mouse move relative to the navigation viewpoint
                                        compartment.complexs[kk].y += offsetY;  //mouse move relative to the navigation viewpoint
                                        var currentData ={};
                                        currentData.time = (new Date()).toLocaleTimeString();
                                        currentData.Status = "Move";
                                        currentData.type = compartment.complexs[kk].type;
                                        currentData.id = compartment.complexs[kk].id;
                                        currentData.offset = {x: offsetX, y:offsetY};
                                        tmpData.push(currentData);
                                    }
                                }
                            }
                            for(var kk=0; kk<compartment.proteins.length; ++kk)
                            {
                                if(compartment.proteins[kk].colors.length===0)
                                    continue;
                                if(arrayContainArray(compartment.proteins[kk].colors,_this.selection[i].colors ) )
                                {
                                    if(_this.selection[i] !== compartment.proteins[kk]) {
                                        compartment.proteins[kk].x += offsetX;  //mouse move relative to the navigation viewpoint
                                        compartment.proteins[kk].y += offsetY;  //mouse move relative to the navigation viewpoint
                                        var currentData ={};
                                        currentData.time = (new Date()).toLocaleTimeString();
                                        currentData.Status = "Move";
                                        currentData.type = compartment.proteins[kk].type;
                                        currentData.id = compartment.proteins[kk].id;
                                        currentData.offset = {x: offsetX, y:offsetY};
                                        tmpData.push(currentData);
                                    }
                                }
                            }
                            for(var kk=0; kk<compartment.molecules.length; ++kk)
                            {
                                if(compartment.molecules[kk].colors.length===0)
                                    continue;
                                if(arrayContainArray(compartment.molecules[kk].colors,_this.selection[i].colors ) )
                                {
                                    if(_this.selection[i] !== compartment.molecules[kk]) {
                                        compartment.molecules[kk].x += offsetX;  //mouse move relative to the navigation viewpoint
                                        compartment.molecules[kk].y += offsetY;  //mouse move relative to the navigation viewpoint
                                        var currentData ={};
                                        currentData.time = (new Date()).toLocaleTimeString();
                                        currentData.Status = "Move";
                                        currentData.type = compartment.molecules[kk].type;
                                        currentData.id = compartment.molecules[kk].id;
                                        currentData.offset = {x: offsetX, y:offsetY};
                                        tmpData.push(currentData);
                                    }
                                }
                            }
                            for(var kk=0; kk<compartment.entitys.length; ++kk)
                            {
                                if(compartment.entitys[kk].colors.length===0)
                                    continue;
                                if(arrayContainArray(compartment.entitys[kk].colors,_this.selection[i].colors ) )
                                {
                                    if(_this.selection[i] !== compartment.entitys[kk]) {
                                        compartment.entitys[kk].x += offsetX;  //mouse move relative to the navigation viewpoint
                                        compartment.entitys[kk].y += offsetY;  //mouse move relative to the navigation viewpoint
                                        var currentData ={};
                                        currentData.time = (new Date()).toLocaleTimeString();
                                        currentData.Status = "Move";
                                        currentData.type = compartment.entitys[kk].type;
                                        currentData.id = compartment.entitys[kk].id;
                                        currentData.offset = {x: offsetX, y:offsetY};
                                        tmpData.push(currentData);
                                    }
                                }
                            }
                            for(var kk=0; kk<compartment.dnas.length; ++kk)
                            {
                                if(compartment.dnas[kk].colors.length===0)
                                    continue;
                                if(arrayContainArray(compartment.dnas[kk].colors,_this.selection[i].colors ) )
                                {
                                    if(_this.selection[i] !== compartment.dnas[kk]) {
                                        compartment.dnas[kk].x += offsetX;  //mouse move relative to the navigation viewpoint
                                        compartment.dnas[kk].y += offsetY;  //mouse move relative to the navigation viewpoint
                                        var currentData ={};
                                        currentData.time = (new Date()).toLocaleTimeString();
                                        currentData.Status = "Move";
                                        currentData.type = compartment.dnas[kk].type;
                                        currentData.id = compartment.dnas[kk].id;
                                        currentData.offset = {x: offsetX, y:offsetY};
                                        tmpData.push(currentData);
                                    }
                                }
                            }
                            for(var kk=0; kk<compartment.rnas.length; ++kk)
                            {
                                if(compartment.rnas[kk].colors.length===0)
                                    continue;
                                if(arrayContainArray(compartment.rnas[kk].colors,_this.selection[i].colors ) )
                                {
                                    if(_this.selection[i] !== compartment.rnas[kk]) {
                                        compartment.rnas[kk].x += offsetX;  //mouse move relative to the navigation viewpoint
                                        compartment.rnas[kk].y += offsetY;  //mouse move relative to the navigation viewpoint
                                        var currentData ={};
                                        currentData.time = (new Date()).toLocaleTimeString();
                                        currentData.Status = "Move";
                                        currentData.type = compartment.rnas[kk].type;
                                        currentData.id = compartment.rnas[kk].id;
                                        currentData.offset = {x: offsetX, y:offsetY};
                                        tmpData.push(currentData);
                                    }
                                }
                            }
                        }
                    }
                    changeLog.push(tmpData);
                }
                //console.log( "Length:" + _this.selection.length);
                //console.log(i + "offsetX:" + offsetX +", offsetY" + offsetY);
                if(_this.selection[i].type === "M")
                {
                    _this.selection[i].x += offsetX;  //mouse move relative to the navigation viewpoint
                    _this.selection[i].y += offsetY;
                    _this.selection[i].childOffsetx += offsetX;  //mouse move relative to the navigation viewpoint
                    _this.selection[i].childOffsety += offsetY;
                    var tmpData = [];
                    var currentData ={};
                    currentData.time = (new Date()).toLocaleTimeString();
                    currentData.Status = "Move";
                    currentData.type = _this.selection[i].type;
                    currentData.id = _this.selection[i].id;
                    currentData.offset = {x: offsetX, y:offsetY};
                    tmpData.push(currentData);
                    changeLog.push(tmpData);

                    var mousemove ={};  //log event
                    mousemove.time = (new Date()).toLocaleTimeString();
                    mousemove.toPos = {x:mx, y:my};
                    mousemove.offset = {x:offsetX, y:offsetY};
                    if(_this.shapes[i].id !== undefined)
                        mousemove.log = _this.shapes[i].type + " "+ _this.shapes[i].id + " is Dragged";
                    else
                        mousemove.log = _this.shapes[i].type + " is Dragged";
                    log.MouseMove.push(mousemove);
                }
            }
            this.style.cursor = 'move';
            _this.valid = false; // Something's dragging so we must redraw
        }
        else if (_this.resizeDragging && !_this.Ctrl)
        {
            //Father:Bubble. ====>Child: Compartment. ====> ====>Child: Protein, Complex, Small Molecule, DNA, ...
            if (_this.selection[0].type === "VISUALIZATION")  //Fixed a bug: Bubble object do not need to add offsetX;
            {
                oldx = _this.selection[0].x; //OffsetX is just used for test the contain relatonship
                oldy = _this.selection[0].y;
                this.style.cursor = 'auto';
            }
            else if (_this.selection[0].type === "M")
            {
                oldx = _this.selection[0].x; //resize is just the relative position,, not absolute position
                oldy = _this.selection[0].y;
                mx -= _this.selection[0].offsetX;
                my -= _this.selection[0].offsetY;
            }
            // 0  1  2
            // 3     4
            // 5  6  7
            switch (_this.expectResize) {
                case 0:

                    var mouseresize ={};  //log event
                    mouseresize.time = (new Date()).toLocaleTimeString();
                    mouseresize.startPos = {x:_this.selection[0].x, y:_this.selection[0].y};
                    mouseresize.endPos = {x:mx, y:my};
                    mouseresize.log = _this.selection[0].type +" "+_this.selection[0].id + " Top-Left corner is Dragged to resize";
                    log.MouseResize.push(mouseresize);

                    _this.selection[0].x = mx;
                    _this.selection[0].y = my;
                    _this.selection[0].w += oldx - mx;
                    _this.selection[0].h += oldy - my;
                    var tmpData = [];
                    var currentData ={};
                    currentData.time = (new Date()).toLocaleTimeString();
                    currentData.Status = "Resize";
                    currentData.type = _this.selection[0].type;
                    currentData.id = _this.selection[0].id;
                    currentData.x = _this.selection[0].x;
                    currentData.y = _this.selection[0].y;
                    currentData.w = _this.selection[0].w;
                    currentData.h = _this.selection[0].h;
                    tmpData.push(currentData);
                    changeLog.push(tmpData);
                    break;
                case 1:

                    var mouseresize ={};  //log event
                    mouseresize.time = (new Date()).toLocaleTimeString();
                    mouseresize.startPos = {x:_this.selection[0].x, y:_this.selection[0].y};
                    mouseresize.endPos = {x:mx, y:my};
                    mouseresize.log = _this.selection[0].type +" " + _this.selection[0].id + " Top-Middle corner is Dragged to resize";
                    log.MouseResize.push(mouseresize);

                    _this.selection[0].y = my;
                    _this.selection[0].h += oldy - my;

                    var tmpData = [];
                    var currentData ={};
                    currentData.time = (new Date()).toLocaleTimeString();
                    currentData.Status = "Resize";
                    currentData.type = _this.selection[0].type;
                    currentData.id = _this.selection[0].id;
                    currentData.x = _this.selection[0].x;
                    currentData.y = _this.selection[0].y;
                    currentData.w = _this.selection[0].w;
                    currentData.h = _this.selection[0].h;
                    tmpData.push(currentData);
                    changeLog.push(tmpData);
                    break;
                case 2:

                    var mouseresize ={};  //log event
                    mouseresize.time = (new Date()).toLocaleTimeString();
                    mouseresize.startPos = {x:_this.selection[0].x, y:_this.selection[0].y};
                    mouseresize.endPos = {x:mx, y:my};
                    mouseresize.log = _this.selection[0].type +" "+ _this.selection[0].id + " Top-Right corner is Dragged to resize";
                    log.MouseResize.push(mouseresize);

                    _this.selection[0].y = my;
                    _this.selection[0].w = mx - oldx;
                    _this.selection[0].h += oldy - my;

                    var tmpData = [];
                    var currentData ={};
                    currentData.time = (new Date()).toLocaleTimeString();
                    currentData.Status = "Resize";
                    currentData.type = _this.selection[0].type;
                    currentData.id = _this.selection[0].id;
                    currentData.x = _this.selection[0].x;
                    currentData.y = _this.selection[0].y;
                    currentData.w = _this.selection[0].w;
                    currentData.h = _this.selection[0].h;
                    tmpData.push(currentData);
                    changeLog.push(tmpData);
                    break;
                case 3:

                    var mouseresize ={};  //log event
                    mouseresize.time = (new Date()).toLocaleTimeString();
                    mouseresize.startPos = {x:_this.selection[0].x, y:_this.selection[0].y};
                    mouseresize.endPos = {x:mx, y:my};
                    mouseresize.log = _this.selection[0].type +" "+ _this.selection[0].id + " Middle-Left corner is Dragged to resize";
                    log.MouseResize.push(mouseresize);

                    _this.selection[0].x = mx;
                    _this.selection[0].w += oldx - mx;

                    var tmpData = [];
                    var currentData ={};
                    currentData.time = (new Date()).toLocaleTimeString();
                    currentData.Status = "Resize";
                    currentData.type = _this.selection[0].type;
                    currentData.id = _this.selection[0].id;
                    currentData.x = _this.selection[0].x;
                    currentData.y = _this.selection[0].y;
                    currentData.w = _this.selection[0].w;
                    currentData.h = _this.selection[0].h;
                    tmpData.push(currentData);
                    changeLog.push(tmpData);
                    break;
                case 4:

                    var mouseresize ={};  //log event
                    mouseresize.time = (new Date()).toLocaleTimeString();
                    mouseresize.startPos = {x:_this.selection[0].x, y:_this.selection[0].y};
                    mouseresize.endPos = {x:mx, y:my};
                    mouseresize.log = _this.selection[0].type +" "+ _this.selection[0].id + " Middle-Right corner is Dragged to resize";
                    log.MouseResize.push(mouseresize);

                    _this.selection[0].w = mx - oldx;

                    var tmpData = [];
                    var currentData ={};
                    currentData.time = (new Date()).toLocaleTimeString();
                    currentData.Status = "Resize";
                    currentData.type = _this.selection[0].type;
                    currentData.id = _this.selection[0].id;
                    currentData.x = _this.selection[0].x;
                    currentData.y = _this.selection[0].y;
                    currentData.w = _this.selection[0].w;
                    currentData.h = _this.selection[0].h;
                    tmpData.push(currentData);
                    changeLog.push(tmpData);
                    break;
                case 5:

                    var mouseresize ={};  //log event
                    mouseresize.time = (new Date()).toLocaleTimeString();
                    mouseresize.startPos = {x:_this.selection[0].x, y:_this.selection[0].y};
                    mouseresize.endPos = {x:mx, y:my};
                    mouseresize.log = _this.selection[0].type + " " +_this.selection[0].id + " Bottom-Left corner is Dragged to resize";
                    log.MouseResize.push(mouseresize);

                    _this.selection[0].x = mx;
                    _this.selection[0].w += oldx - mx;
                    _this.selection[0].h = my - oldy;

                    var tmpData = [];
                    var currentData ={};
                    currentData.time = (new Date()).toLocaleTimeString();
                    currentData.Status = "Resize";
                    currentData.type = _this.selection[0].type;
                    currentData.id = _this.selection[0].id;
                    currentData.x = _this.selection[0].x;
                    currentData.y = _this.selection[0].y;
                    currentData.w = _this.selection[0].w;
                    currentData.h = _this.selection[0].h;
                    tmpData.push(currentData);
                    changeLog.push(tmpData);
                    break;
                case 6:

                    var mouseresize ={};  //log event
                    mouseresize.time = (new Date()).toLocaleTimeString();
                    mouseresize.startPos = {x:_this.selection[0].x, y:_this.selection[0].y};
                    mouseresize.endPos = {x:mx, y:my};
                    mouseresize.log = _this.selection[0].type + " " +_this.selection[0].id + " Bottom-Middle corner is Dragged to resize";
                    log.MouseResize.push(mouseresize);

                    _this.selection[0].h = my - oldy;

                    var tmpData = [];
                    var currentData ={};
                    currentData.time = (new Date()).toLocaleTimeString();
                    currentData.Status = "Resize";
                    currentData.type = _this.selection[0].type;
                    currentData.id = _this.selection[0].id;
                    currentData.x = _this.selection[0].x;
                    currentData.y = _this.selection[0].y;
                    currentData.w = _this.selection[0].w;
                    currentData.h = _this.selection[0].h;
                    tmpData.push(currentData);
                    changeLog.push(tmpData);
                    break;
                case 7:

                    var mouseresize ={};  //log event
                    mouseresize.time = (new Date()).toLocaleTimeString();
                    mouseresize.startPos = {x:_this.selection[0].x, y:_this.selection[0].y};
                    mouseresize.endPos = {x:mx, y:my};
                    mouseresize.log = _this.selection[0].type + " " +_this.selection[0].id + " Bottom-Right corner is Dragged to resize";
                    log.MouseResize.push(mouseresize);

                    _this.selection[0].w = mx - oldx;
                    _this.selection[0].h = my - oldy;

                    var tmpData = [];
                    var currentData ={};
                    currentData.time = (new Date()).toLocaleTimeString();
                    currentData.Status = "Resize";
                    currentData.type = _this.selection[0].type;
                    currentData.id = _this.selection[0].id;
                    currentData.x = _this.selection[0].x;
                    currentData.y = _this.selection[0].y;
                    currentData.w = _this.selection[0].w;
                    currentData.h = _this.selection[0].h;
                    tmpData.push(currentData);
                    changeLog.push(tmpData);
                    break;
            }
            _this.valid = false;
        }
        // if there's a selection see if we grabbed one of the selection handles
        if (_this.selection[0] !== null && _this.selection[0] !== undefined && !_this.resizeDragging && !_this.Ctrl)
        {
            for (i = 0; i < 8; i += 1) {
                // 0  1  2
                // 3     4
                // 5  6  7

                cur = _this.selectionHandles[i];

                // we dont need to use the ghost context because
                // selection handles will always be rectangles
                if (mx >= cur.x && mx <= cur.x + _this.selectionBoxSize &&
                    my >= cur.y && my <= cur.y + _this.selectionBoxSize) {
                    // we found one!
                    _this.expectResize = i;
                    _this.valid = false;

                    switch (i) {
                        case 0:
                            this.style.cursor = 'nw-resize';
                            break;
                        case 1:
                            this.style.cursor = 'n-resize';
                            break;
                        case 2:
                            this.style.cursor = 'ne-resize';
                            break;
                        case 3:
                            this.style.cursor = 'w-resize';
                            break;
                        case 4:
                            this.style.cursor = 'e-resize';
                            break;
                        case 5:
                            this.style.cursor = 'sw-resize';
                            break;
                        case 6:
                            this.style.cursor = 's-resize';
                            break;
                        case 7:
                            this.style.cursor = 'se-resize';
                            break;
                    }
                    _this.selection[0].flag = true;
                    return;
                }

            }
            // not over a selection box, return to normal
            _this.resizeDragging = false;
            _this.expectResize = -1;

        }
    }, true);
    canvas.addEventListener('mouseup', function (e) {
        this.style.cursor = 'auto';
        _this.dragging = false;
        _this.resizeDragging = false;
        _this.expectResize = -1;
    }, true);
    canvas.addEventListener('mousewheel', mousewheel, false);
    canvas.addEventListener('DOMMouseScroll', mousewheel, false); // firefox

    function mousewheel() {
        var delta = 0;
        if (event.wheelDelta) { // WebKit / Opera / Explorer 9
            delta = -(event.wheelDelta / 120);
        }
        else if (event.detail) { // Firefox
            delta = event.detail / 3;
        }


        _this.valid = false;
    }

    this.selectionBoxSize = 6;
    var index=0;
    function animate() {
        requestAnimationFrame(animate);
        if(changedLogloader!==null)
        {
            var logData = changedLogloader.logData;

            if(logData!==null) {
                if(index === logData.length)
                {
                    changedLogloader = null;
                }
                if (index in logData && Bubbles) {
                    var objects = logData[index];
                    for (var j = 0; j < objects.length; ++j)
                    {
                        if (objects[j].Status === "Move" && objects[j].type !== "M")
                        {
                            if(objects[j].type === "VISUALIZATION")
                            {
                                _this.shapes[0].x += objects[j].offset.x;
                                _this.shapes[0].y += objects[j].offset.y;
                            }
                            else
                            {
                                for (var k = 1; k < _this.shapes.length; ++k) {
                                    if (_this.shapes[k].type === objects[j].type && _this.shapes[k].id === objects[j].id) {
                                        _this.shapes[k].x += objects[j].offset.x;
                                        _this.shapes[k].y += objects[j].offset.y;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (objects[j].Status === "Move" && objects[j].type === "M")
                        {
                            for (var k = 0; k < Bubbles.compartments.length; ++k) {
                                if (Bubbles.compartments[k].id === objects[j].id) {
                                    Bubbles.compartments[k].childOffsetx += objects[j].offset.x;
                                    Bubbles.compartments[k].childOffsety += objects[j].offset.y;
                                    Bubbles.compartments[k].x += objects[j].offset.x;
                                    Bubbles.compartments[k].y += objects[j].offset.y;
                                    break;
                                }
                            }
                        }
                        else if (objects[j].Status === "Resize")
                        {
                            for (var k = 0; k < Bubbles.compartments.length; ++k) {
                                if (Bubbles.compartments[k].id === objects[j].id) {
                                    Bubbles.compartments[k].x = objects[j].x;
                                    Bubbles.compartments[k].y = objects[j].y;
                                    Bubbles.compartments[k].w = objects[j].w;
                                    Bubbles.compartments[k].h = objects[j].h;
                                    break;
                                }
                            }
                        }
                        _this.valid = false; // Something's dragging so we must redraw
                    }
                }
            }
        }
        _this.draw();
        index++;
    }

    animate();
}

MainManage.prototype = {
    addShape: function (shape) {
        this.shapes.push(shape);
        this.valid = false;
    },
    remove: function (value) {
        var l = this.shapes.length;
        if (value > 0 && value < l)
            this.shapes.splice(value, 1);
        this.valid = false;
    },
    clear: function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
    },
    draw: function () {
        //if(springy !== null)
        //this.valid = true;
        if (!this.valid) {
            this.clear();
            if (Bubbles)
                Bubbles.draw(this.ctx);
            if(pathfileNameObj)
            {
                pathfileNameObj.font = '20pt Arial';
                var w = pathfileNameObj.getTextWidth(this.ctx)+10;
                pathfileNameObj.draw(10 + w/2, 10 + 30/2, this.ctx );
            }
            this.valid = true;
        }

    },
    getMouse: function (e) {
        var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
        if (element.offsetParent !== undefined) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
                element = element.offsetParent;
            } while (element);
        }
        mx = e.pageX - offsetX;
        my = e.pageY - offsetY;
        return {x: mx, y: my};
    }
};