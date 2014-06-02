/**
 * Created by Yongnan on 6/1/2014.
 */
//custom shader concatenation for brain fiber material

//shadowMap use ShadowMapPlugin to render the depth map into a WebGLRenderTarget

var fiberShader = {

    'custom_phong':{ //modified from ShaderLib.js phong
        uniforms: THREE.UniformsUtils.merge( [

            THREE.UniformsLib[ "common" ],
            //THREE.UniformsLib[ "bump" ],
            //THREE.UniformsLib[ "normalmap" ],
            THREE.UniformsLib[ "lights" ],
            THREE.UniformsLib[ "shadowmap" ],

            {
                "ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
                "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
                "specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
                "shininess": { type: "f", value: 30 },
                "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
            }

        ] ),

        vertexShader: [

            "#define PHONG",

            "varying vec3 vViewPosition;",
            "varying vec3 vNormal;",

            "vec4 mvPosition;",  //defined in default_vertex
            "vec3 objectNormal;",//defined in default_normal

            //THREE.ShaderChunk[ "map_pars_vertex" ],
            //THREE.ShaderChunk[ "lightmap_pars_vertex" ],
            THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
            THREE.ShaderChunk[ "color_pars_vertex" ],  //apply the color that set of the vertexColors
            //THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
            //THREE.ShaderChunk[ "skinning_pars_vertex" ],
            THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
            //THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

            "void main() {",

            //THREE.ShaderChunk[ "map_vertex" ],
            //THREE.ShaderChunk[ "lightmap_vertex" ],
            THREE.ShaderChunk[ "color_vertex" ], //apply the color that set of the vertexColors

            //THREE.ShaderChunk[ "morphnormal_vertex" ],
            //THREE.ShaderChunk[ "skinbase_vertex" ],
            //THREE.ShaderChunk[ "skinnormal_vertex" ],
            //THREE.ShaderChunk[ "defaultnormal_vertex" ],
            "	objectNormal = normal;",                            //in default normal
            "   vec3 transformedNormal = normalMatrix * objectNormal;",

            "	vNormal = normalize( transformedNormal );",

            //THREE.ShaderChunk[ "morphtarget_vertex" ],
            //THREE.ShaderChunk[ "skinning_vertex" ],
            //THREE.ShaderChunk[ "default_vertex" ],
            "	mvPosition = modelViewMatrix * vec4( position, 1.0 );",//at first defined in default_vertex
            "   gl_Position = projectionMatrix * mvPosition;",
            //THREE.ShaderChunk[ "logdepthbuf_vertex" ],

            "	vViewPosition = -mvPosition.xyz;",   //defined in light phong parameter

            //THREE.ShaderChunk[ "worldpos_vertex" ],   //worldPosition in lambert and phong shading is defined in this shader
            "   vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",

            THREE.ShaderChunk[ "lights_phong_vertex" ],
            THREE.ShaderChunk[ "shadowmap_vertex" ],//MAX_SHADOWS: maxShadows the number of spotlight and directionalLight for castShadow, shadowMatrix[i] is the light shadowMatrix
            //vShadowCoord for texture2D to extract shadow depth value according to shadowMap(unpackDepth), in shadowmap_fragment
            "}"

        ].join("\n"),

        fragmentShader: [

            "uniform vec3 diffuse;",
            "uniform float opacity;",

            "uniform vec3 ambient;",
            "uniform vec3 emissive;",
            "uniform vec3 specular;",
            "uniform float shininess;",

            THREE.ShaderChunk[ "color_pars_fragment" ],
            //THREE.ShaderChunk[ "map_pars_fragment" ],
            //THREE.ShaderChunk[ "lightmap_pars_fragment" ],
            //THREE.ShaderChunk[ "fog_pars_fragment" ],
            THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
            THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
            //THREE.ShaderChunk[ "bumpmap_pars_fragment" ],
            //THREE.ShaderChunk[ "normalmap_pars_fragment" ],
            // THREE.ShaderChunk[ "specularmap_pars_fragment" ],
            //THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],//has a parameter about specularStrength = 1.0; for phong shading
            "float specularStrength = 1.0;",                   //So I write the parameter here

            "void main() {",

            "	gl_FragColor = vec4( vec3( 1.0 ), opacity );",

            //THREE.ShaderChunk[ "logdepthbuf_fragment" ],
            //THREE.ShaderChunk[ "map_fragment" ],
            THREE.ShaderChunk[ "alphatest_fragment" ],
            //THREE.ShaderChunk[ "specularmap_fragment" ], //has a parameter about specularStrength = 1.0; for phong shading

            THREE.ShaderChunk[ "lights_phong_fragment" ],

            //THREE.ShaderChunk[ "lightmap_fragment" ],
            THREE.ShaderChunk[ "color_fragment" ],   //apply the color that set of the vertexColors
            THREE.ShaderChunk[ "shadowmap_fragment" ],

            THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

            "}"

        ].join("\n")
    },
    'custom_depthRGBA': {  //modified from ShaderLib.js depth_rgba
        //shadowMap use ShadowMapPlugin
        uniforms: {},
        vertexShader: [
            "vec4 mvPosition;",
            "void main() {",
            "	mvPosition = modelViewMatrix * vec4( position, 1.0 );",
            "   gl_Position = projectionMatrix * mvPosition;",
            "}"

        ].join("\n"),

        fragmentShader: [

            // Pack a floating point value into a vec2 (16bpp).
            // Used by VSM.  // Encode moments to RG/BA
            "#if defined( SHADOWMAP_TYPE_VSM ) ",// Variance Shadow Map
            "vec2 packHalf( const in float depth ){",

            "    const vec2 bit_mask = vec2(1.0 / 255.0,0.0);",
            "    vec2 res = vec2(depth, fract(depth * 255.0));",
            "    res -=  (res.yy * bit_mask);",
            "	 return res;",
            "}",
            "#else",

            // Pack a floating point value into an RGBA (32bpp).
            // Used by SSM, PCF, and ESM. , Exponential Shadow Map
            "vec4 pack_depth( const in float depth ) {",

            "	const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );",
            "	const vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );",
            "	vec4 res = mod( depth * bit_shift * vec4( 255 ), vec4( 256 ) ) / vec4( 255 );", // "	vec4 res = fract( depth * bit_shift );",
            "	res -= res.xxyz * bit_mask;",
            "	return res;",

            "}",

            "#endif",
            // Classic shadow mapping algorithm.
            // Store screen-space z-coordinate or linear depth value (better precision)
            // For linear depth:  linearDepth = length(mvPosition) * 1.0 / (Far - Near);
            /*
            "void main() {",

            "		gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );",

            "}"
             */
            "void main() {",

            "		#if defined( SHADOWMAP_TYPE_VSM )",// Variance Shadow Map
            "           gl_FragData[ 0 ] = vec4(packHalf(gl_FragCoord.z), packHalf(pow(gl_FragCoord.z, 2.0)));",
            "	    #else",
            "		    gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );",
            "       #endif",
            "}"
        ].join("\n")

    }

};
