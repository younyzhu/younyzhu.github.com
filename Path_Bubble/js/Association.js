/**
 * Created by Yongnan on 7/3/2014.
 */
function Dissociation(id, x, y) {
    this.type = "DISSOCIATION";
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.l = 20;
    this.strokeColor = "#666666";
    this.lineWidth = 2;
    this.fillColor = "#ffffff";
}
Dissociation.prototype = {
    draw: function (ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        var h = this.l * (Math.sqrt(3) / 2);
        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - h / 2);
        ctx.lineTo(this.x - this.l / 2, this.y + h / 2);
        ctx.lineTo(this.x + this.l / 2, this.y + h / 2);
        ctx.lineTo(this.x, this.y - h / 2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();	// restore context to what it was on entry
    },
    drawStroke: function(ctx){
        var h = this.l * (Math.sqrt(3) / 2);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - h / 2);
        ctx.lineTo(this.x - this.l / 2, this.y + h / 2);
        ctx.lineTo(this.x + this.l / 2, this.y + h / 2);
        ctx.lineTo(this.x, this.y - h / 2);
        ctx.stroke();
        ctx.closePath();
        ctx.save();
    },
    contains: function (mx, my) {
        var h = this.l * (Math.sqrt(3) / 2);
        var minX = this.x - this.l / 2;
        var maxX = this.x + this.l / 2;
        var minY = this.y - h / 2;
        var maxY = this.y + h / 2;
        return  (minX <= mx) && (maxX >= mx) &&
            (minY <= my) && (maxY >= my);
    }
};