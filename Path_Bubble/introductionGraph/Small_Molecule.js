/**
 * Created by Yongnan on 7/3/2014.
 */
function Small_Molecule(id, x, y, w, h, text) {
    this.type = "S";        //MOLECULE     ===>   S
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.w = 60;
    this.h = 30;
    this.text = text;
    if(text !== undefined)
        this.textObj = new Text(text) ;
    else
        this.textObj = null;
    this.strokeColor = "#C2C2C2";
    this.lineWidth = 1;
    this.fillColor = "#D6D7CA";
    //Complex is contained in the Compartment and the Compartment is contained in the Bubble
    //So Offset = offsetBubble + offsetCompartment
    this.offsetX =0;
    this.offsetY =0;
    this.flag = false;
}
Small_Molecule.prototype = {
    draw: function (ctx, offsetX, offsetY) {
        this.offsetX =offsetX;
        this.offsetY =offsetY;
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        /*if(this.textObj)
            this.w = this.textObj.getTextWidth(ctx)+10;
        if(this.w >=40)
        {
            this.w = 40;
        }*/
        var w = this.w;
        var h = this.h;
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        var mx1 = x + w / 4;
        var mx2 = x + w * 3 / 4;
        var my1 = y + h / 3;
        var my2 = y + h * 2 / 3;
        ctx.save();	// save the context so we don't mess up others
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = this.lineWidth;
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
        if (this.flag) {
            this.drawStroke(ctx);
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