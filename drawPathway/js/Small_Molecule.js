/**
 * Created by Yongnan on 7/3/2014.
 */
function Small_Molecule(id, x, y, w, h, text, compartmentId,colors) {
    this.type = "S";        //MOLECULE     ===>   S
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.w = 40;
    this.h = 15;
    this.text = text;
    this.compartmentId = compartmentId;
    this.textObj = new Text(text);
    this.strokeColor = "#C2C2C2";
    this.lineWidth = 1;
    this.fillColor = "#D6D7CA";
    //Complex is contained in the Compartment and the Compartment is contained in the Bubble
    //So Offset = offsetBubble + offsetCompartment
    this.offsetX =0;
    this.offsetY =0;
    this.flag = false;
    this.colors = colors;
}
Small_Molecule.prototype = {
    draw: function (ctx, offsetX, offsetY) {
        this.offsetX =offsetX;
        this.offsetY =offsetY;
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        this.w = this.textObj.getTextWidth(ctx)+10;
        if(this.w >=40)
        {
            this.w = 40;
        }
        var w = this.w;
        var h = this.h;
        ctx.save();	// save the context so we don't mess up others
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        var mx1 = x + w / 4;
        var mx2 = x + w * 3 / 4;
        var my1 = y + h / 3;
        var my2 = y + h * 2 / 3;
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
        for(var i=0; i<this.colors.length; ++i)
        {
            this.drawColorStroke(ctx,i,this.colors[i]);
        }
    },
    drawColorStroke: function(ctx,i,colorindex) {
        var padding = 4;
        var x = this.x + this.offsetX-padding*(i+1)/2;
        var y = this.y + this.offsetY-padding*(i+1)/2;
        var w = this.w+padding*(i+1);
        var h = this.h+padding*(i+1);
        var mx1 = x + w / 4;
        var mx2 = x + w * 3 / 4;
        var my1 = y + h / 3;
        var my2 = y + h * 2 / 3;
        ctx.save();	// save the context so we don't mess up others
        ctx.strokeStyle = COLORS[colorindex];
        ctx.lineWidth = padding/2;
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
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = this.lineWidth;
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