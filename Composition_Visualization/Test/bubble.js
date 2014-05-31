/**
 * Created by Yongnanzhu on 5/28/2014.
 */
var __bind = function (fn, me) {
    return function () {
        return fn.apply(me, arguments);
    };
};
function Bubble() {
    this.container = $('#container' )[0];

    this.camera = null;
    this.scene = null;
    this.renderer = null;

    this.controls = null;
    this.projector = null;
    this.objects = [];
    this.plane = null;
    this.mainGroup = new THREE.Object3D();
    this.mouse = new THREE.Vector2();
    this.offset = new THREE.Vector3();
    this.INTERSECTED = null;
    this.SELECTED = null;
    this.axes = null;

    this.init = __bind(this.init, this);
    this.fillScene = __bind(this.fillScene, this);
    this.render = __bind(this.render, this);
    this.animate = __bind(this.animate, this);
    this.onDocumentMouseDown = __bind(this.onDocumentMouseDown, this);
    this.onDocumentMouseMove = __bind(this.onDocumentMouseMove, this);
    this.onDocumentMouseUp = __bind(this.onDocumentMouseUp, this);
}

Bubble.prototype = {
    constructor: Bubble,
    init: function(){

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 250;

         this.controls = new THREE.OrbitControls(this.camera);

        this.projector = new THREE.Projector();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove, false);
        this.renderer.domElement.addEventListener('mousedown', this.onDocumentMouseDown, false);
        this.renderer.domElement.addEventListener('mouseup', this.onDocumentMouseUp, false);
        window.addEventListener('resize', this.onWindowResize, false);
    },
    fillScene: function () {
        this.scene = new THREE.Scene();
        var _this = this;
        var manager = new THREE.LoadingManager();
        manager.onProgress = function (item, loaded, total)
        {
            console.log(item, loaded, total);
        };
        var cc_loader = new GeometryLoader(manager);
        cc_loader.load('./whole_s4.data', function (object)
        //cc_loader.load('./s1_cc.data', function (object)
        {
            if (cc_loader.center !== null)
            {
                object.position.x = -cc_loader.center.x;
                object.position.y = -cc_loader.center.y;
                object.position.z = -cc_loader.center.z;
                object.traverse(function(ribbon){
                    if(ribbon instanceof THREE.Mesh)
                    {
                        ribbon.castShadow = true;
                        ribbon.receiveShadow = true;
                    }
                });
                _this.mainGroup.add(object);
                var ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), groundMaterial);
                ground.rotation.x = -Math.PI / 2;
                ground.receiveShadow = true;
                ground.position.x = _this.mainGroup.position.x;
                ground.position.y = _this.mainGroup.position.y -100;
                ground.position.z = _this.mainGroup.position.z;
                _this.scene.add(ground);
            }
        });
        this.scene.add(this.mainGroup);
        var groundMaterial = new THREE.MeshPhongMaterial({
            color: 0x6C6C6C
        });

        var geometry = new THREE.SphereGeometry(10, 40, 40);
        var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));
        object.position.x = Math.random() * 50 - 100;
        object.position.y = Math.random() * 50 - 100;
        object.position.z = Math.random() * 10 - 20;
        object.receiveShadow = true;
        this.scene.add(object);
        this.objects.push(object);
        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 0, 1);
        this.scene.add(light);
        this.light = new THREE.DirectionalLight(0xffffff);
        this.light.position.copy(object.position);
        //light.target.position = mainGroup.position;
        this.light.castShadow = true;

        this.light.shadowCameraNear = 0.1;
        this.light.shadowCameraFar = this.camera.far/2;
        this.light.shadowCameraFov = 90;

        this.light.shadowCameraVisible = true;

        this.light.shadowBias = 0.0022;
        this.light.shadowDarkness = 0.5;

        function setShadowDarkness(light, r, g, b)
        {
            r /= 255;
            g /= 255;
            b /= 255;
            var avg = (r + g + b) / 3;

            light.shadowDarkness = avg * 0.5;
        }
        this.light.shadowMapWidth = 2048;
        this.light.shadowMapHeight = 2048;
        this.scene.add( this.light );

        //plane for select sphere selector
        this.plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 8, 8), new THREE.MeshBasicMaterial({ color: 0xFF0000, opacity: 0.25}));
        this.plane.visible = false;
        this.scene.add(this.plane);
        // Axes
        this.axes = buildAxes();
        this.scene.add(this.axes);

        function buildAxes() {       //just for help
            var axes = new THREE.Object3D();
            axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(100, 0, 0), 0xFF0000, false)); // +X
            axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-100, 0, 0), 0x800000, true)); // -X
            axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 100, 0), 0x00FF00, false)); // +Y
            axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -100, 0), 0x008000, true)); // -Y
            axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 100), 0x0000FF, false)); // +Z
            axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -100), 0x000080, true)); // -Z
            return axes;

        }

        function buildAxis(src, dst, colorHex, dashed) {
            var geom = new THREE.Geometry(),
                mat;

            if (dashed) {
                mat = new THREE.LineDashedMaterial({ linewidth: 1, color: colorHex, dashSize: 5, gapSize: 5 });
            } else {
                mat = new THREE.LineBasicMaterial({ linewidth: 1, color: colorHex });
            }

            geom.vertices.push(src.clone());
            geom.vertices.push(dst.clone());

            var axis = new THREE.Line(geom, mat);

            return axis;

        }
    },
    onWindowResize: function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onDocumentMouseMove: function (event) {
        event.preventDefault();
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
        var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
        this.projector.unprojectVector(vector, this.camera);
        var raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
        if (this.SELECTED) {
            var intersects = raycaster.intersectObject(this.plane);
            this.SELECTED.position.copy(intersects[ 0 ].point.sub(this.offset));
            this.light.position.copy(this.SELECTED.position);

            return;
        }

        var intersects = raycaster.intersectObjects(this.objects);
        if (intersects.length > 0) {
            if (this.INTERSECTED != intersects[ 0 ].object) {
                this.INTERSECTED = intersects[ 0 ].object;
                this.plane.position.copy(this.INTERSECTED.position);
                this.plane.lookAt(this.camera.position);
            }
            this.container.style.cursor = 'pointer';
        }
        else {
            this.INTERSECTED = null;
            this.container.style.cursor = 'auto';
        }
    },
    onDocumentMouseDown: function (event) {

        event.preventDefault();
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
        var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
        this.projector.unprojectVector(vector, this.camera);
        var raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
        var intersects = raycaster.intersectObjects(this.objects);
        if (intersects.length > 0) {
            this.controls.enabled = false;
            this.SELECTED = intersects[ 0 ].object;

            var intersects = raycaster.intersectObject(this.plane);
            this.offset.copy(intersects[ 0 ].point).sub(this.plane.position);
            this.container.style.cursor = 'move';
        }
    },
    onDocumentMouseUp: function (event) {

        event.preventDefault();
        this.controls.enabled = true;
        if (this.INTERSECTED) {
            this.plane.position.copy(this.INTERSECTED.position);
            this.SELECTED = null;
        }
        this.container.style.cursor = 'auto';
    },
    addSelector: function () {
        var geometry = new THREE.SphereGeometry(10, 40, 40);
        var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));

        object.position.x = Math.random() * 50 - 100;
        object.position.y = Math.random() * 50 - 100;
        object.position.z = Math.random() * 10 - 20;
        this.scene.add(object);
        this.objects.push(object);
    },

    animate: function () {
        requestAnimationFrame(this.animate);
        this.render();
    },


    render: function () {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
