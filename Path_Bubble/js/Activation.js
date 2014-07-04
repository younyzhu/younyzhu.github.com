/**
 * Created by Yongnan on 7/3/2014.
 */
function Activation(id, beginX, beginY , endX, endY) {
    this.type = "ACTIVATION";
    this.id = id || 0;
    this.x1 = beginX;
    this.y1 = beginY;
    this.x2 = endX;
    this.y2 = endY;
    this.dotRadius = 10;
    this.dotLimitRadius = 2;
    this.fillColor = "#00FF00";
}
Activation.prototype = {
    draw: function (ctx) {
        var dotCount = Math.ceil((this.dotRadius - this.dotLimitRadius ) / 0.5);
        var dx = this.x2 - this.x1;
        var dy = this.y2 - this.y1;
        var spaceX = dx / (dotCount - 1);
        var spaceY = dy / (dotCount - 1);
        var newX = this.x1;
        var newY = this.y1;
        for (var i = 0; i < dotCount; i++) {
            this.drawDot(newX, newY, (this.dotRadius - this.dotLimitRadius ) * (1-i / dotCount) + this.dotLimitRadius , this.fillColor, ctx);
            newX += spaceX;
            newY += spaceY;
        }
        this.drawDot(this.x1, this.y1, 3, "red", ctx);
        this.drawDot(this.x2, this.y2, 3, "red", ctx);
    },
    drawDot: function (x, y, dotRadius, dotColor, ctx) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = dotColor;
        ctx.fill();
    }
};