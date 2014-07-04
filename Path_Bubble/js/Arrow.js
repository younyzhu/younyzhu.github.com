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
}
Arrow.prototype ={

    draw: function (ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.beginPath();
        ctx.moveTo(this.x1-5, this.y1 );
        ctx.lineTo(this.x1+5, this.y1 );
        ctx.lineTo(this.x2, this.y2);
        ctx.fill();
        ctx.closePath();
        ctx.save();
    }
};
