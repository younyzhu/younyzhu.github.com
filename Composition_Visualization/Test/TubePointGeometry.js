/**
 * Created by Yongnanzhu on 4/13/2014.
 * Modified from Three.js
 * @author WestLangley / https://github.com/WestLangley
 * @author zz85 / https://github.com/zz85
 * @author miningold / https://github.com/miningold
 *
 * Modified from the TorusKnotGeometry by @oosmoxiecode
 *
 * Creates a tube which extrudes along a 3d spline
 *
 * Uses parallel transport frames as described in
 * http://www.cs.indiana.edu/pub/techreports/TR425.pdf
 */

TubeGeometry = function( path, segments, radius, radialSegments, closed) {

    THREE.Geometry.call( this );

    this.path = path;
    this.segments = segments || 64;
    this.radius = radius || 1;
    this.radialSegments = radialSegments || 8;
    this.closed = closed || false;

    this.grid = [];

    var scope = this;

    var  tangent;
    var  normal;
    var  binormal;

    var numpoints = this.segments + 1;
    var v;
    var cx;
    var cy;
    var pos= new THREE.Vector3();
    var pos2 = new THREE.Vector3();
    var i;
    var j;
    var ip;
    var jp;
    var a, b, c, d,
        uva, uvb, uvc, uvd;

    var cap =[];
    var frames = new TubeGeometry.FrenetFrames( this.path, this.segments, this.closed ),
        tangents = frames.tangents,
        normals = frames.normals,
        binormals = frames.binormals;

    // proxy internals
    this.tangents = tangents;
    this.normals = normals;
    this.binormals = binormals;

    function vert( x, y, z ) {
        return scope.vertices.push( new THREE.Vector3( x,
        y, z ) ) - 1;
    }
    function color(r,g,b){
       scope.colors.push( new THREE.Color( r,g, b ) ) ;
    }

    // consruct the grid

    for ( i = 0; i < numpoints- 1; i++ ) {

        this.grid[ i ] = [];

        //u = i / ( numpoints- 1  );
        pos = path[i];
        //pos = path.getPointAt( u );

        tangent = tangents[ i ];
        normal = normals[ i ];
        binormal = binormals[ i ];

        for ( j = 0; j < this.radialSegments; j++ ) {

            v = j / this.radialSegments * 2 * Math.PI;

            cx = -this.radius * Math.cos( v ); // TODO: Hack: Negating it so it faces outside.
            cy = this.radius * Math.sin( v );

            pos2.copy( pos );
            pos2.x += cx * normal.x + cy * binormal.x;
            pos2.y += cx * normal.y + cy * binormal.y;
            pos2.z += cx * normal.z + cy * binormal.z;
            var pos3 = new THREE.Vector3();
            pos3.copy(pos2);
            this.grid[ i ][ j ] = vert( pos2.x, pos2.y, pos2.z );
           //color(vertexColor[i].x,vertexColor[i].y,vertexColor[i].z);
            color(this.tangents[i].x,this.tangents[i].y,this.tangents[i].z);

            if(i===0 || i=== numpoints - 2)
            {
                cap.push(pos3);
            }
        }
    }


    // construct the mesh for the tube
    var faceIdx =0;
    for ( i = 0; i < this.segments-1; i++ ) {

        for ( j = 0; j < this.radialSegments; j++ ) {

            ip = ( this.closed ) ? (i + 1) % this.segments : i + 1;
            jp = (j + 1) % this.radialSegments;

            a = this.grid[ i ][ j ];		// *** NOT NECESSARILY PLANAR ! ***
            b = this.grid[ ip ][ j ];
            c = this.grid[ ip ][ jp ];
            d = this.grid[ i ][ jp ];

            uva = new THREE.Vector2( i / (this.segments -1), j / this.radialSegments );
            uvb = new THREE.Vector2( ( i + 1 ) / (this.segments -1), j / this.radialSegments );
            uvc = new THREE.Vector2( ( i + 1 ) / (this.segments -1), ( j + 1 ) / this.radialSegments );
            uvd = new THREE.Vector2( i / (this.segments -1), ( j + 1 ) / this.radialSegments );

            this.faces.push( new THREE.Face3( a, b, d ) );
            this.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );

            this.faces[ faceIdx ].vertexColors[0] = this.colors[a];
            this.faces[ faceIdx ].vertexColors[1] = this.colors[b];
            this.faces[ faceIdx ].vertexColors[2] = this.colors[d];
            faceIdx++;

            this.faces.push( new THREE.Face3( b, c, d ) );
            this.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc, uvd.clone() ] );
            this.faces[ faceIdx ].vertexColors[0] = this.colors[b];
            this.faces[ faceIdx].vertexColors[1] = this.colors[c];
            this.faces[ faceIdx ].vertexColors[2] = this.colors[d];
            faceIdx++;
        }
    }

    for(i=0; i<cap.length; ++i)
    {
        scope.vertices.push(cap[i]);
    }

    // construct the mesh for the cap
    {
        //for the front cap
        var startp;
        startp = this.vertices.length - cap.length;
        for( j = 0; j < this.radialSegments-2; j++)
        {

            this.faces.push(new THREE.Face3( startp, startp+j+1,startp+j+2 ));
            this.faces[ faceIdx ].vertexColors[0] = new THREE.Vector3(this.tangents[0].x, this.tangents[0].y, this.tangents[0].z);
            //this.faces[ faceIdx ].vertexColors[0] = new THREE.Vector3(vertexColor[0].x, vertexColor[0].y, vertexColor[0].z);
            faceIdx++;
        }
        //for the back cap

        for( j = 0; j < this.radialSegments-2; j++)
        {
            this.faces.push(new THREE.Face3( this.vertices.length-1, this.vertices.length -j-2,  this.vertices.length -j-3 ));
            this.faces[ faceIdx ].vertexColors[0] = new THREE.Vector3(this.tangents[this.tangents.length-1].x, this.tangents[this.tangents.length-1].y, this.tangents[this.tangents.length-1].z);
            //this.faces[ faceIdx ].vertexColors[0] = new THREE.Vector3(vertexColor[vertexColor.length-1].x, vertexColor[vertexColor.length-1].y, vertexColor[vertexColor.length-1].z);
            faceIdx++;
        }
    }

    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals();
};

