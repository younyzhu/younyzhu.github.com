/**
 * Created by Yongnanzhu on 5/24/2014.
 */

function FiberSelector(selectors)//manage the selectors
{
    //this.state = state||1;  //{ AND: 0, OR: 1}
    this.selectors = selectors;
    this.SelectResults = [];
    this.deletedFibers = [];
    this.UPDATE = false;
}
FiberSelector.prototype = {
    constructor: FiberSelector,
    unique: function (tmp) {
        var a = [];
        var l = tmp.length;
        for (var i = 0; i < l; i++) {
            for (var j = i + 1; j < l; j++) {
                if (tmp[i] === tmp[j])
                    j = ++i;
            }
            a.push(tmp[i]);
        }
        return a;
    },
    Logic_AND: function (first, second) {
        var tmp = [];
        for (var j = 0, l = first.length; j < l; j++) {
            for (var k = 0, l2 = second.length; k < l2; k++) {
                if (first[j].object.id === second[k].object.id)
                    tmp.push(second[k]);
            }
        }
        return tmp;
    },

    AND_selector: function () {
        for (var i = 0; i < this.selectors.length; ++i)
            if (this.selectors[i].needsUpdate === true) {
                this.UPDATE = true;
                break;
            }
        if (this.UPDATE) {
            var flag = true;
            var tmp = [];
            for (i = 0; i < this.selectors.length; ++i) {
                if (this.selectors[i].length === 0)
                    continue;
                var intersects = this.selectors[i].intersects;
                if (flag) {
                    tmp = intersects;
                    flag = false;
                    continue;
                }
                tmp = this.Logic_AND(tmp, intersects);
                this.selectors[i].setUpdateState(false);
            }
            this.SelectResults = tmp;
            this.UPDATE = false;
        }
        //this.unique(this.SelectResults);
    },
    OR_selector: function () {
        for (var i = 0; i < this.selectors.length; ++i)
            if (this.selectors[i].needsUpdate === true)
            {
                this.UPDATE = true;
                break;
            }
        if(this.UPDATE)
        {
            var flag = true;
            this.SelectResults.length =0;
            for (i = 0; i < this.selectors.length; ++i) {
                if (this.selectors[i].length === 0)
                    continue;
                var intersects = this.selectors[i].intersects;
                if (flag) {
                    this.SelectResults = intersects;
                    flag = false;
                    continue;
                }
                for (var k = 0, l2 = intersects.length; k < l2; k++) {
                    this.SelectResults.push(intersects[k]);
                }
                this.selectors[i].setUpdateState(false);
            }
            this.UPDATE = false;
            if (this.SelectResults.length >1)
                this.unique(this.SelectResults);
        }
    },

    Delete_selector: function () {
        for (var i = 0; i < this.selectors.length; ++i)
            if (this.selectors[i].needsUpdate === true)
            {
                this.UPDATE = true;
                break;
            }
        if(this.UPDATE)
        {
            var flag = true;

            for (i = 0; i < this.selectors.length; ++i) {
                if (this.selectors[i].length === 0)
                    continue;
                var intersects = this.selectors[i].intersects;
                if (flag && this.deletedFibers.length === 0) {
                    this.deletedFibers = intersects;
                    flag = false;
                    continue;
                }
                for (var k = 0, l2 = intersects.length; k < l2; k++) {
                    this.deletedFibers.push(intersects[k]);
                }
                this.selectors[i].setUpdateState(false);
            }
            this.UPDATE = false;
            if (this.deletedFibers.length >1)
                this.unique(this.deletedFibers);
        }
    },

    updateSelectResult: function (state) {
        if (this.selectors.length === 0)
            return;
        if (state === "AND")//AND
        {
            this.AND_selector();
        }
        else if (state === "OR")//OR
        {
            this.OR_selector();
        }
        else if (state === "DELETE")//OR
        {
            this.Delete_selector();
        }
    }
};
function SphereSelector(sphere, needupdate) {
    this.sphere = sphere;//This is a sphere selector
    this.needsUpdate = needupdate || true; // If we change the position of selector, we need to update the selector

    this.intersects = [];

    //this.deletedFibers = [];// This parameter is from class FiberSelector, if we have already deleted some fibers, we should not calculate the intersection between the selectors and fibers
}
SphereSelector.prototype = {
    constructor: SphereSelector,
    setSphere: function(sphere){
        this.sphere = sphere;
    },
    setUpdateState: function (flag) {
        this.needsUpdate = flag;
        if (flag)
            this.intersects.length = 0;
    },
    pointInsideSelectorSphere: function (point) {
        return ( point.distanceTo(this.sphere.position) - this.sphere.geometry.radius ) <= 0;
    },
    sphereInteractSphere: function (sphere1, sphere2) {
        return (sphere1.geometry.boundingSphere.center.distanceTo(sphere2.center) - sphere2.radius - sphere1.geometry.boundingSphere.radius) <= 0;
    },
    intersectObject: function (object, intersects) {
        if (object instanceof THREE.Line) {
            var geometry = object.geometry;
            var center = object.parent.center;
            //store the obj center in the load code (GeometryLoader)
            //spend a day to find this bug, I do not think this would be a problem at first.
            if (geometry instanceof THREE.Geometry) {

                var vertices = geometry.vertices;
                var nbVertices = vertices.length;
                var step = object.type === THREE.LineStrip ? 1 : 2;


                for (var i = 0; i < nbVertices - 1; i = i + step) {
                    var tmp = new THREE.Vector3();
                    tmp.subVectors(vertices[i], center);
                    if (this.pointInsideSelectorSphere(tmp)) {
                        intersects.push({object: object});
                        break;
                    }
                }
            }
        }
    },

    intersectDescendants: function (object, intersects) {
        /*
         var descendants = object.getDescendants();

         for ( var i = 0, l = descendants.length; i < l; i ++ ) {

         this.intersectObject( descendants[ i ],  intersects );

         } */

        var childs = object.children;
        for (var i = 0; i < childs.length; ++i) {
            this.intersectObject(childs[ i ], intersects);
        }
        /*
        //if we have already deleted some fibers, we should not calculate the intersection between the selectors and fibers
        var childs = object.children;
        if(fiberSelector.deletedFibers.length === 0)
        {
            for (var i = 0; i < childs.length; ++i) {
                this.intersectObject(childs[ i ], intersects);
            }
        }
        else
        {
            for (i = 0; i < childs.length; ++i) {
                var flag = true;
                for(var j=0; j< fiberSelector.deletedFibers.length; ++j)
                {
                    if(childs[i].id === fiberSelector.deletedFibers[j].object.id)
                    {
                        flag = false;
                        break;
                    }
                }
                if(flag)
                    this.intersectObject(childs[ i ], intersects);
            }
        } */
    },
    intersectObjects: function (objects, recursive) {
        if (this.needsUpdate) {
            var intersects = [];
            for (var i = 0, l = objects.length; i < l; i++) {
                this.intersectObject(objects[ i ], intersects);
                if (recursive === true) {

                    this.intersectDescendants(objects[ i ], intersects);

                }
            }
            this.intersects = intersects;
            //return intersects;
            var flag = false;
            if (this.intersects.length > 0)
                flag = true;
            return flag;
        }
    }
};
