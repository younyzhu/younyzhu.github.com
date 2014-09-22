/**
 * Created by Yongnanzhu on 4/12/2014.
 */
/**
 * @author mrdoob / http://mrdoob.com/
 */

GeometryLoader = function ( manager ) {

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
    //----------------------------------
    this.center = null;
    //-----------------------------------
};
GeometryLoader.prototype = {

    constructor: GeometryLoader,

    load: function ( url, onLoad, onProgress, onError ) {

        var scope = this;

        var loader = new THREE.XHRLoader();
        loader.setCrossOrigin( this.crossOrigin );
        loader.load( url, function ( text ) {

            onLoad( scope.parse( text  ) );

        } );

    },

    parse: function ( text ) {
        var lines = text.split("\n");
        var totalFiberNum = lines[0];
        var startNum=1;

        var object = new THREE.Object3D();
        var material;
        var line;
        //-------------------------------
        var positionminx=200,positionminy=200,positionminz=200;
        var positionmaxx=-200,positionmaxy=-200,positionmaxz=-200;
        //------------------------------
        for(var i=0;i<totalFiberNum;i++)
        {
            var geometry = new THREE.Geometry();
            var totalVertexNum = lines[startNum];
            //var vertexPosition = [];
            //var vertexColor = [];
            for(var j = 1;j<=totalVertexNum;j+=2)
            {
                var vals = lines[startNum+j].split(/\s+/);
                geometry.vertices.push( new THREE.Vector3( parseFloat(vals[0]), parseFloat(vals[1]), parseFloat(vals[2]) ) );
                positionminx = Math.min(positionminx, parseFloat(vals[0]));
                positionminy = Math.min(positionminy, parseFloat(vals[1]));
                positionminz = Math.min(positionminz, parseFloat(vals[2]));

                positionmaxx = Math.max(positionmaxx, parseFloat(vals[0]));
                positionmaxy = Math.max(positionmaxy, parseFloat(vals[1]));
                positionmaxz = Math.max(positionmaxz, parseFloat(vals[2]));

                geometry.colors.push( new THREE.Vector3( parseFloat(vals[3]), parseFloat(vals[4]), parseFloat(vals[5]) ) );
            }
            this.center = new THREE.Vector3((positionminx + positionmaxx)/2.0,
                    (positionminy + positionmaxy)/2.0, (positionminz + positionmaxz)/2.0);

            //geometry = new LineGeometry(vertexPosition,vertexColor);
            geometry.name = i;
            var grayness = Math.random() * 0.5 + 0.25;
            material = new THREE.LineBasicMaterial();
            material.color.setRGB( grayness, grayness, grayness );
            material.grayness = grayness; // *** NOTE THIS
            line = new THREE.Line( geometry, material,THREE.LineStrip );

            object.add( line );

            startNum+=parseInt(totalVertexNum)+1;
        }
        object.center = this.center;
        return object;
    }

};

