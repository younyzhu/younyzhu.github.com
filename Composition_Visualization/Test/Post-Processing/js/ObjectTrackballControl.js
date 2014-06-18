/**
 * Created by Yongnanzhu on 5/5/2014.
 */
/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 */

TrackballControls = function ( object, domElement ) {

    var _this = this;

    _this.object = object;
    _this.quater = object.quaternion;

    _this.domElement = ( domElement !== undefined ) ? domElement : document;

    _this.zoomValue = 0;
    _this.mouseDown = true;

    _this.rotateStartP = new THREE.Vector3();
    _this.rotateEndP = new THREE.Vector3();

    // events
    var changeEvent = { type: 'change' };

    // methods
    this.setObject = function(object) {
        _this.object = object;
    };
    this.handleEvent = function ( event ) {

        if ( typeof this[ event.type ] == 'function' ) {

            this[ event.type ]( event );

        }

    };

    this.update = function () {

        var rotateQuaternion = rotateMatrix(_this.rotateStartP, _this.rotateEndP);
        _this.quater = _this.object.quaternion;
        _this.quater.multiplyQuaternions(rotateQuaternion,_this.quater);
        _this.quater.normalize();
        _this.object.setRotationFromQuaternion(_this.quater);
        _this.object.position.z += _this.zoomValue;
        _this.zoomValue = 0;

    };



    function mousedown( event ) {

        event.preventDefault();
        _this.mouseDown = true;
        _this.rotateStartP = projectOnTrackball(event.clientX, event.clientY);

        document.addEventListener( 'mousemove', mousemove, false );
        document.addEventListener( 'mouseup', mouseup, false );



    }
    function getMouseOnScreen( pageX, pageY) {

        return new THREE.Vector2.set(pageX / window.innerWidth ,pageY / window.innerHeight);

    }

    function projectOnTrackball(pageX, pageY) // The screen coordinate[(0,0)on the left-top] convert to the
        //trackball coordinate [(0,0) on the center of the page]
    {
        var mouseOnBall = new THREE.Vector3();
        mouseOnBall.set(
                ( pageX - window.innerWidth * 0.5 ) / (window.innerWidth * .5),
                ( window.innerHeight * 0.5 - pageY ) / ( window.innerHeight * .5),
            0.0
        );

        var length = mouseOnBall.length();
        if (length > 1.0) {

            mouseOnBall.normalize();

        }
        else {
            mouseOnBall.z = Math.sqrt(1.0 - length * length);
        }
        return mouseOnBall;
    }

    function rotateMatrix(rotateStart, rotateEnd)
    {
        var axis = new THREE.Vector3(),
            quaternion = new THREE.Quaternion();

        var angle = Math.acos( rotateStart.dot( rotateEnd ) / rotateStart.length() / rotateEnd.length() );

        if ( angle )
        {
            axis.crossVectors( rotateStart, rotateEnd ).normalize();
            angle *= 0.01;            //Here we could define rotate speed
            quaternion.setFromAxisAngle( axis, angle );
        }
        return  quaternion;
    }

    function mousemove( event ) {

        if(!_this.mouseDown)
        {
            return;
        }

        _this.rotateEndP = projectOnTrackball(event.clientX, event.clientY);

    }

    function mouseup( event ) {

        _this.mouseDown = false;
        _this.rotateStartP = _this.rotateEndP;
        document.removeEventListener( 'mousemove', mousemove );
        document.removeEventListener( 'mouseup', mouseup );

    }

    function mousewheel( event ) {

        event.preventDefault();
        event.stopPropagation();

        var delta = 0;

        if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

            delta = event.wheelDelta / 40;

        } else if ( event.detail ) { // Firefox

            delta = - event.detail / 3;

        }

        _this.zoomValue += delta;

    }

    this.domElement.addEventListener( 'mousedown', mousedown, false );

    this.domElement.addEventListener( 'mousewheel', mousewheel, false );
    this.domElement.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox

};

TrackballControls.prototype = Object.create( THREE.EventDispatcher.prototype );