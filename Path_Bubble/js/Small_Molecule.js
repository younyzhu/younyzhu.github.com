/**
 * Created by Yongnan on 7/3/2014.
 */
function Small_Molecule(id, x, y, w, h, text) {
    this.type = "MOLECULE";
    this.id = id || 0;
    this.x = x;
    this.y = y;
    this.w = w || 1;
    this.h = h || 1;
    this.text = text;
    this.textObj = new Text("Small_Molecule");
    this.strokeColor = "#666666";
    this.lineWidth = 2;
    this.fillColor = "#D6D7CA";
}
Small_Molecule.prototype = {
    draw: function (ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        var mx1 = this.x + this.w / 4;
        var mx2 = this.x + this.w * 3 / 4;
        var my1 = this.y + this.h / 3;
        var my2 = this.y + this.h * 2 / 3;
        ctx.beginPath();
        ctx.moveTo(this.x, my1);
        ctx.lineTo(this.x, my2);
        ctx.lineTo(mx1, this.y +this.h);
        ctx.lineTo(mx2, this.y+this.h);
        ctx.lineTo(this.x + this.w, my2);
        ctx.lineTo(this.x + this.w, my1);
        ctx.lineTo(mx2, this.y);
        ctx.lineTo(mx1, this.y);
        ctx.lineTo(this.x, my1);
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