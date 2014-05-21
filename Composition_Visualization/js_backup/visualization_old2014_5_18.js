/**
 * Created by Yongnanzhu on 5/12/2014.
 */
var rotateState = true;
var selectState = false;

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
    var cWidth = 400;
    var cHeight = 400;

    //For trackball control
    var mouseDown = false;
    var rotateStartP = new THREE.Vector3(0,0,1);
    var rotateEndP = new THREE.Vector3(0,0,1);
    var quater;
    var zoomValue =0;

    //For interactive line selection
    var projector, raycaster;
    var mouse = new THREE.Vector2();
    var currentIntersected;
    var selectHelper;
    //Keyboard
    var keyboard = new KeyboardState();

    var count = [ 0, 0, 0, 0, 0];

    this.fillScene = function () {
        scene = new THREE.Scene();

        selectHelper = new THREE.Sprite( new THREE.SpriteMaterial( {color: 0xff0000} ));
        selectHelper.scale.x = selectHelper.scale.y = 5;
        selectHelper.visible = false;
        scene.add( selectHelper );

        //objectvar
        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };

        var cc_loader = new GeometryLoader(manager,'cc' );
        cc_loader.load( 's1_cc.data', function ( object) {
            if(cc_loader.center!==null)
            {
                object.position.x = -cc_loader.center.x;
                object.position.y = -cc_loader.center.y;
                object.position.z = -cc_loader.center.z;
                //group.add( object );
                mainGroup.add(object);

            }
        });
        var cg_loader = new GeometryLoader(manager,'cg');
        cg_loader.load( 's1_cg.data', function ( object ) {
            if (cg_loader.center !== null) {
                object.position.x = -cg_loader.center.x;
                object.position.y = -cg_loader.center.y;
                object.position.z = -cg_loader.center.z;
            }
        });
        var cst_loader = new GeometryLoader(manager,'cst');
        cst_loader.load( 's1_cst.data', function ( object ) {
            if (cst_loader.center !== null ) {
                //-116,-126,-94
                object.position.x = 4-cst_loader.center.x;
                object.position.y = -12-cst_loader.center.y;
                object.position.z = -25-cst_loader.center.z;

                mainGroup.add(object);
            }
        });

        var ifo_loader = new GeometryLoader(manager,'ifo');
        ifo_loader.load( 's1_ifo.data', function ( object ) {
            if (ifo_loader.center !== null) {
                //-118,-125,-90
                object.position.x = -32.0 - ifo_loader.center.x;
                object.position.y = -3.2-ifo_loader.center.y;
                object.position.z = -22- ifo_loader.center.z;
                //group.add( object );
                mainGroup.add(object);
            }
        });
        var ilf_loader = new GeometryLoader(manager ,'ilf');
        ilf_loader.load( 's1_ilf.data', function ( object ) {
            if (ilf_loader.center !== null) {
                //-118,-123,-90
                object.position.x = -6 - ilf_loader.center.x;
                object.position.y = 34-ilf_loader.center.y;
                object.position.z = -12.3-ilf_loader.center.z;
                //group.add( object );
                mainGroup.add(object);
            }
        });
        scene.add(mainGroup);
    };

    this.init = function () {
        cWidth = 400;
        cHeight = 400;
        var canvasRatio = cWidth / cHeight;

        projector = new THREE.Projector();
        raycaster = new THREE.Raycaster();
        //raycaster.linePrecision = 3;
        // RENDERER
        renderer = new THREE.WebGLRenderer( );
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        //renderer.setClearColor( 0xf0f0f0 );
        renderer.setSize(cWidth, cHeight);
        container.appendChild( renderer.domElement );

        canvas = renderer.domElement;

        // CAMERA
        camera = new THREE.PerspectiveCamera( 60, canvasRatio, 1, 4000 );
        camera.position.set( 0, 0, 220 );

        $('#container'+ id).resize( function onWindowResize() {
            cWidth = $('#container'+ id).width();
            cHeight = $('#container'+ id).height();
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

        /*if(event.which === 1) //Be sure, we use left mouse to select fibers
        {} */
        mouseDown = true;
        rotateStartP = projectOnTrackball(event.clientX, event.clientY);


    }

    function onDocumentMouseMove( event ) {

        if(!mouseDown)
        {
            return;
        }
        var offset = $('#container'+ id).offset();
        mouse.x = ( (event.clientX- offset.left) / cWidth ) * 2 - 1;
        mouse.y = - ( (event.clientY- offset.top) / cHeight ) * 2 + 1;
        rotateEndP = projectOnTrackball(event.clientX, event.clientY);
    }

    function projectOnTrackball(pageX, pageY) // The screen coordinate[(0,0)on the left-top] convert to the
        //trackball coordinate [(0,0) on the center of the page]
    {
        var mouseOnBall = new THREE.Vector3();
        var offset = $('#container'+ id).offset();
        mouseOnBall.set(
                ( (pageX- offset.left) / cWidth ) * 2 - 1,
                - ( (pageY- offset.top) / cHeight ) * 2 + 1,
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

    function rotateMatrix(rotateStart, rotateEnd)
    {
        var axis = new THREE.Vector3(),
            quaternion = new THREE.Quaternion();

        var angle = Math.acos( rotateStart.dot( rotateEnd ) / rotateStart.length() / rotateEnd.length() );

        if ( angle )
        {
            axis.crossVectors( rotateStart, rotateEnd ).normalize();
            angle *= 0.01*2;            //Here we could define rotate speed
            quaternion.setFromAxisAngle( axis, angle );
        }
        return  quaternion;
    }

    function onDocumentMouseUp( event ) {

        canvas.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        canvas.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        canvas.removeEventListener( 'mouseout', onDocumentMouseOut, false );
        mouseDown = false;
        rotateStartP = rotateEndP;
        selectHelper.visible = false;
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

    function animate() {
        requestAnimationFrame(animate);
        update();
        render();
    }

    function update(){
        quater = mainGroup.quaternion;

        if( selectState)
        {
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

            //x = RotationAxis.x * sin(RotationAngle / 2)
            //y = RotationAxis.y * sin(RotationAngle / 2)
            //z = RotationAxis.z * sin(RotationAngle / 2)
            //w = cos(RotationAngle / 2)
            var quaterX = new THREE.Quaternion(Math.sin(phiDelta / 2), 0, 0, Math.cos(phiDelta / 2));  // W,S
            var quaterY = new THREE.Quaternion(0, Math.sin(thetaDelta / 2), 0, Math.cos(thetaDelta / 2));   //A D
            var keyBoardquater = new THREE.Quaternion();
            keyBoardquater.multiplyQuaternions(quaterX,quaterY);
            quater.multiplyQuaternions(keyBoardquater,quater);
        }
        if(rotateState)
        {
            var rotateQuaternion = rotateMatrix(rotateStartP, rotateEndP);
            quater.multiplyQuaternions(rotateQuaternion,quater);
        }

        quater.normalize();
        mainGroup.setRotationFromQuaternion(quater);
        mainGroup.position.z += zoomValue;
        zoomValue = 0;
    }

    function render() {
        if(mouseDown &&selectState)
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
                switch (currentIntersected.name)
                {
                    case 'cc':
                        count[0]++;
                        break;
                    case 'cg':
                        count[1]++;
                        break;
                    case 'cst':
                        count[2]++;
                        break;
                    case 'ifo':
                        count[3]++;
                        break;
                    case 'ilf':
                        count[4]++;
                        break;
                    default:
                        break;
                }
                currentIntersected.material.linewidth = 5;

                selectHelper.visible = true;
                selectHelper.position.copy( intersects[ 0 ].point );

            }
            else {

                currentIntersected = undefined;

                selectHelper.visible = false;

            }
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
function addBubble(id,name,mousePosX,mousePosY)
{
    var bubblediv = $(bubble_div(id,name,mousePosX,mousePosY));
    $("#bubble").append(bubblediv);
    //var bubble = new Bubble(id,'s1_'+name+'.data');
    var bubble = new Bubble(id);
    $(".bubble").draggable({ containment: '#bgCanvas', scroll: false });
    $("canvas").draggable({ containment: '#bgCanvas', scroll: false }).resizable();

    var parent =$('#bubble'+id ).contextMenu({
        selector: '.dragheader',
        callback: function(key, options) {
            if(key==="delete")
            {
                parent.remove();
                delete bubble;
            }
            else if(key==="select")
            {
                rotateState = false;
                selectState = true;
            }
            else if(key==="rotate")
            {
                rotateState = true;
                selectState = false;
            }
            else if(key==="export")
            {
                rotateState = true;
                selectState = false;
            }

        },
        items: {
            "delete": {name: "Delete"},
            "select": {name: "Select"},
            "rotate": {name: "Rotate"},
            "export": {name: "Export"}
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
function bubble_div(id,name,mousePosX,mousePosY) {
    var tmp = '';
    tmp += '<div id ="bubble'+id+'" class="bubble shadow drag" style="position: absolute; left:'+mousePosX +'px; top:'+ mousePosY+'px; ">';
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
                addBubble(BUBBLE_COUNT,'5 fiber bundles',mousePosX,mousePosY);
                /*$('#bubble'+BUBBLE_COUNT).css({
                 left : mousePosX,
                 top : mousePosY
                 }); */
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