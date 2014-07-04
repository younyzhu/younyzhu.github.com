/**
 * Created by Yongnan on 7/3/2014.
 */
function Complex(id, x, y, w, h) {
    this.type = "COMPLEX";
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.w = w || 1;
    this.h = h || 1;

    this.strokeColor = "#666666";
    this.lineWidth = 2;
    this.fillColor = "#FFE2B7";
}
Complex.prototype = {
    draw: function (ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.save();	// save the context so we don't mess up others
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.restore();	// restore context to what it was on entry
    },
    drawStroke: function(ctx) {
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    },
    contains : function(mx, my)
    {
        return  (this.x <= mx) && (this.x + this.w >= mx) &&
            (this.y <= my) && (this.y + this.h >= my);
    }
};