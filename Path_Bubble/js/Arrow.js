/**
 * Created by Yongnan on 7/3/2014.
 */

function Arrow(id,beginX,beginY,endX,endY )
{
    this.type = "ARROW";
    this.id = id;
    this.x1 = beginX;
    this.y1 = beginY;
    this.x2 = endX;
    this.y2 = endY;
    this.fillColor = "black";
    //Complex is contained in the Compartment and the Compartment is contained in the Bubble
    //So Offset = offsetBubble + offsetCompartment
    this.offsetX =0;
    this.offsetY =0;
    this.moveR = 10;
}
Arrow.prototype ={

    draw: function (ctx, offsetX, offsetY) {
        this.offsetX =offsetX;
        this.offsetY =offsetY;
        var x1 = this.x1 + this.offsetX;
        var x2 = this.x2 + this.offsetX;
        var y1 = this.y1 + this.offsetY;
        var y2 = this.y2 + this.offsetY;
        ctx.save();	// save the context so we don't mess up others
        ctx.fillStyle = this.fillColor;
        ctx.beginPath();
        ctx.moveTo(x1-5, y1 );
        ctx.lineTo(x1+5, y1 );
        ctx.lineTo(x2, y2);
        ctx.fill();
        ctx.closePath();
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
