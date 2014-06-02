

    displayShader = gl.shader({
        common: '#line 55 pcf-shadow.coffee\n' +
            'varying vec3 vWorldNormal;' +
            'varying vec4 vWorldPosition;\n' +
            'uniform mat4 camProj, camView;\n' +
            'uniform mat4 lightProj, lightView; ' +
            'uniform mat3 lightRot;\n' +
            'uniform mat4 model;',
        vertex: '#line 61 pcf-shadow.coffee\n' +
            'attribute vec3 position, normal;\n\n' +
            'void main(){\n' +
            '    vWorldNormal = normal;\n' +
            '    vWorldPosition = model * vec4(position, 1.0);\n' +
            '    gl_Position = camProj * camView * vWorldPosition;\n' +
            '}',
        fragment: '#line 70 pcf-shadow.coffee\n' +
            'uniform sampler2D sLightDepth;\n' +
            'uniform vec2 lightDepthSize;\n\n' +
            'float texture2DCompare(sampler2D depths, vec2 uv, float compare){\n' +
            '    float depth = texture2D(depths, uv).r;\n' +
            '    return step(compare, depth);\n' +
            '}\n\n' +
            'float PCF(sampler2D depths, vec2 size, vec2 uv, float compare){\n' +
            '    float result = 0.0;\n' +
            '    for(int x=-2; x<=2; x++){\n' +
            '        for(int y=-2; y<=2; y++){\n' +
            '            vec2 off = vec2(x,y)/size;\n' +
            '            result += texture2DCompare(depths, uv+off, compare);\n' +
            '        }\n' +
            '    }\n' +
            '    return result/25.0;\n' +
            '}\n\n' +
            'float attenuation(vec3 dir){\n' +
            '    float dist = length(dir);\n' +
            '    float radiance = 1.0/(1.0+pow(dist/10.0, 2.0));\n' +
            '    return clamp(radiance*10.0, 0.0, 1.0);\n' +
            '}\n\n' +
            'float influence(vec3 normal, float coneAngle){\n' +
            '    float minConeAngle = ((360.0-coneAngle-10.0)/360.0)*PI;\n' +
            '    float maxConeAngle = ((360.0-coneAngle)/360.0)*PI;\n' +
            '    return smoothstep(minConeAngle, maxConeAngle, acos(normal.z));\n' +
            '}\n\n' +
            'float lambert(vec3 surfaceNormal, vec3 lightDirNormal){\n' +
            '    return max(0.0, dot(surfaceNormal, lightDirNormal));\n' +
            '}\n\n' +
            'vec3 skyLight(vec3 normal){\n' +
            '    return vec3(smoothstep(0.0, PI, PI-acos(normal.y)))*0.4;\n' +
            '}\n\n' +
            'vec3 gamma(vec3 color){\n' +
            '    return pow(color, vec3(2.2));\n' +
            '}\n\n' +
            'void main(){\n' +
            '    vec3 worldNormal = normalize(vWorldNormal);\n\n' +
            '    vec3 camPos = (camView * vWorldPosition).xyz;\n' +
            '    vec3 lightPos = (lightView * vWorldPosition).xyz;\n' +
            '    vec3 lightPosNormal = normalize(lightPos);\n' +
            '    vec3 lightSurfaceNormal = lightRot * worldNormal;\n' +
            '    vec4 lightDevice = lightProj * vec4(lightPos, 1.0);\n' +
            '    vec2 lightDeviceNormal = lightDevice.xy/lightDevice.w;\n' +
            '    vec2 lightUV = lightDeviceNormal*0.5+0.5;\n\n' +
            '    // shadow calculation\n' +
            '    float bias = 0.001;\n' +
            '    float lightDepth2 = clamp(length(lightPos)/40.0, 0.0, 1.0)-bias;\n' +
            '    float illuminated = PCF(sLightDepth, lightDepthSize, lightUV, lightDepth2);\n    \n' +
            '    vec3 excident = (\n' +
            '        skyLight(worldNormal) +\n' +
            '        lambert(lightSurfaceNormal, -lightPosNormal) *\n' +
            '        influence(lightPosNormal, 55.0) *\n ' +
            '        attenuation(lightPos) *\n' +
            '        illuminated\n' +
            '    );\n' +
            '    gl_FragColor = vec4(gamma(excident), 1.0);\n}'
    });

    lightShader = gl.shader({
        common: '#line 142 pcf-shadow.coffee\n' +
            'varying vec3 vWorldNormal;' +
            ' varying vec4 vWorldPosition;\n' +
            'uniform mat4 lightProj, lightView;' +
            ' uniform mat3 lightRot;\n' +
            'uniform mat4 model;',
        vertex: '#line 147 pcf-shadow.coffee\n' +
            'attribute vec3 position, normal;\n\n' +
            'void main(){\n' +
            '    vWorldNormal = normal;\n' +
            '    vWorldPosition = model * vec4(position, 1.0);\n' +
            '    gl_Position = lightProj * lightView * vWorldPosition;\n' +
            '}',
        fragment: '#line 156 pcf-shadow.coffee\n' +
            'void main(){\n' +
            '    vec3 worldNormal = normalize(vWorldNormal);\n' +
            '    vec3 lightPos = (lightView * vWorldPosition).xyz;\n' +
            '    float depth = clamp(length(lightPos)/40.0, 0.0, 1.0);\n' +
            '    gl_FragColor = vec4(vec3(depth), 1.0);\n' +
            '}'
    });
    displayShader = gl.shader({
            common: '#line 53 pcf-lerp-shadow.coffee\n' +
                'varying vec3 vWorldNormal; ' +
                'varying vec4 vWorldPosition;\n' +
                'uniform mat4 camProj, camView;\n' +
                'uniform mat4 lightProj, lightView;' +
                ' uniform mat3 lightRot;\n' +
                'uniform mat4 model;',
            vertex: '#line 59 pcf-lerp-shadow.coffee\n' +
                'attribute vec3 position, normal;\n\n' +
                'void main(){\n' +
                '    vWorldNormal = normal;\n' +
                '    vWorldPosition = model * vec4(position, 1.0);\n ' +
                '   gl_Position = camProj * camView * vWorldPosition;\n' +
                '}',
            fragment: '#line 68 pcf-lerp-shadow.coffee\n' +
                'uniform sampler2D sLightDepth;\n' +
                'uniform vec2 lightDepthSize;\n\n' +
                'float texture2DCompare(sampler2D depths, vec2 uv, float compare){\n' +
                '    float depth = texture2D(depths, uv).r;\n' +
                '    return step(compare, depth);\n}\n\n' +
                'float texture2DShadowLerp(sampler2D depths, vec2 size, vec2 uv, float compare){\n' +
                '    vec2 texelSize = vec2(1.0)/size;\n' +
                '    vec2 f = fract(uv*size+0.5);\n' +
                '    vec2 centroidUV = floor(uv*size+0.5)/size;\n\n' +
                '    float lb = texture2DCompare(depths, centroidUV+texelSize*vec2(0.0, 0.0), compare);\n' +
                '    float lt = texture2DCompare(depths, centroidUV+texelSize*vec2(0.0, 1.0), compare);\n' +
                '    float rb = texture2DCompare(depths, centroidUV+texelSize*vec2(1.0, 0.0), compare);\n ' +
                '    float rt = texture2DCompare(depths, centroidUV+texelSize*vec2(1.0, 1.0), compare);\n' +
                '    float a = mix(lb, lt, f.y);\n' +
                '    float b = mix(rb, rt, f.y);\n' +
                '    float c = mix(a, b, f.x);\n' +
                '    return c;\n' +
                '}\n\n' +
                'float PCF(sampler2D depths, vec2 size, vec2 uv, float compare){\n' +
                '    float result = 0.0;\n' +
                '    for(int x=-1; x<=1; x++){\n' +
                '        for(int y=-1; y<=1; y++){\n' +
                '            vec2 off = vec2(x,y)/size;\n' +
                '            result += texture2DShadowLerp(depths, size, uv+off, compare);\n' +
                '        }\n' +
                '    }\n ' +
                '   return result/9.0;\n' +
                '}\n\n' +
                'float attenuation(vec3 dir){\n' +
                '    float dist = length(dir);\n' +
                '    float radiance = 1.0/(1.0+pow(dist/10.0, 2.0));\n' +
                '    return clamp(radiance*10.0, 0.0, 1.0);\n' +
                '}\n\n' +
                'float influence(vec3 normal, float coneAngle){\n' +
                '    float minConeAngle = ((360.0-coneAngle-10.0)/360.0)*PI;\n' +
                '    float maxConeAngle = ((360.0-coneAngle)/360.0)*PI;\n' +
                '    return smoothstep(minConeAngle, maxConeAngle, acos(normal.z));\n' +
                '}\n\n' +
                'float lambert(vec3 surfaceNormal, vec3 lightDirNormal){\n' +
                '    return max(0.0, dot(surfaceNormal, lightDirNormal));\n' +
                '}\n\n' +
                'vec3 skyLight(vec3 normal){\n' +
                '    return vec3(smoothstep(0.0, PI, PI-acos(normal.y)))*0.4;\n' +
                '}\n\n' +
                'vec3 gamma(vec3 color){\n' +
                '    return pow(color, vec3(2.2));\n' +
                '}\n\n' +
                'void main(){\n' +
                '    vec3 worldNormal = normalize(vWorldNormal);\n\n' +
                '    vec3 camPos = (camView * vWorldPosition).xyz;\n' +
                '    vec3 lightPos = (lightView * vWorldPosition).xyz;\n' +
                '    vec3 lightPosNormal = normalize(lightPos);\n' +
                '    vec3 lightSurfaceNormal = lightRot * worldNormal;\n' +
                '    vec4 lightDevice = lightProj * vec4(lightPos, 1.0);\n' +
                '    vec2 lightDeviceNormal = lightDevice.xy/lightDevice.w;\n' +
                '    vec2 lightUV = lightDeviceNormal*0.5+0.5;\n\n' +
                '    // shadow calculation\n' +
                '    float bias = 0.001;\n' +
                '    float lightDepth2 = clamp(length(lightPos)/40.0, 0.0, 1.0)-bias;\n' +
                '    float illuminated = PCF(sLightDepth, lightDepthSize, lightUV, lightDepth2);\n\n' +
                '    vec3 excident = (\n' +
                '        skyLight(worldNormal) +\n' +
                '        lambert(lightSurfaceNormal, -lightPosNormal) *\n' +
                '        influence(lightPosNormal, 55.0) *\n' +
                '        attenuation(lightPos) *\n' +
                '        illuminated\n' +
                '    );\n' +
                '    gl_FragColor = vec4(gamma(excident), 1.0);\n' +
                '}'
        });


        lightShader = gl.shader({
            common: '#line 155 pcf-lerp-shadow.coffee\nvarying vec3 vWorldNormal; varying vec4 vWorldPosition;\nuniform mat4 lightProj, lightView; uniform mat3 lightRot;\nuniform mat4 model;',
            vertex: '#line 160 pcf-lerp-shadow.coffee\nattribute vec3 position, normal;\n\nvoid main(){\n    vWorldNormal = normal;\n    vWorldPosition = model * vec4(position, 1.0);\n    gl_Position = lightProj * lightView * vWorldPosition;\n}',
            fragment: '#line 169 pcf-lerp-shadow.coffee\nvoid main(){\n    vec3 worldNormal = normalize(vWorldNormal);\n    vec3 lightPos = (lightView * vWorldPosition).xyz;\n    float depth = clamp(length(lightPos)/40.0, 0.0, 1.0);\n    gl_FragColor = vec4(vec3(depth), 1.0);\n}'
        });

