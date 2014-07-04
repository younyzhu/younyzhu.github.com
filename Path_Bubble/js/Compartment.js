/**
 * Created by Yongnan on 7/2/2014.
 */
function Compartment(id, state, x, y, w, h, text) {
    this.type = "COMPARTMENT";
    this.id = id || 0;     //this rectangle belongs to which bubble or chart
    this.state = state;
    this.x = x;
    this.y = y;
    this.w = w || 1;
    this.h = h || 1;
    this.radius = 10;
    this.text = text;
    this.textObj = new Text("Compartment");
    this.strokeColor = "#000000";
    this.fillColor = "#ffffff";
    this.lineWidth = 2;
}

Compartment.prototype = {
    draw: function (ctx) {
        var i, cur, half;

        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        var r = this.x + this.w;
        var b = this.y + this.h;
        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        ctx.moveTo(this.x + this.radius, this.y);
        ctx.lineTo(r - this.radius, this.y);
        ctx.quadraticCurveTo(r, this.y, r, this.y + this.radius);
        ctx.lineTo(r, this.y + this.h - this.radius);
        ctx.quadraticCurveTo(r, b, r - this.radius, b);
        ctx.lineTo(this.x + this.radius, b);
        ctx.quadraticCurveTo(this.x, b, this.x, b - this.radius);
        ctx.lineTo(this.x, this.y + this.radius);
        ctx.quadraticCurveTo(this.x, this.y, this.x + this.radius, this.y);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();	// restore context to what it was on entry

        if (this.state.selection === this) {
            // draw the boxes
            half = this.state.selectionBoxSize / 2;
            // 0  1  2
            // 3     4
            // 5  6  7
            // top left, middle, right
            this.state.selectionHandles[0].x = this.x - half;
            this.state.selectionHandles[0].y = this.y - half;

            this.state.selectionHandles[1].x = this.x + this.w / 2 - half;
            this.state.selectionHandles[1].y = this.y - half;

            this.state.selectionHandles[2].x = this.x + this.w - half;
            this.state.selectionHandles[2].y = this.y - half;

            //middle left
            this.state.selectionHandles[3].x = this.x - half;
            this.state.selectionHandles[3].y = this.y + this.h / 2 - half;

            //middle right
            this.state.selectionHandles[4].x = this.x + this.w - half;
            this.state.selectionHandles[4].y = this.y + this.h / 2 - half;

            //bottom left, middle, right
            this.state.selectionHandles[6].x = this.x + this.w / 2 - half;
            this.state.selectionHandles[6].y = this.y + this.h - half;

            this.state.selectionHandles[5].x = this.x - half;
            this.state.selectionHandles[5].y = this.y + this.h - half;

            this.state.selectionHandles[7].x = this.x + this.w - half;
            this.state.selectionHandles[7].y = this.y + this.h - half;

            for (i = 0; i < 8; i += 1) {
                cur = this.state.selectionHandles[i];
                ctx.fillStyle = "#ffff00";
                ctx.fillRect(cur.x, cur.y, this.state.selectionBoxSize, this.state.selectionBoxSize);
            }
        }
        if (this.textObj) {
            this.textObj.draw(this.x + this.w / 2, this.y + this.h - 10, ctx);
        }
    },
    contains: function (mx, my) {
        return  (this.x <= mx) && (this.x + this.w >= mx) &&
            (this.y <= my) && (this.y + this.h >= my);
    },
    getColor: function () {
        return this.strokeColor;
    }
};