/**
 * Created by Yongnan on 7/2/2014.
 */
function Bubble(id, state, x, y, w, h, text) {
    this.type = "BUBBLE";
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
    this.fillColor = "#2F968B";
    this.lineWidth = 2;
}

Bubble.prototype = {
    draw: function (ctx) {
        var i, cur, half, r, thea;
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;

        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.stroke();
        ctx.restore();	// restore context to what it was on entry

        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        r = Math.sqrt((this.h/2)*(this.h/2) + 16 *this.w * this.w);
        thea = Math.atan(this.h/this.w/8);
        ctx.arc(this.x + this.w*4, this.y + this.h/2, r , Math.PI - thea,  Math.PI+thea, false);
        ctx.closePath();
        ctx.fill();
        //ctx.stroke();
        ctx.restore();	// restore context to what it was on entry

        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        r = Math.sqrt((this.h/2)*(this.h/2) + 16 *this.w * this.w);
        thea = Math.atan(this.h/this.w/8);
        ctx.arc(this.x- this.w*3, this.y + this.h/2, r , -thea,  thea, false);
        ctx.closePath();
        ctx.fill();
        //ctx.stroke();
        ctx.restore();	// restore context to what it was on entry

        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        r = Math.sqrt((this.w/2)*(this.w/2) + 16 * this.h * this.h);
        thea = Math.atan(this.w/this.h/8);
        ctx.arc(this.x + this.w/2, this.y + 4 * this.h, r , Math.PI*3/2-thea,  Math.PI*3/2 + thea, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();	// restore context to what it was on entry
        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();

        r = Math.sqrt((this.w/2)*(this.w/2) + 16*this.h*this.h);
        thea = Math.atan(this.w/this.h/8);
        ctx.arc(this.x + this.w/2, this.y-3*this.h , r , Math.PI/2-thea,  Math.PI/2 + thea, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();	// restore context to what it was on entry
        ctx.save();

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
        /*
        if (this.textObj) {
            this.textObj.draw(this.x + this.w / 2, this.y + this.h - 10, ctx);
        } */
    },
    contains: function (mx, my) {
        return  (this.x <= mx) && (this.x + this.w >= mx) &&
            (this.y <= my) && (this.y + this.h >= my);
    }
};