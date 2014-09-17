/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/16/2014
 * @name        PathBubble_Bubble
 */

PATHBUBBLES.Bubble = function(x, y, w ,h, strokeColor, fillColor, lineWidth, cornerRadius){
    PATHBUBBLES.Object2D.call(this);
    this.shape = new PATHBUBBLES.Shape.Rectangle(x, y, w ,h, strokeColor, fillColor, lineWidth, cornerRadius);
    this.name = "bubble";
};
PATHBUBBLES.Bubble.prototype ={
    constructor: PATHBUBBLES.Bubble,
    draw: function(ctx){
        this.shape.draw(ctx);
    },
    contains : function(mx, my)
    {
        return this.shape.contains(mx,my);
    }
};