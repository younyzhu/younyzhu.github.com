/**
 * Created by Yongnan on 7/1/2014.
 * This is a Chart for saving the chart(line chart, bar chart......)
 */
CHART_COUNT=0;
function Chart(id,charId, selectorId)//every chart belongs to specific bubble
{
    CHART_COUNT++;
    this.id = id;
    this.chartId = charId;
    this.selectorId = selectorId;
    this.lineChart = null;
    this.pixelBarChart = null;
}

Chart.prototype = {
    initChart: function () {
        var _this = this;
        var $bubbleId = $("#bubble" + this.id);
        var posx = $bubbleId.offset().left;//offset() or position()
        var posy = $bubbleId.offset().top;
        var chartdiv = $(this.chart_div(this.chartId, "FA Chart", posx + $bubbleId.width() + 30, posy));
        $("#bubble").append(chartdiv);

        var $chartId = $('#chart' + this.chartId);
        var boxWidth = $chartId.width() / window.innerWidth * nvWidth;
        var boxHeight = $chartId.height() / (window.innerHeight - 50) * 50;
        var pos = currentToBoxPos(posx + $bubbleId.width() + 30, posy);
        var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        var chartView = new Rectangle(navigationCanvas, pos.x, pos.y, boxWidth, boxHeight, color, true, this.chartId, "CHART");
        navigationCanvas.addShape(chartView);

//        var linechartCanvas = document.getElementById('chartCanvas' + this.chartId);
//        this.lineChart = new LineChart(id, linechartCanvas);
//
//        var selectedFibers = Bubbles[id].fiberSelector.selectedFibers;
//        for(var i=0; i< selectedFibers.length; ++i)
//        {
//            if(selectedFibers[i].object.FA)
//            {
//                this.lineChart.addItem(selectedFibers[i].object.id, selectedFibers[i].object.FA);
//            }
//        }

//        var pixelchartCanvas = document.getElementById('chartCanvas' + this.chartId);
//        this.pixelBarChart = new PixelBarChart(this.chartId, pixelchartCanvas);
//        var selectedFibers = Bubbles[this.id].fiberSelector.selectedFibers;
//        for(var i=0; i< selectedFibers.length; ++i)
//        {
//            if(selectedFibers[i].object.geometry.colors)
//            {
//                this.pixelBarChart.addItem(selectedFibers[i].object.id, selectedFibers[i].object.geometry.colors);
//            }
//        }

        var pixelchartCanvas = document.getElementById('chartCanvas' + this.chartId);
        this.pixelBarChart = new PixelBarChart(this.chartId, pixelchartCanvas);
        var selectedFibers = Bubbles[this.id].selectors[this.selectorId].intersects;
        for(var i=0; i< selectedFibers.length; ++i)
        {
            if(selectedFibers[i].object.geometry.colors)
            {
                this.pixelBarChart.addItem(selectedFibers[i].object.id, selectedFibers[i].object.geometry.colors);
            }
        }
        var parent = $chartId.draggable({ containment: '#bgCanvas', scroll: false,  //just dragable, do not need to move
            drag: function (ev, ui) {
                var position = ui.position;  //drag stop position
                var currentPos = currentToBoxPos(position.left, position.top);
                //navigationCanvas.updateRectPos(id, currentPos.x, currentPos.y);
                //var currentId = parseInt($(this).attr('id').replace(/chart/, ''));

                for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
                    if (navigationCanvas.shapes[i] === null)
                        continue;
                    if (navigationCanvas.shapes[i].type === "CHART" && navigationCanvas.shapes[i].Id === _this.chartId)
                        navigationCanvas.updateRectPos(i, currentPos.x, currentPos.y);
                }
                var currentId = _this.id;
                if (Bubbles[currentId] !== null) {
                    var le = Bubbles[currentId].getlinkNodes().length;
                    for (var i = 0; i < le; ++i) {
                        var type = Bubbles[currentId].getlinkNodes()[i].type;
                        if(type === "CHART") {
//                            pathConnection.update(Bubbles[currentId].getlinkNodes()[i].connectionId, getWidgetCenter(currentId), getChartCenter(currentId));
                            var next = Bubbles[currentId].getlinkNodes()[i].connectTo;
                            if (Bubbles[currentId].getlinkNodes()[i].connectionId !== null && Bubbles[currentId] !== null ) {
                                pathConnection.update(Bubbles[currentId].getlinkNodes()[i].connectionId, getWidgetCenter(currentId), getChartCenter(next));
                            }
                        }
                    }
                }
            }
        });
        $('#chartCanvas' + this.chartId).resizable({
            resize: function () {
                var $canvas = $('#chartCanvas' + _this.chartId);
                var width_ = $canvas.width();
                var height_ = $canvas.height();
                $canvas.attr({width: width_, height: height_});
                if(_this.lineChart)
                _this.lineChart.resize(width_, height_);
                if(_this.pixelBarChart)
                    _this.pixelBarChart.resize(width_, height_);
                var width = width_ / window.innerWidth * nvWidth;
                var height = height_ / (window.innerHeight - 50) * 50;
                for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
                    if (navigationCanvas.shapes[i] === null)
                        continue;
                    if (navigationCanvas.shapes[i].type === "CHART" && navigationCanvas.shapes[i].Id === _this.chartId)
                        navigationCanvas.updateRectResize(i, width, height);
                }
                var currentId = _this.id;
                if (Bubbles[currentId] !== null) {
                    var le = Bubbles[currentId].getlinkNodes().length;
                    for (var i = 0; i < le; ++i) {
                        var type = Bubbles[currentId].getlinkNodes()[i].type;
                        if(type === "CHART") {
//                            pathConnection.update(Bubbles[currentId].getlinkNodes()[i].connectionId, getWidgetCenter(currentId), getChartCenter(currentId));
                            var next = Bubbles[currentId].getlinkNodes()[i].connectTo;
                            if (Bubbles[currentId].getlinkNodes()[i].connectionId !== null && Bubbles[currentId] !== null ) {
                                pathConnection.update(Bubbles[currentId].getlinkNodes()[i].connectionId, getWidgetCenter(currentId), getChartCenter(next));
                            }
                        }
                    }
                }
            }
        });

