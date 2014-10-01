/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/23/2014
 * @name        PathBubble_interaction
 */

//Select, Drag, Resize
PATHBUBBLES.Interaction = function(renderer)
{
    this.dragging = false; // Keep track of when we are dragging
    this.resizeDragging = false; // Keep track of resize
    this.expectResize = -1; // save the # of the selection handle
    this.groupResize = false;
    this.menu = false;
    this.bubbleViewDrag = false;
    this.moleculeDrag = false;
    this.selection = [];// the current selected objects.
    // New, holds the 8 tiny boxes that will be our selection handles
    // the selection handles will be in this order:
    // 0  1  2
    // 3     4
    // 5  6  7
    PATHBUBBLES.selectionHandles = [];
    for (var i = 0; i < 8; i += 1) {
        PATHBUBBLES.selectionHandles.push(new PATHBUBBLES.Shape.Rectangle());   //here we just keep 8 rectangle for resizing
    }
    var _this = this;
//    document.addEventListener('keydown',function(e){
//        if(e.keyCode === 17)//Ctrl
//        {
//            console.log("Ctrl key down for multi selection.");
//        }
//    },true);
//
//    document.addEventListener('keyup',function(e){
//        if(e.keyCode === 17)//Ctrl
//        {
//            console.log("Ctrl key up, this time select " + _this.selection.length + " elements");
//            renderer.valid = false;
//        }
//    },true);
    var oldMouseX;
    var oldMouseY;
    canvas.addEventListener('mousedown',function(e){
        if (_this.expectResize !== -1) {
            _this.resizeDragging = true;
            return;
        }
        var mouse = _this.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        renderer.valid = false;
        if(_this.selection[0])
        {
            if(_this.selection[0].shape.HighLight_State)
                _this.selection[0].shape.HighLight_State = false;
            if(_this.selection[0].bubbleView && _this.selection[0] instanceof PATHBUBBLES.Bubble)
            {
                _this.selection[0].bubbleView.HighLight_State = false;
            }
        }

        for(i=PATHBUBBLES.objects.length -1; i>=0; i--)
        {
            if(PATHBUBBLES.objects[i] === null)
                continue;
            if( PATHBUBBLES.objects[i] instanceof PATHBUBBLES.Bubble && PATHBUBBLES.objects[i].containsInHalo(mx, my))
            {
                oldMouseX = mx;
                oldMouseY = my;

                _this.selection[0] = PATHBUBBLES.objects[i];
                _this.selection[0].shape.HighLight_State = true;
                _this.dragging = true;
                renderer.valid = false;
                return;
            }
            else if( PATHBUBBLES.objects[i] instanceof PATHBUBBLES.Bubble && PATHBUBBLES.objects[i].containsInMenu(mx, my))
            {
                oldMouseX = mx;
                oldMouseY = my;

                _this.selection[0] = PATHBUBBLES.objects[i];
//                _this.selection[0].menu.HighLight_State = true;
                _this.selection[0].menu.HighLight_State = !_this.selection[0].menu.HighLight_State;
//                _this.menu = true;
                scene.moveObjectToFront(_this.selection[0]);
                renderer.valid = false;
                return;
            }
            else if(PATHBUBBLES.objects[i] instanceof PATHBUBBLES.Bubble && PATHBUBBLES.objects[i].containsInsideBubble(mx, my))
            {
                var flag = false;
                for(var ii = 0; ii<PATHBUBBLES.objects[i].children.length; ii++)
                {
                    if( !(PATHBUBBLES.objects[i].children[ii] instanceof PATHBUBBLES.Arrow)
                        && !(PATHBUBBLES.objects[i].children[ii] instanceof PATHBUBBLES.Activation)
                        && !(PATHBUBBLES.objects[i].children[ii] instanceof PATHBUBBLES.Inhibition)
                        && (PATHBUBBLES.objects[i].children[ii].contains(mx, my)))
                    {
                        oldMouseX = mx;
                        oldMouseY = my;

                        _this.selection[0] = PATHBUBBLES.objects[i].children[ii];
                        _this.selection[0].shape.HighLight_State = true;
                        _this.moleculeDrag = true;
                        flag = true;
                        break;
                    }
                }
                if(!flag)
                {
                    oldMouseX = mx;
                    oldMouseY = my;

                    _this.selection[0] = PATHBUBBLES.objects[i];
                    if( _this.selection[0].bubbleView)
                    {
                        _this.selection[0].bubbleView.shape.HighLight_State = true;
                        _this.bubbleViewDrag = true;
                    }
                }
                renderer.valid = false;
                return;
            }

            else if ( !(PATHBUBBLES.objects[i] instanceof PATHBUBBLES.Bubble) && !(PATHBUBBLES.objects[i] instanceof PATHBUBBLES.Groups) && PATHBUBBLES.objects[i].type != "" && PATHBUBBLES.objects[i].contains(mx, my))
            {
                oldMouseX = mx;
                oldMouseY = my;
                _this.selection[0] = PATHBUBBLES.objects[i];
                _this.selection[0].shape.HighLight_State = true;

                _this.dragging = true;
                renderer.valid = false;
                return;
            }

        }
        this.style.cursor = 'auto';
    },true);
    canvas.addEventListener('mousemove', function (e) {
        var mouse = _this.getMouse(e),
            mx = mouse.x,
            my = mouse.y,
            oldx, oldy, i, cur;
        var offsetX, offsetY;
        // We don't want to drag the object by its top-left corner, we want to drag it
        // from where we clicked. Thats why we saved the offset and use it here
        offsetX = mouse.x - oldMouseX;
        offsetY = mouse.y - oldMouseY;
        oldMouseX = mouse.x;
        oldMouseY = mouse.y;
        if(_this.bubbleViewDrag)
        {
            if (_this.selection[0].bubbleView) {
                _this.selection[0].bubbleView.x += offsetX;
                _this.selection[0].bubbleView.y += offsetY;
            }
        }
        if(_this.moleculeDrag)
        {
            _this.selection[0].x += offsetX;
            _this.selection[0].y += offsetY;
        }
        if (_this.dragging) {

            if(!_this.selection[0].GROUP)
            {
                _this.selection[0].x += offsetX;
                _this.selection[0].y += offsetY;
            }
            if(_this.selection[0].GROUP)
            {
//                _this.selection[0].x += offsetX;
//                _this.selection[0].y += offsetY;
                _this.selection[0].parent.offsetX += offsetX;
                _this.selection[0].parent.offsetY += offsetY;
                for(var i=0; i<_this.selection[0].parent.children.length; ++i)
                {
                    _this.selection[0].parent.children[i].x += offsetX;
                    _this.selection[0].parent.children[i].y += offsetY;
                }
            }
            this.style.cursor = 'move';
            renderer.valid = false; // Something's dragging so we must redraw
        }
        else if (_this.resizeDragging ) {

            oldx = _this.selection[0].shape.x; //resize is just the relative position,, not absolute position
            oldy = _this.selection[0].shape.y;
            // 0  1  2
            // 3     4
            // 5  6  7
            switch (_this.expectResize) {
                case 0:
                    _this.selection[0].x = mx;
                    _this.selection[0].y = my;
                    _this.selection[0].w += oldx - mx;
                    _this.selection[0].h += oldy - my;
                    break;
                case 1:
                    _this.selection[0].y = my;
                    _this.selection[0].h += oldy - my;
                    break;
                case 2:

                    _this.selection[0].y = my;
                    _this.selection[0].w = mx - oldx;
                    _this.selection[0].h += oldy - my;
                    break;
                case 3:
                    _this.selection[0].x = mx;
                    _this.selection[0].w += oldx - mx;
                    break;
                case 4:
                    _this.selection[0].w = mx - oldx;
                    break;
                case 5:

                    _this.selection[0].x = mx;
                    _this.selection[0].w += oldx - mx;
                    _this.selection[0].h = my - oldy;
                    break;
                case 6:
                    _this.selection[0].h = my - oldy;
                    break;
                case 7:

                    _this.selection[0].w = mx - oldx;
                    _this.selection[0].h = my - oldy;
                    break;
            }
            if(_this.selection[0].GROUP)
            {
               var id = _this.selection[0].id;

               for(var i=0; i<_this.selection[0].parent.shape.points.length; ++i)
               {
                   if(_this.selection[0].parent.shape.points[i].bubbleId === id)
                   {
                       var x = _this.selection[0].x - _this.selection[0].parent.offsetX;
                       var y = _this.selection[0].y - _this.selection[0].parent.offsetY;
                       if(_this.selection[0].parent.shape.points[i].bubblePos == "left")
                       {
                           _this.selection[0].parent.shape.points[i].x = x;
                           _this.selection[0].parent.shape.points[i].y = y;
                           continue;
                       }
                       if(_this.selection[0].parent.shape.points[i].bubblePos == "right")
                       {
                           _this.selection[0].parent.shape.points[i].x = x + _this.selection[0].w;
                           _this.selection[0].parent.shape.points[i].y = y;
                           continue;
                       }
                       if(_this.selection[0].parent.shape.points[i].bubblePos == "bleft")
                       {
                           _this.selection[0].parent.shape.points[i].x = x;
                           _this.selection[0].parent.shape.points[i].y = y + _this.selection[0].h;
                           continue;
                       }
                       if(_this.selection[0].parent.shape.points[i].bubblePos == "bright")
                       {
                           _this.selection[0].parent.shape.points[i].x = x + _this.selection[0].w;
                           _this.selection[0].parent.shape.points[i].y = y + _this.selection[0].h;
                       }
                   }
               }
                for(var i=0; i<_this.selection[0].parent.tempPoints.length; ++i)
                {
                    if(_this.selection[0].parent.tempPoints[i].id === id)
                    {
                        var x = _this.selection[0].x - _this.selection[0].parent.offsetX;
                        var y = _this.selection[0].y - _this.selection[0].parent.offsetY;
                        if(_this.selection[0].parent.tempPoints[i].pos == "left")
                        {
                            _this.selection[0].parent.tempPoints[i].x = x;
                            _this.selection[0].parent.tempPoints[i].y = y;
                            continue;
                        }
                        if(_this.selection[0].parent.tempPoints[i].pos == "right")
                        {
                            _this.selection[0].parent.tempPoints[i].x = x + _this.selection[0].w;
                            _this.selection[0].parent.tempPoints[i].y = y;
                            continue;
                        }
                        if(_this.selection[0].parent.tempPoints[i].pos == "bleft")
                        {
                            _this.selection[0].parent.tempPoints[i].x = x;
                            _this.selection[0].parent.tempPoints[i].y = y + _this.selection[0].h;
                            continue;
                        }
                        if(_this.selection[0].parent.tempPoints[i].pos == "bright")
                        {
                            _this.selection[0].parent.tempPoints[i].x = x + _this.selection[0].w;
                            _this.selection[0].parent.tempPoints[i].y = y + _this.selection[0].h;
                        }
                    }
                }

                _this.groupResize = true;
            }
            renderer.valid = false;
        }

        // if there's a selection see if we grabbed one of the selection handles
        if (_this.selection[0] !== undefined && !_this.resizeDragging ) {
            for (i = 0; i < 8; i += 1) {
                // 0  1  2
                // 3     4
                // 5  6  7

                cur = PATHBUBBLES.selectionHandles[i];

                // we dont need to use the ghost context because
                // selection handles will always be rectangles
                if (mx >= cur.x && mx <= cur.x + _this.selectionBoxSize &&
                    my >= cur.y && my <= cur.y + _this.selectionBoxSize) {
                    // we found one!
                    _this.expectResize = i;
                    renderer.valid = false;

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
                    _this.selection[0].shape.HighLight_State = true;
                    return;
                }

            }
            // not over a selection box, return to normal
            _this.resizeDragging = false;
            _this.expectResize = -1;

        }
    }, true);
    canvas.addEventListener('mouseup',function(e) {
        this.style.cursor = 'auto';
//        if(_this.selection[0]&&  _this.menu)
//        {
//            _this.menu = false;
//            _this.selection[0].menu.HighLight_State = false;
//
//        }
        if(_this.selection[0]&&  !_this.groupResize)
        {
            for(var i=0; i<PATHBUBBLES.objects.length; ++i)
            {
                if((_this.selection[0]!== PATHBUBBLES.objects[i])
                    && (_this.selection[0] instanceof PATHBUBBLES.Bubble
                    ||_this.selection[0].parent instanceof PATHBUBBLES.Groups))
                {
                    if(_this.detectOverlap(_this.selection[0], PATHBUBBLES.objects[i]) )
                    {
                        if(PATHBUBBLES.objects[i] instanceof PATHBUBBLES.Bubble)
                        {
                            if(PATHBUBBLES.objects[i].GROUP)
                            {
                                if(PATHBUBBLES.objects[i].parent instanceof PATHBUBBLES.Groups)
                                {
                                    PATHBUBBLES.objects[i].parent.addToGroup(_this.selection[0]);
                                }
                            }
                            else
                            {
                                var group= new PATHBUBBLES.Groups();
                                group.addToGroup(PATHBUBBLES.objects[i]);
                                group.addToGroup(_this.selection[0]);
                                scene.addObject(group);
                            }
                        }
                    }
                }
            }
        }
        _this.bubbleViewDrag = false;
        _this.dragging = false;
        _this.moleculeDrag = false;
        _this.resizeDragging = false;
        _this.expectResize = -1;
        _this.groupResize= false;
        //renderer.valid = false;
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
        renderer.valid = false;
    }
    this.selectionBoxSize = PATHBUBBLES.selectionBoxSize;
};
PATHBUBBLES.Interaction.prototype ={
    detectOverlap: function (object1, object2) {
        return (object1.x < object2.x + object2.w &&
            object1.x + object1.w > object2.x &&
            object1.y < object2.y + object2.h &&
            object1.h + object1.y > object2.y) ||
            (object2.x < object1.x + object1.w &&
                object2.x + object2.w > object1.x &&
                object2.y < object1.y + object1.h &&
                object2.h + object2.y > object1.y);
    },
    getMouse: function (e) {
        var element = canvas, offsetX = 0, offsetY = 0, mx, my;
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

