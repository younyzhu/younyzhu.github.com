/**
 * Created by Yongnan on 7/1/2014.
 * This function is to visualize the 3 slice of the image data
 */
var __bind = function (fn, me) {
    return function () {
        return fn.apply(me, arguments);
    };
};
function ImageSlice2d(id, positionX, positionY)
{
    this.id = id;
    this.positionX = positionX;
    this.positionY = positionY;

    this.sliceXY =null;
    this.sliceYZ = null;
    this.sliceYZ = null;

    this.init = __bind(this.init, this);
    this.animate = __bind(this.animate, this);
}
ImageSlice2d.prototype = {
    init: function(){
        //init html
        //init three slice
    },
    animate: function(){
        //Three slice .animate
        requestAnimationFrame( this.animate );
    },
    bubble_Slice_div: function () {
        var id = this.id;
        var positionX = this.positionX;
        var positionY = this.positionY;
        var tmp = '';
        tmp += '<div id="slice' + id + '" class="slice shadow drag" style="position: absolute; left:' + positionX + 'px; top:' + positionY + 'px; ">';
        tmp += '    <div class="dragheader">Compare';
        tmp += '        <span class="close">X</span>';
        tmp += '    </div>';
        tmp += '    <div id="sliceContainer' + id + '" class="sliceContainer" >';
        tmp += '        <div id="sliceXY" class="sliceXY" >';
        tmp += '        </div>';
        tmp += '        <div id="sliceYZ" class="sliceYZ" >';
        tmp += '        </div>';
        tmp += '        <div id="sliceXZ"  class="sliceXZ" >';
        tmp += '        </div>';
        tmp += '    </div>';
        tmp += '</div>';
        return tmp;
    }
};

