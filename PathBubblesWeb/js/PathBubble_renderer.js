/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/16/2014
 * @name        PathBubble_render
 */
PATHBUBBLES.Renderer = function(canvas, scene){

    this.canvas = canvas;
    this.canvasWidth = canvas.clientWidth;
    this.canvasHeight = canvas.clientHeight;

    this.scene = scene||null;//manage objects inside scene
    this.alpha = false;
    this.ctx = canvas.getContext('2d');
    this.ctx = canvas.getContext('2d', {
        alpha: this.alpha === true
    });  // when set to false, the canvas will redraw everything
    this.valid =false;
};
PATHBUBBLES.Renderer.prototype ={
    constructor: PATHBUBBLES.Renderer,

    clear: function () {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    render: function () {
        var _this = this;
        function drawObject( object ) {
            if(! (object instanceof PATHBUBBLES.Scene) && !( object instanceof PATHBUBBLES.Object2D ))
            {
                object.draw(_this.ctx);
            }
            if(!(object instanceof PATHBUBBLES.Groups) )
            {
                for ( var i = 0, l = object.children.length; i < l; i ++ ) {
                    drawObject( object.children[ i ] );
                }
            }
        }
        if(!_this.valid)
        {
            _this.clear();
            if (scene)
            {
                drawObject(scene);
            }
        }

    }
};