//        parent.children(".dragheader").children(".close").click(function () {
//             _this.removeChart();
//        });

        $chartId.contextMenu({
           selector: ".dragheader",
           callback: function(key, options){
               if(key==="delete")
               {
                   _this.removeChart();
               }
               else if(key==="sort")
               {
                   _this.pixelBarChart.SORTFLAG = true;
                   _this.pixelBarChart.valid = false;
               }
               else if(key==="unSort")
               {
                   _this.pixelBarChart.SORTFLAG = false;
                   _this.pixelBarChart.valid = false;
               }
           },
           items: {
                "delete": {name: "Delete"},
                "sort": {name: "Sort"},
                "unSort": {name: "UnSort"}
           }
        });

    },
    removeChart: function(){
        for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
            if (navigationCanvas.shapes[i] === null)
                continue;
            if (navigationCanvas.shapes[i].type === "CHART" && navigationCanvas.shapes[i].Id === this.chartId)
                navigationCanvas.remove(i);
        }
        $('#chart' + this.chartId).remove();
        if (Bubbles[this.id] !== null) {
            if(Bubbles[this.id].getlinkNodes())
            {
                if(Bubbles[this.id].getlinkNodes()[this.selectorId])
                {
                    var type = Bubbles[this.id].getlinkNodes()[this.selectorId].type;
                    if (type === "CHART") //if chart has node
                    {
                        pathConnection.remove(Bubbles[this.id].getlinkNodes()[this.selectorId].connectionId);
                        Bubbles[this.id].spliceNodeLink(this.selectorId);
                        $('#chart' + this.chartId).remove();
                    }
                }
            }
        }
    },
    updateChart: function(){
//        if(this.lineChart)
//        {
//            this.lineChart.data.values.length =0;
//            var selectedFibers = Bubbles[this.id].fiberSelector.selectedFibers;
//            for(var i=0; i< selectedFibers.length; ++i)
//            {
//                if(selectedFibers[i].object.FA)
//                {
//                    this.lineChart.addItem(selectedFibers[i].object.id, selectedFibers[i].object.FA);
//                }
//            }
//        }
        if(this.pixelBarChart)
        {
            this.pixelBarChart.data.length =0;
            this.pixelBarChart.unsortData.length =0;
            var selectedFibers = Bubbles[this.id].selectors[this.selectorId].intersects;
            for(var i=0; i< selectedFibers.length; ++i)
            {
                if(selectedFibers[i].object.geometry.colors)
                {
                    this.pixelBarChart.addItem(selectedFibers[i].object.id, selectedFibers[i].object.geometry.colors);
                }
            }
        }
    },
    chart_div: function (id, name, mousePosX, mousePosY) {   //Every Bubble has a char to show FA value.
        var tmp = '';
        tmp += '<div id ="chart' + id + '" class="chart shadow drag" style="position: absolute; left:' + mousePosX + 'px; top:' + mousePosY + 'px; ">';
        tmp += '    <div id ="drag' + id + '" class="dragheader">' + name;
       // tmp += '        <span class="close">X</span>';
        tmp += '    </div>';
        tmp += '    <canvas id ="chartCanvas' + id + '"width="250" height="250" >';
        tmp += '    </canvas>';
        //tmp += '    <div id ="chartTip" class="chartTooltip" style="position: absolute; display: = none; left:0; top:0">';
        tmp += '    <div id ="chartTip" class="chartTooltip">';
        tmp += '        <span >Value: <span id="value"></span></span>';
        tmp += '    </div>';
        tmp += '</div>';
        return tmp;
    }
};
