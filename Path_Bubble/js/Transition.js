/**
 * Created by Yongnan on 7/3/2014.
 */
function Transition(id, x, y) {
    this.type = "TRANSITION";
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.strokeColor = "#666666";
    this.lineWidth = 2;
    this.fillColor = "#ffffff";
}
Transition.prototype = {
    draw: function (ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x, this.y, this.w, this.w);
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.strokeRect(this.x, this.y, this.w, this.w);
    },
    drawStroke: function (ctx) {
        ctx.strokeRect(this.x, this.y, this.w, this.w);
    },
    contains : function(mx, my)
    {
        return  (this.x <= mx) && (this.x + this.w >= mx) &&
            (this.y <= my) && (this.y + this.h >= my);
    }
};