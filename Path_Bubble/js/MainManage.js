/**
 * Created by Yongnan on 7/2/2014.
 */
function MainManage(canvas)
{
    this.canvas = canvas;
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
    this.ctx = canvas.getContext('2d');

    this.valid = false; // when set to false, the canvas will redraw everything
    this.shapes = [];  // the collection of things to be drawn on the 2d canvas

    this.dragging = false; // Keep track of when we are dragging
    this.resizeDragging = false; // Keep track of resize
    this.expectResize = -1; // save the # of the selection handle

    this.selection = null;// the current selected object. In the future we could turn this into an array for multiple selection
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;

    // New, holds the 8 tiny boxes that will be our selection handles
    // the selection handles will be in this order:
    // 0  1  2
    // 3     4
    // 5  6  7
    this.selectionHandles = [];
    for (var i = 0; i < 8; i += 1) {
        this.selectionHandles.push(new Compartment(this));
    }

    var _this = this;

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
            if(_this.shapes[i] === null || _this.shapes[i].type === "ARROW" ||_this.shapes[i].type === "INHIBITION"||_this.shapes[i].type === "ACTIVATION")
                continue;
            if (_this.shapes[i].contains(mx, my)) {
                _this.selectId = i;        //We have three types of bubbles: CHART, BUBBLE, COMPARE, so we need to choose the bubble according to this type

                _this.oldPosx = mx;
                _this.navViewSelected = true;

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
    }, true);

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
            /*
            if(_this.navViewSelected)
            {
                resetAllBubblesPos( (mx- _this.oldPosx)* window.innerWidth /nvWidth );
            }

            if(_this.selectId > 0) //_this.selectId We have three types of bubbles: CHART, BUBBLE, COMPARE, so we need to choose the bubble according to this type
            {
                var offsetpos = boxToViewPointPos(( _this.selection.x - _this.boxoldPosx), ( _this.selection.y - _this.boxoldPosy));
                var rectId = _this.shapes[_this.selectId].Id;
                var rectType = _this.shapes[_this.selectId].type;
                updateBubblePos(rectId, rectType, offsetpos.x, offsetpos.y);
            }
            */
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
        /*
        if(_this.navViewSelected)
        {
            currentViewpointPosx = _this.selection.x;
            currentViewpointPosy = _this.selection.y;
            _this.navViewSelected = false;
        } */

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

MainManage.prototype={
    addShape : function(shape) {
        this.shapes.push(shape);
        this.valid = false;
    },
    remove : function(value)
    {
        var l = this.shapes.length;
        if(value >0 && value <l)
            this.shapes.splice(value,1);
        this.valid = false;
    },
    clear : function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    },
    draw : function() {
        // if our state is invalid, redraw and validate!
        if (!this.valid) {
            this.clear();
            // draw all the arrow
            for (var i = 0; i < this.shapes.length; i += 1) {
                if(this.shapes[i]!==null)
                {
                    if(this.shapes[i].type === "ARROW"||this.shapes[i].type === "INHIBITION"||this.shapes[i].type === "ACTIVATION")
                    {
                        this.shapes[i].draw(this.ctx);
                    }
                }
            }
            for (var i = 0; i < this.shapes.length; i += 1) {
                if(this.shapes[i]!==null)
                {
                    if(this.shapes[i].type !== "ARROW"&&this.shapes[i].type !== "INHIBITION"&&this.shapes[i].type !== "ACTIVATION")
                    {
                        this.shapes[i].draw(this.ctx);
                    }

                }
            }
            // draw selection
            if (this.selection !== null) {
                this.ctx.strokeStyle = this.selectionColor;
                  this.ctx.lineWidth = this.selectionWidth;
                if(this.selection.type ==="COMPARTMENT"||this.selection.type ==="BUBBLE")
                {
                    this.ctx.strokeRect(this.selection.x, this.selection.y, this.selection.w, this.selection.h);
                }
                else
                {
                    this.selection.drawStroke(this.ctx);
                }

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