/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/17/2014
 * @name        PathBubble_groups
 */
PATHBUBBLES.Groups = function()
{
    PATHBUBBLES.Object2D.call(this);
    this.path = new PATHBUBBLES.Shape.Path("#0000ff", "#ffffff",10);
    this.type = "Group";
    this.arranged = [];

};
PATHBUBBLES.Groups.prototype = {
    constructor: PATHBUBBLES.Groups,
    addToGroup: function(object)
    {
        if (object)
        {
            this.arranged.length = 0;
            for(var i=0; i< this.children.length; ++i)
            {
                if(this.detectOverlap(this.children[i], object))
                {
                    break;
                }
            }

        }
        return this;
    },
    detectOverlap: function(object1, object2){
        return (object1.x < object2.x + object2.w &&
            object1.x + object1.w > object2.x &&
            object1.y < object2.y + object2.h &&
            object1.h + object1.y > object2.y) ||
            (object2.x < object1.x + object1.w &&
            object2.x + object2.w > object1.x &&
            object2.y < object1.y + object1.h &&
            object2.h + object2.y > object1.y);
    },
    upGroup: function(object){

    },
    draw: function(ctx){

    }

};
