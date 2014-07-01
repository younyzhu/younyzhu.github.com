/**
 * Created by Yongnanzhu on 5/24/2014.
 */

function FiberSelector(selectors)//manage the selectors
{
    //this.state = state||1;  //{ AND: 0, OR: 1}
    this.selectors = selectors;
    this.SelectResults = [];
}
FiberSelector.prototype ={
    constructor: FiberSelector,
    unique: function(tmp)
    {
        var a = [];
        var l = tmp.length;
        for(var i=0; i<l; i++) {
            for(var j=i+1; j<l; j++) {
                if (tmp[i] === tmp[j])
                    j = ++i;
            }
            a.push(tmp[i]);
        }
        return a;
    },
    //Selector is added one by one, so we could use two arrays to judge the result
    AND_selector: function()
    {
        for (var i = 0; i < this.selectors.length; ++i)
        if(this.selectors[i].needsUpdate === true)
        {
            this.selectors[i].setUpdateState(false);
            var intersect = this.selectors[i].intersects; //return the selected object
            if(intersect.length === 0)
                return;
            if(this.SelectResults.length === 0 && this.selectors.length === 1 )
            {
                this.SelectResults = intersect;
                return;
            }
            var first = this.SelectResults;
            var tmp = [];
            for(var j= 0,l = first.length; j<l; j++)
            {
                for(var k= 0, l2 = intersect.length; k<l2; k++)
                {
                    if (first[j].object.id === intersect[k].object.id)
                        tmp.push(intersect[k]);
                }
            }
            this.SelectResults = tmp;
        }
    },
    OR_selector: function() {
        for (var i = 0; i < this.selectors.length; ++i) {
            var intersect = this.selectors[i].intersects; //return the selected object
            if (intersect.length === 0 || this.selectors[i].needsUpdate === false)
                continue;
            for (var k = 0, l2 = intersect.length; k < l2; k++) {
                this.SelectResults.push(intersect[k]);
            }
            this.selectors[i].setUpdateState(false);
        }
        if (this.selectors.length)
            this.unique(this.SelectResults);
    },

    updateSelectResult: function(state)
    {
        if(this.selectors.length === 0)
            return;
        if(state ==="AND")//AND
        {
            this.AND_selector();
        }
        else if(state ==="OR")//OR
        {
            this.OR_selector();
        }
    }
};
function SphereSelector(sphere, needupdate)
{
    this.sphere = sphere;//This is a sphere selector
    this.needsUpdate = needupdate ||true; // If we change the position of selector, we need to update the selector

    this.intersects =[];
}
SphereSelector.prototype = {
    constructor: SphereSelector,
    setUpdateState: function(flag)
    {
        this.needsUpdate = flag;
        if(flag)
            this.intersects.length = 0;
    },
    pointInsideSelectorSphere: function (point)
    {
        return ( point.distanceTo( this.sphere.position ) - this.sphere.geometry.radius ) <= 0;
    },
    sphereInteractSphere: function(sphere1, sphere2)
    {
        return (sphere1.geometry.boundingSphere.center.distanceTo( sphere2.center )- sphere2.radius - sphere1.geometry.boundingSphere.radius) <= 0;
    },
    intersectObject : function ( object, intersects )
    {
        if ( object instanceof THREE.Line )
        {
            var geometry = object.geometry;
            var center = object.parent.center;
            //store the obj center in the load code (GeometryLoader)
            //spend a day to find this bug, I do not think this would be a problem at first.
            if ( geometry instanceof THREE.Geometry ) {

                var vertices = geometry.vertices;
                var nbVertices = vertices.length;
                var step = object.type === THREE.LineStrip ? 1 : 2;


                for ( var i = 0; i < nbVertices - 1; i = i + step )
                {
                    var tmp = new THREE.Vector3();
                    tmp.subVectors(vertices[i],center );
                    if (this.pointInsideSelectorSphere( tmp ))
                    {
                        intersects.push( {object: object} );

                        break;
                    }
                }
            }
        }
    },

    intersectDescendants : function ( object, intersects )
    {
        /*
        var descendants = object.getDescendants();

        for ( var i = 0, l = descendants.length; i < l; i ++ ) {

            this.intersectObject( descendants[ i ],  intersects );

        } */

        var childs = object.children;
        for(var i = 0; i < childs.length; ++i)
        {
            this.intersectObject( childs[ i ],  intersects );
        }
    },
    intersectObjects : function ( objects, recursive )
    {
        if(this.needsUpdate)
        {
            var intersects = [];
            for (var i = 0, l = objects.length; i < l; i++)
            {
                this.intersectObject(objects[ i ], intersects);
                if ( recursive === true ) {

                    this.intersectDescendants( objects[ i ], intersects );

                }
            }
            this.intersects = intersects;
            //return intersects;
            var flag = false;
            if(this.intersects.length >0)
                flag= true;
                return flag;
        }
    }
};
