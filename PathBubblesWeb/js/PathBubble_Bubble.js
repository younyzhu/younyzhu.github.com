/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/16/2014
 * @name        PathBubble_Bubble
 */

PATHBUBBLES.Bubble = function (x, y, w, h, strokeColor, fillColor, cornerRadius, text) {
    PATHBUBBLES.Object2D.call(this);
    this.type = "Bubble";
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 500;
    this.h = h || 500;
    this.strokeColor = strokeColor || "#00ffff";
    this.fillColor = fillColor || "#ffffff";
    this.cornerRadius = cornerRadius || 20;
    this.lineWidth = 10;

    this.shape = new PATHBUBBLES.Shape.Rectangle(this, this.x, this.y, this.w, this.h, this.strokeColor, this.fillColor, this.lineWidth, this.cornerRadius);

    this.menu = new PATHBUBBLES.Shape.Circle(this.x + this.w - this.cornerRadius / 2, this.y + this.cornerRadius / 2, this.lineWidth, "#ff0000", this.strokeColor, 1) || null;
    this.bubbleView = null;
    this.menuBar = new PATHBUBBLES.Menu(this);
    var button = new PATHBUBBLES.Button(this.menuBar, 0);   //Button 0 for file selection
    button.addButton();

    this.name = text;
    this.__objectsAdded = [];
    this.__objectsRemoved = [];
    this.center = {x: this.x + this.w / 2, y: this.y + this.h / 2};
    this.GROUP = false;
    this.selected_file = null;
};

PATHBUBBLES.Bubble.prototype = Object.create(PATHBUBBLES.Object2D.prototype);

