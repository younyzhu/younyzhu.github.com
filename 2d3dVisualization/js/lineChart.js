/**
 * Created by Yongnan on 6/8/2014.
 */
function Dot(id, x, y) {
    this.Id = id;//which line this dot belongs to.
    this.x = x;
    this.y = y;
    this.radius = 2;

    this.fillStyle = '#333';
}
Dot.prototype = {
    drawDot: function (ctx) {
        // Draw the dots
        ctx.save();
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath();   //Center, Start angle, End angle
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();
    },
    contains: function (mx, my) {    //if (mx, my) inside the circle, we said it contains.
        return ( (mx - this.x) * (mx - this.x) + (my - this.y) * (my - this.y) ) - this.radius * this.radius <= 0;
    }
};
function LineChart(id, canvas) {

    this.id = id;//id means which bubble it belongs to.
    this.data = {values: [ ]}; //values are pairs of (x,y);  { X: "Jan", Y: 12 }
    this.xPadding = 20;
    this.yPadding = 20;
    this.dots = [];
    this.width = canvas.width;
    this.height = canvas.height;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.valid = true; // when set to false, the canvas will redraw everything
    this.just_click = false;

    var _this = this;
    canvas.addEventListener('mousedown', function(e) {
        var mouse = _this.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        for(var i=0; i < _this.dots.length ; ++i)
        {
            if (_this.dots[i].contains(mx, my)) {
                _this.dots[i].fillStyle = "#ffff00";
                //Bubbles[_this.id].setSelectFAColor(_this.dots[i].Id);
                var $chartip = $("#chart" + _this.id).find("#chartTip");

                for(var j=0; j<_this.data.values.length; ++j)
                {
                    if(_this.data.values[j].Id === _this.dots[i].Id)
                    {
                        $chartip.find("#value").text(parseFloat(_this.data.values[j].Y).toFixed(7));
                        $chartip.css({left: mx, top: my+27});
                        $chartip.show();
                        break;
                    }
                }
                break;
            }
        }
        _this.just_click = true;
        _this.valid = false;
    });
    canvas.addEventListener('mouseup', function(e) {
        var mouse = _this.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        for(var i=0; i < _this.dots.length ; ++i)
        {
            if ( _this.dots[i].fillStyle ===  "#ffff00")
            {
                _this.dots[i].fillStyle = "#333";
                var $chartip = $("#chart" + _this.id).find("#chartTip");
                $chartip.hide();
                //Bubbles[_this.id].resetSelectFAColor(_this.dots[i].Id);
                break;
            }
        }
        _this.just_click = true;
        _this.valid = false;
    });
    function animate() {
        requestAnimationFrame(animate);
        _this.draw();
    }
    animate();
}
LineChart.prototype = {
    addItem: function (id, y) {
        this.data.values.push({ Id: id, Y: y });   //This id means which line it belongs to
        //this.dataProcessing();// When we add a Item, we must sort the fa.
        this.valid = false; //For redrawing the chart, the data is changed
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
    getMaxY: function () {
        var max = 0;
        var l = this.data.values.length;
        for (var i = 0; i < l; i++) {
            if (this.data.values[i].Y > max) {
                max = this.data.values[i].Y;
            }
        }
        return max;
    },
    // Return the x pixel for a graph point
    getXPixel: function (val) {
        return ((this.width - 2 * this.xPadding) / this.data.values.length) * val + this.xPadding;//left and right keep padding
    },
    // Return the y pixel for a graph point
    getYPixel: function (val) {
        return this.height - this.yPadding - (( (this.height - 2 * this.yPadding) ) * val);  // Y value range[0,1]
    },
    clear: function () {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, this.width, this.height);
    },
    dataProcessing: function () {
        //sort the data
        var tmp;
        for (var i = 0; i < this.data.values.length - 1; ++i)
            for (var j = i + 1; j < this.data.values.length; ++j) {
                if (this.data.values[i].Y > this.data.values[j].Y) {
                    tmp = this.data.values[i].Y;
                    this.data.values[i].Y = this.data.values[j].Y;
                    this.data.values[j].Y = tmp;
                }
            }
        //Keep the position of the Dots
        this.dots.length = 0;
        for (var i = 0; i < this.data.values.length; i++) {
            var dot = new Dot(this.data.values[i].Id, this.getXPixel(i), this.getYPixel(this.data.values[i].Y));
            this.dots.push(dot);
        }
    },
    draw: function () {
        // if our state is invalid, redraw!
        if (!this.valid) {
            if(!this.just_click)
                this.dataProcessing();
            this.clear();
            this.ctx.save();
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
            for (var i = 0; i < this.data.values.length; i++) {
                this.ctx.lineTo(this.getXPixel(i), this.getYPixel(this.data.values[i].Y));
            }
            this.ctx.stroke();

            // Draw the dots    //As we want to use mouse to select the dots, so we must store the every dot's position, here, I just store the dot, which can be used to redraw with another color
            //this.ctx.fillStyle = '#333';
            for (var i = 0; i < this.data.values.length; i++) {
                //this.ctx.beginPath();   //Center, Start angle, End angle
                //this.ctx.arc(this.getXPixel(i), this.getYPixel( this.data.values[i].Y ), 2, 0, Math.PI * 2, true);
                //this.ctx.fill();
                this.dots[i].drawDot(this.ctx);
            }

            this.ctx.strokeStyle = '#0ff';
            this.ctx.font = 'italic 8pt sans-serif';
            this.ctx.textAlign = "center";
            this.ctx.fillText("(0,0)", this.xPadding / 2.0, this.height - this.yPadding / 2.0, 30);

            // Draw the X value texts
            var i, l = this.data.values.length;
            var step = parseInt(l / 5);
            for (i = step; i < l; i += step) {
                //this.ctx.strokeStyle = '#00f';
                this.ctx.font = 'italic 8pt Calibri';
                this.ctx.fillText(i, this.getXPixel(i), this.height - this.yPadding / 2.0, 30);
            }

            // Draw the Y value texts
            this.ctx.textAlign = "right";
            this.ctx.textBaseline = "middle";
            for (i = 1; i <= 5; i++) {
                this.ctx.fillText(i / 5, this.xPadding * 4 / 5.0, this.height - this.yPadding - (this.height - 2 * this.yPadding) / 5.0 * i);
            }
            this.ctx.restore();
            this.valid = true;
            this.just_click = false;
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
