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
    this.selection = [];// the current selected object. In the future we could turn this into an array for multiple selection

    // New, holds the 8 tiny boxes that will be our selection handles
    // the selection handles will be in this order:
    // 0  1  2
    // 3     4
    // 5  6  7
    this.selectionHandles = [];
    for (var i = 0; i < 8; i += 1) {
        this.selectionHandles.push(new Complex(this));   //here we just keep 8 rectangle for resizing
    }

    var _this = this;
    //canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
    // Up, down, and move are for dragging
    document.addEventListener('keydown',function(e){
            if(e.keyCode === 17)//Ctrl
            {
                _this.Ctrl = true;
            }
    },true);
    document.addEventListener('keyup',function(e){
        if(e.keyCode === 17)//Ctrl
        {
            _this.Ctrl = false;
            for(i=0; i< _this.selection.length; ++i)
                _this.selection[i].flag = false;
            _this.selection.length = 0;
            _this.valid = false;
        }
    },true);

    var oldMouseX;
    var oldMouseY;
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
            if (_this.shapes[i].contains(mx, my)) {
                oldMouseX = mx;
                oldMouseY = my;
                _this.shapes[i].flag = true;
                for(var j=0; j<_this.selection.length; j++)
                {
                    if(_this.selection[j] === _this.shapes[i])
                        break;
                }
                if(j>= _this.selection.length)
                    _this.selection.push(_this.shapes[i]);

                _this.dragging = true;
                _this.valid = false;
                return;
            }
        }
        this.style.cursor = 'auto';
    }, true);
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
            for(i=0; i< _this.selection.length; ++i)
            {
                if(_this.Ctrl && _this.selection[i].type !== "VISUALIZATION" )
                {
                    _this.selection[i].x += offsetX;  //mouse move relative to the navigation viewpoint
                    _this.selection[i].y += offsetY;
                }
                else if(!_this.Ctrl)
                {
                    _this.selection[i].x += offsetX;  //mouse move relative to the navigation viewpoint
                    _this.selection[i].y += offsetY;
                }
                //console.log( "Length:" + _this.selection.length);
                //console.log(i + "offsetX:" + offsetX +", offsetY" + offsetY);
                if(_this.selection[i].type === "M")
                {
                    _this.selection[i].childOffsetx += offsetX;  //mouse move relative to the navigation viewpoint
                    _this.selection[i].childOffsety += offsetY;
                }
            }
            this.style.cursor = 'move';
            _this.valid = false; // Something's dragging so we must redraw
        }
        else if (_this.resizeDragging && !_this.Ctrl) {
            //Father:Bubble. ====>Child: Compartment. ====> ====>Child: Protein, Complex, Small Molecule, DNA, ...
            if (_this.selection[0].type === "VISUALIZATION")  //Fixed a bug: Bubble object do not need to add offsetX;
            {
                oldx = _this.selection[0].x; //OffsetX is just used for test the contain relatonship
                oldy = _this.selection[0].y;
                this.style.cursor = 'auto';
            }
            else if (_this.selection[0].type === "M") {
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
        if (_this.selection[0] !== null && !_this.resizeDragging && !_this.Ctrl) {
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
        /*for(var i=0; i<_this.selection.length; ++i){
            if (_this.selection[i].w < 0) {
                _this.selection[i].w = -_this.selection[i].w;
                _this.selection[i].x -= _this.selection[i].w;
            }
            if (_this.selection[i].h < 0) {
                _this.selection[i].h = -_this.selection[i].h;
                _this.selection[i].y -= _this.selection[i].h;
            }
        }*/

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
        // if our state is invalid, redraw and validate!
        if (!this.valid) {
            this.clear();
            if (Bubbles)
                Bubbles.draw(this.ctx);

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