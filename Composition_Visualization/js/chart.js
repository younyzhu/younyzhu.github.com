/**
 * Created by Yongnan on 6/8/2014.
 */

function LineChart(canvas){

    this.data = {values:[ ]}; //values are pairs of (x,y);  { X: "Jan", Y: 12 }
    this.xPadding = 20;
    this.yPadding = 20;

    this.width = canvas.width;
    this.height = canvas.height;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.valid = true; // when set to false, the canvas will redraw everything

    var _this = this;

    function animate(){
        requestAnimationFrame(animate);
        _this.draw();
    }
    animate();
}
LineChart.prototype = {
    addItem : function(x, y) {
        this.data.values.push({ X: x, Y: y });
        this.valid = false; //For redrawing the chart, the data is changed
    },
    resize :function(){
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.valid = false;
    },
    removeItem : function(index)
    {
        var l = this.data.values.length;
        if(index >0 && index <l)
            this.data.values[index] = null;
        this.valid = false;
    },
    // Returns the max Y value in our data list
    getMaxY: function () {
        var max = 0;
        var l = this.data.values.length;
        for(var i = 0; i < l; i ++) {
            if(this.data.values[i].Y > max) {
                max = this.data.values[i].Y;
            }
        }
        return max;
    },
    // Return the x pixel for a graph point
    getXPixel :function (val) {
        return ((this.width - 2 * this.xPadding) / this.data.values.length) * val + this.xPadding;//left and right keep padding
    },
    // Return the y pixel for a graph point
    getYPixel :function (val) {
        return this.height - this.yPadding - (( (this.height - 2 * this.yPadding) / this.getMaxY() ) * val);  // Y value range[0,1]
    },
    clear : function() {
        //this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0,0,this.width, this.height);
    },
    draw: function()
    {
        // if our state is invalid, redraw and validate!
        if (!this.valid) {
            this.clear();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#333';
            this.ctx.font = 'italic 8pt sans-serif';
            this.ctx.textAlign = "center";

            // Draw the axises
            this.ctx.beginPath();
            this.ctx.moveTo(this.xPadding, this.yPadding); //top, left 10
            this.ctx.lineTo(this.xPadding, this.height - this.yPadding); //bottom, left
            this.ctx.lineTo(this.width - this.xPadding, this.height - this.yPadding); //bottom right
            this.ctx.stroke();


            this.ctx.strokeStyle = '#f00';
            // Draw the line graph
            this.ctx.beginPath();
            this.ctx.moveTo(this.getXPixel(0), this.getYPixel(this.data.values[0].Y));
            for(var i = 0; i < this.data.values.length; i ++) {
                this.ctx.lineTo(this.getXPixel(i), this.getYPixel(this.data.values[i].Y));
            }
            this.ctx.stroke();

            // Draw the dots
            this.ctx.fillStyle = '#333';
            for(var i = 0; i < this.data.values.length; i ++) {
                this.ctx.beginPath();
                this.ctx.arc(this.getXPixel(i), this.getYPixel( this.data.values[i].Y ), 2, 0, Math.PI * 2, true);
                this.ctx.fill();
            }

            this.ctx.strokeStyle = '#0ff';
            this.ctx.font = 'italic 8pt sans-serif';
            this.ctx.textAlign = "center";
            this.ctx.fillText("(0,0)", this.xPadding /2.0, this.height - this.yPadding/2.0, 30);

            // Draw the X value texts
            var i, l = this.data.values.length;
            var step = parseInt(l / 5);
            for(i = step; i < l; i += step) {
                //this.ctx.strokeStyle = '#00f';
                this.ctx.font = 'italic 8pt Calibri';
                this.ctx.fillText(this.data.values[i].X, this.getXPixel(i), this.height - this.yPadding/2.0, 30);
            }

            // Draw the Y value texts
            this.ctx.textAlign = "right";
            this.ctx.textBaseline = "middle";
            for(i = 1; i <= 5; i ++) {
                this.ctx.fillText( i/5, this.xPadding*4/5.0, this.height - this.yPadding-(this.height - 2 *this.yPadding) / 5.0*i );
            }
            this.valid = true;
        }
    }
};
