/**
 * Created by Yongnan on 7/1/2014.
 * just a visualize for the 2D slice
 */

function Slice2d(id, texture){
    this.id = id;

    this.texture = texture; //This texture is from voxel space image

    this.cWidth = null;
    this.cHeight = null;

    this.camera = null;
    this.scene = null;
    this.renderer = null;

    this.controls = null;

}
Slice2d.prototype = {
    init: function(){
        this.cWidth = ( $("#sliceContainer" + this.id).width() - 6) /3.0;
        this.cHeight = $("#sliceContainer" + this.id).height();



    },
    animate: function(){

    },
    render: function(){

    }
};
