/**
 * Created by Yongnanzhu on 5/12/2014.
 */
//part code modify from https://github.com/amclark
function Rectangle(state, x, y, w ,h, color, fillState)
{
    this.state = state;
    this.x = x + currentViewpointPosx || 0;
    this.y = y + currentViewpointPosy || 0;
    this.w = w || 1;
    this.h = h || 1;

    this.strokeColor = color || "#0000ff";
    this.lineWidth   = 2;
    this.fillState = fillState ||false;
}

Rectangle.prototype ={
    draw : function(ctx)
    {
        var i, cur, half;
        if(this.fillState)
        {
            ctx.fillStyle = this.strokeColor;
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
        else
        {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.lineWidth;
            ctx.strokeRect(this.x,this.y,this.w,this.h);
        }

        if (this.state.selection === this)
        {
            // draw the boxes
            half = this.state.selectionBoxSize / 2;
            // 0  1  2
            // 3     4
            // 5  6  7

            // top left, middle, right
            this.state.selectionHandles[0].x = this.x-half;
            this.state.selectionHandles[0].y = this.y-half;

            this.state.selectionHandles[1].x = this.x+this.w/2-half;
            this.state.selectionHandles[1].y = this.y-half;

            this.state.selectionHandles[2].x = this.x+this.w-half;
            this.state.selectionHandles[2].y = this.y-half;

            //middle left
            this.state.selectionHandles[3].x = this.x-half;
            this.state.selectionHandles[3].y = this.y+this.h/2-half;

            //middle right
            this.state.selectionHandles[4].x = this.x+this.w-half;
            this.state.selectionHandles[4].y = this.y+this.h/2-half;

            //bottom left, middle, right
            this.state.selectionHandles[6].x = this.x+this.w/2-half;
            this.state.selectionHandles[6].y = this.y+this.h-half;

            this.state.selectionHandles[5].x = this.x-half;
            this.state.selectionHandles[5].y = this.y+this.h-half;

            this.state.selectionHandles[7].x = this.x+this.w-half;
            this.state.selectionHandles[7].y = this.y+this.h-half;

            for (i = 0; i < 8; i += 1) {
                cur = this.state.selectionHandles[i];
                ctx.fillRect(cur.x, cur.y, this.state.selectionBoxSize, this.state.selectionBoxSize);
            }
        }
    },
    contains : function(mx, my)
    {
        return  (this.x <= mx) && (this.x + this.w >= mx) &&
            (this.y <= my) && (this.y + this.h >= my);
    }
};

var currentViewpointPosx =0;
var currentViewpointPosy =0;
function NavCanvas(canvas)
{
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');

    this.valid = false; // when set to false, the canvas will redraw everything
    this.shapes = [];  // the collection of things to be drawn on the 2d canvas

    this.dragging = false; // Keep track of when we are dragging
    this.resizeDragging = false; // Keep track of resize
    this.expectResize = -1; // save the # of the selection handle

    this.selection = null;// the current selected object. In the future we could turn this into an array for multiple selection
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;
    this.selectId = -1;

    // New, holds the 8 tiny boxes that will be our selection handles
    // the selection handles will be in this order:
    // 0  1  2
    // 3     4
    // 5  6  7
    this.selectionHandles = [];
    for (var i = 0; i < 8; i += 1) {
        this.selectionHandles.push(new Rectangle(this));
    }

    var _this = this;
    this.navViewSelected = false;

    this.reserveView = []; //This is to keep the viewpoints in the virtual bar

    //canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
    // Up, down, and move are for dragging
    canvas.addEventListener('mousedown', function(e) {

        if (_this.expectResize !== -1) {
            _this.resizeDragging = true;
            return;
        }
        var mouse = _this.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        for (var i = _this.shapes.length-1; i >= 0; i -= 1) {
            if (_this.shapes[i].contains(mx, my)) {
                _this.selectId = i;

                // Keep track of where in the object we clicked
                // so we can move it smoothly (see mousemove)
                if(i===0)
                {
                    _this.oldPosx = mx;
                    _this.navViewSelected = true;
                }
                _this.dragoffx = mx - _this.shapes[i].x;
                _this.dragoffy = my - _this.shapes[i].y;

                _this.boxoldPosx = _this.shapes[i].x;
                _this.boxoldPosy = _this.shapes[i].y;

                _this.dragging = true;
                _this.selection = _this.shapes[i];
                _this.valid = false;
                return;
            }
        }

        // haven't returned means we have failed to select anything.
        // If there was an object selected, we deselect it
        if (_this.selection) {
            _this.selection = null;
            _this.valid = false; // Need to clear the old selection border
        }
    }, true);
    // double click for making new shapes
    canvas.addEventListener('dblclick', function(e) {
        var mouse = _this.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        if (_this.shapes[0].contains(mx, my)) {
            _this.addResearveShape(new Rectangle(navigationCanvas, _this.shapes[0].x - currentViewpointPosx, _this.shapes[0].y - currentViewpointPosy,
                _this.shapes[0].w, _this.shapes[0].h, _this.shapes[0].strokeColor, _this.shapes[0].fillState));
        }
    }, true);

    //This function is called when the navigation bar is move,actually,
    //the navigation bar can move in horizontal direction
    //So the whole bubble in screen space is just need to change the x-pos
    function boxToViewPointPos(mousePosX,mousePosY)  //mouse pos on the navigation bar
    {
        var widthPercent = mousePosX / nvWidth;
        var heightPercent = mousePosY / 50;
        var left = window.innerWidth * widthPercent;
        var top = (window.innerHeight -50) * heightPercent; //50 is the height of the navigation bar;
        return {x: left, y: top};
    }

    canvas.addEventListener('mousemove', function(e) {
        var mouse = _this.getMouse(e),
            mx = mouse.x,
            my = mouse.y,
            oldx, oldy, i, cur;
        if (_this.dragging){
            mouse = _this.getMouse(e);
            // We don't want to drag the object by its top-left corner, we want to drag it
            // from where we clicked. Thats why we saved the offset and use it here
            _this.selection.x = mouse.x - _this.dragoffx;  //mouse move relative to the navigation viewpoint
            _this.selection.y = mouse.y - _this.dragoffy;

            if(_this.navViewSelected)
            {
                resetAllBubblesPos( (mx- _this.oldPosx)* window.innerWidth /nvWidth );
            }

            if(_this.selectId > 0)
            {
                var offsetpos = boxToViewPointPos(( _this.selection.x - _this.boxoldPosx), ( _this.selection.y - _this.boxoldPosy));
                updateBubblePos(_this.selectId, offsetpos.x, offsetpos.y);
            }
            _this.oldPosx = mx;
            _this.boxoldPosx = _this.selection.x;
            _this.boxoldPosy = _this.selection.y;
            _this.valid = false; // Something's dragging so we must redraw
        }
        else if (_this.resizeDragging) {
            // time ro resize!
            oldx = _this.selection.x;
            oldy = _this.selection.y;

            // 0  1  2
            // 3     4
            // 5  6  7
            switch (_this.expectResize) {
                case 0:
                    _this.selection.x = mx;
                    _this.selection.y = my;
                    _this.selection.w += oldx - mx;
                    _this.selection.h += oldy - my;
                    break;
                case 1:
                    _this.selection.y = my;
                    _this.selection.h += oldy - my;
                    break;
                case 2:
                    _this.selection.y = my;
                    _this.selection.w = mx - oldx;
                    _this.selection.h += oldy - my;
                    break;
                case 3:
                    _this.selection.x = mx;
                    _this.selection.w += oldx - mx;
                    break;
                case 4:
                    _this.selection.w = mx - oldx;
                    break;
                case 5:
                    _this.selection.x = mx;
                    _this.selection.w += oldx - mx;
                    _this.selection.h = my - oldy;
                    break;
                case 6:
                    _this.selection.h = my - oldy;
                    break;
                case 7:
                    _this.selection.w = mx - oldx;
                    _this.selection.h = my - oldy;
                    break;
            }

            _this.valid = false;
        }

        // if there's a selection see if we grabbed one of the selection handles
        if (_this.selection !== null && !_this.resizeDragging) {
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
                            this.style.cursor='nw-resize';
                            break;
                        case 1:
                            this.style.cursor='n-resize';
                            break;
                        case 2:
                            this.style.cursor='ne-resize';
                            break;
                        case 3:
                            this.style.cursor='w-resize';
                            break;
                        case 4:
                            this.style.cursor='e-resize';
                            break;
                        case 5:
                            this.style.cursor='sw-resize';
                            break;
                        case 6:
                            this.style.cursor='s-resize';
                            break;
                        case 7:
                            this.style.cursor='se-resize';
                            break;
                    }
                    return;
                }

            }
            // not over a selection box, return to normal
            _this.resizeDragging = false;
            _this.expectResize = -1;
            this.style.cursor = 'auto';
        }
    }, true);
    canvas.addEventListener('mouseup', function(e) {
        _this.dragging = false;
        _this.resizeDragging = false;
        _this.expectResize = -1;
        _this.selectId = -1;
        if(_this.navViewSelected)
        {
            currentViewpointPosx = _this.selection.x;
            currentViewpointPosy = _this.selection.y;
            _this.navViewSelected = false;
        }

        if (_this.selection !== null) {
            if (_this.selection.w < 0) {
                _this.selection.w = -_this.selection.w;
                _this.selection.x -= _this.selection.w;
            }
            if (_this.selection.h < 0) {
                _this.selection.h = -_this.selection.h;
                _this.selection.y -= _this.selection.h;
            }
        }
    }, true);

    this.selectionColor = '#CC0000';
    this.selectionWidth = 2;
    this.selectionBoxSize = 6;

    function animate(){
        requestAnimationFrame(animate);
        _this.draw();
    }
    animate();
}

