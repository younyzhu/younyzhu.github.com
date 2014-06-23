/**
 * Created by Yongnanzhu on 6/19/2014. Local object Loader
 */

LocalObjectLoader = function (selectFibers, deletedFibers, center, shape) {

    this.center = center || null;
    this.selectedFiber = selectFibers;
    this.deletedFibers = deletedFibers;
    this.renderShape = shape || 'Line';
};
LocalObjectLoader.prototype = {

    constructor: LocalObjectLoader,

    load: function (url, callback) {
        var scope = this;
        checkFileFormat(url.name);
        var reader = new FileReader();
        var progress = $("#progress")[0];
        progress.textContent = "";
        reader.readAsText(url);
        reader.onerror = function () {
            progress.innerHTML = "Could not read file, error code is " + reader.error.code;
        };
        var load = 0;
        var total = 0;
        reader.onprogress = function (event) {
            if (event.lengthComputable) {
                load = event.loaded;
                total = event.total;
                progress.innerHTML = event.loaded + '/' + event.total;
            }
        };

        reader.onload = function () {
            var tempdata = "";
            tempdata = reader.result;
            if (tempdata != null && load == total) {
                callback( scope.parse(tempdata) );
            }
        };
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
        var FA = [];
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
                var sum = 0.0;
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
                    sum += parseFloat(vals[4]); //color (1,FA,FA)
                }
                sum /= vertexPosition.length;
                //FA.push( sum );
                if (this.renderShape === 'Line') {
                    var grayness = Math.random() * 0.5 + 0.25;
                    var material = new THREE.LineBasicMaterial();
                    material.color.setRGB(grayness, grayness, grayness);
                    material.ColorKeeper = new THREE.Color(grayness, grayness, grayness);
                    var line = new THREE.Line(geometry, material, THREE.LineStrip);
                    line.name = i; //This is to recode which line is selected.
                    line.FA = sum;
                    object.add(line);
                }
                else if (this.renderShape === 'Ribbon') {
                    var ribbongeometry = new RibbonGeometry(vertexPosition, 1, vertexColor);
                    var ribbonmaterial = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors, side: THREE.DoubleSide});
                    var mesh = new THREE.Mesh(ribbongeometry, ribbonmaterial);
                    mesh.FA = sum;
                    object.add(mesh);
                }
                else if (this.renderShape === 'Tube') {
                    var tubegeometry = new TubeGeometry(
                        vertexPosition,
                            vertexPosition.length - 1,
                        0.5,
                        6,
                        false,
                        vertexColor
                    );
                    var tubematerial = new THREE.ShaderMaterial({ vertexShader: fiberShader["custom_phong"].vertexShader,
                        fragmentShader: fiberShader["custom_phong"].fragmentShader,
                        uniforms: fiberShader["custom_phong"].uniforms, vertexColors: THREE.VertexColors, lights: true });

                    var tubemesh = new THREE.Mesh(tubegeometry, tubematerial);
                    tubemesh.castShadow = true;
                    tubemesh.receiveShadow = true;
                    tubemesh.FA = sum;
                    object.add(tubemesh);
                }
            }
            startNum += parseInt(totalVertexNum) + 1;
        }
        if (this.center === null)
            this.center = new THREE.Vector3((positionminx + positionmaxx) / 2.0,
                    (positionminy + positionmaxy) / 2.0, (positionminz + positionmaxz) / 2.0);
        object.center = this.center;//Need remember the center of object
        return object;
        /*
         if(FA.length !== 0)
         {
         object.FA = FA;
         } */
        //return object;
    }

};

