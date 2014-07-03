/**
 * Created by Yongnan on 7/3/2014.
 */
function Association(id, x, y) {

    this.type = "ASSOCIATION";
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.r = 10;
    this.strokeColor = "#666666";
    this.lineWidth = 2;
    this.fillColor = "#ffffff";
}
Association.prototype = {
    draw: function (ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.save();
    },
    drawStroke: function(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
        ctx.save();
    },
    contains: function (mx, my) {
        return  (this.x - mx ) * (this.x - mx) + (this.y - my ) * (this.y - my) <= this.r * this.r;
    }

};
