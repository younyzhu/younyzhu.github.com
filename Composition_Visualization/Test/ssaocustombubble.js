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
    this.keyboard = new KeyboardState();
    this.SHADOW_MAP_WIDTH =2048;
    this.SHADOW_MAP_HEIGHT=2048;
    //this.quadCamera = null;
    //this.quadScene = null;
    //this.quadMaterial = null;

    this.composer = null;
    this.depthMaterial = null;
    this.depthTarget = null;
    this.SSAOShader = null;
    this.FXAAShader = null;

    this.init = __bind(this.init, this);
    this.createPostProcessing = __bind(this.createPostProcessing, this);

    this.fillScene = __bind(this.fillScene, this);
    this.render = __bind(this.render, this);
    this.animate = __bind(this.animate, this);
    this.onDocumentMouseDown = __bind(this.onDocumentMouseDown, this);
    this.onDocumentMouseMove = __bind(this.onDocumentMouseMove, this);
    this.onDocumentMouseUp = __bind(this.onDocumentMouseUp, this);
    this.onWindowResize = __bind(this.onWindowResize, this);
}

Bubble.prototype = {
    constructor: Bubble,
    init: function(){

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 250;

        this.controls = new THREE.TrackballControls(this.camera);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        this.quadCamera = new THREE.OrthographicCamera(this.SHADOW_MAP_WIDTH/-2, this.SHADOW_MAP_WIDTH/2,this.SHADOW_MAP_HEIGHT/2.0, this.SHADOW_MAP_HEIGHT/-2.0, 0.1,300 );
        this.quadCamera.position.z = 100;
        this.showShadow = false;

        this.projector = new THREE.Projector();
        this.fillScene();
        //render
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.autoClear = false;

        this.renderer.shadowMapEnabled = true;
        //this.renderer.shadowMapCascade = true;
        //this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        //this.renderer.shadowMapType = THREE.VSMShadowMap;   //Try to apply VSMShadowMap
        this.renderer.shadowMapType = THREE.ESMShadowMap;   //Try to apply ESMShadowMap
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.renderer.shadowMapCullFrontFaces = false;
        this.createPostProcessing();

        this.renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove, false);
        this.renderer.domElement.addEventListener('mousedown', this.onDocumentMouseDown, false);
        this.renderer.domElement.addEventListener('mouseup', this.onDocumentMouseUp, false);
        window.addEventListener('resize', this.onWindowResize, false);
    },
    createPostProcessing:function(){
        //postprocessing
        //Depth
        var depthShader = THREE.ShaderLib[ "depthRGBA" ];
        var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );
        this.depthMaterial = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms } );
        this.depthMaterial.blending = THREE.NoBlending;

        //this.SSAOShader = new THREE.ShaderPass(THREE.SSAOShader);
        this.SSAOShader = new THREE.ShaderPass(fiberShader["custom_SSAOShader"]);
        this.SSAOShader.enabled = true;
        this.depthTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight,
            { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat });
        this.SSAOShader.uniforms[ 'tDepth' ].value = this.depthTarget;
        this.SSAOShader.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );
        this.SSAOShader.uniforms[ 'cameraNear' ].value = this.camera.near;
        this.SSAOShader.uniforms[ 'cameraFar' ].value = this.camera.far;
        this.SSAOShader.uniforms[ 'aoClamp' ].value = 0.7;
        this.SSAOShader.uniforms[ 'lumInfluence' ].value = 0.1;
        this.FXAAShader = new THREE.ShaderPass(THREE.FXAAShader);
        this.FXAAShader.renderToScreen = true;
        this.FXAAShader.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );

        var renderPass = new THREE.RenderPass(this.scene, this.camera);

        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(renderPass);
        this.composer.addPass( this.SSAOShader );
        this.composer.addPass( this.FXAAShader );
    },

    fillScene: function () {
        this.scene = new THREE.Scene();
        var _this = this;
        var manager = new THREE.LoadingManager();
        manager.onProgress = function (item, loaded, total)
        {
            console.log(item, loaded, total);
        };
        var cc_loader = new ObjectLoader(manager);
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
                var groundMaterial = new THREE.MeshPhongMaterial({
                    color: 0x6C6C6C
                });
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
        var geometry = new THREE.SphereGeometry(10, 40, 40);
        var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));
        object.position.x = 42;
        object.position.y = 111;
        object.position.z = 6;
        object.receiveShadow = true;
        this.scene.add(object);
        this.objects.push(object);
        /*
         var light = new THREE.DirectionalLight(0xffffff);
         light.position.set(0, 0, 1);
         this.scene.add(light);
        */
        this.light = new THREE.DirectionalLight(0xffffff);
        this.light.position.copy(object.position);
        this.light.castShadow = true;
        this.light.shadowCameraNear = 0.1;
        this.light.shadowCameraFar = this.camera.far/2;
        this.light.shadowCameraFov = 90;
        this.light.shadowCameraVisible = false;
        this.light.shadowBias = 0.0;
        this.light.shadowDarkness = 1.8;
        this.light.shadowMapWidth = this.SHADOW_MAP_WIDTH;
        this.light.shadowMapHeight = this.SHADOW_MAP_HEIGHT;
        this.scene.add( this.light );

        //plane for select sphere selector
        this.plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 8, 8), new THREE.MeshBasicMaterial({ color: 0xFF0000, opacity: 0.25}));
        this.plane.visible = false;
        this.scene.add(this.plane);
        /*
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
        */
    },
    onWindowResize: function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.depthTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight);
        this.SSAOShader.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );
        this.FXAAShader.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
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
            //console.log("Light Position:" + this.light.position.x + " " + this.light.position.y + " " + this.light.position.z);
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
        this.keyboard.update();
        this.renderer.shadowMapEnabled = false;
        this.renderer.autoClear = false;
        this.renderer.autoUpdateObjects = true;
        this.scene.overrideMaterial = this.depthMaterial;
        this.renderer.render( this.scene, this.camera, this.depthTarget );
        this.scene.overrideMaterial = null;
        this.renderer.clearDepth();
        this.renderer.shadowMapEnabled = true;
        this.composer.render();



    }
};
