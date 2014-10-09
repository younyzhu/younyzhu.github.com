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
    document.addEventListener('keydown',function(e){
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
                log.Control.push(shift);

                _this.Shift = true;
            }
    },true);
    document.addEventListener('keyup',function(e){
        if(e.keyCode === 17)//Ctrl
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
        else if(e.keyCode === 16) //Shift
        {
            var shift ={};  //log event
            shift.time = (new Date()).toLocaleTimeString();
            shift.log = "Shift key up";
            log.Control.push(shift);
            _this.Shift = false;
            _this.valid = false;
        }
    },true);
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
                if(_this.Ctrl && _this.selection[i].type !== "VISUALIZATION" )
                {
                    _this.selection[i].x += offsetX;  //mouse move relative to the navigation viewpoint
                    _this.selection[i].y += offsetY;
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
                }
                else if(!_this.Ctrl)
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
                            }
                        }
                        log.MouseMove.push(mousemove);
                    }
                }
                //console.log( "Length:" + _this.selection.length);
                //console.log(i + "offsetX:" + offsetX +", offsetY" + offsetY);
                if(_this.selection[i].type === "M")
                {
                    _this.selection[i].childOffsetx += offsetX;  //mouse move relative to the navigation viewpoint
                    _this.selection[i].childOffsety += offsetY;

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
                    break;
                case 4:

                    var mouseresize ={};  //log event
                    mouseresize.time = (new Date()).toLocaleTimeString();
                    mouseresize.startPos = {x:_this.selection[0].x, y:_this.selection[0].y};
                    mouseresize.endPos = {x:mx, y:my};
                    mouseresize.log = _this.selection[0].type +" "+ _this.selection[0].id + " Middle-Right corner is Dragged to resize";
                    log.MouseResize.push(mouseresize);

                    _this.selection[0].w = mx - oldx;
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
                    break;
                case 6:

                    var mouseresize ={};  //log event
                    mouseresize.time = (new Date()).toLocaleTimeString();
                    mouseresize.startPos = {x:_this.selection[0].x, y:_this.selection[0].y};
                    mouseresize.endPos = {x:mx, y:my};
                    mouseresize.log = _this.selection[0].type + " " +_this.selection[0].id + " Bottom-Middle corner is Dragged to resize";
                    log.MouseResize.push(mouseresize);

                    _this.selection[0].h = my - oldy;
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
                    break;
            }
            _this.valid = false;
        }

        // if there's a selection see if we grabbed one of the selection handles
        if (_this.selection[0] !== null && _this.selection[0] !== undefined && !_this.resizeDragging && !_this.Ctrl) {
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

    function animate() {
        requestAnimationFrame(animate);

        _this.draw();
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