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

                scope.dispatchEvent({ type: 'load', content: geometry });

                if (callback)
                    callback(geometry);

            } else {

                scope.dispatchEvent({ type: 'error', message: 'Couldn\'t load URL [' + url + ']', response: event.target.responseText });

            }

        }

        xhr.addEventListener('load', onloaded, false);

        xhr.addEventListener('progress', function (event) {

            scope.dispatchEvent({ type: 'progress', loaded: event.loaded, total: event.total });

        }, false);

        xhr.addEventListener('error', function () {

            scope.dispatchEvent({ type: 'error', message: 'Couldn\'t load URL [' + url + ']' });

        }, false);

        if (xhr.overrideMimeType) xhr.overrideMimeType('text/plain; charset=x-user-defined');
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
    },

    parse: function (data) {

    },
    parseHeader: function (data) {
        this._data = data;
        // the nii header fields   http://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1.h
        var MRI = {
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
            data: null,
            min: Infinity, //store the min intensity
            max: -Infinity //store the max intensity
        };
    },
    scan: function (type, chunks) {

        var chunks_num = chunks ||1;

        var _chunkSize = 1;
        var _array_type = Uint8Array;

        switch (type) {
            // 1 byte data types
            case 'uchar':
                break;
            case 'schar':
                _array_type = Int8Array;
                break;
            // 2 byte data types
            case 'ushort':
                _array_type = Uint16Array;
                _chunkSize = 2;
                break;
            case 'sshort':
                _array_type = Int16Array;
                _chunkSize = 2;
                break;
            // 4 byte data types
            case 'uint':
                _array_type = Uint32Array;
                _chunkSize = 4;
                break;
            case 'sint':
                _array_type = Int32Array;
                _chunkSize = 4;
                break;
            case 'float':
                _array_type = Float32Array;
                _chunkSize = 4;
                break;
            case 'complex':
                _array_type = Float64Array;
                _chunkSize = 8;
                break;
            case 'double':
                _array_type = Float64Array;
                _chunkSize = 8;
                break;

        }

        // increase the data pointer in-place
        var _bytes = new _array_type(this._data.slice(this._dataPointer,
            this._dataPointer += chunks_num * _chunkSize));
        if( chunks_num === 1)
        {
            return _bytes[0];
        }
        return _bytes;
    }
};
