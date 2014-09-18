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
            if (object.parent !== undefined) {
                object.parent = undefined;
            }
            object.parent = this;

            var index =  this.children.indexOf( object );
            if ( index === - 1 ) {
                if(object instanceof PATHBUBBLES.Groups)
                {
                    for(var i=0; i<object.children.length; ++i)
                    {
                        this.manageSpaceInGroup(object.children[i]);
                        this.children.push(object.children[i]);
                    }
                }
                else if(object instanceof PATHBUBBLES.Bubble)
                {
                    this.manageSpaceInGroup(object);
                    this.children.push(object);
                }

            }
            this.arranged.length = 0;
            for(var i=0; i<this.children.length ; ++i)
            {
                this.manageInsertOne(this.children[i]);
            }
        }
        return this;
    },
    distanceCenters: function(center1, center2){
         return Math.sqrt((center1.x - center2.x) * ( center1.x - center2.x) + (center1.y - center2.y) * (center1.y - center2.y));
    },
    manageSpaceInGroup: function(object){
        var minDistance = Infinity;
        var index = -1;
        if(this.children.length !=0)
           for(var i=0; i< this.children.length ; ++i)
           {
               var distance = this.distanceCenters(object.center, this.children[i].center);
               if(distance < minDistance)
                    index = i;
           }
        if(index!== -1)
        {
            this.children.splice(index+1, 0, object);//insert object into position index;
        }
    },
    manageInsertOne: function(object){
        if(this.arranged.length!==this.children.length)
        {
              if(this.arranged.length ==0)
              {
                  this.arranged.push(object);
              }
              else
              {
                  var minDistance = Infinity;
                  var index = -1;
                  for(var i=0; i<this.arranged.length; ++i)
                  {
                      var distance = this.distanceCenters(object.center, this.arranged[i].center);
                      if(distance < minDistance)
                          index = i;
                  }
                  if( Math.abs(object.center.x - this.arranged[index].center.x) > Math.abs(object.center.y - this.arranged[index].center.y))
                  {
                      if(object.center.x - this.arranged[index].center.x>0)
                           object.shape.y = this.arranged[index].y + this.arranged[index].h;
                      //else
                          //object.shape.y = this.arranged[index].y - this.arranged[index].h;
                  }
                  else
                  {
                      if(object.center.y - this.arranged[index].center.y>0)
                          object.shape.x = this.arranged[index].x + this.arranged[index].w;
                      //else
                          //object.shape.x = this.arranged[index].x - this.arranged[index].w;
                  }
              }
        }
    },
    upGroup: function(object){

    },
    draw: function(ctx){

    }

};
