/**
 * Created by Yongnan on 7/3/2014.
 */
function Protein(id, x, y, w, h, text) {
    this.type = "P";       //PROTEIN    ===>   P
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.w = w || 1;
    this.h = h || 1;
    this.text = text;
    this.textObj = new Text(this.text);
    this.strokeColor = "#666666";
    this.lineWidth = 2;
    this.fillColor = "#FFFFCC";
    //Complex is contained in the Compartment and the Compartment is contained in the Bubble
    //So Offset = offsetBubble + offsetCompartment
    this.offsetX =0;
    this.offsetY =0;
    this.flag = false;
}
Protein.prototype = {
    draw: function (ctx, offsetX, offsetY) {
        this.offsetX =offsetX;
        this.offsetY =offsetY;
        var x = this.x+this.offsetX;
        var y = this.y+this.offsetY;
        var w = this.w;
        var h = this.h;
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        var mx = x + w / 2;
        var my = y + h / 2;
        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        ctx.moveTo(x, my);
        ctx.quadraticCurveTo(x, y, mx, y);
        ctx.quadraticCurveTo(x + w, y, x + w, my);
        ctx.quadraticCurveTo(x + w, y + h, mx, y + h);
        ctx.quadraticCurveTo(x, y + h, x, my);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();	// restore context to what it was on entry
        if(this.textObj)
        {
            this.textObj.draw(x + w/2, y + h-10, ctx );
        }
        if (this.flag ) {
            this.drawStroke(ctx);
        }
    },
    drawStroke: function(ctx) {
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        var w = this.w;
        var h = this.h;
        var mx = x + w / 2;
        var my = y + h / 2;
        ctx.save();	// save the context so we don't mess up others
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(x, my);
        ctx.quadraticCurveTo(x, y, mx, y);
        ctx.quadraticCurveTo(x + w, y, x + w, my);
        ctx.quadraticCurveTo(x + w, y + h, mx, y + h);
        ctx.quadraticCurveTo(x, y + h, x, my);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();	// restore context to what it was on entry
    },
    contains: function (mx, my) {
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        return  (x<= mx) && (x + this.w >= mx) && (y <= my) && (y + this.h >= my);
    }
};
