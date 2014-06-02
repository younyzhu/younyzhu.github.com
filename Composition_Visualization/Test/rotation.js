Skip to content
Sign up Sign in
Explore
Features
Enterprise
Blog

This repository
Star 0 Fork 1 PUBLICdefmech/Three.js-Object-Rotation-with-Quaternion
    branch: master  Three.js-Object-Rotation-with-Quaternion / Rotation.js
    defmech defmech yesterday at 11:53 AM Added momentum so when you drag and release the cube slows down not j…
1 contributor
file  280 lines (215 sloc)  5.577 kb  Open EditRawBlameHistory Delete
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
185
186
187
188
189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220
221
222
223
224
225
226
227
228
229
230
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
262
263
264
265
266
267
268
269
270
271
272
273
274
275
276
277
278
279
280
window.log = function()
{
    if (this.console)
    {
        console.log(Array.prototype.slice.call(arguments));
    }
};

// Namespace
var Defmech = Defmech ||
{};

Defmech.RotationWithQuaternion = (function()
{
    'use_strict';

    var container;

    var camera, scene, renderer;

    var cube, plane;

    var mouseDown = false;
    var rotateStartPoint = new THREE.Vector3(0, 0, 1);
    var rotateEndPoint = new THREE.Vector3(0, 0, 1);

    var curQuaternion;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var rotationSpeed = 2;
    var lastMoveTimestamp,
        moveReleaseTimeDelta = 50;

    var startPoint = {
        x: 0,
        y: 0
    };

    var deltaX = 0,
        deltaY = 0;

    var setup = function()
    {
        container = document.createElement('div');
        document.body.appendChild(container);

        var info = document.createElement('div');
        info.style.position = 'absolute';
        info.style.top = '10px';
        info.style.width = '100%';
        info.style.textAlign = 'center';
        info.innerHTML = 'Drag to spin the cube';
        container.appendChild(info);

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.y = 150;
        camera.position.z = 500;

        scene = new THREE.Scene();

        // Cube

        var boxGeometry = new THREE.BoxGeometry(200, 200, 200);

        for (var i = 0; i < boxGeometry.faces.length; i += 2)
        {

            var color = {
                h: (1 / (boxGeometry.faces.length)) * i,
                s: 0.5,
                l: 0.5
            };

            boxGeometry.faces[i].color.setHSL(color.h, color.s, color.l);
            boxGeometry.faces[i + 1].color.setHSL(color.h, color.s, color.l);

        }

        var cubeMaterial = new THREE.MeshBasicMaterial(
            {
                vertexColors: THREE.FaceColors,
                overdraw: 0.5
            });

        cube = new THREE.Mesh(boxGeometry, cubeMaterial);
        cube.position.y = 200;
        scene.add(cube);

        // Plane

        var planeGeometry = new THREE.PlaneGeometry(200, 200);
        planeGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

        var planeMaterial = new THREE.MeshBasicMaterial(
            {
                color: 0xe0e0e0,
                overdraw: 0.5
            });

        plane = new THREE.Mesh(planeGeometry, planeMaterial);
        scene.add(plane);

        renderer = new THREE.CanvasRenderer();
        renderer.setClearColor(0xf0f0f0);
        renderer.setSize(window.innerWidth, window.innerHeight);

        container.appendChild(renderer.domElement);

        document.addEventListener('mousedown', onDocumentMouseDown, false);

        window.addEventListener('resize', onWindowResize, false);

        animate();
    };

    function onWindowResize()
    {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseDown(event)
    {
        event.preventDefault();

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);

        mouseDown = true;

        startPoint = {
            x: event.clientX,
            y: event.clientY
        };

        rotateStartPoint = rotateEndPoint = projectOnTrackball(0, 0);
    }

    function onDocumentMouseMove(event)
    {
        deltaX = event.x - startPoint.x;
        deltaY = event.y - startPoint.y;

        handleRotation();

        startPoint.x = event.x;
        startPoint.y = event.y;

        lastMoveTimestamp = new Date();
    }

    function onDocumentMouseUp(event)
    {
        if (new Date().getTime() - lastMoveTimestamp.getTime() > moveReleaseTimeDelta)
        {
            deltaX = event.x - startPoint.x;
            deltaY = event.y - startPoint.y;
        }

        mouseDown = false;

        document.removeEventListener('mousemove', onDocumentMouseMove, false);
        document.removeEventListener('mouseup', onDocumentMouseUp, false);
    }

    function projectOnTrackball(touchX, touchY)
    {
        var mouseOnBall = new THREE.Vector3();

        mouseOnBall.set(
            clamp(touchX / windowHalfX, -1, 1), clamp(-touchY / windowHalfY, -1, 1),
            0.0
        );

        var length = mouseOnBall.length();

        if (length > 1.0)
        {
            mouseOnBall.normalize();
        }
        else
        {
            mouseOnBall.z = Math.sqrt(1.0 - length * length);
        }

        return mouseOnBall;
    }

    function rotateMatrix(rotateStart, rotateEnd)
    {
        var axis = new THREE.Vector3(),
            quaternion = new THREE.Quaternion();

        var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

        if (angle)
        {
            axis.crossVectors(rotateStart, rotateEnd).normalize();
            angle *= rotationSpeed;
            quaternion.setFromAxisAngle(axis, angle);
        }
        return quaternion;
    }

    function clamp(value, min, max)
    {
        return Math.min(Math.max(value, min), max);
    }

    function animate()
    {
        requestAnimationFrame(animate);
        render();
    }

    function render()
    {
        if (!mouseDown)
        {
            var drag = 0.95;
            var minDelta = 0.05;

            if (deltaX < -minDelta || deltaX > minDelta)
            {
                deltaX *= drag;
            }
            else
            {
                deltaX = 0;
            }

            if (deltaY < -minDelta || deltaY > minDelta)
            {
                deltaY *= drag;
            }
            else
            {
                deltaY = 0;
            }

            handleRotation();
        }

        renderer.render(scene, camera);
    }

    var handleRotation = function()
    {
        rotateEndPoint = projectOnTrackball(deltaX, deltaY);

        var rotateQuaternion = rotateMatrix(rotateStartPoint, rotateEndPoint);
        curQuaternion = cube.quaternion;
        curQuaternion.multiplyQuaternions(rotateQuaternion, curQuaternion);
        curQuaternion.normalize();
        cube.setRotationFromQuaternion(curQuaternion);

        rotateEndPoint = rotateStartPoint;
    };

    // PUBLIC INTERFACE
    return {
        init: function()
        {
            setup();
        }
    };
})();

document.onreadystatechange = function()
{
    if (document.readyState === 'complete')
    {
        Defmech.RotationWithQuaternion.init();
    }
};
Status API Training Shop Blog About © 2014 GitHub, Inc. Terms Privacy Security Contact /**
 * Created by Yongnan on 5/31/2014.
 */
