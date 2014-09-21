/**
 * Created by Yongnanzhu on 5/24/2014.
 */
function FiberSelector(id, selectors)//manage the selectors
{
    this.id = id;
    //this.state = state||1;  //{ AND: 0, OR: 1}
    this.selectors = selectors;
    this.selectedFibers = [];
    this.deletedFibers = [];

    this.UPDATE = false;
}
FiberSelector.prototype = {
    constructor: FiberSelector,
    getRefineFiberId: function () {
        var selectedFibersId = [];//Id
        var deletedFibersId = [];//Id
        for (var i = 0; i < this.selectedFibers.length; ++i) {
            selectedFibersId.push(parseInt(this.selectedFibers[i].object.name));
        }

        for (i = 0; i < this.deletedFibers.length; ++i) {
            deletedFibersId.push(parseInt(this.deletedFibers[i].object.name));
        }
        //we need to consider the input deleted fibers
        if (Bubbles[this.id].deletedFibers !== null) {
            for (i = 0; i < Bubbles[this.id].deletedFibers.length; ++i) {
                deletedFibersId.push(Bubbles[this.id].deletedFibers[i]);
            }
        }
        return {selectedFibersId: selectedFibersId, deletedFibersId: deletedFibersId };
    },
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
                    this.selectors[i].setUpdateState(false);
                    continue;
                }
                this.selectors[i].setUpdateState(false);
                tmp = this.Logic_AND(tmp, intersects);
            }
            this.selectedFibers = tmp;
            if(Charts)
            {
                Charts.updateChart();
            }
            this.UPDATE = false;
        }
        //this.unique(this.selectedFibers);
    },
    OR_selector: function () {
        for (var i = 0; i < this.selectors.length; ++i)
            if (this.selectors[i].needsUpdate === true) {
                this.UPDATE = true;
                break;
            }
        if (this.UPDATE) {
            var flag = true;
            this.selectedFibers.length = 0;
            for (i = 0; i < this.selectors.length; ++i) {
                if (this.selectors[i].length === 0)
                    continue;
                var intersects = this.selectors[i].intersects;

                if (flag) {
                    this.selectedFibers = intersects;
                    flag = false;
                    this.selectors[i].setUpdateState(false);
                    continue;
                }
                this.selectors[i].setUpdateState(false);
                for (var k = 0, l2 = intersects.length; k < l2; k++) {
                    this.selectedFibers.push(intersects[k]);
                }
            }
            if(Charts)
            {
                Charts.updateChart();
            }
            this.UPDATE = false;
            if (this.selectedFibers.length > 1)
                this.unique(this.selectedFibers);
        }
    },

    Delete_selector: function () {
        for (var i = 0; i < this.selectors.length; ++i)
            if (this.selectors[i].needsUpdate === true) {
                this.UPDATE = true;
                break;
            }
        if (this.UPDATE) {
            var flag = true;

            for (i = 0; i < this.selectors.length; ++i) {
                if (this.selectors[i].length === 0)
                    continue;
                var intersects = this.selectors[i].intersects;

                if (flag && this.deletedFibers.length === 0) {
                    this.deletedFibers = intersects;
                    flag = false;
                    this.selectors[i].setUpdateState(false);
                    continue;
                }
                this.selectors[i].setUpdateState(false);
                for (var k = 0, l2 = intersects.length; k < l2; k++) {
                    this.deletedFibers.push(intersects[k]);
                }
            }
            if(Charts)
            {
                Charts.updateChart();
            }
            this.UPDATE = false;
            if (this.deletedFibers.length > 1)
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
SphereSelector = function (id, sphere, needupdate) {
    this.id = id;
    this.sphere = sphere;//This is a sphere selector
    this.needsUpdate = needupdate || true; // If we change the position of selector, we need to update the selector
    this.updateVoxelSelection = true;
    this.updateLineFA = true;
    this.intersects = []; // This is just to save the intersected fibers
    this.averageFA = null;
    //this.debug = true;
};
SphereSelector.prototype = {
    constructor: SphereSelector,
    setSphere: function (sphere) {
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
                for (var i = 0; i < nbVertices; i = i + step) {
                    var tmp = new THREE.Vector3();
                    tmp.subVectors(vertices[i], center);
                    if (this.pointInsideSelectorSphere(tmp)) {
                        intersects.push({object: object});
                        break;
                    }
                }
            }
            else if (geometry instanceof THREE.BufferGeometry) {
                var position = geometry.attributes.position.array;  //r66
                ///var position = geometry.getAttribute( 'position' ).array;
                var nbVertices = position.length / 3;
                var step = object.type === THREE.LineStrip ? 1 : 2;
                for (var i = 0; i < nbVertices; i = i + step) {  //changed   nbVertices -1 to nbVertices
                    var vertice = new THREE.Vector3(position[3 * i], position[3 * i + 1], position[3 * i + 2]);
                    var tmp = new THREE.Vector3();
                    tmp.subVectors(vertice, center);
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
        /*
         var childs = object.children;
         for (var i = 0; i < childs.length; ++i) {
         this.intersectObject(childs[ i ], intersects);
         }
         */
        //if we have already deleted some fibers, we should not calculate the intersection between the selectors and fibers
        var childs = object.children;
        if (Bubbles[this.id] === null)
            return;
        if (Bubbles[this.id].fiberSelector.deletedFibers.length === 0) {
            for (var i = 0; i < childs.length; ++i) {
                this.intersectObject(childs[ i ], intersects);
            }
        }
        else {
            for (i = 0; i < childs.length; ++i) {
                var flag = true;
                for (var j = 0; j < Bubbles[this.id].fiberSelector.deletedFibers.length; ++j) {
                    if (childs[i].id === Bubbles[this.id].fiberSelector.deletedFibers[j].object.id) {
                        flag = false;
                        break;
                    }
                }
                if (flag)
                    this.intersectObject(childs[ i ], intersects);
            }
        }
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
            this.updateVoxelSelection = true;
            this.updateLineFA = true;
            //return intersects;
            var flag = false;
            if (this.intersects.length > 0)
                flag = true;
            return flag;
        }
    },
    intersectVoxel: function (metadata) {    // Collect the data, if we want to
        if (this.updateVoxelSelection) {
            var center = this.sphere.position;
            var radius = this.sphere.geometry.radius;
            var tmp = new THREE.Vector4(center.x, center.y, center.z, 1.0);
            tmp.applyMatrix4(metadata.xyz_to_ijkMatrix);
            var selectCenter = new THREE.Vector3(tmp.x, tmp.y, tmp.z);
            var sum = 0;
            var count = 0;
            for (var i = 0; i < metadata.dim[1]; ++i)
                for (var j = 0; j < metadata.dim[2]; j++)
                    for (var k = 0; k < metadata.dim[3]; k++) {
                        var pos = new THREE.Vector3(i, j, k);
                        if (pos.distanceTo(selectCenter) <= radius) {
                            //this.selectFromNii.push(metadata.data[ k * metadata.dim[2] * metadata.dim[3] + j * metadata.dim[3] + i ]);
                            var value = metadata.data[ k * metadata.dim[2] * metadata.dim[3] + j * metadata.dim[3] + i ];
                            //console.log("i:"+ i + " j:" + j + " k: " + k);
                            if (value > 0.2)  //As we focus on the white matter, we just throw away gray matter
                            {   /*
                             if(this.debug)
                             {
                             console.log("i:"+ i + " j:" + j + " k: " + k +" value:"+value);
                             this.debug = false;
                             }
                             */
                                sum += value;
                                count++;
                            }
                        }
                    }
            this.averageFA = sum / count;
            this.updateVoxelSelection = false;
        }
    },
    getVoxelFA: function (metadata) {
        if (this.updateLineFA) {
            for (var i = 0; i < this.intersects.length; ++i) {
                if(this.intersects[i].object instanceof THREE.Line)
                {
                    var sum =0.0;
                    var center = Bubbles[this.id].mainCenter;
                    var geometry = this.intersects[i].object.geometry;
                    if(this.intersects[i].object.FA!== undefined)  //If we had already calculated the FA from voxel space, we should not calculate it again.
                        continue;
                    if(geometry instanceof THREE.BufferGeometry)
                    {
                        var positions = geometry.attributes.position.array;
                        var len = positions.length/3;
                        for(var j=0; j< len; ++j)
                        {
                            //http://paulbourke.net/miscellaneous/interpolation/
                            //Vxyz =
                            //V000 (1 - x) (1 - y) (1 - z) +
                            //V100 x (1 - y) (1 - z) +
                            //V010 (1 - x) y (1 - z) +
                            //V001 (1 - x) (1 - y) z +
                            //V101 x (1 - y) z +
                            //V011 (1 - x) y z +
                            //V110 x y (1 - z) +
                            //V111 x y z
                            var tmp = new THREE.Vector3(positions[3*j], positions[3*j +1], positions[3*j +2]);
                            tmp.subVectors(tmp,center);
                            var vertex = new THREE.Vector4(tmp.x, tmp.y, tmp.z, 1.0);
                            vertex.applyMatrix4(metadata.xyz_to_ijkMatrix);
                            var ifloor = Math.floor(vertex.x);
                            var iceil = Math.ceil(vertex.x);
                            var jfloor = Math.floor(vertex.y);
                            var jceil = Math.ceil(vertex.y);
                            var kfloor = Math.floor(vertex.z);
                            var kceil = Math.ceil(vertex.z);

                            var x = vertex.x - ifloor;
                            var y = vertex.y - jfloor;
                            var z = vertex.z - kfloor;

                            if(ifloor<=metadata.dim[1] && jfloor<= metadata.dim[2] && kfloor <= metadata.dim[3])
                                var V000 = metadata.data[ kfloor * metadata.dim[2] * metadata.dim[3] + jfloor * metadata.dim[3] + ifloor ];
                            else
                                var V000=0;
                            var w000 = (1-x)*(1-y)*(1-z);

                            if(iceil<=metadata.dim[1] && jfloor<= metadata.dim[2] && kfloor <= metadata.dim[3])
                                var V100 = metadata.data[ kfloor * metadata.dim[2] * metadata.dim[3] + jfloor * metadata.dim[3] + iceil ];
                            else
                                var V100=0;
                            var w100 = x*(1-y)*(1-z);

                            if(ifloor<=metadata.dim[1] && jceil<= metadata.dim[2] && kfloor <= metadata.dim[3])
                                var V010 = metadata.data[ kfloor * metadata.dim[2] * metadata.dim[3] + jceil * metadata.dim[3] + ifloor ];
                            else
                                var V010=0;
                            var w010 = (1-x)* y *(1-z);

                            if(ifloor<=metadata.dim[1] && jfloor<= metadata.dim[2] && kceil <= metadata.dim[3])
                                var V001 = metadata.data[ kceil * metadata.dim[2] * metadata.dim[3] + jfloor * metadata.dim[3] + ifloor ];
                            else
                                var V001=0;
                            var w001 = (1-x)*(1-y)*z;

                            if(iceil<=metadata.dim[1] && jfloor<= metadata.dim[2] && kceil <= metadata.dim[3])
                                var V101 = metadata.data[ kceil * metadata.dim[2] * metadata.dim[3] + jfloor * metadata.dim[3] + iceil ];
                            else
                                var V101=0;
                            var w101 = x*(1-y)*z;

                            if(ifloor<=metadata.dim[1] && jceil<= metadata.dim[2] && kceil <= metadata.dim[3])
                                var V011 = metadata.data[ kceil * metadata.dim[2] * metadata.dim[3] + jceil * metadata.dim[3] + ifloor ];
                            else
                                var V011=0;
                            var w011 = (1 - x) * y * z;

                            if(iceil<=metadata.dim[1] && jceil<= metadata.dim[2] && kfloor <= metadata.dim[3])
                                var V110 = metadata.data[ kfloor * metadata.dim[2] * metadata.dim[3] + jceil * metadata.dim[3] + iceil ];
                            else
                                var V110=0;
                            var w110 = x* y *(1-z);

                            if(iceil<=metadata.dim[1] && jceil<= metadata.dim[2] && kceil <= metadata.dim[3])
                                var V111 = metadata.data[ kceil * metadata.dim[2] * metadata.dim[3] + jceil * metadata.dim[3] + iceil ];
                            else
                                var V111=0;
                            var w111 = x* y *z;

                            var faValue = V000 * w000 + V100 * w100 + V010 * w010 + V001 * w001 + V101 * w101 + V011 * w011 + V110 * w110 + V111 * w111;
                            sum += faValue;
                        }
                        sum /=len;
                        this.intersects[i].object.FA = sum;
                    }
                }
            }
        }
    }
};
