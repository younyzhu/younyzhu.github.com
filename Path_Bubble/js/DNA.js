/**
 * Created by Yongnan on 7/3/2014.
 */
function DNA(id, x, y, w, h, text) {
    this.type = "DNA";
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.w = w || 1;
    this.h = h || 1;
    this.text = text;
    this.textObj = new Text("DNA");
    this.strokeColor = "#666666";
    this.lineWidth = 2;
    this.fillColor = "#D6EAAC";
}
DNA.prototype = {
    draw: function (ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        var mx = this.x + this.w / 2;
        var my = this.y + this.h / 2;
        ctx.beginPath();
        ctx.moveTo(this.x, my);
        ctx.quadraticCurveTo(this.x, this.y, mx, this.y);
        ctx.quadraticCurveTo(this.x + this.w, this.y, this.x + this.w, my);
        ctx.quadraticCurveTo(this.x + this.w, this.y + this.h, mx, this.y + this.h);
        ctx.quadraticCurveTo(this.x, this.y + this.h, this.x, my);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.save();
        if(this.textObj)
        {
            this.textObj.draw(this.x + this.w/2, this.y + this.h-10, ctx );
        }
    },
    contains: function (mx, my) {
        return  (this.x <= mx) && (this.x + this.w >= mx) &&
            (this.y <= my) && (this.y + this.h >= my);
    }
};