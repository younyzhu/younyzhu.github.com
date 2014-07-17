/**
 * Created by Yongnan on 7/15/2014.
 */
function Manage(params) {
    var graph = params.graph;

    var canvas = params.canvas;
    var ctx = canvas.getContext("2d");

    var layout = new ForceDirected(graph, ctx, params.boundingX,params.boundingY,params.boundingW,params.boundingH);
    layout.initCalculateBB();

    function animate() {
        layout.updateBB();
        requestAnimationFrame(animate);
    }
    animate();

    var renderer = new Renderer(layout,layout.clear,layout.drawEdge,layout.drawNode);
    renderer.start();






}


