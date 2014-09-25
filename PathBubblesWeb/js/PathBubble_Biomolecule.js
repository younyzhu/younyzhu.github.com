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
    this.x = this.shape.x;
    this.y = this.shape.y;
    this.name = text;
};

PATHBUBBLES.Biomolecule.Complex.prototype = Object.create( PATHBUBBLES.Biomolecule.Complex.prototype );

PATHBUBBLES.Biomolecule.Complex.prototype = {
    constructor: PATHBUBBLES.Biomolecule.Complex,
    draw: function(ctx){
        this.setOffset();
        this.shape.draw(ctx);
    },
    setOffset: function(){
        if(this.parent!==undefined)
        {
            this.offsetX = this.parent.offsetX + this.parent.x;
            this.offsetY = this.parent.offsetY + this.parent.y;
        }
        else
        {
            this.offsetX = 0;
            this.offsetY = 0;
        }

        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
        this.shape.x = this.x;
        this.shape.y = this.y;
    },
    contains : function(mx, my)
    {
        this.setOffset();
        return this.shape.contains(mx,my);
    }
};

