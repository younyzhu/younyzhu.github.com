/**
 * Created by Yongnan on 6/21/2014.
 */
function NiiSlice(scene) {
    this.scene = scene;
    this.metaData = null;
    this.vector1 = null;
    this.vector2 = null;
    this.opacity = 1.0;
    this.transparent = false;
    this.XYPlane = null;
    this.YZPlane = null;
    this.XZPlane = null;
    this.init();
}
NiiSlice.prototype = {
    init: function () {
        var _this = this;
        var niiLoader = new NiiLoader();
        var niiFile ='./3_2014_02_10.nii';
        checkFileFormat(niiFile);
        niiLoader.load(niiFile, function (metaData) {
            _this.metaData = metaData;
            _this.calculateRange(_this.metaData.dim);
            _this.addXY_Plane(parseInt(_this.metaData.dim[3] / 2));
            _this.addYZ_Plane(parseInt(_this.metaData.dim[1] / 2));
            _this.addXZ_Plane(parseInt(_this.metaData.dim[2] / 2));
        });
    },
    calculateRange: function (dim) {  //this bounding box is in the xyz plane
        // transform i ,j ,k space to x, y, z space
        // i from 0, ..., dim[1] - 1
        // j from 0, ..., dim[2] - 1
        // k from 0, ..., dim[3] - 1
        this.vector1 = new THREE.Vector4(0, 0, 0, 1);
        this.vector2 = new THREE.Vector4(dim[1], dim[2], dim[3], 1);
        this.vector1.applyMatrix4(this.metaData.ijk_to_xyzMatrix);
        this.vector2.applyMatrix4(this.metaData.ijk_to_xyzMatrix);

    },
    addXY_Plane: function (k) {
        /*
         var width = this.xMax - this.xMin;
         var height = this.yMax - this.yMin;
         var geometry = new THREE.PlaneGeometry( width, height );
         */
        var width = Math.abs(this.vector2.x - this.vector1.x) ;
        var height = Math.abs(this.vector2.y - this.vector1.y) ;
        var geometry = new THREE.PlaneGeometry(width, height);
        //var geometry = new PlaneGeometry(this.vector1, this.vector2, "XY");
        var texture = this.generateDataTextureK(k);
        //var texture = THREE.ImageUtils.loadTexture( "disturb.jpg");
        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: this.transparent, opacity: this.opacity  });
        this.XYPlane = new THREE.Mesh(geometry, material);
        this.XYPlane.position.set(0, 0, 0);
        this.scene.add(this.XYPlane);
    },
    addYZ_Plane: function (i) {
        var width = Math.abs(this.vector2.z - this.vector1.z) ;
        var height = Math.abs(this.vector2.y - this.vector1.y) ;
        var geometry = new THREE.PlaneGeometry(width, height);
        //var geometry = new PlaneGeometry(this.vector1, this.vector2, "YZ");
        var texture = this.generateDataTextureI(i);
        //var texture = THREE.ImageUtils.loadTexture( "disturb.jpg");
        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: this.transparent, opacity: this.opacity  });
        this.YZPlane = new THREE.Mesh(geometry, material);
        this.YZPlane.position.set(0, 0, 0);
        this.YZPlane.rotation.y = -Math.PI/2;
        this.scene.add(this.YZPlane);
    },
    addXZ_Plane: function (j) {
        /*
         var width = this.xMax - this.xMin;
         var height = this.yMax - this.yMin;
         var geometry = new THREE.PlaneGeometry( width, height );
         */
        var width = Math.abs(this.vector2.x - this.vector1.x) ;
        var height = Math.abs(this.vector2.z - this.vector1.z) ;
        var geometry = new THREE.PlaneGeometry(width, height);
        //var geometry = new PlaneGeometry(this.vector1, this.vector2, "XZ");
        var texture = this.generateDataTextureJ(j);
        //var texture = THREE.ImageUtils.loadTexture( "disturb.jpg");
        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: this.transparent, opacity: this.opacity });
        this.XZPlane = new THREE.Mesh(geometry, material);
        this.XZPlane.position.set(0, 0, 0);
        this.XZPlane.rotation.x = Math.PI*3/2 ;
        this.scene.add(this.XZPlane);

    },
    //generate the texture in voxel space
    generateDataTextureK: function (k) {
        var dim = this.metaData.dim;
        var size = dim[1] * dim[2];
        var data = new Uint8Array(size * 4);
        for (var i = 0; i < dim[1]; ++i)
            for (var j = 0; j < dim[2]; ++j) {
                // 2 dim array conver to 1 dim : a[i][j] = a[i * Ncol + j] 2*4 array: a[1][1] = a[1 *4 + 1]
                // 3 dim array conver to 1 dim : a[i][j][k] = a[i * Ncol * Nheight + j * Nheight + k] 2*3*4 array: a[1][1][1] = a[1 * 3*4 + 1*4 + 1]
                //data[i][j] = this.metaData.data[i][j][k];
                var value = this.metaData.data[ k * dim[2] * dim[3] + j * dim[3] + i ] * 255;
                // What the image store the data is just inverse with the array what we know in c, this is store according to its column,
                // In order to figure this, I almost a day to figure, why my fa is different, and I also checked the C transform file wrote a few days ago, I doubt It is also wrong,
                //  Actually, It is wrong, because of the different way of array data storage policy
                data[ (j * dim[1] + i ) * 4] = value;
                data[ (j * dim[1] + i) * 4 + 1 ] = value;
                data[ (j * dim[1] + i) * 4 + 2 ] = value;
                data[ (j * dim[1] + i) * 4 + 3 ] = value;
                /*  //just test for the result compare with the FSL view software
                 if(i===23 && j === 65 && k ===76)
                 console.log(value);
                 if(value >255)
                 console.log("i,j,k" +i+" " +j+" "+k);
                 */
            }
        var texture = new THREE.DataTexture(data, dim[1], dim[2], THREE.RGBAFormat);
        texture.needsUpdate = true;
        return texture;
    },
    generateDataTextureI: function (i) {
        var dim = this.metaData.dim;
        var size = dim[3] * dim[2];
        var data = new Uint8Array(size * 4);

        for (var k = 0; k < dim[3]; ++k)
            for (var j = 0; j < dim[2]; ++j) {
                var value = this.metaData.data[ k * dim[2] * dim[3] + j * dim[3] + i ] * 255;
                // What the image store the data is just inverse with the array what we know in c, this is store according to its column,
                // In order to figure this, I almost a day to figure, why my fa is different, and I also checked the C transform file wrote a few days ago, I doubt It is also wrong,
                //  Actually, It is wrong, because of the different way of array data storage policy
                /*
                 data[ (k * dim[2]  + j ) *4] = value;
                 data[ (k * dim[2] + j) *4 + 1 ] = value;
                 data[ (k * dim[2] + j) *4 + 2 ] = value;
                 data[ (k * dim[2] + j) *4 + 3 ] = value;
                 */

                data[ (j * dim[3] + k ) * 4] = value;
                data[ (j * dim[3] + k) * 4 + 1 ] = value;
                data[ (j * dim[3] + k) * 4 + 2 ] = value;
                data[ (j * dim[3] + k) * 4 + 3 ] = value;


                if (i === 23 && j === 65 && k === 76)
                    console.log(value);

            }
        var texture = new THREE.DataTexture(data, dim[3], dim[2], THREE.RGBAFormat);
        texture.needsUpdate = true;
        return texture;
    },
    generateDataTextureJ: function (j) {
        var dim = this.metaData.dim;
        var size = dim[1] * dim[3];
        var data = new Uint8Array(size * 4);
        for (var i = 0; i < dim[1]; ++i)
            for (var k = 0; k < dim[3]; ++k) {
                var value = this.metaData.data[ k * dim[2] * dim[3] + j * dim[3] + i ] * 255;
                // What the image store the data is just inverse with the array what we know in c, this is store according to its column,
                // In order to figure this, I almost a day to figure, why my fa is different, and I also checked the C transform file wrote a few days ago, I doubt It is also wrong,
                //  Actually, It is wrong, because of the different way of array data storage policy
                data[ (k * dim[1] + i ) * 4] = value;
                data[ (k * dim[1] + i) * 4 + 1 ] = value;
                data[ (k * dim[1] + i) * 4 + 2 ] = value;
                data[ (k * dim[1] + i) * 4 + 3 ] = value;

            }
        var texture = new THREE.DataTexture(data, dim[1], dim[3], THREE.RGBAFormat);
        texture.needsUpdate = true;
        return texture;
    },
    updateXYSliceK: function (k) {
        if (this.metaData !== null)   //we need to make sure we have already loaded the data
        {
            this.XYPlane.material.map = this.generateDataTextureK(k);
            this.XYPlane.material.transparent = this.transparent;
            this.XYPlane.material.opacity = this.opacity;
            this.XYPlane.material.needsUpdate = true;
        }
    },
    updateXZSliceJ: function (j) {
        if (this.metaData !== null)   //we need to make sure we have already loaded the data
        {
            this.XYPlane.material.map = this.generateDataTextureJ(j);
            this.XYPlane.material.transparent = this.transparent;
            this.XYPlane.material.opacity = this.opacity;
            this.XYPlane.material.needsUpdate = true;
        }
    },
    updateYZSliceI: function (i) {
        if (this.metaData !== null)   //we need to make sure we have already loaded the data
        {
            this.XYPlane.material.map = this.generateDataTextureI(i);
            this.XYPlane.material.transparent = this.transparent;
            this.XYPlane.material.opacity = this.opacity;
            this.XYPlane.material.needsUpdate = true;
        }
    }
};
