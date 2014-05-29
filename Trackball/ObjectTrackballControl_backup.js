/**
 * Created by Yongnanzhu on 5/5/2014.
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin    / http://mark-lundin.com
 */

TrackballControls = function (object, domElement) {

    var _this = this;
    this.enabled = true;
    this.zoomSpeed = 1.5;
    this.rotateSpeed = 1.0;
    this.screen = { left: 0, top: 0, width: 0, height: 0 };

    _this.quater = object.quaternion;
    _this.object = object;
    _this.domElement = ( domElement !== undefined ) ? domElement : document;

    _this.zoomValue = 0;
    _this.mouseDown = true;

    _this.rotateStartP = new THREE.Vector3();
    _this.rotateEndP = new THREE.Vector3();

    // methods
    this.handleResize = function () {

        if (this.domElement === document) {

            this.screen.left = 0;
            this.screen.top = 0;
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;

        } else {

            this.screen = this.domElement.getBoundingClientRect();
            // adjustments come from similar code in the jquery offset() function
            var d = this.domElement.ownerDocument.documentElement;
            this.screen.left += window.pageXOffset - d.clientLeft;
            this.screen.top += window.pageYOffset - d.clientTop;
        }

    };
    this.update = function () {
        this.handleResize();//When we change the container div, we could move it.
        var rotateQuaternion = rotateMatrix(_this.rotateStartP, _this.rotateEndP);
        _this.quater = _this.object.quaternion;
        _this.quater.multiplyQuaternions(rotateQuaternion, _this.quater);
        _this.quater.normalize();
        _this.object.setRotationFromQuaternion(_this.quater);
        _this.object.position.z += _this.zoomValue;
        _this.zoomValue = 0;

    };
    function mousedown(event) {
        if (_this.enabled === false) return;
        event.preventDefault();
        _this.mouseDown = true;
        _this.rotateStartP = projectOnTrackball(event.clientX, event.clientY);

        _this.domElement.addEventListener('mousemove', mousemove, false);
        _this.domElement.addEventListener('mouseup', mouseup, false);
    }

    function projectOnTrackball(pageX, pageY) // The screen coordinate[(0,0)on the left-top] convert to the
        //trackball coordinate [(0,0) on the center of the page]
    {
        var mouseOnBall = new THREE.Vector3();
        mouseOnBall.set(
                ( pageX - _this.screen.width * 0.5 - _this.screen.left ) / (_this.screen.width * .5),
                ( _this.screen.height * 0.5 + _this.screen.top - pageY ) / (_this.screen.height * .5),
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

    function rotateMatrix(rotateStart, rotateEnd) {
        var axis = new THREE.Vector3(),
            quaternion = new THREE.Quaternion();

        var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

        if (angle) {
            axis.crossVectors(rotateStart, rotateEnd).normalize();
            angle *= _this.rotateSpeed / 100;            //Here we could define rotate speed
            quaternion.setFromAxisAngle(axis, angle);
        }
        return  quaternion;
    }

    function mousemove(event) {
        if (_this.enabled === false) return;

        if (!_this.mouseDown) {
            return;
        }

        _this.rotateEndP = projectOnTrackball(event.clientX, event.clientY);

    }

    function mouseup(event) {
        if (_this.enabled === false) return;

        _this.mouseDown = false;
        _this.rotateStartP = _this.rotateEndP;
        _this.domElement.removeEventListener('mousemove', mousemove);
        _this.domElement.removeEventListener('mouseup', mouseup);

    }

    function mousewheel(event) {
        if (_this.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();

        var delta = 0;

        if (event.wheelDelta) { // WebKit / Opera / Explorer 9

            delta = event.wheelDelta / 40;

        } else if (event.detail) { // Firefox

            delta = -event.detail;

        }

        _this.zoomValue += delta * _this.zoomSpeed;

    }

    this.domElement.addEventListener('mousedown', mousedown, false);
    this.domElement.addEventListener('mousewheel', mousewheel, false);
    this.domElement.addEventListener('DOMMouseScroll', mousewheel, false); // firefox

};

TrackballControls.prototype = Object.create(THREE.EventDispatcher.prototype);