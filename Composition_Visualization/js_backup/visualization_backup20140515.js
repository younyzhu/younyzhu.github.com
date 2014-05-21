/**
 * Created by Yongnanzhu on 5/12/2014.
 */

function Bubble(id)
{
    ////////////////////////////////////////////////////////////////////////////////
    /*global THREE, window, document*/
    var camera, scene, renderer;
    var mainGroup = new THREE.Object3D();
    var controls;
    //var container = document.getElementById('container'+ id);
    var container = $('#container'+ id)[0];
    var canvas;

    this.fillScene = function () {
        scene = new THREE.Scene();

        //objectvar
        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };

        var cc_loader = new GeometryLoader(manager);
        cc_loader.load( 's1_cc.data', function ( object ) {
            if(cc_loader.center!==null)
            {
                object.position.x = -cc_loader.center.x;
                object.position.y = -cc_loader.center.y;
                object.position.z = -cc_loader.center.z;
                //group.add( object );
                mainGroup.add(object);

            }
        });
        var cg_loader = new GeometryLoader(manager);
        cg_loader.load( 's1_cg.data', function ( object ) {
            if (cg_loader.center !== null) {
                object.position.x = -cg_loader.center.x;
                object.position.y = -cg_loader.center.y;
                object.position.z = -cg_loader.center.z;
            }
        });
        var cst_loader = new GeometryLoader(manager);
        cst_loader.load( 's1_cst.data', function ( object ) {
            if (cst_loader.center !== null ) {

                object.position.x = -116;
                object.position.y = -126;
                object.position.z = -94;

                mainGroup.add(object);
            }
        });

        var ifo_loader = new GeometryLoader(manager);
        ifo_loader.load( 's1_ifo.data', function ( object ) {
            if (ifo_loader.center !== null) {
                object.position.x = -118;
                object.position.y = -125;
                object.position.z = -90;
                //group.add( object );
                mainGroup.add(object);
            }
        });
        var ilf_loader = new GeometryLoader(manager );
        ilf_loader.load( 's1_ilf.data', function ( object ) {
            if (ilf_loader.center !== null) {
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

        // RENDERER
        renderer = new THREE.WebGLRenderer( );
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        //renderer.setClearColor( 0xf0f0f0 );
        renderer.setSize(canvasWidth, canvasHeight);
        container.appendChild( renderer.domElement );
        // CAMERA
        camera = new THREE.PerspectiveCamera( 60, canvasRatio, 1, 4000 );
        camera.position.set( 0, 0, 220 );

        // CONTROLS
        controls = new THREE.TrackballControls( camera, renderer.domElement);

        canvas = render.domElement;

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [ 65, 83, 68 ];

        controls.addEventListener( 'change', render );

        $('#container'+ id).resize( function onWindowResize() {
            var cWidth = $('#container'+ id).width();
            var cHeight = $('#container'+ id).height();
            camera.aspect = cWidth / cHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( cWidth, cHeight );
            $('#bubble'+ id).children('#paraMenu').css({left: cWidth -15});
        });
        //container.addEventListener( 'resize', onWindowResize, false );
    };


     function animate() {
        requestAnimationFrame(animate);
        controls.update();
        render();
    }

    function render() {
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
            tmp += '    <li class="para1">Size</li>';
            tmp += '    <li class="para2">Texture</li>';
            tmp += '    <li class="para3">Shape</li>';
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
     });
 }
BUBBLE_COUNT=0;
$(document).ready(function(){
    if ( ! Detector.webgl )
        Detector.addGetWebGLMessage();

    $('#bubble').contextMenu({
        selector: '#bgCanvas',
        callback: function(key, options) {
            //var m = "clicked: " + key;
            //window.console && console.log(m) || alert(m);
             if(key === 'Open_Bubble')
             {
                 BUBBLE_COUNT++;
                 addBubble(BUBBLE_COUNT,'cc');
             }
            else if(key === 'Delete_All') //buble numer camer from 1...n
             {
                 while(BUBBLE_COUNT)
                 {
                     $("#bubble"+BUBBLE_COUNT).remove();
                     BUBBLE_COUNT--;
                 }
             }
            else if(key === 'Open_VC_Menu')
             {
                 addVisualCueMenu();
             }
        },
        items: {
            "Open_Bubble": {name: "Open_bubble"},
            "Open_VC_Menu": {name: "Open_vc_menu"},
            "sep1": "---------",
            "Delete_All": {name: "Delete_all"}
        }
    });
    $(".drag").draggable();

});