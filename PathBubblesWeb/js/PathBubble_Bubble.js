/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/16/2014
 * @name        PathBubble_Bubble
 */

PATHBUBBLES.Bubble = function(x, y, w ,h, strokeColor, fillColor, cornerRadius,text){
    PATHBUBBLES.Object2D.call(this);
    this.type = "Bubble";
    this.x = x||0;
    this.y = y||0;
    this.w = w||400;
    this.h = h||400;
    this.strokeColor=strokeColor||"#0000ff";
    this.fillColor=fillColor||"#ffffff";
    this.cornerRadius = cornerRadius||20;

    this.shape = new PATHBUBBLES.Shape.Rectangle(this.x, this.y, this.w ,this.h, this.strokeColor, this.fillColor, 10, this.cornerRadius);

    this.name = text;
    this.__objectsAdded = [];
    this.__objectsRemoved = [];
    this.center = {x: this.x + this.w/2, y: this.y + this.h/2};
    this.GROUP = false;

};

PATHBUBBLES.Bubble.prototype = Object.create( PATHBUBBLES.Object2D.prototype );

PATHBUBBLES.Bubble.prototype ={
    constructor: PATHBUBBLES.Bubble,
    addObject : function(object){
        object.parent = this;
        object.shape.parent = this;
        if(PATHBUBBLES.objects.indexOf(object)==-1)
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
        this.setOffset();

        if( !this.GROUP)
            this.shape.draw(ctx);
        if(this.shape.HighLight_State)
        {
            this.shape.drawStroke(ctx);
            this.drawSelection(ctx);
        }
    },
    setOffset: function(){
        if(this.parent!==undefined)
        {
            this.offsetX = this.parent.x;
            this.offsetY = this.parent.y;
        }
        else
        {
            this.offsetX = 0;
            this.offsetY = 0;
        }
        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
        this.shape.x = this.x;
        this.shape.y = this.y;
    },
    drawSelection: function(ctx) {
        var i, cur, half;
        var x = this.shape.offsetX + this.shape.x;
        var y = this.shape.offsetY + this.shape.y;

        var w = this.shape.w;
        var h = this.shape.h;
        if(this.GROUP)
        {
            x-=6;
            y-=6;
            w+=12;
            h+=12;
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
            ctx.save();	// save the context so we don't mess up others
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(cur.x, cur.y, PATHBUBBLES.selectionBoxSize, PATHBUBBLES.selectionBoxSize);
            ctx.restore();
        }
    },
    contains : function(mx, my)
    {
        return this.shape.contains(mx,my);
    },
    insideRect: function( mx, my, x, y, w, h){
        return  (x<= mx) && (x + w >= mx) && (y <= my) && (y + h >= my);
    },
    containsInHalo: function(mx, my){
        var x = this.shape.offsetX + this.shape.x+5;
        var y = this.shape.offsetY + this.shape.y+5;
        var w= this.shape.w-10;
        var h= this.shape.h-10;

        var x2 = this.shape.offsetX + this.shape.x-5;
        var y2 = this.shape.offsetY + this.shape.y-5;
        var w2 = this.shape.w + 10;
        var h2 = this.shape.h + 10;
        return (!this.insideRect(mx,my,x,y,w,h) && this.insideRect(mx,my,x2,y2,w2,h2));
    }
};