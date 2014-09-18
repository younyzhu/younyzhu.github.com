/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/17/2014
 * @name        PathBubble_Biomolecule
 */
PATHBUBBLES.Biomolecule = PATHBUBBLES.Biomolecule|| {};

PATHBUBBLES.Biomolecule.Complex = function(x, y, text){
    PATHBUBBLES.Object2D.call(this);
    this.type = "Complex";
    this.shape = new PATHBUBBLES.Shape.Rectangle(x, y, 15 ,6, "#C2C2C2", "#FFE2B7", 1, 0);
    this.name = text;
    this.parentObject = null;
};

PATHBUBBLES.Biomolecule.Complex.prototype = Object.create( PATHBUBBLES.Biomolecule.Complex.prototype );

PATHBUBBLES.Biomolecule.Complex.prototype = {
    constructor: PATHBUBBLES.Biomolecule.Complex,
    draw: function(ctx){
        if(this.parentObject)
        {
            this.shape.offsetX = this.parentObject.shape.x;
            this.shape.offsetY = this.parentObject.shape.y;
        }
        this.shape.draw(ctx);
    },
    contains : function(mx, my)
    {
        if(this.parentObject)
        {
            this.shape.offsetX = this.parentObject.shape.x;
            this.shape.offsetY = this.parentObject.shape.y;
        }
        return this.shape.contains(mx,my);
    }
};

