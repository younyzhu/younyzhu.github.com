/**
 * Created by Yongnanzhu on 5/28/2014.
 */
var __bind = function (fn, me) {
    return function () {
        return fn.apply(me, arguments);
    };
};
function Bubble(id, selectedFibers, deletedFibers, objectCenter,shape) {
    this.connectionLinks = [];

    this.camera = null;
    this.scene = null;
    this.renderer = null;

    //this.FA = [];//store the FA value

    this.id = id;

    this.mainGroup = new THREE.Object3D();
    this.mainCenter = null;

    this.container = $('#container' + id)[0];
    this.cWidth = 400;
    this.cHeight = 400;

    this.selectedFibers = selectedFibers||null;   //if selectFiber = null, there is no selected fibers
    this.deletedFibers = deletedFibers||null;   //if deletedFibers = null, there is no deleted fibers
    this.objCenter = objectCenter||null;
    //For trackball control
    this.controls = null;
    this.renderShape = shape||'Line';
    //For interactive line selection, ray caster
    this.projector = null;
    this.objects = [];
    this.plane = null;

    // Axes
    this.axes = null;

    this.mouse = new THREE.Vector2();
    this.offset = new THREE.Vector3();

    this.selectors = [];
    this.fiberSelector = null;

    this.INTERSECTED = null;
    this.SELECTED = null;

    this.ANDOR = "OR";
    //Keyboard
    this.keyboard = new KeyboardState();
    this.radius = 10;//Select Ball radius
    //Shadow Mapping
    this.SHADOW_MAP_WIDTH =2048;
    this.SHADOW_MAP_HEIGHT=2048;
    //Post processing
    this.composer = null;
    this.depthMaterial = null; //depth
    this.depthPassPlugin = null; //render depth
    this.depthTarget = null;
    this.SSAOShader = null;   //ssao
    this.FXAAShader = null;   //fxaa


    this.init = __bind(this.init, this);
    this.createPostProcessing = __bind(this.createPostProcessing, this);
    this.fillScene = __bind(this.fillScene, this);
    this.fillMainGroup = __bind(this.fillMainGroup, this);
    this.update = __bind(this.update, this);
    this.render = __bind(this.render, this);
    this.animate = __bind(this.animate, this);

    this.resetRenderShape= __bind(this.resetRenderShape, this);
    this.removeSelector = __bind(this.removeSelector, this);
    this.addSelector = __bind(this.addSelector, this);
    this.resetAllResult = __bind(this.resetAllResult, this);
    this.Delete = __bind(this.Delete, this);
    this.And = __bind(this.And, this);
    this.Or = __bind(this.Or, this);

    this.onDocumentMouseDown = __bind(this.onDocumentMouseDown, this);
    this.onDocumentMouseMove = __bind(this.onDocumentMouseMove, this);
    this.onDocumentMouseUp = __bind(this.onDocumentMouseUp, this);
    this.onDivResize = __bind(this.onDivResize, this);
}
Bubble.prototype = {
    constructor: Bubble,

    getlinkNodes: function () {
        return this.connectionLinks;
    },

    spliceNodeLink: function (index) {
        if (index >= 0 && index < this.connectionLinks.length) {
            this.connectionLinks.splice(index, 1);
        }
    },

    addlinkNode: function (node) {
        this.connectionLinks.push(node);
    },

    resetRenderShape: function(shape){
        if(shape !== this.renderShape)
        {   /*
            for(var i= 0, l=this.mainGroup.children.length; i < l; ++i )
                this.scene.remove(this.mainGroup.children[i]);
            */
            this.renderShape = shape;
            this.scene.remove(this.mainGroup);
            this.mainGroup = new THREE.Object3D();
            this.fillMainGroup();
            this.render();
        }
    },

    init: function () {
        this.cWidth = 400;
        this.cHeight = 400;
        var canvasRatio = this.cWidth / this.cHeight;
        var scope = this;
        // CAMERA
        this.camera = new THREE.PerspectiveCamera(60, canvasRatio, 1, 4000);
        this.camera.position.set(0, 0, 220);

        this.controls = new THREE.TrackballControls(this.camera, this.container);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        this.projector = new THREE.Projector();

        // RENDERER
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.setSize(this.cWidth, this.cHeight);
        this.container.appendChild(this.renderer.domElement);
        this.fillScene();

        $('#container' + this.id).resize(function onWindowResize() {
            var $containerId = $('#container' + scope.id);
            scope.cWidth = $containerId.width();
            scope.cHeight = $containerId.height();
            scope.camera.aspect = scope.cWidth / scope.cHeight;
            scope.camera.updateProjectionMatrix();
            scope.renderer.autoClear = true;
            scope.renderer.setSize(scope.cWidth, scope.cHeight);
            if(scope.renderShape === 'Tube')
            {
                scope.depthTarget = new THREE.WebGLRenderTarget( scope.cWidth, scope.cHeight);
                scope.depthPassPlugin.renderTarget = scope.depthTarget;
                scope.SSAOShader.uniforms[ 'tDepth' ].value = scope.depthTarget;
                scope.SSAOShader.uniforms[ 'size' ].value.set( scope.cWidth, scope.cHeight );
                scope.FXAAShader.uniforms[ 'resolution' ].value.set( 1 / scope.cWidth, 1 / scope.cHeight );

            }
         $('#bubble' + scope.id).children('#paraMenu').css({left: scope.cWidth - 15});
        });

        this.renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove, false);
        this.renderer.domElement.addEventListener('mousedown', this.onDocumentMouseDown, false);
        this.renderer.domElement.addEventListener('mouseup', this.onDocumentMouseUp, false);
        //this.renderer.domElement.addEventListener('resize', this.onDivResize, false);
    },
    onDivResize:function(){
        var scope = this;
        var $containerId = $('#container' + scope.id);
        scope.cWidth = $containerId.width();
        scope.cHeight = $containerId.height();
        scope.camera.aspect = scope.cWidth / scope.cHeight;
        scope.camera.updateProjectionMatrix();

        scope.renderer.setSize(scope.cWidth, scope.cHeight);
        if(scope.renderShape === 'Tube')
        {
            scope.depthTarget = new THREE.WebGLRenderTarget( scope.cWidth, scope.cHeight);
            scope.depthPassPlugin.renderTarget = scope.depthTarget;
            scope.SSAOShader.uniforms[ 'tDepth' ].value = scope.depthTarget;
            scope.SSAOShader.uniforms[ 'size' ].value.set( scope.cWidth, scope.cHeight );
            scope.FXAAShader.uniforms[ 'resolution' ].value.set( 1 / scope.cWidth, 1 / scope.cHeight );

        }
        $('#bubble' + scope.id).children('#paraMenu').css({left: scope.cWidth - 15});
    },
    createPostProcessing:function(){
        this.renderer.shadowMapEnabled = true;
        //this.renderer.shadowMapCascade = true;
        //this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        //this.renderer.shadowMapType = THREE.VSMShadowMap;   //Try to apply VSMShadowMap
        this.renderer.shadowMapType = THREE.ESMShadowMap;   //Try to apply ESMShadowMap
        this.renderer.shadowMapCullFrontFaces = false;
        //postprocessing
        //Depth
        var depthShader = THREE.ShaderLib[ "depthRGBA" ];
        var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );
        this.depthMaterial = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms } );
        this.depthMaterial.blending = THREE.NoBlending;

        //this.SSAOShader = new THREE.ShaderPass(THREE.SSAOShader);
        this.SSAOShader = new THREE.ShaderPass(fiberShader["custom_SSAOShader"]);
        this.SSAOShader.enabled = true;
        var $containerId = $('#container' + this.id);
        this.cWidth = $containerId.width();
        this.cHeight = $containerId.height();
        this.depthTarget = new THREE.WebGLRenderTarget( this.cWidth, this.cHeight,
            { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat });
        this.SSAOShader.uniforms[ 'tDepth' ].value = this.depthTarget;
        this.SSAOShader.uniforms[ 'size' ].value.set( this.cWidth, this.cHeight );
        this.SSAOShader.uniforms[ 'cameraNear' ].value = this.camera.near;
        this.SSAOShader.uniforms[ 'cameraFar' ].value = this.camera.far;
        this.SSAOShader.uniforms[ 'aoClamp' ].value = 0.7;
        this.SSAOShader.uniforms[ 'lumInfluence' ].value = 0.1;
        //this.SSAOShader.renderToScreen = true;
        this.FXAAShader = new THREE.ShaderPass(THREE.FXAAShader);
        this.FXAAShader.renderToScreen = true;
        this.FXAAShader.uniforms[ 'resolution' ].value.set( 1 / this.cWidth, 1 / this.cHeight );

        var renderPass = new THREE.RenderPass(this.scene, this.camera);

        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(renderPass);
        this.composer.addPass( this.SSAOShader );
        this.composer.addPass( this.FXAAShader );

        this.depthPassPlugin = new THREE.DepthPassPlugin();
        this.depthPassPlugin.renderTarget = this.depthTarget;
        this.renderer.addPrePlugin(  this.depthPassPlugin );
    },

    addAxes: function(){
        // Axes
        this.axes = new THREE.Object3D();
        this.axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(100, 0, 0), 0xFF0000, false)); // +X
        this.axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-100, 0, 0), 0x800000, true)); // -X
        this.axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 100, 0), 0x00FF00, false)); // +Y
        this.axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -100, 0), 0x008000, true)); // -Y
        this.axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 100), 0x0000FF, false)); // +Z
        this.axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -100), 0x000080, true)); // -Z
        this.axes.name = "axes";
        this.scene.add(this.axes);
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
            axis.visible = false;
            return axis;
        }
    },
    showAxesHelper: function(){
        this.axes.traverse(function(axis){   //Moved to the loader
            if(axis instanceof THREE.Line)
            {
                axis.visible = true;
            }
        });
    },
    hideAxesHelper: function(){
        this.axes.traverse(function(axis){   //Moved to the loader
            if(axis instanceof THREE.Line)
            {
                axis.visible = false;
            }
        });
    },
    fillMainGroup: function(){
        if(this.renderShape === "Tube")
        {
            this.createPostProcessing();
        }
        var scope = this;
        var manager = new THREE.LoadingManager();
        manager.onProgress = function (item, loaded, total) {
            console.log(item, loaded, total);
        };
        var loader = new ObjectLoader(manager, this.selectedFibers, this.deletedFibers, this.objCenter, this.renderShape);
        loader.load('./data/whole_s4.data', function (object) {
        //loader.load('./data/s1_cc.data', function (object){
            if (loader.center !== null) {
                object.position.x = -loader.center.x;
                object.position.y = -loader.center.y;
                object.position.z = -loader.center.z;
                scope.mainCenter = object.center;
                scope.mainGroup.add(object);
                //this.FA = object.FA;
            }
        });
        this.scene.add(this.mainGroup);

        if(this.renderShape ==='Tube')
        {
            var light = new THREE.DirectionalLight(0xffffff);
            light.castShadow = true;
            light.position.set(42, 111, 6 );
            light.shadowCameraNear = 0.1;
            light.shadowCameraFar = this.camera.far/2;
            light.shadowCameraFov = 90;
            light.shadowCameraVisible = false;
            light.shadowBias = 0.0;
            light.shadowDarkness = 1.8;
            light.shadowMapWidth = this.SHADOW_MAP_WIDTH;
            light.shadowMapHeight = this.SHADOW_MAP_HEIGHT;
            this.scene.add( light );
        }
        this.addAxes();
    },

    fillScene: function () {
        this.scene = new THREE.Scene();
        this.fiberSelector = new FiberSelector(this.id, this.selectors);
        this.fillMainGroup();
        //this.scene.add(new THREE.AmbientLight(0x505050));   No ambient light, AO instead
        var dlight = new THREE.DirectionalLight(0xffffff);  //Keep a light
        dlight.position.set(0, 0, 1);
        this.scene.add(dlight);
        this.plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 8, 8), new THREE.MeshBasicMaterial({ color: 0xFF0000, opacity: 0.25}));
        this.plane.visible = false;
        this.scene.add(this.plane);
    },

    resetAllResult: function () {
        //Should not put this pice of code here, The logic is when we add a new sphere,
        //we should calculate the set result(intersect, union), so when we add a new selectors, we should do this
        var childs = this.mainGroup.children;
        for (var i = 0; i < childs.length; ++i) {
            for (var j = 0; j < childs[i].children.length; ++j) {
                //var grayness = childs[i].children[j].material.grayness;
                var origColor = childs[i].children[j].material.ColorKeeper;
                childs[i].children[j].material.color.setRGB(origColor.r, origColor.g, origColor.b);
            }
        }
    },
    resetAllColors: function (color) {
        var childs = this.mainGroup.children;
        for (var i = 0; i < childs.length; ++i) {
            for (var j = 0; j < childs[i].children.length; ++j) {
                childs[i].children[j].material.ColorKeeper = new THREE.Color(color.r /255.0, color.g /255.0, color.b /255.0);
                childs[i].children[j].material.color.setRGB(color.r /255.0, color.g /255.0, color.b /255.0);
            }
        }
    },
    setSelectFAColor: function(id)   //this is according to its unique id;
    {
        var childs = this.mainGroup.children;
        for (var i = 0; i < childs.length; ++i) {
            for (var j = 0; j < childs[i].children.length; ++j) {
                if( childs[i].children[j].id ===id)
                    childs[i].children[j].material.color.setRGB(1.0, 1.0, 0.0);
            }
        }
    },
    resetSelectFAColor: function(id)   //this is according to its unique id;
    {
        var childs = this.mainGroup.children;
        for (var i = 0; i < childs.length; ++i) {
            for (var j = 0; j < childs[i].children.length; ++j) {
                if( childs[i].children[j].id ===id)
                {
                    var origColor = childs[i].children[j].material.ColorKeeper;
                    childs[i].children[j].material.color.setRGB(origColor.r, origColor.g, origColor.b);
                }
            }
        }
    },
    addSelector: function () {
        this.resetAllResult();
        var geometry = new THREE.SphereGeometry(10, 40, 40);
        var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));

        object.position.x = Math.random() * 100 - 25;
        object.position.y = Math.random() * 100 - 25;
        object.position.z = Math.random() * 100- 25;
        this.scene.add(object);
        this.objects.push(object);
        var sphereSelector = new SphereSelector(this.id, object,true);
        this.selectors.push(sphereSelector);  //When add a sphere, we should build a selector;
        object.selectId = this.selectors.length - 1;
        this.selectors[ object.selectId ].setUpdateState(true);

    },
    removeAllSelectors: function()
    {
        for (var i = 0, l = this.selectors.length; i < l; ++i)
        {
            this.selectors.pop();
            this.scene.remove(this.objects.pop());
        }
    },
    removeSelector: function () {
        this.resetAllResult();
        for (var i = 0; i < this.selectors.length; ++i)
            this.selectors[ i ].setUpdateState(true);
        this.selectors.pop();
        this.scene.remove(this.objects.pop());
    },
    And: function () {
        this.ANDOR = "AND";
        this.resetAllResult();
    },

    Or: function () {
        this.ANDOR = 'OR';
    },
    Delete: function () {
        this.ANDOR = "DELETE";
    },
    onDocumentMouseMove: function (event) {

        event.preventDefault();

        var $containerId = $('#container' + this.id);
        var offset = $containerId.offset();
        this.cWidth = $containerId.width();
        this.cHeight = $containerId.height();
        this.mouse.x = ( (event.clientX - offset.left) / this.cWidth ) * 2 - 1;
        this.mouse.y = -( (event.clientY - offset.top) / this.cHeight ) * 2 + 1;
        var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
        this.projector.unprojectVector(vector, this.camera);
        var raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
        if (this.SELECTED) {
            var intersects = raycaster.intersectObject(this.plane);
            this.SELECTED.position.copy(intersects[ 0 ].point.sub(this.offset));
            this.selectors[ this.SELECTED.selectId ].setUpdateState(true);
            this.resetAllResult();
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
        var $containerId = $('#container' + this.id);
        var offset = $containerId.offset();
        this.cWidth = $containerId.width();
        this.cHeight = $containerId.height();
        this.mouse.x = ( (event.clientX - offset.left) / this.cWidth ) * 2 - 1;
        this.mouse.y = -( (event.clientY - offset.top) / this.cHeight ) * 2 + 1;
        var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
        this.projector.unprojectVector(vector, this.camera);
        var raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
        var intersects = raycaster.intersectObjects(this.objects);
        if (intersects.length > 0) {
            this.controls.enabled = false;
            this.SELECTED = intersects[ 0 ].object;

            this.radius = this.SELECTED.geometry.radius;
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

    animate: function () {
        requestAnimationFrame(this.animate);
        this.update();
        this.render();
    },

    update: function () {
        this.controls.update();
        if (this.SELECTED) {
            this.keyboard.update();
            var select_Id = this.SELECTED.selectId;
            var position = this.SELECTED.position;

            if (this.keyboard.down("up")) {
                this.radius += 1;
            }
            if (this.keyboard.down("down")) {
                this.radius -= 1;
                if (this.radius == 0) {
                    this.radius = 1;
                    alert("1 is the smallest radius!")
                }
            }
            if (this.radius !== this.SELECTED.geometry.radius) {
                if (this.radius < this.SELECTED.geometry.radius)   //when the radius of sphere becomes much smaller, we should reset the selected fibers.
                    this.resetAllResult();
                var geometry = new THREE.SphereGeometry(this.radius, 40, 40);
                var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: this.SELECTED.material.color }));
                object.position = position;
                object.selectId = select_Id;
                this.scene.remove(this.objects[select_Id]);
                this.scene.add(object);
                this.objects[select_Id] = object;
                this.selectors[select_Id].setSphere(object);
                this.selectors[ select_Id ].setUpdateState(true);
            }
        }
        for (var i = 0; i < this.selectors.length; i++)
            this.selectors[i].intersectObjects(this.mainGroup.children, true);
        if (this.ANDOR === "DELETE") {
            this.fiberSelector.updateSelectResult("DELETE");   //{ AND: 0, OR: 1}
            var delete_Fibers = this.fiberSelector.deletedFibers;
            if (delete_Fibers.length > 0) {
                for (i = 0; i < delete_Fibers.length; ++i) {
                    var delete_object = delete_Fibers[i].object;
                    if (delete_object !== undefined) {
                        delete_object.visible = false;
                    }
                }
            }
        }
        else {
            this.fiberSelector.updateSelectResult(this.ANDOR);   //{ AND: 0, OR: 1}
            var select_Fibers = this.fiberSelector.selectedFibers;
            if (select_Fibers.length > 0) {
                for (i = 0; i < select_Fibers.length; ++i) {
                    var select_object = select_Fibers[i].object;
                    if (select_object !== undefined) {
                        select_object.material.color.setRGB(1, 1, 0);
                    }
                }
            }
        }
    },

    render: function () {
        if(this.renderShape === 'Tube')
        {
            this.renderer.shadowMapEnabled = false;
            //this.renderer.autoClear = false;
            this.renderer.autoUpdateObjects = true;
            this.depthPassPlugin.enabled = true;

            this.scene.overrideMaterial = this.depthMaterial;
            this.renderer.render( this.scene, this.camera, this.depthTarget );
            this.scene.overrideMaterial = null;

            this.depthPassPlugin.enabled = false;
            this.renderer.clearDepth();
            this.renderer.shadowMapEnabled = true;
            this.composer.render();
        }
        else
        {
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
        }

    }
};