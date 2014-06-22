/**
 * Created by Yongnan on 6/21/2014.
 */
function NiiSlice(scene){
    this.scene = scene;
    this.xMin = -Infinity;
    this.xMax = Infinity;
    this.yMin = -Infinity;
    this.yMax = Infinity;
    this.zMin = -Infinity;
    this.zMax = Infinity;
    this.metaData = {};
    this.vector1 = null;
    this.vector2 = null;
}
NiiSlice.prototype = {
    init: function(){
        var _this =this;
        var niiLoader = new NiiLoader();

        niiLoader.load('./dti_fa.nii', function ( metaData ) {
            _this.metaData = metaData;
            _this.calculateRange(_this.metaData.dim);
            _this.addXY_Plane();
            _this.addYZ_Plane();
            _this.addXZ_Plane();
        });


    },
    calculateRange: function(dim){  //this bounding box is in the xyz plane
        // transform i ,j ,k space to x, y, z space
        // i from 0, ..., dim[1] - 1
        // j from 0, ..., dim[2] - 1
        // k from 0, ..., dim[3] - 1
        this.vector1 = new THREE.Vector4(0 ,0 ,0 ,1 );
        this.vector2 = new THREE.Vector4( dim[1], dim[2], dim[3],1 );
        this.vector1.applyMatrix4(this.metaData.ijk_to_xyzMatrix);
        this.vector2.applyMatrix4(this.metaData.ijk_to_xyzMatrix);

    },
    addXY_Plane: function()
    {
        /*
        var width = this.xMax - this.xMin;
        var height = this.yMax - this.yMin;
        var geometry = new THREE.PlaneGeometry( width, height );
        */
        var geometry = new PlaneGeometry( this.vector1, this.vector2, "XY" );
        var texture = this.generateDataTextureK(this.metaData.dim,76);
        //var texture = THREE.ImageUtils.loadTexture( "disturb.jpg");
        var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0, 0, 0);
        this.scene.add(mesh);
    },
    addYZ_Plane: function()
    {
        var geometry = new PlaneGeometry( this.vector1, this.vector2, "YZ" );
        var texture = this.generateDataTextureI(this.metaData.dim,23);
        //var texture = THREE.ImageUtils.loadTexture( "disturb.jpg");
        var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0, 0, 0);
        //mesh.rotation.y = -Math.PI / 2;
        this.scene.add(mesh);
    },
    addXZ_Plane: function()
    {
        /*
         var width = this.xMax - this.xMin;
         var height = this.yMax - this.yMin;
         var geometry = new THREE.PlaneGeometry( width, height );
         */
        var geometry = new PlaneGeometry( this.vector1, this.vector2, "XZ" );
        var texture = this.generateDataTextureJ(this.metaData.dim,65);
        //var texture = THREE.ImageUtils.loadTexture( "disturb.jpg");
        var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0, 0, 0);
        //mesh.rotation.x = -Math.PI / 2;
        this.scene.add(mesh);
    },
    //generate the texture in voxel space
    generateDataTextureK: function (dim, k ) {
        var size = dim[1] * dim[2];
        var data = new Uint8Array( size * 4 );
        for ( var i = 0; i < dim[1]; ++i)
             for( var j = 0; j < dim[2]; ++j)
             {
                 // 2 dim array conver to 1 dim : a[i][j] = a[i * Ncol + j] 2*4 array: a[1][1] = a[1 *4 + 1]
                 // 3 dim array conver to 1 dim : a[i][j][k] = a[i * Ncol * Nheight + j * Nheight + k] 2*3*4 array: a[1][1][1] = a[1 * 3*4 + 1*4 + 1]
                 //data[i][j] = this.metaData.data[i][j][k];
                 var value = this.metaData.data[ k * dim[2]* dim[3] + j * dim[3] + i ] * 255;
                 // What the image store the data is just inverse with the array what we know in c, this is store according to its column,
                 // In order to figure this, I almost a day to figure, why my fa is different, and I also checked the C transform file wrote a few days ago, I doubt It is also wrong,
                 //  Actually, It is wrong, because of the different way of array data storage policy
                 data[ (j * dim[1]  + i ) *4] = value;
                 data[ (j * dim[1] + i) *4 + 1 ] = value;
                 data[ (j * dim[1] + i) *4 + 2 ] = value;
                 data[ (j * dim[1] + i) *4 + 3 ] = value;
                 /*  //just test for the result compare with the FSL view software
                 if(i===23 && j === 65 && k ===76)
                    console.log(value);
                 if(value >255)
                     console.log("i,j,k" +i+" " +j+" "+k);
                  */
             }
        var texture = new THREE.DataTexture( data,  dim[1], dim[2], THREE.RGBAFormat  );
        texture.needsUpdate = true;
        return texture;
    },
    generateDataTextureI: function (dim, i ) {
        var size = dim[3] * dim[2];
        var data = new Uint8Array( size * 4 );

        for( var k = 0; k < dim[3]; ++k)
             for ( var j = 0; j < dim[2]; ++j)
            {
                var value = this.metaData.data[ k * dim[2]* dim[3] + j * dim[3] + i ] * 255;
                // What the image store the data is just inverse with the array what we know in c, this is store according to its column,
                // In order to figure this, I almost a day to figure, why my fa is different, and I also checked the C transform file wrote a few days ago, I doubt It is also wrong,
                //  Actually, It is wrong, because of the different way of array data storage policy
                /*
                data[ (k * dim[2]  + j ) *4] = value;
                data[ (k * dim[2] + j) *4 + 1 ] = value;
                data[ (k * dim[2] + j) *4 + 2 ] = value;
                data[ (k * dim[2] + j) *4 + 3 ] = value;
                 */

                data[ (j * dim[3]  + k ) *4] = value;
                data[ (j * dim[3] + k) *4 + 1 ] = value;
                data[ (j * dim[3] + k) *4 + 2 ] = value;
                data[ (j * dim[3] + k) *4 + 3 ] = value;


                if(i===23 && j === 65 && k ===76)
                    console.log(value);

            }
        var texture = new THREE.DataTexture( data,  dim[3], dim[2], THREE.RGBAFormat );
        texture.needsUpdate = true;
        return texture;
    },
    generateDataTextureJ: function (dim, j ) {
        var size = dim[1] * dim[3];
        var data = new Uint8Array( size * 4  );
        for ( var i = 0; i < dim[1]; ++i)
            for( var k = 0; k < dim[3]; ++k)
            {
                var value = this.metaData.data[ k * dim[2]* dim[3] + j * dim[3] + i ] * 255;
                // What the image store the data is just inverse with the array what we know in c, this is store according to its column,
                // In order to figure this, I almost a day to figure, why my fa is different, and I also checked the C transform file wrote a few days ago, I doubt It is also wrong,
                //  Actually, It is wrong, because of the different way of array data storage policy
                data[ (k * dim[1]  + i ) *4] = value;
                data[ (k * dim[1] + i) *4 + 1 ] = value;
                data[ (k * dim[1] + i) *4 + 2 ] = value;
                data[ (k * dim[1] + i) *4 + 3 ] = value;
                if(i===38 && j === 53 && k ===44)
                    console.log(value);
            }
        var texture = new THREE.DataTexture( data,  dim[1], dim[3], THREE.RGBAFormat  );
        texture.needsUpdate = true;
        return texture;
    }
};
