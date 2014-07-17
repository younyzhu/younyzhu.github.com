/**
 * Created by Yongnan on 7/15/2014.
 */
function Renderer(layout, clear, drawEdge, drawNode, onRenderStop, onRenderStart) {
    this.layout = layout;
    this.clear = clear;
    this.drawEdge = drawEdge;
    this.drawNode = drawNode;
    this.onRenderStop = onRenderStop;
    this.onRenderStart = onRenderStart;
    //this.layout.graph.addGraphListener(this);
    //this.start();//move from new Renderer();
}
Renderer.prototype = {
    graphChanged: function (e) {
        this.start();
    },
    start: function (done) {
        var _this = this;
        this.layout.start(function render() {
            _this.clear();

            _this.layout.eachEdge(function (edge, spring) {
                _this.drawEdge(edge, spring.point1.p, spring.point2.p);
            });

            _this.layout.eachNode(function (node, point) {
                _this.drawNode(node, point.p);
            });
        }, this.onRenderStart, this.onRenderStop);
    },
    stop: function () {
        this.layout.stop();
    }
};
