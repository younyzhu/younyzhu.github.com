/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/16/2014
 * @name        PathBubble_Shape
 */
PATHBUBBLES.Shape = PATHBUBBLES.Shape|| {};

PATHBUBBLES.Shape.Rectangle = function(x, y, w ,h,  strokeColor, fillColor, lineWidth, cornerRadius){
    this.type = "Rectangle";
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;

    this.cornerRadius = cornerRadius || 0;  //whether it is a round rectangle or not
    this.strokeColor = strokeColor || "#0000ff";
    this.fillColor = fillColor ||"#FFE2B7";
    this.lineWidth   = lineWidth || 1;
    this.HighLight_State = false;
};
PATHBUBBLES.Shape.Rectangle.prototype = {
    constructor: PATHBUBBLES.Shape.Rectangle,
    draw: function (ctx) {
        var x = this.x;
        var y = this.y;
        var w = this.w;
        var h = this.h;
        ctx.save();	// save the context so we don't mess up others
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        if(!this.cornerRadius)
        {
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
        }
        else
        {
            var r = x + w;
            var b = y + h;
            ctx.beginPath();
            ctx.moveTo(x + this.cornerRadius, y);
            ctx.lineTo(r - this.cornerRadius, y);
            ctx.quadraticCurveTo(r, y, r, y + this.cornerRadius);
            ctx.lineTo(r, y + h - this.cornerRadius);
            ctx.quadraticCurveTo(r, b, r - this.cornerRadius, b);
            ctx.lineTo(x + this.cornerRadius, b);
            ctx.quadraticCurveTo(x, b, x, b - this.cornerRadius);
            ctx.lineTo(x, y + this.cornerRadius);
            ctx.quadraticCurveTo(x, y, x + this.cornerRadius, y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();	// restore context to what it was on entry
        if (this.HighLight_State) {
            this.drawStroke(ctx);
        }
    },
    drawStroke: function(ctx) {
        var x = this.x;
        var y = this.y;
        var w = this.w;
        var h = this.h;
        ctx.save();
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = this.lineWidth;
        ctx.strokeRect(x, y, w, h);
        ctx.restore();	// restore context to what it was on entry
    },
    contains : function(mx, my)
    {
        var x = this.x;
        var y = this.y;
        return  (x<= mx) && (x + this.w >= mx) && (y <= my) && (y + this.h >= my);
    },
    clone: function(){
        var rectangle = new PATHBUBBLES.Shape.Rectangle();
        rectangle.type = this.type;
        rectangle.x = this.x;
        rectangle.y = this.y;
        rectangle.r = this.r;
        rectangle.strokeColor = this.strokeColor;
        rectangle.fillColor = this.fillColor;
        rectangle.lineWidth = this.lineWidth;
        rectangle.HighLight_State = this.HighLight_State;
        return rectangle;
    }
};

PATHBUBBLES.Shape.Circle = function(x, y, r,  strokeColor, fillColor , lineWidth){
    this.type = "Circle";
    this.x = x || 0;
    this.y = y || 0;
    this.r = r ||10;

    this.strokeColor = strokeColor || "#0000ff";
    this.fillColor = fillColor ||"#FFE2B7";
    this.lineWidth   = lineWidth || 1;
    this.HighLight_State = false;
};
PATHBUBBLES.Shape.Circle.prototype ={
    constructor: PATHBUBBLES.Shape.Circle,
    draw: function (ctx) {

        ctx.save();	// save the context so we don't mess up others
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();	// restore context to what it was on entry
        if (this.HighLight_State) {
            this.drawStroke(ctx);
        }
    },
    drawStroke: function(ctx){

        ctx.save();	// save the context so we don't mess up others
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();	// restore context to what it was on entry
    },
    contains: function (mx, my) {
        var x = this.x;
        var y = this.y;
        return  (x - mx ) * (x - mx) + (y - my ) * (y - my) <= this.r * this.r;
    },
    clone: function(){
        var circle = new PATHBUBBLES.Shape.Circle();
        circle.type = this.type;
        circle.x = this.x;
        circle.y = this.y;
        circle.r = this.r;
        circle.strokeColor = this.strokeColor;
        circle.fillColor = this.fillColor;
        circle.lineWidth = this.lineWidth;
        circle.HighLight_State = this.HighLight_State;
        return circle;
    }
};

PATHBUBBLES.Shape.Ellipse = function(x, y, w, h,  strokeColor, fillColor , lineWidth){
    this.type = "Ellipse";
    this.x = x || 0;
    this.y = y || 0;
    this.w = w ||10;
    this.h = h ||10;

    this.strokeColor = strokeColor || "#0000ff";
    this.fillColor = fillColor ||"#FFE2B7";
    this.lineWidth   = lineWidth || 1;
    this.HighLight_State = false;
};
PATHBUBBLES.Shape.Ellipse.prototype ={
    constructor: PATHBUBBLES.Shape.Ellipse,
    draw: function (ctx) {

        ctx.save();	// save the context so we don't mess up others
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        if(this.w !== this.h)
        {
            ctx.scale(1, this.h/this.w);
        }
        ctx.arc(this.x, this.y, this.w, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();	// restore context to what it was on entry
        if (this.HighLight_State) {
            this.drawStroke(ctx);
        }
    },
    drawStroke: function(ctx){

        ctx.save();	// save the context so we don't mess up others
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        if(this.w !== this.h)
        {
            ctx.scale(1, this.h/this.w);
        }
        ctx.arc(this.x, this.y, this.w, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();	// restore context to what it was on entry
    },
    contains: function (mx, my) {
        var x = this.x;
        var y = this.y;
        return  (x<= mx) && (x + this.w >= mx) && (y <= my) && (y + this.h >= my);
    },
    clone: function(){
        var ellipse = new PATHBUBBLES.Shape.Ellipse();
        ellipse.type = this.type;
        ellipse.x = this.x;
        ellipse.y = this.y;
        ellipse.w = this.w;
        ellipse.h = this.h;
        ellipse.strokeColor = this.strokeColor;
        ellipse.fillColor = this.fillColor;
        ellipse.lineWidth = this.lineWidth;
        ellipse.HighLight_State = this.HighLight_State;
        return ellipse;
    }
};




