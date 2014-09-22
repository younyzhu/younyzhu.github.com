/**
 * Created by Yongnanzhu on 5/12/2014.
 */

function Bubble(id)
{
    ////////////////////////////////////////////////////////////////////////////////
    /*global THREE, window, document*/
    var camera, scene, renderer;
    var mainGroup = new THREE.Object3D();
    //var controls;
    //var container = document.getElementById('container'+ id);
    var container = $('#container'+ id)[0];
    var canvas;

    //For trackball control
    var mouseDown = false;
    var rotateStartP = new THREE.Vector3(0,0,1);
    var rotateEndP = new THREE.Vector3(0,0,1);
    var quater;
    var zoomValue =0;

    //Interact with line
    var projector, raycaster;
    var mouse = new THREE.Vector2();
    var currentIntersected;

    var keyboard = new KeyboardState();

    this.fillScene = function () {
        scene = new THREE.Scene();

        var light;
        light = new THREE.DirectionalLight( 0xffeedd );
        light.position.set( 0, 0, 200 );
        scene.add( light );
        light = new THREE.DirectionalLight( 0xffeedd );
        light.position.set( 0, 200, 0 );
        scene.add( light );

        //objectvar
        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };

        var cc_loader = new GeometryLoader(manager);
        cc_loader.load( 's1_cc.data', function ( geometry ) {
            if(cc_loader.center!==null)
            {
                var ribbonmaterial = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors,side:THREE.DoubleSide});
                var object = new THREE.Mesh( geometry, ribbonmaterial );

                object.position.x = -cc_loader.center.x;
                object.position.y = -cc_loader.center.y;
                object.position.z = -cc_loader.center.z;
                //group.add( object );
                mainGroup.add(object);

            }
        });
        var cg_loader = new GeometryLoader(manager);
        cg_loader.load( 's1_cg.data', function ( geometry ) {
            if (cg_loader.center !== null) {
                var ribbonmaterial = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors,side:THREE.DoubleSide});
                var object = new THREE.Mesh( geometry, ribbonmaterial );
                object.position.x = -cg_loader.center.x;
                object.position.y = -cg_loader.center.y;
                object.position.z = -cg_loader.center.z;
            }
        });
        var cst_loader = new GeometryLoader(manager);
        cst_loader.load( 's1_cst.data', function ( geometry ) {
            if (cst_loader.center !== null ) {
                var ribbonmaterial = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors,side:THREE.DoubleSide});
                var object = new THREE.Mesh( geometry, ribbonmaterial );
                object.position.x = -116;
                object.position.y = -126;
                object.position.z = -94;

                mainGroup.add(object);
            }
        });

        var ifo_loader = new GeometryLoader(manager);
        ifo_loader.load( 's1_ifo.data', function ( geometry ) {
            if (ifo_loader.center !== null) {
                var ribbonmaterial = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors,side:THREE.DoubleSide});
                var object = new THREE.Mesh( geometry, ribbonmaterial );
                object.position.x = -118;
                object.position.y = -125;
                object.position.z = -90;
                //group.add( object );
                mainGroup.add(object);
            }
        });
        var ilf_loader = new GeometryLoader(manager );
        ilf_loader.load( 's1_ilf.data', function ( geometry ) {
            if (ilf_loader.center !== null) {
                var ribbonmaterial = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors,side:THREE.DoubleSide});
                var object = new THREE.Mesh( geometry, ribbonmaterial );
                object.position.x = -118;
                object.position.y = -123;
                object.position.z = -90;
                //group.add( object );
                mainGroup.add(object);
            }
        });
        scene.add(mainGroup);
    };

    this.init = function () {
        var canvasWidth = 400;
        var canvasHeight = 400;
        var canvasRatio = canvasWidth / canvasHeight;

        projector = new THREE.Projector();
        raycaster = new THREE.Raycaster();
        //raycaster.linePrecision = 3;


        // RENDERER
        renderer = new THREE.WebGLRenderer( );
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        //renderer.setClearColor( 0xf0f0f0 );
        renderer.setSize(canvasWidth, canvasHeight);
        container.appendChild( renderer.domElement );

        canvas = renderer.domElement;
        // CAMERA
        camera = new THREE.PerspectiveCamera( 60, canvasRatio, 1, 4000 );
        camera.position.set( 0, 0, 220 );

        // CONTROLS

        $('#container'+ id).resize( function onWindowResize() {
            var cWidth = $('#container'+ id).width();
            var cHeight = $('#container'+ id).height();
            camera.aspect = cWidth / cHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( cWidth, cHeight );
            $('#bubble'+ id).children('#paraMenu').css({left: cWidth -15});
        });


        canvas.addEventListener( 'mousedown', onDocumentMouseDown, false );
        canvas.addEventListener( 'mousewheel', onMouseWheel, false );
        canvas.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
    };

    function onDocumentMouseDown( event ) {

        event.preventDefault();

        canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
        canvas.addEventListener( 'mouseup', onDocumentMouseUp, false );
        canvas.addEventListener( 'mouseout', onDocumentMouseOut, false );
        mouseDown = true;
        rotateStartP = projectOnTrackball(event.clientX, event.clientY);
    }

    function onDocumentMouseMove( event ) {

        if(!mouseDown)
        {
            return;
        }
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        rotateEndP = projectOnTrackball(event.clientX, event.clientY);
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

    function onDocumentMouseUp( event ) {

        canvas.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        canvas.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        canvas.removeEventListener( 'mouseout', onDocumentMouseOut, false );
        mouseDown = false;
        rotateStartP = rotateEndP;

    }

    function onDocumentMouseOut( event ) {

        canvas.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        canvas.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        canvas.removeEventListener( 'mouseout', onDocumentMouseOut, false );

    }

    function onMouseWheel( event ) {

        event.preventDefault();
        event.stopPropagation();

        var delta = 0;

        if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

            delta = event.wheelDelta / 40;

        } else if ( event.detail ) { // Firefox

            delta = - event.detail / 3;

        }

        zoomValue += delta ;

    }
    function rotateMatrix(rotateStart, rotateEnd)
    {
        var axis = new THREE.Vector3(),
            quaternion = new THREE.Quaternion();

        var angle = Math.acos( rotateStart.dot( rotateEnd ) / rotateStart.length() / rotateEnd.length() );

        if ( angle )
        {
            axis.crossVectors( rotateStart, rotateEnd ).normalize();
            angle *= 0.03;       //Here we could define rotate speed
            quaternion.setFromAxisAngle( axis, angle );
        }
        return  quaternion;
    }

     function animate() {
        requestAnimationFrame(animate);
        update();
        render();
    }

    function update(){

        keyboard.update();
        var phiDelta= 0;
        var thetaDelta=0;

        if ( keyboard.down("W") )
        {
            phiDelta -= 0.1;
        }

        if ( keyboard.down("S") )
        {
            phiDelta += 0.1;
        }

        if ( keyboard.pressed("A") )
        {
            thetaDelta -= 0.1;
        }

        if ( keyboard.pressed("D") )
        {
            thetaDelta += 0.1;
        }

        // RotationAngle is in radians
        /*
         x = RotationAxis.x * sin(RotationAngle / 2)
         y = RotationAxis.y * sin(RotationAngle / 2)
         z = RotationAxis.z * sin(RotationAngle / 2)
         w = cos(RotationAngle / 2)*/
        var quaterX = new THREE.Quaternion(Math.sin(phiDelta / 2), 0, 0, Math.cos(phiDelta / 2));  // W,S
        var quaterY = new THREE.Quaternion(0, Math.sin(thetaDelta / 2), 0, Math.cos(thetaDelta / 2));   //A D
        var keyBoardquater = new THREE.Quaternion();
        keyBoardquater.multiplyQuaternions(quaterX,quaterY);

        //var rotateQuaternion = rotateMatrix(rotateStartP, rotateEndP);
        quater = mainGroup.quaternion;
        //quater.multiplyQuaternions(rotateQuaternion,quater);
        quater.multiplyQuaternions(keyBoardquater,quater);
        quater.normalize();
        mainGroup.setRotationFromQuaternion(quater);
        mainGroup.position.z += zoomValue;
        zoomValue = 0;
    }

    function render() {

        if(mouseDown)
        {
            // find intersections using mouse
            var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
            projector.unprojectVector( vector, camera );

            raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

            var intersects = raycaster.intersectObjects( mainGroup.children, true);

            if ( intersects.length > 0 ) {

                if ( currentIntersected !== undefined ) {
                    currentIntersected.material.color.setRGB(1,1,0);
                }

                currentIntersected = intersects[ 0 ].object;
               // currentIntersected.material.linewidth = 5;

                //sphereInter.visible = true;
                //sphereInter.position.copy( intersects[ 0 ].point );

            }
            /*else {

             if ( currentIntersected !== undefined ) {
             currentIntersected.material.color.setRGB(1,0,0);

             }

             currentIntersected = undefined;

             //sphereInter.visible = true;

             } */
        }
        renderer.render(scene, camera);
    }

    try {
        this.init();
        this.fillScene();
        animate();

    } catch(e) {
        var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
        container.append(errorReport+e);
    }
}
function addBubble(id,name)
{
    var bubblediv = $(bubble_div(id,name));
    $("#bubble").append(bubblediv);
    //var bubble = new Bubble(id,'s1_'+name+'.data');
    var bubble = new Bubble(id);
    $(".bubble").draggable();
    $("canvas").draggable().resizable();

    var parent =$('#bubble'+id ).contextMenu({
        selector: '.dragheader',
        callback: function(key, options) {
            if(key==="delete")
            {
                parent.remove();
                delete bubble;
            }
        },
        items: {
            "delete": {name: "Delete"}
        }
    });
    /*
    parent.children(".dragheader").children(".close").click( function() {
        parent.remove();
        delete bubble;
    });
    */
    /*
    parent.children(".dragheader").children(".open_para").click( function() {
        parent.children("#paraMenu").show();
    });
    parent.children("#paraMenu").children(".para_header").children(".close_para").click( function() {
        parent.children("#paraMenu").hide();
    });
    */
    parent.children(".dragheader").children(".open_para").click( function() {
        parent.children("#paraMenu").toggle();
        BUBBLE_COUNT--;
    });
}
function bubble_div(id,name) {
    var tmp = '';
    tmp += '<div id ="bubble'+id+'" class="bubble shadow drag" style="position: absolute; left:0px; top:0px; ">';
        tmp += '<div id ="drag'+id+'" class="dragheader">' + name;
            tmp += '<span class="open_para">O</span>';
        //tmp += '<span class="close">X</span>';
        tmp += '</div>';

        tmp += '<div id="container'+id+'" height="400" width="400">';
        tmp += '</div>';
        //
        tmp += '<div id="paraMenu" class="widget shadow" style="position: absolute; left:385px; top:-17px; display: none">';
            tmp += '<div class="para_header">Parameter';
            //tmp += '<span class="close_para">X</span>';
            tmp += '</div>';
            tmp += '<ul id="para_items">';
            tmp += '    <li class="para">Size</li>';
            tmp += '    <li class="para">Texture</li>';
            tmp += '    <li class="para">Shape</li>';
            tmp += '</ul>';
        tmp += '</div>';
        //
    tmp += '</div>';
    return tmp;
}

