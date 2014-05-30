/**
 * Created by Yongnanzhu on 4/12/2014.
 */

GeometryLoader = function (manager, selectFibers, deletedFibers, center, shape) {

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

    this.center = center || null;
    this.selectedFiber = selectFibers;
    this.deletedFibers = deletedFibers;
    this.renderShape = shape||'Line';
};
GeometryLoader.prototype = {

    constructor: GeometryLoader,

    load: function (url, onLoad, onProgress, onError) {
        var scope = this;
        var loader = new THREE.XHRLoader();
        loader.setCrossOrigin(this.crossOrigin);
        loader.load(url, function (text) {
            onLoad(scope.parse(text));
        });
    },

    parse: function (text) {
        var lines = text.split("\n");
        var totalFiberNum = lines[0];
        var startNum = 1;
        var object = new THREE.Object3D();
        var positionminx = 200, positionminy = 200, positionminz = 200;
        var positionmaxx = -200, positionmaxy = -200, positionmaxz = -200;
        //  If...
        //  this.selectedFiber = null;
        //  this.deletedFibers = null;  //The model has not been refined
        //  Or
        //  this.selectedFiber = [];
        //  this.deletedFibers = []; //The model has been refined, and one of the array.length > 0;

        for (var i = 0; i < totalFiberNum; i++) {
            var flag = true;
            if (this.selectedFiber === null && this.deletedFibers === null) {
                flag = true;
            }
            else {
                flag = false;
                if (this.selectedFiber.length !== 0)
                //when we select fibers, there is no need to consider the deleted fibers,
                //because I have already excluded the deleted fibers for selecting.
                {
                    for (var k = 0; k < this.selectedFiber.length; ++k)
                        if (i === this.selectedFiber[k]) {
                            flag = true;
                            break;
                        }
                }
                if (this.selectedFiber.length === 0 && this.deletedFibers.length !== 0) {
                    for (k = 0; k < this.deletedFibers.length; ++k)
                        if (i !== this.deletedFibers[k]) {
                            flag = true;
                            break;
                        }
                }

            }

            var totalVertexNum = lines[startNum];
            if (flag) {
                var geometry = new THREE.Geometry();
                var vertexPosition = [];
                var vertexColor = [];
                for (var j = 1; j <= totalVertexNum; j += 2) {
                    var vals = lines[startNum + j].split(/\s+/);
                    geometry.vertices.push(new THREE.Vector3(parseFloat(vals[0]), parseFloat(vals[1]), parseFloat(vals[2])));
                    vertexPosition.push(new THREE.Vector3(parseFloat(vals[0]), parseFloat(vals[1]), parseFloat(vals[2])));
                    positionminx = Math.min(positionminx, parseFloat(vals[0]));
                    positionminy = Math.min(positionminy, parseFloat(vals[1]));
                    positionminz = Math.min(positionminz, parseFloat(vals[2]));

                    positionmaxx = Math.max(positionmaxx, parseFloat(vals[0]));
                    positionmaxy = Math.max(positionmaxy, parseFloat(vals[1]));
                    positionmaxz = Math.max(positionmaxz, parseFloat(vals[2]));

                    geometry.colors.push(new THREE.Vector3(parseFloat(vals[3]), parseFloat(vals[4]), parseFloat(vals[5])));
                    vertexColor.push(new THREE.Vector3(parseFloat(vals[3]), parseFloat(vals[4]), parseFloat(vals[5])));
                }
                if(this.renderShape === 'Line')
                {
                    var grayness = Math.random() * 0.5 + 0.25;
                    var material = new THREE.LineBasicMaterial();
                    material.color.setRGB(grayness, grayness, grayness);
                    material.grayness = grayness; // *** NOTE THIS
                    var line = new THREE.Line(geometry, material, THREE.LineStrip);
                    line.name = i; //This is to recode which line is selected.
                    object.add(line);
                }
                else if(this.renderShape === 'Ribbon')
                {
                    var ribbongeometry = new RibbonGeometry(vertexPosition, 1, vertexColor);
                    var ribbonmaterial = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors,side:THREE.DoubleSide});
                    var mesh = new THREE.Mesh( ribbongeometry, ribbonmaterial );
                    object.add( mesh );
                }
            }
            startNum += parseInt(totalVertexNum) + 1;
        }
        if (this.center === null)
            this.center = new THREE.Vector3((positionminx + positionmaxx) / 2.0,
                    (positionminy + positionmaxy) / 2.0, (positionminz + positionmaxz) / 2.0);
        object.center = this.center;//Need remember the center of object
        return object;
    }

};

