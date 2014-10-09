/**
 * Created by Yongnan on 7/6/2014.
 */
function Physical_Entity(id, x, y, w, h, text, compartmentId,colors) {
    this.type = "E";    //ENTITY    ===>  E
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.w = 30;
    this.h = 13;
    this.text = text;
    this.compartmentId = compartmentId;
    this.textObj = new Text(this.text);
    this.strokeColor = "#C2C2C2";
    this.lineWidth = 1;
    this.fillColor = "#00ff00";
    //this.fillColor = "#E6EAAC";
    //Complex is contained in the Compartment and the Compartment is contained in the Bubble
    //So Offset = offsetBubble + offsetCompartment
    this.offsetX =0;
    this.offsetY =0;
    this.flag = false;
    this.colors = colors;
}
Physical_Entity.prototype = {
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
        /*var x = this.x + this.offsetX;
         var y = this.y + this.offsetY;
         this.w = this.textObj.getTextWidth(ctx)+10;
         if(this.w >=40)
         {
         this.w = 40;
         }
         var w = this.w;
         var h = this.h;
         ctx.fillStyle = this.fillColor;
         ctx.strokeStyle = this.strokeColor;
         ctx.lineWidth = this.lineWidth;
         var mx1 = x + this.h/2;
         var mx2 = x + w -this.h/2;
         var my1 = y + this.h/2;
         var my2 = y + h - this.h/2;
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
         ctx.restore();	// restore context to what it was on entry*/
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
        ctx.save();
        ctx.strokeStyle = COLORS[colorindex];
        ctx.lineWidth = padding/2;
        ctx.strokeRect(x, y, w, h);
        ctx.restore();	// restore context to what it was on entry
    },
    drawStroke: function(ctx){
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
    contains: function (mx, my) {
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        return  (x<= mx) && (x + this.w >= mx) && (y <= my) && (y + this.h >= my);
    }
};