/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/16/2014
 * @name        PathBubble_Bubble
 */

PATHBUBBLES.Bubble = function(x, y, w ,h, strokeColor, fillColor, cornerRadius){
    PATHBUBBLES.Object2D.call(this);
    this.type = "Bubble";
    this.shape = new PATHBUBBLES.Shape.Rectangle(x, y, w ,h, strokeColor, fillColor, 10, cornerRadius);
    this.x = this.shape.x;
    this.y = this.shape.y;
    this.w = this.shape.w;
    this.h = this.shape.h;
    this.name = "bubble";
    this.__objectsAdded = [];
    this.__objectsRemoved = [];
    this.parentObject = null;
    this.offsetX =0;
    this.offsetY =0;
    this.center = {x: this.x + this.w/2, y: this.y + this.h/2};
};

PATHBUBBLES.Bubble.prototype = Object.create( PATHBUBBLES.Object2D.prototype );

PATHBUBBLES.Bubble.prototype ={
    constructor: PATHBUBBLES.Bubble,
    addObject : function(object){
        object.parentObject = this;
        object.shape.parentObject = this;
        PATHBUBBLES.objects.push(object);
        this.children.push(object);
        this.__objectsAdded.push( object );
        // check if previously removed
        var i = this.__objectsRemoved.indexOf( object );
        if ( i !== - 1 ) {
            this.__objectsRemoved.splice( i, 1 );
        }
        for ( var c = 0; c < object.children.length; c ++ ) {
            this.addObject( object.children[ c ] );
        }
    },
    removeObject : function(object){
        this.__objectsRemoved.push( object );
        var index = PATHBUBBLES.objects.indexOf(object);
        if(index !== -1)
        {
            PATHBUBBLES.objects.splice(index, 1);
        }
        var index = this.children.indexOf(object);
        if(index !== -1)
        {
            this.children.splice(index, 1);
        }
        var i = this.__objectsAdded.indexOf( object );
        if ( i !== - 1 ) {
            this.__objectsAdded.splice( i, 1 );
        }
        for ( var c = 0; c < object.children.length; c ++ ) {
            this.removeObject( object.children[ c ] );
        }
    },
    draw: function(ctx){
        if(this.parentObject)
        {
            if(this.parentObject instanceof PATHBUBBLES.Scene)
            {
                this.shape.offsetX = this.parentObject.x;
                this.shape.offsetY = this.parentObject.y;
            }
            else
            {
                this.shape.offsetX = this.parentObject.shape.x;
                this.shape.offsetY = this.parentObject.shape.y;
            }
        }
        this.shape.draw(ctx);
        this.updateInforamtion();
        if(this.shape.HighLight_State)
            this.drawSelection(ctx);
    },
    updateInforamtion: function(){
        this.x = this.shape.x;
        this.y = this.shape.y;
        this.w = this.shape.w;
        this.h = this.shape.h;
        this.center = {x: this.x + this.w/2, y: this.y + this.h/2};
    },
    drawSelection: function(ctx) {
        var i, cur, half;
        var x = this.shape.x + this.offsetX;
        var y = this.shape.y + this.offsetY;
        if(this.parentObject)
        {
            x+= this.parentObject.x;
            y+= this.parentObject.y;
        }
        var w = this.shape.w;
        var h = this.shape.h;
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
            ctx.save();	// save the context so we don't mess up others
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(cur.x, cur.y, PATHBUBBLES.selectionBoxSize, PATHBUBBLES.selectionBoxSize);
            ctx.restore();
        }
    },
    contains : function(mx, my)
    {
        if(this.parentObject)
        {
            this.shape.offsetX = this.parentObject.shape.x;
            this.shape.offsetY = this.parentObject.shape.y;
        }
        return this.shape.contains(mx,my);
    },
    insideRect: function( mx, my, x, y, w, h){
        return  (x<= mx) && (x + w >= mx) && (y <= my) && (y + h >= my);
    },
    containsInHalo: function(mx, my){
        var x= this.shape.x+5 + this.offsetX;    //inner
        var y= this.shape.y+5 + this.offsetY;
        var w= this.shape.w-10;
        var h= this.shape.h-10;

        var x2= this.shape.x - 5 + this.offsetX;    //inner
        var y2= this.shape.y - 5 + this.offsetY;
        var w2 = this.shape.w + 10;
        var h2 = this.shape.h + 10;
        return (!this.insideRect(mx,my,x,y,w,h) && this.insideRect(mx,my,x2,y2,w2,h2));
    }
};