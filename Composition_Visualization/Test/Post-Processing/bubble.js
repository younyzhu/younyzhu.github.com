/**
 * Created by Yongnan on 6/3/2014.
 */
var __bind = function (fn, me) {
    return function () {
        return fn.apply(me, arguments);
    };
};
function Bubble() {
    this.container = $('#container')[0];

    this.camera = null;
    this.scene = null;
    this.renderer = null;

    this.group = null;
    this.mainGroup = null;
    this.loadedCount = 0;

    this.composer = null;
    this.depthMaterial = null;
    this.depthTarget = null;
    this.init = __bind(this.init, this);
    this.render = __bind(this.render, this);
    this.animate = __bind(this.animate, this);
}
Bubble.prototype ={
    constructor: Bubble,
    init:function(){
        var _this= this;
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
        this.camera.position.z = 220;
        // scene
        this.scene = new THREE.Scene();
        var light;
        light = new THREE.DirectionalLight( 0xffeedd );
        light.position.set( 0, 0, 200 );
        this.scene.add( light );
        light = new THREE.DirectionalLight( 0xffeedd );
        light.position.set( -200, 0, 0 );
        this.scene.add( light );
        light = new THREE.DirectionalLight( 0xffeedd );
        light.position.set( 0, 200, 0 );
        this.scene.add( light );
        this.mainGroup = new THREE.Object3D();
        this.scene.add(this.mainGroup);
        //object
        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {

            console.log( item, loaded, total );

        };
        var cc_loader = new ObjectLoader(manager);
        cc_loader.load('./data/whole_s4.data', function (object)
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
        //render
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.antialias = false;
        //renderer.autoClear = false;
        this.container.appendChild( this.renderer.domElement );

        //post-processing

        // create the shaders
        // overlay of black and white

        //Depth
        var depthShader = THREE.ShaderLib[ "depthRGBA" ];
        var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );
        this.depthMaterial = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms } );
        this.depthMaterial.blending = THREE.NoBlending;

        var SSAOShader = new THREE.ShaderPass(THREE.SSAOShader);
        SSAOShader.enabled = true;
        this.depthTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight,
            { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat });
        SSAOShader.uniforms[ 'tDepth' ].value = this.depthTarget;
        SSAOShader.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );
        SSAOShader.uniforms[ 'cameraNear' ].value = this.camera.near;
        SSAOShader.uniforms[ 'cameraFar' ].value = this.camera.far;
        SSAOShader.uniforms[ 'aoClamp' ].value = 0.6;
        SSAOShader.uniforms[ 'lumInfluence' ].value = 0.2;
        //SSAOShader.renderToScreen = true;
        var FXAAShader = new THREE.ShaderPass(THREE.FXAAShader);
        FXAAShader.renderToScreen = true;
        FXAAShader.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );

        var renderPass = new THREE.RenderPass(this.scene, this.camera);
        // var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        //effectCopy.renderToScreen = true;
        //var effectFilm = new THREE.FilmPass(0.8, 0.325, 256, false);    //about the filmPass do not need to copy the effect to the screen
        //effectFilm.renderToScreen = true;

        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(renderPass);
        this.composer.addPass( SSAOShader );
        this.composer.addPass(FXAAShader);
    },
    animate: function(){
        requestAnimationFrame( this.animate );
        this.render();
    },
    render: function () {

        //this.renderer.render( this.scene, this.camera );

        this.scene.overrideMaterial = this.depthMaterial;
        this.renderer.render( this.scene, this.camera, this.depthTarget );
        this.scene.overrideMaterial = null;
        this.composer.render();

    }
};
