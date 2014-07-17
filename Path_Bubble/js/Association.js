/**
 * Created by Yongnan on 7/3/2014.
 */
function Association(id, x, y, w, h) {

    this.type = "B";  //ASSOCIATION     ====>    B
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.w = 6;
    this.h = 6;
    this.r = this.w/2;
    this.strokeColor = "#666666";
    this.lineWidth = 1;
    this.fillColor = "#ffffff";
    this.flag = false;
}
Association.prototype = {
    draw: function (ctx, offsetX, offsetY) {
        this.offsetX =offsetX;
        this.offsetY =offsetY;
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;

        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        ctx.arc(x, y, this.r, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();	// restore context to what it was on entry
        if (this.flag) {
            this.drawStroke(ctx);
        }
    },
    drawStroke: function(ctx){
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        ctx.save();	// save the context so we don't mess up others
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.arc(x, y, this.r, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();	// restore context to what it was on entry
    },
    contains: function (mx, my) {
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        return  (x - mx ) * (x - mx) + (y - my ) * (y - my) <= this.r * this.r;
    }

};
