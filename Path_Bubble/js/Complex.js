/**
 * Created by Yongnan on 7/3/2014.
 */
function Complex(id, x, y, w, h) {
    this.type = "C";     //COMPLEX
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.w = 20;    // Change to fixed size 7/14/2014
    this.h = 6;

    this.strokeColor = "#666666";
    this.lineWidth = 1;
    this.fillColor = "#FFE2B7";
    //Complex is contained in the Compartment and the Compartment is contained in the Bubble
    //So Offset = offsetBubble + offsetCompartment
    this.offsetX =0;
    this.offsetY =0;
    this.flag = false;
}
Complex.prototype = {
    draw: function (ctx, offsetX, offsetY) {
        this.offsetX =offsetX;
        this.offsetY =offsetY;
        var x = this.x+this.offsetX;
        var y = this.y+this.offsetY;
        var w = this.w;
        var h = this.h;
        ctx.save();	// save the context so we don't mess up others
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        ctx.restore();	// restore context to what it was on entry
        if (this.flag) {
            this.drawStroke(ctx);
        }
    },
    drawStroke: function(ctx) {
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
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
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        return  (x<= mx) && (x + this.w >= mx) && (y <= my) && (y + this.h >= my);
    }
};