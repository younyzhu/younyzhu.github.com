/**
 * Created by Yongnan on 7/15/2014.
 */
function Manage(params) {
    var graphs = params.graphs;
    var canvas = $("#springydemo")[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    this.layouts = [];
    for(var i=0 ; i< graphs.length; ++i)
    {
        var layout = new ForceDirected(graphs[i], ctx, graphs[i].boundingX,graphs[i].boundingY,graphs[i].boundingW,graphs[i].boundingH);
        layout.initCalculateBB();
        this.layouts.push(layout);
    }
    var _this =this;
    function animate() {
        //layout.updateBB();
        for(var i=0; i<_this.layouts.length; ++i)
        {
            _this.layouts[i].updateBB();
        }
        requestAnimationFrame(animate);
    }
    animate();
    for(var i=0; i<this.layouts.length; ++i)
    {
        var renderer = new Renderer(this.layouts[i]);
        renderer.start();
    }
}