function bubble_visual_cue() {
    var tmp = '';
    tmp += '<div id="vcMenu" class="widget shadow drag" style="position: absolute; left:0px; top:400px;">';
    tmp += '<div class="dragheader">Visual Cue';
    tmp += '<span class="close">X</span>';
    tmp += '</div>';
    tmp += '<ul id="vitems">';
    tmp += '    <li class="cue1">Size</li>';
    tmp += '    <li class="cue2">Texture</li>';
    tmp += '    <li class="cue3">Shape</li>';
    tmp += '    <li class="cue4">Color</li>';
    tmp += '    <li class="cue5">Orientation</li>';
    tmp += '    <li class="cue6">Value</li>';
    tmp += '</ul>';
    tmp += '</div>';
    return tmp;
}
 function addVisualCueMenu()
 {
     var vcdiv = $(bubble_visual_cue());
     $('body').append(vcdiv);
     $(".drag").draggable();
     var parent =$('#vcMenu');
     parent.children(".dragheader").children(".close").click( function() {
         parent.remove();
         vcMenu_status = false
     });
 }
BUBBLE_COUNT=0;      //Global variable for counting the bubble number
var vcMenu_status = false;
$(document).ready(function(){

    if ( ! Detector.webgl )
        Detector.addGetWebGLMessage();

    var mousePosX, mousePosY;

    $('#bgCanvas').on('contextmenu', function(e) {
        var m = "x: " + e.clientX + "y" + e.clientY;
        mousePosX = e.clientX;
        mousePosY = e.clientY;
        window.console && console.log(m);
    });
    $('#bubble').contextMenu({
        selector: '#bgCanvas',
        callback: function(key, options) {
            //var m = "clicked: " + key;
            //window.console && console.log(m) || alert(m);
             if(key === 'Open_Bubble')
             {
                 BUBBLE_COUNT++;
                 addBubble(BUBBLE_COUNT,'cc');
                 $('#bubble'+BUBBLE_COUNT).css({
                     left : mousePosX,
                     top : mousePosY
                 });
             }
             else if(key === 'Open_VC_Menu')
             {
                 if(vcMenu_status===false)
                 {
                     addVisualCueMenu();
                     $('#vcMenu').css({
                         left: mousePosX,
                         top: mousePosY
                     });
                     vcMenu_status = true;
                 }
                  else
                 {
                     alert("You opened the menu!");
                 }
             }
            else if(key === 'Delete_All') //buble numer camer from 1...n
             {
                 while(BUBBLE_COUNT)
                 {
                     $("#bubble"+BUBBLE_COUNT).remove();
                     BUBBLE_COUNT--;
                 }
                 if($('#vcMenu')!==undefined)
                 {
                     $('#vcMenu').remove();
                 }
             }

        },
        items: {
            "Open_Bubble": {name: "Open_bubble", disabled: false},
            "Open_VC_Menu": {name: "Open_vc_menu", disabled: false},
            "sep1": "---------",
            "Delete_All": {name: "Delete_all", disabled: false}
        }
    });
    $(".drag").draggable();

});