/**
 * Created by Yongnan on 7/3/2014.
 */

function Arrow()
{
    this.fillColor = "black";
    this.type = "ARROW";
}
Arrow.prototype ={

    draw: function (beginX,beginY,endX,endY, ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.beginPath();
        ctx.moveTo(beginX-5, beginY);
        ctx.lineTo(beginX+5, beginY);
        ctx.lineTo(endX, endY);
        ctx.fill();
        ctx.closePath();
        ctx.save();
    }
};
