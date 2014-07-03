/**
 * Created by Yongnan on 7/2/2014.
 */
function Rectangle(state, x, y, w ,h, color, fillState, id, type)
{
    this.type = type || "BUBBLE"; //
    this.Id = id || 0;     //this rectangle belongs to which bubble or chart
    this.state = state;
    this.x = x + currentViewpointPosx || 0;
    this.y = y + currentViewpointPosy || 0;
    this.w = w || 1;
    this.h = h || 1;

    this.strokeColor = color || "#0000ff";
    this.lineWidth   = 2;
    this.fillState = fillState ||false;
}

Rectangle.prototype ={
    draw : function(ctx)
    {
        var i, cur, half;
        if(this.fillState)
        {
            ctx.fillStyle = this.strokeColor;
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
        else
        {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.lineWidth;
            ctx.strokeRect(this.x,this.y,this.w,this.h);
        }

        if (this.state.selection === this)
        {
            // draw the boxes
            half = this.state.selectionBoxSize / 2;
            // 0  1  2
            // 3     4
            // 5  6  7

            // top left, middle, right
            this.state.selectionHandles[0].x = this.x-half;
            this.state.selectionHandles[0].y = this.y-half;

            this.state.selectionHandles[1].x = this.x+this.w/2-half;
            this.state.selectionHandles[1].y = this.y-half;

            this.state.selectionHandles[2].x = this.x+this.w-half;
            this.state.selectionHandles[2].y = this.y-half;

            //middle left
            this.state.selectionHandles[3].x = this.x-half;
            this.state.selectionHandles[3].y = this.y+this.h/2-half;

            //middle right
            this.state.selectionHandles[4].x = this.x+this.w-half;
            this.state.selectionHandles[4].y = this.y+this.h/2-half;

            //bottom left, middle, right
            this.state.selectionHandles[6].x = this.x+this.w/2-half;
            this.state.selectionHandles[6].y = this.y+this.h-half;

            this.state.selectionHandles[5].x = this.x-half;
            this.state.selectionHandles[5].y = this.y+this.h-half;

            this.state.selectionHandles[7].x = this.x+this.w-half;
            this.state.selectionHandles[7].y = this.y+this.h-half;

            for (i = 0; i < 8; i += 1) {
                cur = this.state.selectionHandles[i];
                ctx.fillRect(cur.x, cur.y, this.state.selectionBoxSize, this.state.selectionBoxSize);
            }
        }
    },
    contains : function(mx, my)
    {
        return  (this.x <= mx) && (this.x + this.w >= mx) &&
            (this.y <= my) && (this.y + this.h >= my);
    },
    getColor: function(){
        return this.strokeColor;
    }
};