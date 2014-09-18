/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/16/2014
 * @name        PathBubble_render
 */
PATHBUBBLES.Render = function(canvas, scene){

    this.canvas = canvas;
    this.canvasWidth = canvas.clientWidth;
    this.canvasHeight = canvas.clientHeight;

    this.valid = false;

    this.scene = scene||null;//manage objects inside scene

    this.ctx = canvas.getContext('2d');  // when set to false, the canvas will redraw everything

    this.dragging = false; // Keep track of when we are dragging
    this.resizeDragging = false; // Keep track of resize
    this.expectResize = -1; // save the # of the selection handle

    this.selection = [];// the current selected objects.

    // New, holds the 8 tiny boxes that will be our selection handles
    // the selection handles will be in this order:
    // 0  1  2
    // 3     4
    // 5  6  7
    PATHBUBBLES.selectionHandles = [];
    for (var i = 0; i < 8; i += 1) {
        PATHBUBBLES.selectionHandles.push(new PATHBUBBLES.Shape.Rectangle(this));   //here we just keep 8 rectangle for resizing
    }

    var _this = this;

    document.addEventListener('keydown',function(e){
        if(e.keyCode === 17)//Ctrl
        {
            console.log("Ctrl key down for multi selection.");
        }
    },true);

    document.addEventListener('keyup',function(e){
        if(e.keyCode === 17)//Ctrl
        {
            console.log("Ctrl key up, this time select " + _this.selection.length + " elements");
            _this.valid = false;
        }
    },true);
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
        _this.valid = false;
        for(i=PATHBUBBLES.objects.length -1; i>=0; i--)
        {
            if(PATHBUBBLES.objects[i] === null)
                continue;
            if( PATHBUBBLES.objects[i].type == "Bubble" && PATHBUBBLES.objects[i].containsInHalo(mx, my))
            {
                oldMouseX = mx;
                oldMouseY = my;

                _this.selection[0] = PATHBUBBLES.objects[i].shape;
                _this.selection[0].HighLight_State = true;
                _this.dragging = true;
                _this.valid = false;
                return;
            }
            else if ( PATHBUBBLES.objects[i].type != "Bubble" &&PATHBUBBLES.objects[i].type != "Group" &&PATHBUBBLES.objects[i].type != "" && PATHBUBBLES.objects[i].contains(mx, my))
            {
                oldMouseX = mx;
                oldMouseY = my;
                _this.selection[0] = PATHBUBBLES.objects[i].shape;
                _this.selection[0].HighLight_State = true;

                _this.dragging = true;
                _this.valid = false;
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
        if (_this.dragging) {
            // We don't want to drag the object by its top-left corner, we want to drag it
            // from where we clicked. Thats why we saved the offset and use it here
            offsetX = mouse.x - oldMouseX;
            offsetY = mouse.y - oldMouseY;
            oldMouseX = mouse.x;
            oldMouseY = mouse.y;
            _this.selection[0].x += offsetX;  //mouse move relative to the navigation viewpoint
            _this.selection[0].y += offsetY;

            this.style.cursor = 'move';
            _this.valid = false; // Something's dragging so we must redraw
        }
        else if (_this.resizeDragging ) {

            oldx = _this.selection[0].x; //resize is just the relative position,, not absolute position
            oldy = _this.selection[0].y;
            //mx -= _this.selection[0].offsetX;
            //my -= _this.selection[0].offsetY;
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

            _this.valid = false;
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
                    _this.selection[0].HighLight_State = true;
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
        if(_this.selection[0])
            _this.selection[0].HighLight_State = false;
        _this.selection.splice(1);
        _this.dragging = false;
        _this.resizeDragging = false;
        _this.expectResize = -1;
        //_this.valid = false;
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

    this.selectionBoxSize = PATHBUBBLES.selectionBoxSize;

    function animate() {
        requestAnimationFrame(animate);
        _this.draw();
    }
    animate();
};
PATHBUBBLES.Render.prototype ={
    constructor: PATHBUBBLES.Render,
    clear: function () {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    draw: function () {
        var _this = this;
        // update Skeleton objects
        function drawObject( object ) {
            if(! (object instanceof PATHBUBBLES.Scene) && !( object instanceof PATHBUBBLES.Object2D ))
            {
                object.draw(_this.ctx);
            }
            for ( var i = 0, l = object.children.length; i < l; i ++ ) {
                drawObject( object.children[ i ] );
            }
        }

        if (!this.valid) {
            this.clear();
            if (this.scene)
            {
                drawObject(this.scene);
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
