/**
 * Created by Yongnan on 6/21/2014.
 */
function NiiSlice(id,scene,url) {
    this.id = id;
    this.scene = scene;
    this.metaData = null;
    this.vector1 = null;
    this.vector2 = null;
    this.opacity = 0.5;
    this.transparent = false;
    this.XYPlane = null;
    this.YZPlane = null;
    this.XZPlane = null;
    this.init(url);
}
NiiSlice.prototype = {
    init: function (url) {
        var _this = this;
        var niiLoader = new LocalNiiLoader(this.id);
        niiLoader.load(url, function (metaData) {
            var $plane = $("#bubble" + _this.id).children().children().children().children("#plane");
            if(metaData===null)
            {
                if($plane.css('display') !== 'none')
                    $plane.css("display", "none");
                return;
            }
            _this.metaData = metaData;
            _this.calculateRange(_this.metaData.dim);
            _this.addXY_Plane(parseInt(_this.metaData.dim[3] / 2));
            _this.addYZ_Plane(parseInt(_this.metaData.dim[1] / 2));
            _this.addXZ_Plane(parseInt(_this.metaData.dim[2] / 2));
            $plane.show();
//--------------------------------------------------------Transparent----------------------------------------------------//
            $plane.children().children("#transparent")[0].checked = _this.transparent;
            $plane.children().children('#transparent').change(function(){
                _this.transparent = $(this).is(':checked');
                Bubbles[_this.id].niiSlice.updateYZSliceI($plane.children('#yzSlider').slider("value"));
                Bubbles[_this.id].niiSlice.updateXYSliceK($plane.children('#xySlider').slider("value"));
                Bubbles[_this.id].niiSlice.updateXZSliceJ($plane.children('#xzSlider').slider("value"));
            });
            $plane.children().children('#opacity').spinner({
                step: 0.1,
                min:0.0,
                max:1.0,
                spin: function( event, ui ) {
                    Bubbles[_this.id].niiSlice.opacity = parseFloat(ui.value);

                    Bubbles[_this.id].niiSlice.updateYZSliceI($plane.children('#yzSlider').slider("value"));
                    Bubbles[_this.id].niiSlice.updateXYSliceK($plane.children('#xySlider').slider("value"));
                    Bubbles[_this.id].niiSlice.updateXZSliceJ($plane.children('#xzSlider').slider("value"));
                }
            }).val(parseFloat(_this.opacity));
//--------------------------------------------------------XY-Plane----------------------------------------------------//
            $plane.children().children("#xyPlane")[0].checked = true;

            $plane.children('#xySlider').show().slider({
                min: 0,
                max: _this.metaData.dim[3],
                value: parseInt(_this.metaData.dim[3] / 2),
                slide: function( event, ui ) {
                    $plane.children().children( "#xypValue" ).children().text( ui.value );
                    Bubbles[_this.id].niiSlice.updateXYSliceK(ui.value);
                }
            });
            $plane.children().children( "#xypValue" ).text( $plane.children('#xySlider').slider("value") );
            $plane.children().children('#xyPlane').change(function(){
                $(this).val($(this).is(':checked'));
                Bubbles[_this.id].niiSlice.XYPlane.visible = $(this).is(':checked');
                if( $(this).is(':checked') )
                {
                    $plane.children('#xySlider').show();

                }
                else
                {
                    $plane.children('#xySlider').hide();
                }
            });
//--------------------------------------------------------YZ-Plane----------------------------------------------------//
            $plane.children().children("#yzPlane")[0].checked = true;
            $plane.children().children('#yzPlane').change(function(){
                $(this).val($(this).is(':checked'));
                Bubbles[_this.id].niiSlice.YZPlane.visible = $(this).is(':checked');
                if( $(this).is(':checked') )
                {
                    $plane.children('#yzSlider').show();
                }
                else
                {
                    $plane.children('#yzSlider').hide();
                }
            });
            $plane.children('#yzSlider').show().slider({
                min: 0,
                max: _this.metaData.dim[1],
                value: parseInt(_this.metaData.dim[1] / 2),
                slide: function( event, ui ) {
                    $plane.children().children( "#yzpValue" ).text( ui.value );
                    Bubbles[_this.id].niiSlice.updateYZSliceI(ui.value);
                }
            });
            $plane.children().children( "#yzpValue" ).text( $plane.children('#yzSlider').slider("value") );


//--------------------------------------------------------XZ-Plane----------------------------------------------------//
            $plane.children().children('#xzPlane').change(function(){
                $(this).val($(this).is(':checked'));
                Bubbles[_this.id].niiSlice.XZPlane.visible = $(this).is(':checked');
                if( $(this).is(':checked') )
                {
                    $plane.children('#xzSlider').show();
                }
                else
                {
                    $plane.children('#xzSlider').hide();
                }
            });
            $plane.children().children("#xzPlane")[0].checked = true;
            $plane.children('#xzSlider').show().slider({
                min: 0,
                max: _this.metaData.dim[2],
                value: parseInt(_this.metaData.dim[2] / 2),
                slide: function( event, ui ) {
                    $plane.children().children( "#xzpValue" ).text( ui.value );
                    Bubbles[_this.id].niiSlice.updateXZSliceJ(ui.value);
                }
            });
            $plane.children().children( "#xzpValue" ).text( $plane.children('#xzSlider').slider("value") );

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
        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: this.transparent, opacity: this.opacity});
        this.XYPlane = new THREE.Mesh(geometry, material);
        this.XYPlane.position.set(0, 0, 0);
        this.scene.add(this.XYPlane);
    },
    addYZ_Plane: function (i) {
        var width = Math.abs(this.vector2.z - this.vector1.z) ;
        var height = Math.abs(this.vector2.y - this.vector1.y) ;
        var geometry = new THREE.PlaneGeometry(height, width);
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
        var width = Math.abs(this.vector2.x - this.vector1.x);
        var height = Math.abs(this.vector2.z - this.vector1.z);
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
                data[ (j * dim[1] + i) * 4 + 3 ] = 255;
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
                data[ (j * dim[3] + k) * 4 + 3 ] = 255;
                /*
                if (i === 23 && j === 65 && k === 76)
                    console.log(value);
                 */
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
                data[ (k * dim[1] + i) * 4 + 3 ] = 255;
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
            var vector = new THREE.Vector4(0,0,k,1);
            vector.applyMatrix4(this.metaData.ijk_to_xyzMatrix);
            this.XYPlane.position.z = vector.z;
        }
    },
    updateXZSliceJ: function (j) {
        if (this.metaData !== null)   //we need to make sure we have already loaded the data
        {
            this.XZPlane.material.map = this.generateDataTextureJ(j);
            this.XZPlane.material.transparent = this.transparent;
            this.XZPlane.material.opacity = this.opacity;
            this.XZPlane.material.needsUpdate = true;
            var vector = new THREE.Vector4(0,j,0,1);
            vector.applyMatrix4(this.metaData.ijk_to_xyzMatrix);
            this.XZPlane.position.y = vector.y;
        }
    },
    updateYZSliceI: function (i) {
        if (this.metaData !== null)   //we need to make sure we have already loaded the data
        {
            this.YZPlane.material.map = this.generateDataTextureI(i);
            this.YZPlane.material.transparent = this.transparent;
            this.YZPlane.material.opacity = this.opacity;
            this.YZPlane.material.needsUpdate = true;
            var vector = new THREE.Vector4(i,0,0,1);
            vector.applyMatrix4(this.metaData.ijk_to_xyzMatrix);
            this.YZPlane.position.x = vector.x;
        }
    }
};
