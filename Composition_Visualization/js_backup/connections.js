/**
 * Created by Yongnanzhu on 5/19/2014.
 */
//Draw connection between two div elements, which contain canvas
function Connection(begin, end)
{
    this.begin = begin;
    this.end = end;
}
Connection.prototype = {

    draw: function (ctx) {
        //draw line
        //ctx.beginPath();
        //ctx.moveTo(this.begin.x, this.begin.y);
        //ctx.lineTo(this.end.x, this.end.y);
        //ctx.closePath();
        //draw besierCurve
        //          p2          p4
        //
        //
        //p1        p3
        ctx.beginPath();
        ctx.moveTo(this.begin.x, this.begin.y);
        ctx.bezierCurveTo((this.begin.x + this.end.x) / 2.0,this.end.y,(this.begin.x + this.end.x) / 2.0,this.begin.y,this.end.x, this.end.y);
        //ctx.closePath();
        //ink line
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#fff"; //black
        ctx.stroke();
    }
};

function PathConnections(canvas, width, height)
{
    this.canvas = canvas;
    this.width = width; //  our canvas is much bigger than the screen space, so we should not use the width of canvas
    this.height = height;//
    this.ctx = canvas.getContext('2d');

    this.valid = false; // when set to false, the canvas will redraw everything
    this.connections = [];  // the collection of things to be drawn
    var _this = this;

    function animate(){
        requestAnimationFrame(animate);
        _this.draw();
    }
    animate();
}

PathConnections.prototype = {
    //when we build a connection for two div, we need to put in the connections to collect the connect
    addConnection: function(connection){
        this.connections.push(connection);
        this.valid = false;
    },

    clear : function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    },
    contains: function(points)
    {
        var x = points.x;
        var y = points.y;
        return  ( x>0&&x< this.width ) && ( y>0 && y< this.height);
    },
    remove : function(value) {
        // this.clear();
        var l = this.connections.length;
        if (value >=0 && value < l)
            this.connections[value] = null;
        this.valid = false;
    },
    update : function(id, begin, end)
    {
        if(id >=0 && id < this.connections.length)
        {
            this.connections[id].begin = begin;
            this.connections[id].end = end;
            this.valid = false;
        }
    },
    draw : function()
    {
        // if our state is invalid, redraw and validate!
        if (!this.valid)
        {
            this.clear();
            // draw all connections
            for (var i = 0; i < this.connections.length; i += 1)
            {
                if (this.connections[i] !== null)
                {
                    // We can skip the drawing of elements that two points have moved off the screen:
                    if (this.contains(this.connections[i].begin) || this.contains(this.connections[i].end)) {
                        this.connections[i].draw(this.ctx);
                    }
                }
            }
            this.valid = true;
        }
    }
};

