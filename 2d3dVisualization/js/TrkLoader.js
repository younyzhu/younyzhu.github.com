/**
 * Created by Yongnan on 6/23/2014.
 * This function is used for load trk file: http://trackvis.org/docs/?subsect=fileformat
 */

TrkLoader = function (id) {
    this.id = id;
};
TrkLoader.prototype = {
    constructor: TrkLoader,
    load: function (url, callback) {

        var _this = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        this.createStatus();
        xhr.onreadystatechange = function () {

            if ( xhr.readyState == 4 ) {

                if ( xhr.status == 200 || xhr.status == 0 ) {
                    _this.parse( xhr.response, function(object){
                        callback( object );
                    });
                } else {
                    console.error( 'TrkLoader: Couldn\'t load ' + url + ' (' + xhr.status + ')' );
                }
            }
        };
        xhr.send(null);
    },
    createStatus: function(){
        this.statusDomElement = this.addStatusElement();
        $("#container"+ this.id)[0].appendChild(this.statusDomElement);
    },
    addStatusElement: function () {
        var e = document.getElementById('status');
        if(e === null)
        {
            e = document.createElement( "div" );
            e.id = 'status';
        }
        else
            e.style.display = 'block';
        e.style.position = "absolute";
        e.style.fontWeight = 'bold';
        e.style.top = "50%";
        e.style.fontSize = "1.2em";
        e.style.textAlign = "center";
        e.style.color = "#f00";
        e.style.width = "100%";
        e.style.zIndex = 1000;
        e.innerHTML = "Loading ...";
        return e;
    },
    updateProgress: function ( current, total ) {
        var message = "Complete ";
        total = total -1;// index from 0 - total -1
        if ( total>0 ) {
            message += ( 100 * current / total ).toFixed(0) + "%";
        }
        else if( total === 0)
        {
            message += "1";
        }
        this.statusDomElement.innerHTML = message;
        if( current === total  )
        {
            this.statusDomElement.style.display = 'none';
        }
    },
    parse: function (data, callback) {
        var current_offset = 0;
        var header = this.parseHeader(data, current_offset);
        callback(this.buildGeometry(data, header) );
    },
    buildGeometry: function(data, header)
    {
        var n = header.n_count;//total number of tracks
        var n_s = header.n_scalars;
        var n_p = header.n_properties;
        var current_offset = header.hdr_size;
        var object = new THREE.Object3D();
        var positionminx=Infinity,positionminy=Infinity,positionminz=Infinity;
        var positionmaxx=-Infinity,positionmaxy=-Infinity,positionmaxz=-Infinity;
        for(var i=0; i<n; ++i)
        {
            var tmp = this.parseTrack(data, current_offset, object, n_s, n_p);
            current_offset = tmp.offset;
            object = tmp.object;
            positionminx = Math.min(positionminx, parseFloat(tmp.center.x));
            positionminy = Math.min(positionminy, parseFloat(tmp.center.y));
            positionminz = Math.min(positionminz, parseFloat(tmp.center.z));

            positionmaxx = Math.max(positionmaxx, parseFloat(tmp.center.x));
            positionmaxy = Math.max(positionmaxy, parseFloat(tmp.center.y));
            positionmaxz = Math.max(positionmaxz, parseFloat(tmp.center.z));
            this.updateProgress(i, n-1);  //update progress state
        }
        var center = new THREE.Vector3((positionminx + positionmaxx)/2.0,
                (positionminy + positionmaxy)/2.0, (positionminz + positionmaxz)/2.0);
        object.center = center;
        return object;
    },
    parseTrack: function (data, offset, object, n_s, n_p) {
        var m = this.parseInt32Array(data, offset, 1);
        offset += 4; //1 int
        var n_s_skip;

        var geometry = new THREE.BufferGeometry();
        //var material = new THREE.LineBasicMaterial({ vertexColors: true });

        var grayness = Math.random() * 0.5 + 0.25;
        var material = new THREE.LineBasicMaterial();
        material.color.setRGB(grayness, grayness, grayness);
        material.ColorKeeper = new THREE.Color(grayness, grayness, grayness);
         //r67 r66 has some selection for Trk Loader
        /*geometry.attributes[ 'position' ] = {array: new Float32Array( m * 3 ), itemSize: 3};
        var positions = geometry.getAttribute( 'position' ).array;
        geometry.attributes[ 'color' ] = {array: new Float32Array( m * 3 ), itemSize: 3};
        var colors = geometry.getAttribute( 'color' ).array;
         *///r66
        geometry.addAttribute( 'position', Float32Array, m , 3 );
        //geometry.addAttribute( 'color', Float32Array, m , 3 );
        var positions = geometry.attributes.position.array;
        //var colors = geometry.attributes.color.array;

        var positionminx=Infinity,positionminy=Infinity,positionminz=Infinity;
        var positionmaxx=-Infinity,positionmaxy=-Infinity,positionmaxz=-Infinity;
        for(var i=0; i<m; ++i)
        {
            // positions
            var pointGeo = this.parseFloat32Array(data,offset,3);
            offset += 4 *3; //1 int
            positions[ i * 3 ] = pointGeo[0];
            positions[ i * 3 + 1 ] = pointGeo[1];
            positions[ i * 3 + 2 ] = pointGeo[2];
            positionminx = Math.min(positionminx, parseFloat(pointGeo[0]));
            positionminy = Math.min(positionminy, parseFloat(pointGeo[1]));
            positionminz = Math.min(positionminz, parseFloat(pointGeo[2]));

            positionmaxx = Math.max(positionmaxx, parseFloat(pointGeo[0]));
            positionmaxy = Math.max(positionmaxy, parseFloat(pointGeo[1]));
            positionmaxz = Math.max(positionmaxz, parseFloat(pointGeo[2]));
            n_s_skip = this.parseFloat32Array(data, offset, n_s);
            offset += 4 *n_s; //1 int
            /*
            // colors
            var grayness = Math.random() * 0.5 + 0.25;
            colors[ i * 3 ] = grayness;
            colors[ i * 3 + 1 ] = grayness;
            colors[ i * 3 + 2 ] = grayness;
            */
        }

        this.parseFloat32Array(data, offset, n_p);
        offset += 4 *n_p; //1 int

        var lineMesh = new THREE.Line( geometry, material, THREE.LineStrip );
        var center = new THREE.Vector3((positionminx + positionmaxx)/2.0,
                (positionminy + positionmaxy)/2.0, (positionminz + positionmaxz)/2.0);
        object.add(lineMesh);
        return {offset:offset, object:object, center: center};
    },
    parseHeader: function (data, offset) {
        var metaData = {
            // trk file format: http://trackvis.org/docs/?subsect=fileformat
            id_string: null, /* id_string[6]	char	6*/
            dim: null, /* dim[3]	short int	6 */
            voxel_size: null, /* voxel_size[3]	float	12*/
            origin: null, /* origin[3] 	float	12 */
            n_scalars: 0, /* n_scalars	short int	2 */
            scalar_name: null, /* scalar_name[10][20]	char	200 */
            n_properties: 0, /* n_properties	short int	2 */
            property_name: 0, /* property_name[10][20]	char	200 */
            vox_to_ras: 0, // *vox_to_ras[4][4]	float	64 */
            reserved: 0, // reserved[444]	char	444 */
            voxel_order: 0, // * voxel_order[4]	char	4 */
            pad2: 0, // * pad2[4]	    char	4 */
            image_orientation_patient: 0, // * image_orientation_patient[6]	float	24 */
            pad1: null, // *pad1[2]	char	2 */
            swap_xy: 0, // * swap_xy	unsigned char	1 */
            swap_yz: 0, // * swap_yz	unsigned char	1 */
            swap_zx: 0, // * swap_zx	unsigned char	1 */
            n_count: 0, // *n_count	int	4 */          //number of tracks
            version: 0, // *version	int	4 */
            hdr_size: 0 // * hdr_size	int	4 */
        };

        metaData.id_string = this.parseUChar(data, offset, 6); //[]
        offset += 6; //6 char
        metaData.dim = this.parseUint16Array(data, offset, 3);  //[]
        offset += 3 * 2;  //3 short
        metaData.voxel_size = this.parseFloat32Array(data, offset, 3); //[]
        offset += 3 * 4;  //3 float
        metaData.origin = this.parseFloat32Array(data, offset, 3); //[]
        offset += 3 * 4;  //3 float
        metaData.n_scalars = this.parseUint16Array(data, offset, 1);    //[]
        offset += 2;  //1 short
        metaData.scalar_name = this.parseUCharChar(data, offset, 10, 20); //[]
        offset += 200; //[10][20] char
        metaData.n_properties = this.parseUint16Array(data, offset, 1);    //[]
        offset += 2;  //1 short
        metaData.property_name = this.parseUCharChar(data, offset, 10, 20); //[]
        offset += 200; //[10][20] char
        metaData.vox_to_ras = this.parseFloat32ArrayArray(data, offset, 4, 4); //[]
        offset += 64; //[4][4] float
        metaData.reserved = this.parseUChar(data, offset, 444); //[]
        offset += 444; //444 char
        metaData.voxel_order = this.parseUChar(data, offset, 4); //[]
        offset += 4; //4 char
        metaData.pad2 = this.parseUChar(data, offset, 4); //[]
        offset += 4; //4 char
        metaData.image_orientation_patient = this.parseFloat32Array(data, offset, 6); //[]
        offset += 24; //6 float
        metaData.pad1 = this.parseUChar(data, offset, 2); //[]
        offset += 2; //2 char
        metaData.invert_x = this.parseUChar(data, offset, 1);  //[]
        offset += 1; //1 unsigned char
        metaData.invert_y = this.parseUChar(data, offset, 1);  //[]
        offset += 1;  //1 unsigned char
        metaData.invert_z = this.parseUChar(data, offset, 1);  //[]
        offset += 1;  //1 unsigned char
        metaData.swap_xy = this.parseUChar(data, offset, 1);  //[]
        offset += 1; //1 unsigned char
        metaData.swap_yz = this.parseUChar(data, offset, 1);  //[]
        offset += 1;  //1 unsigned char
        metaData.swap_zx = this.parseUChar(data, offset, 1);  //[]
        offset += 1;  //1 unsigned char
        metaData.n_count = this.parseUint32Array(data, offset, 1);
        offset += 4;  //1 int
        metaData.version = this.parseUint32Array(data, offset, 1);
        offset += 4;  //1 int
        metaData.hdr_size = this.parseUint32Array(data, offset, 1);
        offset += 4;  //1 int
        return metaData;
    },

    parseUCharChar: function (data, offset, length1, length2) {  //[length1][length2]
        var charArray = new Uint8Array(data.slice(offset, offset + length2 * length1));
        var text = "";
        for (var i = 0; i < length1; i++)
            for(var j = 0; j < length2; j++ )
                text += String.fromCharCode(charArray[ i*length2 +j ]);
        return text;
    },
    // Array(data, offset, num) offset begin with Byte type
    parseUChar: function (data, offset, length) {
        var charArray = new Uint8Array(data.slice(offset, offset + length));
        var text = "";
        for (var i = 0; i < length; i++) {
            text += String.fromCharCode(charArray[ i ]);
        }
        return text;
    },
    parseIChar: function (data, offset, length) {
        var charArray = new Int8Array(data.slice(offset, offset + length));
        var text = "";
        for (var i = 0; i < length; i++) {
            text += String.fromCharCode(charArray[ i ]);
        }
        return text;
    },
    parseUint8Array: function (data, offset, length) {
        //var uint8Array = new Uint8Array(data, offset, length);
        var uint8Array = new Uint8Array(data.slice(offset, offset + length)); //1*length
        if (length === 1)
            return uint8Array[0];
        else
            return uint8Array;
    },
    parseInt8Array: function (data, offset, length) {
        var int8Array = new Int8Array(data.slice(offset, offset + length));
        if (length === 1)
            return int8Array[0];
        else
            return int8Array;
    },
    parseUint16Array: function (data, offset, length) {
        var uint16Array = new Uint16Array(data.slice(offset, offset + length * 2));
        if (length === 1)
            return uint16Array[0];
        else
            return uint16Array;
    },
    parseInt16Array: function (data, offset, length) {
        var int16Array = new Int16Array(data.slice(offset, offset + length * 2));
        if (length === 1)
            return int16Array[0];
        else
            return int16Array;
    },
    parseFloat32ArrayArray: function (data, offset, length1, length2) {        //[length1][length2]
        //var uint32Array = new Uint32Array(data, offset, 1);
        var uint32Array = new Float32Array(data.slice(offset, offset + 4 * length1 * length2));
        return uint32Array;

    },
    parseUint32Array: function (data, offset, length) {
        //var uint32Array = new Uint32Array(data, offset, 1);
        var uint32Array = new Uint32Array(data.slice(offset, offset + 4 * length));
        if (length === 1)
            return uint32Array[0];
        else
            return uint32Array;

    },
    parseInt32Array: function (data, offset, length) {
        var int32Array = new Int32Array(data.slice(offset, offset + 4 * length));
        if (length === 1)
            return int32Array[0];
        else
            return int32Array;
    },
    parseFloat32Array: function (data, offset, length) {
        var float32Array = new Float32Array(data.slice(offset, offset + 4 * length));
        if (length === 1)
            return float32Array[0];
        else
            return float32Array;
    },
    parseFloat64Array: function (data, offset, length) {
        var float64Array = new Float64Array(data.slice(offset, offset + 8 * length));
        if (length === 1)
            return float64Array[0];
        else
            return float64Array;
    }
};
