/**
 * Created by Yongnan on 7/3/2014.
 */
function Activation(id, beginX, beginY , endX, endY) {
    this.type = "ACTIVATION";
    this.id = id || 0;
    this.x1 = beginX;
    this.y1 = beginY;
    this.x2 = endX;
    this.y2 = endY;
    this.dotRadius = 10;
    this.dotLimitRadius = 2;
    this.fillColor = "#00FF00";
    //Complex is contained in the Compartment and the Compartment is contained in the Bubble
    //So Offset = offsetBubble + offsetCompartment
    this.offsetX =0;
    this.offsetY =0;
    this.moveR =10;
}
Activation.prototype = {
    draw: function (ctx, offsetX, offsetY) {
        this.offsetX =offsetX;
        this.offsetY =offsetY;
        var x1 = this.x1+this.offsetX;
        var y1 = this.y1+this.offsetY;
        var x2 = this.x2+this.offsetX;
        var y2 = this.y2+this.offsetY;
        var dotCount = Math.ceil((this.dotRadius - this.dotLimitRadius ) / 0.5);
        var dx = x2 - x1;
        var dy = y2 - y1;
        var spaceX = dx / (dotCount - 1);
        var spaceY = dy / (dotCount - 1);
        var newX = x1;
        var newY = y1;
        for (var i = 0; i < dotCount; i++) {
            this.drawDot(newX, newY, (this.dotRadius - this.dotLimitRadius ) * (1-i / dotCount) + this.dotLimitRadius , this.fillColor, ctx);
            newX += spaceX;
            newY += spaceY;
        }
        this.drawDot(x1, y1, 3, "red", ctx);
        this.drawDot(x2, y2, 3, "red", ctx);
    },
    drawDot: function (x, y, dotRadius, dotColor, ctx) {
        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = dotColor;
        ctx.fill();
        ctx.restore();	// restore context to what it was on entry
    },
    contains: function (mx, my) {
        var x1 = this.x1 + this.offsetX;
        var x2 = this.x2 + this.offsetX;
        var y1 = this.y1 + this.offsetY;
        var y2 = this.y2 + this.offsetY;
        if( (x1 - mx ) * (x1 - mx) + (y1 - my ) * (y1 - my) <= this.moveR * this.moveR )
        {
            return "START";
        }
        else if( (x2 - mx ) * (x2 - mx) + (y2 - my ) * (y2 - my) <= this.moveR * this.moveR )
        {
            return "END";
        }
    }
};