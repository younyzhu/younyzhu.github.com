/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/16/2014
 * @name        PathBubble_scene
 */
//A management class to manage objects inside the scene
PATHBUBBLES.Scene = function(){
    PATHBUBBLES.Object2D.call(this);
    this.type = "Scene";
    this.__objectsAdded = [];
    this.__objectsRemoved = [];
};
PATHBUBBLES.Scene.prototype = Object.create( PATHBUBBLES.Scene.prototype );

PATHBUBBLES.Scene.prototype ={
    addObject : function(object){
        object.parentObject = this;
        if(PATHBUBBLES.objects.indexOf(object)==-1)
            PATHBUBBLES.objects.push(object);
        var index = this.children.indexOf(object);

        if (index > -1) {
            this.children.splice(index, 1);
        }
        this.children.push(object);

        this.__objectsAdded.push( object );
        // check if previously removed
        var i = this.__objectsRemoved.indexOf( object );
        if ( i !== - 1 ) {
            this.__objectsRemoved.splice( i, 1 );
        }
        for ( var c = 0; c < object.children.length; c ++ ) {
            this.addObject( object.children[ c ] );
        }
    },
    removeObject : function(object){
        this.__objectsRemoved.push( object );
        var index = PATHBUBBLES.objects.indexOf(object);
        if(index !== -1)
        {
            PATHBUBBLES.objects.splice(index, 1);
        }

        var index = this.children.indexOf(object);
        if(index !== -1)
        {
            this.children.splice(index, 1);
        }
        var i = this.__objectsAdded.indexOf( object );
        if ( i !== - 1 ) {
            this.__objectsAdded.splice( i, 1 );
        }
        for ( var c = 0; c < object.children.length; c ++ ) {
            this.removeObject( object.children[ c ] );
        }
    }
};