PATHBUBBLES.Bubble.prototype = {
    constructor: PATHBUBBLES.Bubble,
    addObject: function (object) {
//        object.parent = this;
//        object.shape.parent = this;

        var index = this.children.indexOf(object);
        if (index > -1) {
            this.children.splice(index, 1);
        }
        this.children.push(object);
//        if (PATHBUBBLES.objects.indexOf(object) == -1)
//            PATHBUBBLES.objects.push(object);
//        this.__objectsAdded.push(object);
        // check if previously removed
//        var i = this.__objectsRemoved.indexOf(object);
//        if (i !== -1) {
//            this.__objectsRemoved.splice(i, 1);
//        }
//        for (var c = 0; c < object.children.length; c++) {
//            this.addObject(object.children[ c ]);
//        }
    },
    removeObject: function (object) {
        this.__objectsRemoved.push(object);
        var index = PATHBUBBLES.objects.indexOf(object);
        if (index !== -1) {
            PATHBUBBLES.objects.splice(index, 1);
        }
        var index = this.children.indexOf(object);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
        var i = this.__objectsAdded.indexOf(object);
        if (i !== -1) {
            this.__objectsAdded.splice(i, 1);
        }
        for (var c = 0; c < object.children.length; c++) {
            this.removeObject(object.children[ c ]);
        }
    },
    menuOperation: function(){
        var _this=this;
        var $menuBarbubble = $('#menuView'+ this.id);
        $menuBarbubble.find('#button'+ 0).on('click', function(){
            _this.selected_file = $menuBarbubble.find('#file'+ 0).get(0).files[0];
            if ( !_this.selected_file) {
                alert("Please select data file!");
            }
            else
            {
                _this.bubbleView = null;
                _this.children.length =0;
                var localFileLoader = new PATHBUBBLES.LocalFileLoader(_this);

                localFileLoader.load(_this.selected_file);
            }

        });
    },
    draw: function (ctx, scale) {
        this.setOffset();

        ctx.save();
        this.shape.draw(ctx, scale);
        if(this.bubbleView)
        if (this.bubbleView.compartments.length != 0)
            this.bubbleView.draw(ctx, scale);
        ctx.restore();
        ctx.save();
        if (this.menu && scale == 1) {
            this.menu.draw(ctx, scale);

        }
        if (this.menu.HighLight_State && scale == 1) {
            this.menuBar.draw(ctx, scale);
        }
        if (this.menu.HighLight_State) {
            for (var i = 0; i < this.menuBar.buttons.length; ++i) {
                this.menuBar.buttons[i].update();
                this.menuBar.buttons[i].show();
            }
        }
        else {
            for (var i = 0; i < this.menuBar.buttons.length; ++i) {
                this.menuBar.buttons[i].update();
                this.menuBar.buttons[i].hide();
            }
        }
        ctx.restore();
        if (this.shape.HighLight_State) {
            ctx.save();
            this.shape.drawStroke(ctx, scale);
            this.drawSelection(ctx, scale);
            ctx.restore();
        }

    },
    setOffset: function () {
        if (this.parent !== undefined) {
            this.offsetX = this.parent.x;
            this.offsetY = this.parent.y;
        }
        else {
            this.offsetX = 0;
            this.offsetY = 0;
        }
        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
        this.shape.x = this.x;
        this.shape.y = this.y;
        this.menu.x = this.x + this.w - this.cornerRadius / 2;
        this.menu.y = this.y + this.cornerRadius / 2;
//        this.menuBar.x = this.x + this.w+this.offsetX;
//        this.menuBar.y = this.y + this.offsetY;
        this.shape.w = this.w;
        this.shape.h = this.h;
    },
    drawSelection: function (ctx, scale) {
        var i, cur, half;
        var x = this.shape.offsetX + this.shape.x;
        var y = this.shape.offsetY + this.shape.y;

        var w = this.shape.w;
        var h = this.shape.h;
        if (this.GROUP) {
            x -= 6;
            y -= 6;
            w += 12;
            h += 12;
        }
        // draw the boxes
        half = PATHBUBBLES.selectionBoxSize / 2;
        // 0  1  2
        // 3     4
        // 5  6  7
        // top left, middle, right
        PATHBUBBLES.selectionHandles[0].x = x - half;
        PATHBUBBLES.selectionHandles[0].y = y - half;

        PATHBUBBLES.selectionHandles[1].x = x + w / 2 - half;
        PATHBUBBLES.selectionHandles[1].y = y - half;

        PATHBUBBLES.selectionHandles[2].x = x + w - half;
        PATHBUBBLES.selectionHandles[2].y = y - half;

        //middle left
        PATHBUBBLES.selectionHandles[3].x = x - half;
        PATHBUBBLES.selectionHandles[3].y = y + h / 2 - half;

        //middle right
        PATHBUBBLES.selectionHandles[4].x = x + w - half;
        PATHBUBBLES.selectionHandles[4].y = y + h / 2 - half;

        //bottom left, middle, right
        PATHBUBBLES.selectionHandles[6].x = x + w / 2 - half;
        PATHBUBBLES.selectionHandles[6].y = y + h - half;

        PATHBUBBLES.selectionHandles[5].x = x - half;
        PATHBUBBLES.selectionHandles[5].y = y + h - half;

        PATHBUBBLES.selectionHandles[7].x = x + w - half;
        PATHBUBBLES.selectionHandles[7].y = y + h - half;

        for (i = 0; i < 8; i += 1) {
            cur = PATHBUBBLES.selectionHandles[i];
//            ctx.save();	// save the context so we don't mess up others
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(cur.x * scale, cur.y * scale, PATHBUBBLES.selectionBoxSize * scale, PATHBUBBLES.selectionBoxSize * scale);
//            ctx.restore();
        }
    },
    contains: function (mx, my) {
        return this.shape.contains(mx, my);
    },
    insideRect: function (mx, my, x, y, w, h) {
        return  (x <= mx) && (x + w >= mx) && (y <= my) && (y + h >= my);
    },
    containsInMenu: function (mx, my) {
        var x = this.menu.x;
        var y = this.menu.y;
        return  (x - mx ) * (x - mx) + (y - my ) * (y - my) <= 10 * 10;
    },
    containsInHalo: function (mx, my) {
        var x = this.shape.offsetX + this.shape.x + 5;
        var y = this.shape.offsetY + this.shape.y + 5;
        var w = this.shape.w - 10;
        var h = this.shape.h - 10;

        var x2 = this.shape.offsetX + this.shape.x - 5;
        var y2 = this.shape.offsetY + this.shape.y - 5;
        var w2 = this.shape.w + 10;
        var h2 = this.shape.h + 10;
        return (!this.insideRect(mx, my, x, y, w, h) && this.insideRect(mx, my, x2, y2, w2, h2));
    },
    containsInsideBubble: function (mx, my) {
        var x = this.shape.offsetX + this.shape.x + 5;
        var y = this.shape.offsetY + this.shape.y + 5;
        var w = this.shape.w - 10;
        var h = this.shape.h - 10;
        return this.insideRect(mx, my, x, y, w, h);
    },
    clone: function () {
        var bubble = new PATHBUBBLES.Bubble();
        bubble.id = this.id;
        bubble.name = this.name;
        bubble.parent = this.parent;
        for (var i = 0; i < this.children.length; ++i) {
            var a = this.children[i];
            if (bubble.children.indexOf(a) == -1)
                bubble.children.push(a);
        }

        bubble.type = this.type;
        bubble.x = this.x;
        bubble.y = this.y;
        bubble.w = this.w;
        bubble.h = this.h;
        bubble.strokeColor = this.strokeColor;
        bubble.fillColor = this.fillColor;
        bubble.cornerRadius = this.cornerRadius;

        bubble.shape = new PATHBUBBLES.Shape.Rectangle(this.x, this.y, this.w, this.h, this.strokeColor, this.fillColor, 10, this.cornerRadius);
        bubble.offsetX = this.offsetX;
        bubble.offsetY = this.offsetY;


        for (var i = 0, il = this.__objectsAdded.length; i < il; i++) {
            var a = this.__objectsAdded[ i ];
            bubble.__objectsAdded.push(a);
        }
        for (var i = 0, il = this.__objectsRemoved.length; i < il; i++) {
            var a = this.__objectsRemoved[ i ];
            bubble.__objectsRemoved.push(a);
        }
        bubble.__objectsRemoved = this.__objectsRemoved;
        bubble.center = this.center;
        bubble.GROUP = this.GROUP;
        return bubble;
    }
};