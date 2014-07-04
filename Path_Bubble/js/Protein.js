/**
 * Created by Yongnan on 7/3/2014.
 */
function Protein(id, x, y, w, h, text) {
    this.type = "PROTEIN";
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.w = w || 1;
    this.h = h || 1;
    this.text = text;
    this.textObj = new Text("Protein");
    this.strokeColor = "#666666";
    this.lineWidth = 2;
    this.fillColor = "#FFFFCC";
}
Protein.prototype = {
    draw: function (ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        var mx = this.x + this.w / 2;
        var my = this.y + this.h / 2;
        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        ctx.moveTo(this.x, my);
        ctx.quadraticCurveTo(this.x, this.y, mx, this.y);
        ctx.quadraticCurveTo(this.x + this.w, this.y, this.x + this.w, my);
        ctx.quadraticCurveTo(this.x + this.w, this.y + this.h, mx, this.y + this.h);
        ctx.quadraticCurveTo(this.x, this.y + this.h, this.x, my);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();	// restore context to what it was on entry
        if(this.textObj)
        {
            this.textObj.draw(this.x + this.w/2, this.y + this.h-10, ctx );
        }
    },
    drawStroke: function(ctx) {
        var mx = this.x + this.w / 2;
        var my = this.y + this.h / 2;
        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        ctx.moveTo(this.x, my);
        ctx.quadraticCurveTo(this.x, this.y, mx, this.y);
        ctx.quadraticCurveTo(this.x + this.w, this.y, this.x + this.w, my);
        ctx.quadraticCurveTo(this.x + this.w, this.y + this.h, mx, this.y + this.h);
        ctx.quadraticCurveTo(this.x, this.y + this.h, this.x, my);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();	// restore context to what it was on entry
    },
    contains: function (mx, my) {
        return  (this.x <= mx) && (this.x + this.w >= mx) &&
            (this.y <= my) && (this.y + this.h >= my);
    }
};
