/**
 * Created by Yongnan on 6/8/2014.
 */
var PIXEL_WIDTH = 1;
var PIXEL_HEIGHT = 1;
function Pixel(x,y,fa)
{
    this.x = x;
    this.y = y;
    this.w = PIXEL_WIDTH;
    this.h = PIXEL_HEIGHT;

    this.fillColor = this.getColor(fa);
    this.HIGHLIGHT = false;
}
Pixel.prototype = {
    constructor: Pixel,
    getColor: function(fa){
        var r = fa * 255;
        var g = fa * 255;
        var b = 255;
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    draw: function(ctx)
    {
        ctx.save();
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.restore();
        if(this.HIGHLIGHT)
        {
            this.drawStroke(ctx);
        }
    },
    drawStroke: function(ctx){
        ctx.save();
        ctx.strokeStyle = this.fillColor;
        ctx.strokeRect(this.x,this.y,this.w,this.h);
        ctx.restore();
    },
    contains : function(mx, my)
    {
        var x = this.x;
        var y = this.y;
        return  (x<= mx) && (x + this.w >= mx) && (y <= my) && (y + this.h >= my);
    }
};
function PixelBarChart(id, canvas) {

    this.id = id;//id means which bubble it belongs to.
    this.data = []; //values are pairs of (x,y);  { X: "Jan", Y: 12 }
    this.xPadding = 20;
    this.yPadding = 20;

    this.width = canvas.width;
    this.height = canvas.height;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.valid = false; // when set to false, the canvas will redraw everything
    this.just_click = false;

    var _this = this;
    this.SORTFLAG = false;

    function animate() {
        requestAnimationFrame(animate);
        _this.draw();
    }
    animate();
}
PixelBarChart.prototype = {
    addItem: function (id, colors) {
        this.data.push({ Id: id, fas: colors, values:[] });//This id means which line it belongs to
        this.valid = false; //For redrawing the chart, the data is changed
    },
    generatePixelPos: function(){
        if(this.data.length ==0)
        return;
        var max = -Infinity;
        for(var i=0; i< this.data.length; ++i)
        {
            if(this.data[i].fas.length >max)
            {
                max = this.data[i].fas.length;
            }
        }
        if(((this.width - 2 * this.xPadding) / this.data.length)>PIXEL_WIDTH)
        {
            PIXEL_WIDTH = (this.width - 2 * this.xPadding) / this.data.length;
        }
        if( (this.height - 2 * this.yPadding) /max  > PIXEL_HEIGHT)
        {
            PIXEL_HEIGHT = (this.height - 2 * this.yPadding) /max ;
        }

        for(var i=0; i<this.data.length; ++i)
        {
            this.data[i].values.length =0;
            for(var j=0; j<this.data[i].fas.length; ++j)
            {
                var pixel = new Pixel(this.getXPixel(i), this.getYPixel(j), this.data[i].fas[j].z);
//                var index = this.data[i].values.indexOf(pixel);
//                if(index != -1)
                    this.data[i].values.push(pixel);
            }
        }
    },
    resize: function () {
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.valid = false;
    },
    removeItem: function (index) {
        var l = this.data.values.length;
        if (index > 0 && index < l)
            this.data.values[index] = null;
        this.valid = false;
    },
    // Returns the max Y value in our data list
    getXPixel: function (val) {
        //return ((this.width - 2 * this.xPadding) / this.data.values.length) * val + this.xPadding;//left and right keep padding
        return PIXEL_WIDTH * val + this.xPadding;//left and right keep padding
    },
    // Return the y pixel for a graph point
    getYPixel: function (val) {
        //return this.height - this.yPadding - (( (this.height - 2 * this.yPadding) ) * val);
        return this.height - this.yPadding - PIXEL_HEIGHT * (val+1);
    },
    clear: function () {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, this.width, this.height);
    },

    draw: function () {
        // if our state is invalid, redraw!
        if (!this.valid) {
            //if(!this.just_click)
              //  this.dataProcessing();
            this.clear();
            if(this.data.length)
            {
                if(this.SORTFLAG)
                {
                    for(var i=0; i<this.data.length; ++i)
                    {
                        for(var j=0; j<this.data[i].fas.length-1; ++j)
                        {
                            for( var k=0; k<this.data[i].fas.length-1 -j; ++k)
                            {
                                if(this.data[i].fas[k].z < this.data[i].fas[k+1].z )
                                {
                                    var temp1 = this.data[i].fas[k];
                                    this.data[i].fas[k] = this.data[i].fas[k+1];
                                    this.data[i].fas[k+1] = temp1;

                                    var temp2 = this.data[i].values[k];
                                    this.data[i].values[k] = this.data[i].values[k+1];
                                    this.data[i].values[k+1] = temp2;
                                }
                            }
                        }
                    }
                    for(var i=0; i<this.data.length-1; ++i)
                    {
                        for(var j=0; j<this.data.length -i -1; ++j)
                        {
                            if(this.data[j].fas[ this.data[j].fas.length -1 ].z > this.data[j+1].fas[ this.data[j+1].fas.length -1 ].z)
                            {
                                var temp = this.data[j];
                                this.data[j] = this.data[j+1];
                                this.data[j+1] = temp;
                            }
                        }
                    }
                }
                this.generatePixelPos();
            }
//            this.ctx.save();
//            this.ctx.fillStyle = '#000';
//            this.ctx.font = 'italic 8pt sans-serif';
//            this.ctx.textAlign = "center";
//            this.ctx.fillText("(0,0)", this.xPadding / 2.0, this.height - this.yPadding / 2.0, 30);
//            this.ctx.restore();

            this.ctx.save();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#333';
            this.ctx.font = 'italic 8pt sans-serif';
            this.ctx.textAlign = "center";
            // Draw the axises
            this.ctx.beginPath();
            this.ctx.moveTo(this.xPadding-1, this.yPadding); //top, left 10
            this.ctx.lineTo(this.xPadding-1, this.height - this.yPadding+1); //bottom, left
            this.ctx.lineTo(this.width - this.xPadding, this.height - this.yPadding+1); //bottom right
            this.ctx.stroke();
            this.ctx.restore();

            // Draw the X value texts
//            var i, l = this.data.length;
//            var step = parseInt(l / 5);
//            this.ctx.save();
//            for (i = step; i < l; i += step) {
//                this.ctx.lineWidth = 2;
//                this.ctx.strokeStyle = '#333';
//                this.ctx.font = 'italic 8pt Calibri';
//                this.ctx.fillText(i, this.getXPixel(i), this.height - this.yPadding / 2.0, 30);
//            }
//            this.ctx.restore();
            // Draw the Y value texts
//            this.ctx.save();
//            this.ctx.lineWidth = 2;
//            this.ctx.strokeStyle = '#333';
//            this.ctx.textAlign = "right";
//            this.ctx.textBaseline = "middle";
//            for (i = 1; i <= 5; i++) {
//                this.ctx.fillText(i / 5, this.xPadding * 4 / 5.0, this.height - this.yPadding - (this.height - 2 * this.yPadding) / 5.0 * i);
//            }
//            this.ctx.restore();
            if(this.data.length)
            this.drawBar(this.ctx);
            this.valid = true;
            this.just_click = false;
        }
    },
    drawBar: function(ctx){
         for(var i=0; i<this.data.length; ++i)
         {
             for(var j=0; j<this.data[i].values.length; ++j)
             {
                 this.data[i].values[j].draw(ctx);
             }
         }
    },
    getMouse : function(e) {
        var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
        if (element.offsetParent !== undefined) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
                element = element.offsetParent;
            } while (element);
        }
        mx = e.pageX - offsetX;
        my = e.pageY - offsetY;
        return {x: mx, y: my};
    }
};
