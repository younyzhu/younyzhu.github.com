/**
 * Created by Yongnan on 6/20/2014.
 * This function is used for load nii formation file
 * Parted of the code is modified from https://github.com/xtk/X/blob/master/io/parserNII.js
 */

NiiLoader = function () {
};
NiiLoader.prototype = {

    constructor: NiiLoader,
    load: function (url, callback) {
        var scope = this;
        var xhr = new XMLHttpRequest();

        function onloaded(event) {
            if (event.target.status === 200 || event.target.status === 0) {
                var geometry = scope.parse(event.target.response || event.target.responseText);
                // scope.dispatchEvent({ type: 'load', content: geometry });
                if (callback)
                    callback(geometry);
            } else {
                //scope.dispatchEvent({ type: 'error', message: 'Couldn\'t load URL [' + url + ']', response: event.target.responseText });
            }
        }

        xhr.addEventListener('load', onloaded, false);
        xhr.addEventListener('progress', function (event) {
            //scope.dispatchEvent({ type: 'progress', loaded: event.loaded, total: event.total });
        }, false);
        xhr.addEventListener('error', function () {
            //scope.dispatchEvent({ type: 'error', message: 'Couldn\'t load URL [' + url + ']' });
        }, false);
        if (xhr.overrideMimeType) xhr.overrideMimeType('text/plain; charset=x-user-defined');
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
    },
    parse: function (data) {
        var current_offset = 0;
        return this.parseHeader(data, current_offset);

    },
    parseHeader: function (data, offset) {
        var metaData = {
            // the nii header fields   http://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1.h
            sizeof_hdr: 0,
            data_type: null, /* !< ++UNUSED++ *//* char data_type[10]; */
            db_name: null, /* !< ++UNUSED++ *//* char db_name[18]; */
            extents: 0, /* !< ++UNUSED++ *//* int extents; */
            session_error: 0, /* !< ++UNUSED++ *//* short session_error; */
            regular: 0, /* !< ++UNUSED++ *//* char regular; */
            dim_info: null, /* !< MRI slice ordering. *//* char hkey_un0; */
            dim: null, // *!< Data array dimensions.*/ /* short dim[8]; */
            intent_p1: 0, // *!< 1st intent parameter. */ /* short unused8; */
            intent_p2: 0, // *!< 2nd intent parameter. */ /* short unused10; */
            intent_p3: 0, // *!< 3rd intent parameter. */ /* short unused12; */
            intent_code: 0, // *!< NIFTI_INTENT_* code. */ /* short unused14; */
            datatype: 0, // *!< Defines data type! */ /* short datatype; */
            bitpix: 0, // *!< Number bits/voxel. */ /* short bitpix; */
            slice_start: 0, // *!< First slice index. */ /* short dim_un0; */
            pixdim: null, // *!< Grid spacings. */ /* float pixdim[8]; */
            vox_offset: 0, // *!< Offset into .nii file */ /* float vox_offset; */
            scl_slope: 0, // *!< Data scaling: slope. */ /* float funused1; */
            scl_inter: 0, // *!< Data scaling: offset. */ /* float funused2; */
            slice_end: 0, // *!< Last slice index. */ /* float funused3; */
            slice_code: null, // *!< Slice timing order. */
            xyzt_units: null, // *!< Units of pixdim[1..4] */
            cal_max: 0, // *!< Max display intensity */ /* float cal_max; */
            cal_min: 0, // *!< Min display intensity */ /* float cal_min; */
            slice_duration: 0, // *!< Time for 1 slice. */ /* float compressed; */
            toffset: 0, // *!< Time axis shift. */ /* float verified; */
            glmax: 0, /* !< ++UNUSED++ *//* int glmax; */
            glmin: 0, /* !< ++UNUSED++ *//* int glmin; */
            descrip: null, // *!< any text you like. */ /* char descrip[80]; */
            aux_file: null, // *!< auxiliary filename. */ /* char aux_file[24]; */
            qform_code: 0, // *!< NIFTI_XFORM_* code. */ /*-- all ANALYZE 7.5 ---*/
            sform_code: 0, // *!< NIFTI_XFORM_* code. */ /* fields below here */
            quatern_b: 0, // *!< Quaternion b param. */
            quatern_c: 0, // *!< Quaternion c param. */
            quatern_d: 0, // *!< Quaternion d param. */
            qoffset_x: 0, // *!< Quaternion x shift. */
            qoffset_y: 0, // *!< Quaternion y shift. */
            qoffset_z: 0, // *!< Quaternion z shift. */
            srow_x: null, // *!< 1st row affine transform. */
            srow_y: null, // *!< 2nd row affine transform. */
            srow_z: null, // *!< 3rd row affine transform. */
            intent_name: null, // *!< 'name' or meaning of data. */
            magic: null, // *!< MUST be "ni1\0" or "n+1\0". */
            //custom data
            data: null,
            ijk_to_xyzMatrix: null,
            xyz_to_ijkMatrix: null,
            min: Infinity,
            max: -Infinity
        };
        metaData.sizeof_hdr = this.parseUint32Array(data, offset, 1);
        offset += 4; //1 int
        metaData.data_type = this.parseUChar(data, offset, 10); //[]
        offset += 10; //10 char
        metaData.db_name = this.parseUChar(data, offset, 18);  //[]
        offset += 18; //18 char
        metaData.extents = this.parseUint32Array(data, offset, 1);
        offset += 4;  //1 int
        metaData.session_error = this.parseUint16Array(data, offset, 1);
        offset += 2;  //1 short
        metaData.regular = this.parseUChar(data, offset, 1);
        offset += 1;  //1 char
        metaData.dim_info = this.parseUChar(data, offset, 1);
        offset += 1;  //1 char
        metaData.dim = this.parseUint16Array(data, offset, 8);    //[]
        offset += 2 * 8;  //1 short
        metaData.intent_p1 = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.intent_p2 = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.intent_p3 = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.intent_code = this.parseUint16Array(data, offset, 1);
        offset += 2;  //1 short
        metaData.data_type = this.parseUint16Array(data, offset, 1);
        offset += 2;  //1 short
        metaData.bitpix = this.parseUint16Array(data, offset, 1);
        offset += 2;  //1 short
        metaData.slice_start = this.parseUint16Array(data, offset, 1);
        offset += 2;  //1 short
        metaData.pixdim = this.parseFloat32Array(data, offset, 8);  //[]
        offset += 4 * 8;  //1 float
        metaData.vox_offset = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.scl_slope = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.scl_inter = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.slice_end = this.parseUint16Array(data, offset, 1);
        offset += 2;  //1 short
        metaData.slice_code = this.parseUChar(data, offset, 1);
        offset += 1;  //1 char
        metaData.xyzt_units = this.parseUChar(data, offset, 1);
        offset += 1;  //1 char
        metaData.cal_max = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.cal_min = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.slice_duration = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.toffset = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.glmax = this.parseUint32Array(data, offset, 1);
        offset += 4;  //1 int
        metaData.glmin = this.parseUint32Array(data, offset, 1);
        offset += 4;  //1 int
        metaData.descrip = this.parseUChar(data, offset, 80); //[]
        offset += 80; //80 char
        metaData.aux_file = this.parseUChar(data, offset, 24); //[]
        offset += 24; //24 char
        metaData.qform_code = this.parseUint16Array(data, offset, 1);
        offset += 2;  //1 short
        metaData.sform_code = this.parseUint16Array(data, offset, 1);
        offset += 2;  //1 short
        metaData.quatern_b = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.quatern_c = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.quatern_d = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.qoffset_x = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.qoffset_y = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.qoffset_z = this.parseFloat32Array(data, offset, 1);
        offset += 4;  //1 float
        metaData.srow_x = this.parseFloat32Array(data, offset, 4);  //[]
        offset += 4 * 4;  //1 float
        metaData.srow_y = this.parseFloat32Array(data, offset, 4);  //[]
        offset += 4 * 4;  //1 float
        metaData.srow_z = this.parseFloat32Array(data, offset, 4);  //[]
        offset += 4 * 4;  //1 float
        metaData.intent_name = this.parseUChar(data, offset, 16); //[]
        offset += 16; //16 char
        metaData.magic = this.parseUChar(data, offset, 4); //[]
        offset += 4; //4 char

        //processing the data
        // number of pixels in the volume
        var volsize = metaData.dim[1] * metaData.dim[2] * metaData.dim[3];
        offset = metaData.vox_offset;  //352
        // scan the pixels regarding the data type
        switch (metaData.data_type) {
            case 2:
                // unsigned char
                metaData.data = this.parseUint8Array(data, offset, volsize);
                break;
            case 4:
                // signed short
                metaData.data = this.parseInt16Array(data, offset, volsize);
                break;
            case 8:
                // signed int
                metaData.data = this.parseInt32Array(data, offset, volsize);
                break;
            case 16:       //our dataset is just float
                // float
                metaData.data = this.parseFloat32Array(data, offset, volsize);
                break;
            case 32:
                // complex
                metaData.data = this.parseFloat64Array(data, offset, volsize);
                break;
            case 64:
                // double
                metaData.data = this.parseFloat64Array(data, offset, volsize);
                break;
            case 256:
                // signed char
                metaData.data = this.parseIChar(data, offset, volsize);
                break;
            case 512:
                // unsigned short
                metaData.data = this.parseUint16Array(data, offset, volsize);
                break;
            case 768:
                // unsigned int
                metaData.data = this.parseUint32Array(data, offset, volsize);
                break;

            default:
                throw new Error('Unsupported NII data type: ' + metaData.data_type);
        }
        //As from our dataset, it is 4 we use Method 3 from the document: http://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1.h
        if (metaData.sform_code > 0) {
            metaData.ijk_to_xyzMatrix = new THREE.Matrix4();
            metaData.ijk_to_xyzMatrix.set(
                metaData.srow_x[0], metaData.srow_x[1], metaData.srow_x[2], metaData.srow_x[3],
                metaData.srow_y[0], metaData.srow_y[1], metaData.srow_y[2], metaData.srow_y[3],
                metaData.srow_z[0], metaData.srow_z[1], metaData.srow_z[2], metaData.srow_z[3],
                0, 0, 0, 1
            );
            metaData.xyz_to_ijkMatrix = new THREE.Matrix4();
            metaData.xyz_to_ijkMatrix.getInverse(metaData.ijk_to_xyzMatrix);
        }
        /*
        var minmax = this.getMinMax(metaData.data);
        metaData.min = minmax.min;
        metaData.max = minmax.max;
        console.log("Min:" + metaData.min);
        console.log("Max:" + metaData.max);  */
        return metaData;

        /* //just for debug
         console.log("sizeof_hdr: " + metaData.sizeof_hdr);
         console.log("data_type: " + metaData.data_type);
         console.log("db_name: " + metaData.db_name);
         console.log("dim_info: " + metaData.dim_info);
         */
    },
    getMinMax: function (data) {
        var _min = Infinity;
        var _max = -Infinity;
        // buffer the length
        var _datasize = data.length;
        var i = 0;
        for (i = 0; i < _datasize; i++) {
            if (!isNaN(data[i]) && data[i] >=0 && data[i] <=1) {
                var _value = data[i];
                _min = Math.min(_min, _value);
                _max = Math.max(_max, _value);

            }
        }

        return {min:_min, max:_max};
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
