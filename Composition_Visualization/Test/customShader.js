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
    'custom_depthRGBA': {  //modified from ShaderLib.js depth_rgba shadowMap use ShadowMapPlugin
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

    },

"custom_SSAOShader" : {
//modified from THREE.js THREE.SSAOShader from @author alteredq / http://alteredqualia.com/
    uniforms: {

        "tDiffuse": { type: "t", value: null },
        "tDepth": { type: "t", value: null },
        "size": { type: "v2", value: new THREE.Vector2(512, 512) },
        "cameraNear": { type: "f", value: 1 },
        "cameraFar": { type: "f", value: 100 },
        "fogNear": { type: "f", value: 5 },
        "fogFar": { type: "f", value: 100 },
        "fogEnabled": { type: "i", value: 0 },
        "onlyAO": { type: "i", value: 0 },
        "aoClamp": { type: "f", value: 0.3 },
        "lumInfluence": { type: "f", value: 0.9 }

    },

    vertexShader: [

        "varying vec2 vUv;",

        "void main() {",

        "vUv = uv;",

        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"

    ].join("\n"),

    fragmentShader: [

        "uniform float cameraNear;",
        "uniform float cameraFar;",

        "uniform float fogNear;",
        "uniform float fogFar;",

        "uniform bool fogEnabled;",  // attenuate AO with linear fog
        "uniform bool onlyAO;",      // use only ambient occlusion pass?

        "uniform vec2 size;",        // texture width, height
        "uniform float aoClamp;",    // depth clamp - reduces haloing at screen edges

        "uniform float lumInfluence;",  // how much luminance affects occlusion

        "uniform sampler2D tDiffuse;",
        "uniform sampler2D tDepth;",

        "varying vec2 vUv;",

        // "#define PI 3.14159265",
        "#define DL 2.399963229728653",  // PI * ( 3.0 - sqrt( 5.0 ) )
        "#define EULER 2.718281828459045",

        // helpers

        "float width = size.x;",   // texture width
        "float height = size.y;",  // texture height

        "float cameraFarPlusNear = cameraFar + cameraNear;",
        "float cameraFarMinusNear = cameraFar - cameraNear;",
        "float cameraCoef = 2.0 * cameraNear;",

        // user variables

        "const int samples = 8;",     // ao sample count
        "const float radius = 5.0;",  // ao radius

        "const bool useNoise = false;",      // use noise instead of pattern for sample dithering
        "const float noiseAmount = 0.0003;", // dithering amount

        "const float diffArea = 0.4;",   // self-shadowing reduction
        "const float gDisplace = 0.4;",  // gauss bell center

        "const vec3 onlyAOColor = vec3( 1.0, 0.7, 0.5 );",
        // "const vec3 onlyAOColor = vec3( 1.0, 1.0, 1.0 );",


        // RGBA depth

        "float unpackDepth( const in vec4 rgba_depth ) {",

        "const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );",
        "float depth = dot( rgba_depth, bit_shift );",
        "return depth;",

        "}",

        // generating noise / pattern texture for dithering

        "vec2 rand( const vec2 coord ) {",

        "vec2 noise;",

        "if ( useNoise ) {",

        "float nx = dot ( coord, vec2( 12.9898, 78.233 ) );",
        "float ny = dot ( coord, vec2( 12.9898, 78.233 ) * 2.0 );",

        "noise = clamp( fract ( 43758.5453 * sin( vec2( nx, ny ) ) ), 0.0, 1.0 );",

        "} else {",

        "float ff = fract( 1.0 - coord.s * ( width / 2.0 ) );",
        "float gg = fract( coord.t * ( height / 2.0 ) );",

        "noise = vec2( 0.25, 0.75 ) * vec2( ff ) + vec2( 0.75, 0.25 ) * gg;",

        "}",

        "return ( noise * 2.0  - 1.0 ) * noiseAmount;",

        "}",

        "float doFog() {",

        "float zdepth = unpackDepth( texture2D( tDepth, vUv ) );",
        "float depth = -cameraFar * cameraNear / ( zdepth * cameraFarMinusNear - cameraFar );",

        "return smoothstep( fogNear, fogFar, depth );",

        "}",

        "float readDepth( const in vec2 coord ) {",

        // "return ( 2.0 * cameraNear ) / ( cameraFar + cameraNear - unpackDepth( texture2D( tDepth, coord ) ) * ( cameraFar - cameraNear ) );",
        "return cameraCoef / ( cameraFarPlusNear - unpackDepth( texture2D( tDepth, coord ) ) * cameraFarMinusNear );",


        "}",

        "float compareDepths( const in float depth1, const in float depth2, inout int far ) {",

        "float garea = 2.0;",                         // gauss bell width
        "float diff = ( depth1 - depth2 ) * 100.0;",  // depth difference (0-100)

        // reduce left bell width to avoid self-shadowing

        "if ( diff < gDisplace ) {",

        "garea = diffArea;",

        "} else {",

        "far = 1;",

        "}",

        "float dd = diff - gDisplace;",
        "float gauss = pow( EULER, -2.0 * dd * dd / ( garea * garea ) );",
        "return gauss;",

        "}",

        "float calcAO( float depth, float dw, float dh ) {",

        "float dd = radius - depth * radius;",
        "vec2 vv = vec2( dw, dh );",

        "vec2 coord1 = vUv + dd * vv;",
        "vec2 coord2 = vUv - dd * vv;",

        "float temp1 = 0.0;",
        "float temp2 = 0.0;",

        "int far = 0;",
        "temp1 = compareDepths( depth, readDepth( coord1 ), far );",

        // DEPTH EXTRAPOLATION

        "if ( far > 0 ) {",

        "temp2 = compareDepths( readDepth( coord2 ), depth, far );",
        "temp1 += ( 1.0 - temp1 ) * temp2;",

        "}",

        "return temp1;",

        "}",

        "void main() {",

        "vec2 noise = rand( vUv );",
        "float depth = readDepth( vUv );",

        "float tt = clamp( depth, aoClamp, 1.0 );",

        "float w = ( 1.0 / width )  / tt + ( noise.x * ( 1.0 - noise.x ) );",
        "float h = ( 1.0 / height ) / tt + ( noise.y * ( 1.0 - noise.y ) );",

        "float pw;",
        "float ph;",

        "float ao;",

        "float dz = 1.0 / float( samples );",
        "float z = 1.0 - dz / 2.0;",
        "float l = 0.0;",

        "for ( int i = 0; i <= samples; i ++ ) {",

        "float r = sqrt( 1.0 - z );",

        "pw = cos( l ) * r;",
        "ph = sin( l ) * r;",
        "ao += calcAO( depth, pw * w, ph * h );",
        "z = z - dz;",
        "l = l + DL;",

        "}",

        "ao /= float( samples );",
        "ao = 1.0 - ao;",

        "if ( fogEnabled ) {",

        "ao = mix( ao, 1.0, doFog() );",

        "}",

        "vec3 color = texture2D( tDiffuse, vUv ).rgb;",

        "vec3 lumcoeff = vec3( 0.299, 0.587, 0.114 );",
        "float lum = dot( color.rgb, lumcoeff );",
        "vec3 luminance = vec3( lum );",

        "vec3 final = vec3( color * mix( vec3( ao ), vec3( 1.0 ), luminance * lumInfluence ) );",  // mix( color * ao, white, luminance )

        "if ( onlyAO ) {",

        "final = onlyAOColor * vec3( mix( vec3( ao ), vec3( 1.0 ), luminance * lumInfluence ) );",  // ambient occlusion only

        "}",

        "gl_FragColor = vec4( final, 1.0 );",

        "}"

    ].join("\n")
}

};
