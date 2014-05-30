/**
 * Created by Yongnanzhu on 5/12/2014.
 */
LineGeometry = function( path, vertexColor ) {

    THREE.Geometry.call(this);
    var scope = this;

    function vert( v ) {
        scope.vertices.push( v );
    }
    function color(c){
        scope.colors.push( c ) ;
    }
    for (var i=0; i < path.length; ++i)
    {
        vert(path[0]);
        color(vertexColor[0]);
    }
};
LineGeometry.prototype = Object.create( THREE.Geometry.prototype );

