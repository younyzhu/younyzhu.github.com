/**
 * Created by Yongnanzhu on 5/16/2014.
 */

RibbonGeometry = function( path, width, vertexColor ) {

    THREE.Geometry.call( this );

    this.path = path;

    this.width = width || 1; //2*radius
    var scope = this;

    var  tangents = [];
    var i;

    // compute the tangent vectors for each segment on the path
    for ( i = 1; i < this.path.length; i++ ) {

        //  i-2          i-1   |      i           i+1
        //--*------------*-----|------*-----------*----
        //  pos3         pos2  |     pos          pos0
        /*
         var tmp = new THREE.Vector3();
         tmp.subVectors(path[i], path[i-1]);
         tmp.normalize();
         tangents.push(tmp);
         */
        var tmp = new THREE.Vector3();
        if( i===1 )
        {

            tmp.subVectors(path[i], path[i-1]);
            tmp.normalize();
            tangents.push(tmp);
        }
        else
        {
            var tmp2 = new  THREE.Vector3();
            var tmp3  = new  THREE.Vector3();
            tmp.subVectors(path[i-1], path[i-2]);
            tmp2.subVectors(path[i], path[i-1]);
            tmp3.addVectors(tmp,tmp2).multiplyScalar(1/2);
            tmp3.normalize();
            tangents.push(tmp3);
        }
        //if this is the endpoint, so put a targents
        if( i===this.path.length-1 )
        {
            tmp.subVectors(path[i], path[i-1]);
            tmp.normalize();
            tangents.push(tmp);
        }

    }

    function makeRotationAxis(axis, angle)
    {
        var matrix = new THREE.Matrix3();
        var x = axis.x,
            y = axis.y,
            z = axis.z,
            s = Math.sin(angle),
            c = Math.cos(angle),
            t = 1 - c;
        var tx = t * x, ty = t * y;
        /*
         matrix.set(t*x*x+c,   t*x*y-s*z, t*x*z+s*y,
         t*x*y+s*z, t*y*y+c,   t*y*z-s*x,
         t*x*z-s*y, t*y*z+s*x, t*z*z+c);
         */

        matrix.set(
                tx * x + c, tx * y - s * z, tx * z + s * y,
                tx * y + s * z, ty * y + c, ty * z - s * x,
                tx * z - s * y, ty * z + s * x, t * z * z + c
        );
        return matrix;
    }

    function vert( x, y, z ) {
        scope.vertices.push( new THREE.Vector3( x, y, z ) );
    }
    function color(r,g,b){
        scope.colors.push( new THREE.Color( r, g, b ) ) ;
    }
    //p1
    //A========================B
    //p2

    //Two points(line-p1,p2) of a ribbon in x-y plane, which has normal n(0,0,1)
    //And then we rotate the plane to perpendicular to the AB, that is the targent[0] is the normal of the plane,
    //so the rotation angle could be n(dot)targent[0], and the rotation axis could be n(cross)targent[0].
    //So in x-y plane: p1.y = A.y + width/2
    var radius = this.width/2;
    this.segments = 2;

    var angle = -Math.PI /2;
    var dangle = 2 * Math.PI / this.segments;
    //           --------
    //       /             \
    //     /                 \       //this circle is on the xy plane
    //     \                 /
    //       \             /
    //          --------
    var circlePoints = [];
    for (i = 0; i < this.segments; ++i, angle += dangle)
    {
        var end =new  THREE.Vector3( Math.cos(angle), Math.sin(angle), 0  );
        circlePoints.push(end.multiplyScalar(radius));
    }

    var n = new THREE.Vector3(0,0,1);
    var rotAngle;
    var rotAxis = new THREE.Vector3();
    var rotMatrix = new THREE.Matrix3();
    var p1 = new THREE.Vector3();
    var p2 = new THREE.Vector3();
    for( i=0; i< tangents.length;++i)
    {

        p1.copy(circlePoints[0]);
        //p1.y += this.width/2;

        p2.copy(circlePoints[1]);
        //p2.y -= this.width/2;

        rotAxis.crossVectors(n,tangents[i]);
        rotAxis.normalize();
        rotAngle = Math.acos( n.dot(tangents[i]) );

        rotMatrix = makeRotationAxis(rotAxis,rotAngle);

        p1.applyMatrix3(rotMatrix);
        p1.add(p1, path[i]);

        vert(p1.x, p1.y, p1.z);
        color(vertexColor[i].x, vertexColor[i].y, vertexColor[i].z);

        p2.applyMatrix3(rotMatrix);
        p2.add(p2, path[i]);
        vert(p2.x, p2.y, p2.z);
        color(vertexColor[i].x, vertexColor[i].y, vertexColor[i].z);
    }
    var a, b, c, d;
    var faceIdx =0;
    var uva = new THREE.Vector2( 0,1 );
    var uvb = new THREE.Vector2( 0,0 );
    var uvc = new THREE.Vector2( 1,1 );
    var uvd = new THREE.Vector2( 1,0 );

    for(i=0; i< tangents.length - 1 ; i ++)
    {
        a = 2*i;
        b = 2*i + 1;

        c = 2 * (i + 1);
        d = 2 * (i + 1)+1;

        this.faces.push( new THREE.Face3( a, b, d ) );
        this.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );
        this.faces[ faceIdx ].vertexColors[0] = this.colors[a];
        this.faces[ faceIdx ].vertexColors[1] = this.colors[b];
        this.faces[ faceIdx ].vertexColors[2] = this.colors[d];
        faceIdx++;
        this.faces.push( new THREE.Face3( d, c, a ) );
        this.faceVertexUvs[ 0 ].push( [ uvd.clone(), uvc, uva.clone() ] );
        this.faces[ faceIdx ].vertexColors[0] = this.colors[d];
        this.faces[ faceIdx].vertexColors[1] = this.colors[c];
        this.faces[ faceIdx ].vertexColors[2] = this.colors[a];
        faceIdx++;
    }

    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals();
};

RibbonGeometry.prototype = Object.create( THREE.Geometry.prototype );