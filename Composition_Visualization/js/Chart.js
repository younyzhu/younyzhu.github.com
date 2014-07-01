/**
 * Created by Yongnan on 7/1/2014.
 * This is a Chart for saving the chart(line chart, bar chart......)
 */
function Chart(id)//every chart belongs to specific bubble
{
    this.id = id;
}

Chart.prototype = {
    initChart: function () {
        var _this = this;
        var id = this.id;
        var $bubbleId = $("#bubble" + id);
        var posx = $bubbleId.offset().left;//offset() or position()
        var posy = $bubbleId.offset().top;
        var chartdiv = $(this.chart_div(id, "FA Line Chart", posx + $bubbleId.width() + 30, posy));
        $("#bubble").append(chartdiv);

        var $chartId = $('#chart' + id);
        var boxWidth = $chartId.width() / window.innerWidth * nvWidth;
        var boxHeight = $chartId.height() / (window.innerHeight - 50) * 50;
        var pos = currentToBoxPos(posx + $bubbleId.width() + 30, posy);
        var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        var chartView = new Rectangle(navigationCanvas, pos.x, pos.y, boxWidth, boxHeight, color, true, id, "CHART");
        navigationCanvas.addShape(chartView);

        var linechartCanvas = document.getElementById('chartCanvas' + id);
        var lineChart = new LineChart(id, linechartCanvas);

        var childs = Bubbles[id].mainGroup.children;
        for (var i = 0; i < childs.length; ++i) {
            for (var j = 0; j < childs[i].children.length; ++j) {
                lineChart.addItem(childs[i].children[j].id, childs[i].children[j].FA);
            }
        }
        var parent = $('#chart' + id).draggable({ containment: '#bgCanvas', scroll: false,  //just dragable, do not need to move
            drag: function (ev, ui) {
                var position = ui.position;  //drag stop position
                var currentPos = currentToBoxPos(position.left, position.top);
                //navigationCanvas.updateRectPos(id, currentPos.x, currentPos.y);
                var currentId = parseInt($(this).attr('id').replace(/chart/, ''));

                for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
                    if (navigationCanvas.shapes[i] === null)
                        continue;
                    if (navigationCanvas.shapes[i].type === "CHART" && navigationCanvas.shapes[i].Id === currentId)
                        navigationCanvas.updateRectPos(i, currentPos.x, currentPos.y);
                }
                if (Bubbles[currentId] !== null) {
                    var le = Bubbles[currentId].getlinkNodes().length;
                    for (var i = 0; i < le; ++i) {
                        var type = Bubbles[currentId].getlinkNodes()[i].type;
                        if (type === "CHART") {
                            pathConnection.update(Bubbles[currentId].getlinkNodes()[i].connectionId, getWidgetCenter(currentId), getChartCenter(currentId));
                        }
                    }
                }
            }
        });
        $('#chartCanvas' + id).resizable({
            resize: function () {
                var $canvas = $('#chartCanvas' + id);
                var width_ = $canvas.width();
                var height_ = $canvas.height();
                $canvas.attr({width: width_, height: height_});
                lineChart.resize(width_, height_);
                var width = width_ / window.innerWidth * nvWidth;
                var height = height_ / (window.innerHeight - 50) * 50;
                for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
                    if (navigationCanvas.shapes[i] === null)
                        continue;
                    if (navigationCanvas.shapes[i].type === "CHART" && navigationCanvas.shapes[i].Id === id)
                        navigationCanvas.updateRectResize(i, width, height);
                }
            }
        });

        parent.children(".dragheader").children(".close").click(function () {
             _this.removeChart();
        });
    },
    removeChart: function(){
        var id = this.id;
        for (var i = 0; i < navigationCanvas.shapes.length; ++i) {
            if (navigationCanvas.shapes[i] === null)
                continue;
            if (navigationCanvas.shapes[i].type === "CHART" && navigationCanvas.shapes[i].Id === id)
                navigationCanvas.remove(i);
        }
        $('#chart' + id).remove();
        if (Bubbles[id] !== null) {
            var le = Bubbles[id].getlinkNodes().length;
            for (var i = 0; i < le; ++i) {
                var type = Bubbles[id].getlinkNodes()[i].type;
                if (type === "CHART") //if chart has node
                {
                    pathConnection.remove(Bubbles[id].getlinkNodes()[i].connectionId);
                    Bubbles[id].spliceNodeLink(i);
                    $('#chart' + id).remove();
                }
            }
        }
    },
    chart_div: function (id, name, mousePosX, mousePosY) {   //Every Bubble has a char to show FA value.
        var tmp = '';
        tmp += '<div id ="chart' + id + '" class="chart shadow drag" style="position: absolute; left:' + mousePosX + 'px; top:' + mousePosY + 'px; ">';
        tmp += '    <div id ="drag' + id + '" class="dragheader">' + name;
        tmp += '        <span class="close">X</span>';
        tmp += '    </div>';
        tmp += '    <canvas id ="chartCanvas' + id + '"width="250" height="250" >';
        tmp += '    </canvas>';
        tmp += '</div>';
        return tmp;
    }
};
