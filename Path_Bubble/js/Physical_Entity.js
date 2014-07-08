/**
 * Created by Yongnan on 7/6/2014.
 */
function Physical_Entity(id, x, y, w, h, text) {
    this.type = "E";    //ENTITY    ===>  E
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.w = w || 1;
    this.h = h || 1;
    this.text = text;
    this.textObj = new Text(this.text);
    this.strokeColor = "#666666";
    this.lineWidth = 2;
    this.fillColor = "#E6EAAC";
    //Complex is contained in the Compartment and the Compartment is contained in the Bubble
    //So Offset = offsetBubble + offsetCompartment
    this.offsetX =0;
    this.offsetY =0;
}
Physical_Entity.prototype = {
    draw: function (ctx, offsetX, offsetY) {
        this.offsetX =offsetX;
        this.offsetY =offsetY;
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        var w = this.w;
        var h = this.h;
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        var mx1 = x + 10;
        var mx2 = x + w -10;
        var my1 = y + 10;
        var my2 = y + h - 10;
        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        ctx.moveTo(x, my1);
        ctx.lineTo(x, my2);
        ctx.lineTo(mx1, y + h);
        ctx.lineTo(mx2, y+ h);
        ctx.lineTo(x + w, my2);
        ctx.lineTo(x + w, my1);
        ctx.lineTo(mx2, y);
        ctx.lineTo(mx1, y);
        ctx.lineTo(x, my1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();	// restore context to what it was on entry
        if(this.textObj)
        {
            this.textObj.draw(x + w/2, y + h/2, ctx );
        }
    },
    drawStroke: function(ctx){
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        var w = this.w;
        var h = this.h;
        var mx1 = x + w / 4;
        var mx2 = x + w * 3 / 4;
        var my1 = y + h / 3;
        var my2 = y + h * 2 / 3;
        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        ctx.moveTo(x, my1);
        ctx.lineTo(x, my2);
        ctx.lineTo(mx1, y + h);
        ctx.lineTo(mx2, y + h);
        ctx.lineTo(x + w, my2);
        ctx.lineTo(x + w, my1);
        ctx.lineTo(mx2, y);
        ctx.lineTo(mx1, y);
        ctx.lineTo(x, my1);
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