NavCanvas.prototype={
    addShape : function(shape) {
        this.shapes.push(shape);
        this.valid = false;
    },
    addResearveShape: function(shape){   //this is used to keep the viewpoint in the virtual bar
        this.reserveView.push(shape);
        this.valid = false;
    },
    remove : function(value)
    {
        var l = this.shapes.length;
        if(value >0 && value <l)
            this.shapes[value] = null;
        this.valid = false;
    },
    updateRectPos : function(id, x, y)
    {
        if(id>=0&&id<this.shapes.length)
        {
            this.shapes[id].x = x + currentViewpointPosx;
            this.shapes[id].y = y + currentViewpointPosy;
            this.valid = false;
        }
    },
    updateRectResize : function(id, w, h)
    {
        if(id>=0&&id<this.shapes.length)
        {
            this.shapes[id].w = w;
            this.shapes[id].h = h;
            this.valid = false;
        }
    },
    clear : function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    },
    draw : function() {
        // if our state is invalid, redraw and validate!
        if (!this.valid) {
            this.clear();
            // draw all shapes
            for (var i = 0; i < this.shapes.length; i += 1) {
                if(this.shapes[i]!==null)
                {
                    // We can skip the drawing of elements that have moved off the screen:
                    if (this.shapes[i].x <= this.width && this.shapes[i].y <= this.height &&
                        this.shapes[i].x + this.shapes[i].w >= 0 && this.shapes[i].y + this.shapes[i].h >= 0) {
                        this.shapes[i].draw(this.ctx);
                    }
                }
            }
            // draw the viewpoint in the navigation bar
            for( var j=0; j< this.reserveView.length; j++)
            {
                if(this.reserveView[i]!== null)
                {
                    // We can skip the drawing of elements that have moved off the screen:
                    if (this.reserveView[i].x <= this.width && this.reserveView[i].y <= this.height &&
                        this.reserveView[i].x + this.reserveView[i].w >= 0 && this.reserveView[i].y + this.reserveView[i].h >= 0) {
                        this.reserveView[i].draw(this.ctx);
                    }
                }
            }
            // draw selection
            if (this.selection !== null) {
                this.ctx.strokeStyle = this.selectionColor;
                this.ctx.lineWidth = this.selectionWidth;
                this.ctx.strokeRect(this.selection.x, this.selection.y, this.selection.w, this.selection.h);
            }
            this.valid = true;
        }
    },
    getMouse : function(e) {
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
