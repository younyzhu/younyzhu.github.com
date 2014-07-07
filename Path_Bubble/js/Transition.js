/**
 * Created by Yongnan on 7/3/2014.
 */
function Transition(id, x, y, w, h) {
    this.type = "T";              //TRANSITION    ===>    T
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.strokeColor = "#666666";
    this.lineWidth = 2;
    this.fillColor = "#ffffff";
    //Complex is contained in the Compartment and the Compartment is contained in the Bubble
    //So Offset = offsetBubble + offsetCompartment
    this.offsetX =0;
    this.offsetY =0;
}
Transition.prototype = {
    draw: function (ctx, offsetX, offsetY) {
        this.offsetX =offsetX;
        this.offsetY =offsetY;
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        var w = this.w;
        var h = this.h;
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.strokeRect(x, y, w, h);
    },
    drawStroke: function (ctx) {
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        var w = this.w;
        var h = this.h;
        ctx.strokeRect(x, y, w, h);
    },
    contains : function(mx, my)
    {
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        return  (x<= mx) && (x + this.w >= mx) && (y <= my) && (y + this.h>= my);
    }
};