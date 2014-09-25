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

//    setSize : function ( width, height, updateStyle ) {
//
//        this.canvasWidth  = width * this.devicePixelRatio;
//        this.canvasHeight = height * this.devicePixelRatio;
//
//        this.canvasWidthHalf = Math.floor( this.canvasWidth / 2 );
//        this.canvasHeightHalf = Math.floor( this.canvasHeight / 2 );
//
//        if ( updateStyle !== false ) {
//            this.canvas.style.width = width + 'px';
//            this.canvas.style.height = height + 'px';
//        }
//        this.setViewport( 0, 0, width, height );
//    },
//    setViewport : function ( x, y, width, height ) {
//
//    this.viewportX = x * this.devicePixelRatio;
//    this.viewportY = y * this.devicePixelRatio;
//
//    this.viewportWidth = width * this.devicePixelRatio;
//    this.viewportHeight = height * this.devicePixelRatio;
//
//    },
    clear: function () {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    render: function () {
        var _this = this;
//        function drawObject( object ) {
//            if (object instanceof PATHBUBBLES.Groups)
//            {
//                object.draw(_this.ctx);
//                return;
//            }
//            if (!(object instanceof PATHBUBBLES.Groups) && !(object instanceof PATHBUBBLES.Scene)) {
//                object.draw(_this.ctx);
//                for (var i = 0, l = object.children.length; i < l; i++) {
//                    drawObject(object.children[ i ]);
//                }
//            }
//
//        }
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
            if (this.scene)
            {
                drawObject(this.scene);
            }
        }

    }
};