TubeGeometry.prototype = Object.create( THREE.Geometry.prototype );

// For computing of Frenet frames, exposing the tangents, normals and binormals the spline
TubeGeometry.FrenetFrames = function(path, segments, closed) {

    var	normal = new THREE.Vector3(),

        tangents = [],
        normals = [],
        binormals = [],

        vec = new THREE.Vector3(),
        mat = new THREE.Matrix4(),

        numpoints = segments + 1,
        theta,
        epsilon = 0.0001,
        smallest,

        tx, ty, tz,
        i;
    // expose internals
    this.tangents = tangents;
    this.normals = normals;
    this.binormals = binormals;

    // compute the tangent vectors for each segment on the path
    for ( i = 1; i < numpoints; i++ ) {

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
        else if( i===numpoints-1)
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

    }

    initialNormal3();
    function initialNormal3() {
        // select an initial normal vector perpenicular to the first tangent vector,
        // and in the direction of the smallest tangent xyz component

        normals[ 0 ] = new THREE.Vector3();
        binormals[ 0 ] = new THREE.Vector3();
        smallest = Number.MAX_VALUE;
        tx = Math.abs( tangents[ 0 ].x );
        ty = Math.abs( tangents[ 0 ].y );
        tz = Math.abs( tangents[ 0 ].z );

        if ( tx <= smallest ) {
            smallest = tx;
            normal.set( 1, 0, 0 );
        }

        if ( ty <= smallest ) {
            smallest = ty;
            normal.set( 0, 1, 0 );
        }

        if ( tz <= smallest ) {
            normal.set( 0, 0, 1 );
        }

        vec.crossVectors( tangents[ 0 ], normal ).normalize();

        normals[ 0 ].crossVectors( tangents[ 0 ], vec );
        binormals[ 0 ].crossVectors( tangents[ 0 ], normals[ 0 ] );
    }


    // compute the slowly-varying normal and binormal vectors for each segment on the path

    for ( i = 1; i < numpoints-1; i++ ) {

        normals[ i ] = normals[ i-1 ].clone();

        binormals[ i ] = binormals[ i-1 ].clone();

        vec.crossVectors( tangents[ i-1 ], tangents[ i ] );

        if ( vec.length() > epsilon ) {

            vec.normalize();

            theta = Math.acos( THREE.Math.clamp( tangents[ i-1 ].dot( tangents[ i ] ), -1, 1 ) ); // clamp for floating pt errors

            normals[ i ].applyMatrix4( mat.makeRotationAxis( vec, theta ) );

        }

        binormals[ i ].crossVectors( tangents[ i ], normals[ i ] );

    }
};

