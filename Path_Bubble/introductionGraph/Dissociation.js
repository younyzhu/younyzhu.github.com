/**
 * Created by Yongnan on 7/3/2014.
 */
function Dissociation(id, x, y, w ,h, text) {
    this.type = "K";      //DISSOCIATION  ===> D
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.w = 30;
    this.h = 30;
    this.l = this.w;
    if(text !== undefined)
        this.textObj = new Text(text) ;
    else
        this.textObj = null;
    this.strokeColor = "#C2C2C2";
    this.lineWidth = 1;
    this.fillColor = "#ffffff";
    //Complex is contained in the Compartment and the Compartment is contained in the Bubble
    //So Offset = offsetBubble + offsetCompartment
    this.offsetX =0;
    this.offsetY =0;
    this.flag = false;
}
Dissociation.prototype = {
    draw: function (ctx, offsetX, offsetY) {
        this.offsetX =offsetX;
        this.offsetY =offsetY;
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;

        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        var h = this.l * (Math.sqrt(3) / 2);   //h is the height of the triangle
        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        ctx.moveTo(x, y - h / 2);
        ctx.lineTo(x - this.l / 2, y + h / 2);
        ctx.lineTo(x + this.l / 2, y + h / 2);
        ctx.lineTo(x, y - h / 2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();	// restore context to what it was on entry
        if(this.textObj)
        {
            this.textObj.draw(x, y, ctx );
        }
        if (this.flag ) {
            this.drawStroke(ctx);
        }
    },
    drawStroke: function(ctx){
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        var h = this.l * (Math.sqrt(3) / 2);
        ctx.save();
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(x, y - h / 2);
        ctx.lineTo(x - this.l / 2, y + h / 2);
        ctx.lineTo(x + this.l / 2, y + h / 2);
        ctx.lineTo(x, y - h / 2);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    },
    contains: function (mx, my) {
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        var h = this.l * (Math.sqrt(3) / 2);
        var minX = x - this.l / 2;
        var maxX = x + this.l / 2;
        var minY = y - h / 2;
        var maxY = y + h / 2;
        return  (minX <= mx) && (maxX >= mx) &&
            (minY <= my) && (maxY >= my);
    }
};