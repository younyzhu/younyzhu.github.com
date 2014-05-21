/**
 * Created by Yongnanzhu on 5/19/2014.
 */
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
var rotateState = true;
var selectState = false;
function Bubble(id,name)
{
    ////////////////////////////////////////////////////////////////////////////////

    /*global THREE, window, document*/
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.id = id;
    this.bunbleName = name;

    this.mainGroup = new THREE.Object3D();
    //var controls;
    //var container = document.getElementById('container'+ id);
    this.container = $('#container' + id)[0];
    this.cWidth = 400;
    this.cHeight = 400;

    //For trackball control
    this.mouseDown = false;
    this.rotateStartP = new THREE.Vector3(0, 0, 1);
    this.rotateEndP = new THREE.Vector3(0, 0, 1);
    this.quater = new THREE.Quaternion();
    this.zoomValue = 0;

    //For interactive line selection
    this.projector = null;
    this.raycaster = null;
    this.mouse = new THREE.Vector2();
    this.currentIntersected = undefined;
    this.selectHelper = null;
    //Keyboard
    this.keyboard = new KeyboardState();

    //change state: select, rotate

    this.count = [ 0, 0, 0, 0, 0];

    this.init = __bind(this.init, this);
    this.fillScene = __bind(this.fillScene, this);
    this.update = __bind(this.update, this);
    this.render = __bind(this.render, this);
    this.animate = __bind(this.animate, this);

    this.onDocumentMouseDown = __bind(this.onDocumentMouseDown, this);
    this.onDocumentMouseMove = __bind(this.onDocumentMouseMove, this);
    this.projectOnTrackball = __bind(this.projectOnTrackball, this);
    this.rotateMatrix = __bind(this.rotateMatrix, this);
    this.projectOnTrackball = __bind(this.projectOnTrackball, this);
    this.onDocumentMouseUp = __bind(this.onDocumentMouseUp, this);
    this.onDocumentMouseOut = __bind(this.onDocumentMouseOut, this);
    this.onMouseWheel = __bind(this.onMouseWheel, this);
}
Bubble.prototype ={
    constructor: Bubble,
    fillScene: function () {

        var scope = this;
        this.scene = new THREE.Scene();

        this.selectHelper = new THREE.Sprite( new THREE.SpriteMaterial( {color: 0xff0000} ));
        this.selectHelper.scale.x = this.selectHelper.scale.y = 5;
        this.selectHelper.visible = false;
        this.scene.add( this.selectHelper );

        //objectvar
        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };
        if(this.bunbleName  === '5 fiber bundles')
        {
            var cc_loader = new GeometryLoader(manager,'cc' );
            cc_loader.load( './data/s1_cc.data', function ( object) {
                if(cc_loader.center!==null)
                {
                    object.position.x = -cc_loader.center.x;
                    object.position.y = -cc_loader.center.y;
                    object.position.z = -cc_loader.center.z;
                    //group.add( object );
                    scope.mainGroup.add(object);

                }
            });
            var cg_loader = new GeometryLoader(manager,'cg');
            cg_loader.load( './data/s1_cg.data', function ( object ) {
                if (cg_loader.center !== null) {
                    object.position.x = -cg_loader.center.x;
                    object.position.y = -cg_loader.center.y;
                    object.position.z = -cg_loader.center.z;
                    scope.mainGroup.add(object);
                }
            });
            var cst_loader = new GeometryLoader(manager,'cst');
            cst_loader.load( './data/s1_cst.data', function ( object ) {
                if (cst_loader.center !== null ) {
                    //-116,-126,-94
                    object.position.x = 4-cst_loader.center.x;
                    object.position.y = -12-cst_loader.center.y;
                    object.position.z = -25-cst_loader.center.z;

                    scope.mainGroup.add(object);
                }
            });

            var ifo_loader = new GeometryLoader(manager,'ifo');
            ifo_loader.load( './data/s1_ifo.data', function ( object ) {
                if (ifo_loader.center !== null) {
                    //-118,-125,-90
                    object.position.x = -32.0 - ifo_loader.center.x;
                    object.position.y = -3.2-ifo_loader.center.y;
                    object.position.z = -22- ifo_loader.center.z;
                    //group.add( object );
                    scope.mainGroup.add(object);
                }
            });
            var ilf_loader = new GeometryLoader(manager ,'ilf');
            ilf_loader.load( './data/s1_ilf.data', function ( object ) {
                if (ilf_loader.center !== null) {
                    //-118,-123,-90
                    object.position.x = -6 - ilf_loader.center.x;
                    object.position.y = 34-ilf_loader.center.y;
                    object.position.z = -12.3-ilf_loader.center.z;
                    //group.add( object );
                    scope.mainGroup.add(object);
                }
            });
        }
        else if(
            this.bunbleName === 'cc' ||
            this.bunbleName === 'cg' ||
            this.bunbleName === 'cst' ||
            this.bunbleName === 'ifo' ||
            this.bunbleName === 'ilf')
        {
            var loader = new GeometryLoader(manager ,this.bunbleName );
            loader.load( './data/s1_'+this.bunbleName +'.data', function ( object ) {
                if (loader.center !== null) {
                    object.position.x = -loader.center.x;
                    object.position.y = -loader.center.y;
                    object.position.z = -loader.center.z;
                    scope.mainGroup.add(object);
                }
            });
        }

        this.scene.add(this.mainGroup);
    },

    init: function () {
        this.cWidth = 400;
        this.cHeight = 400;
        var canvasRatio = this.cWidth / this.cHeight;
        var scope = this;

        this.projector = new THREE.Projector();
        this.raycaster = new THREE.Raycaster();
        //raycaster.linePrecision = 3;
        // RENDERER
        this.renderer = new THREE.WebGLRenderer( );
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        //renderer.setClearColor( 0xf0f0f0 );
        this.renderer.setSize(this.cWidth, this.cHeight);
        this.container.appendChild( this.renderer.domElement );

        // CAMERA
        this.camera = new THREE.PerspectiveCamera( 60, canvasRatio, 1, 4000 );
        this.camera.position.set( 0, 0, 220 );

        $('#container'+ this.id).resize( function onWindowResize() {
            scope.cWidth = $('#container'+ scope.id).width();
            scope.cHeight = $('#container'+ scope.id).height();
            scope.camera.aspect = scope.cWidth / scope.cHeight;
            scope.camera.updateProjectionMatrix();

            scope.renderer.setSize( scope.cWidth, scope.cHeight );
            $('#bubble'+ scope.id).children('#paraMenu').css({left: scope.cWidth -15});
        });


        this.renderer.domElement.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
        this.renderer.domElement.addEventListener( 'mousewheel', this.onMouseWheel, false );
        this.renderer.domElement.addEventListener( 'DOMMouseScroll', this.onMouseWheel, false ); // firefox
    },

    onDocumentMouseDown: function( event ) {

        event.preventDefault();

        this.renderer.domElement.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
        this.renderer.domElement.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
        this.renderer.domElement.addEventListener( 'mouseout', this.onDocumentMouseOut, false );

        /*if(event.which === 1) //Be sure, we use left mouse to select fibers
         {} */
        this.mouseDown = true;
        this.rotateStartP = this.projectOnTrackball(event.clientX, event.clientY);
    },

    onDocumentMouseMove: function( event ) {

        if(!this.mouseDown)
        {
            return;
        }
        var offset = $('#container'+ this.id).offset();
        this.mouse.x = ( (event.clientX- offset.left) / this.cWidth ) * 2 - 1;
        this.mouse.y = - ( (event.clientY- offset.top) / this.cHeight ) * 2 + 1;
        this.rotateEndP = this.projectOnTrackball(event.clientX, event.clientY);
    },

    projectOnTrackball: function (pageX, pageY) // The screen coordinate[(0,0)on the left-top] convert to the
        //trackball coordinate [(0,0) on the center of the page]
    {
        var mouseOnBall = new THREE.Vector3();
        var offset = $('#container'+ this.id).offset();
        mouseOnBall.set(
                ( (pageX- offset.left) / this.cWidth ) * 2 - 1,
                - ( (pageY- offset.top) / this.cHeight ) * 2 + 1,
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
    },

    rotateMatrix: function (rotateStart, rotateEnd)
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
    },

    onDocumentMouseUp: function ( event ) {

        this.renderer.domElement.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
        this.renderer.domElement.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );
        this.renderer.domElement.removeEventListener( 'mouseout', this.onDocumentMouseOut, false );
        this.mouseDown = false;
        this.rotateStartP = this.rotateEndP;
        this.selectHelper.visible = false;
    },

    onDocumentMouseOut: function ( event ) {

        this.renderer.domElement.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
        this.renderer.domElement.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );
        this.renderer.domElement.removeEventListener( 'mouseout', this.onDocumentMouseOut, false );

    },

    onMouseWheel: function ( event ) {

        event.preventDefault();
        event.stopPropagation();

        var delta = 0;

        if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

            delta = event.wheelDelta / 40;

        } else if ( event.detail ) { // Firefox

            delta = - event.detail / 3;

        }

        this.zoomValue += delta ;

    },

    animate: function () {

        requestAnimationFrame(this.animate);
        this.update();
        this.render();
    },

    update: function (){
        this.quater = this.mainGroup.quaternion;

        if( selectState)
        {
            this.keyboard.update();
            var phiDelta= 0;
            var thetaDelta=0;

            if ( this.keyboard.down("W") )
            {
                phiDelta -= 0.1;
            }

            if ( this.keyboard.down("S") )
            {
                phiDelta += 0.1;
            }

            if ( this.keyboard.pressed("A") )
            {
                thetaDelta -= 0.1;
            }

            if ( this.keyboard.pressed("D") )
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
            this.quater.multiplyQuaternions(keyBoardquater,this.quater);
        }
        if(rotateState)
        {
            var rotateQuaternion = this.rotateMatrix(this.rotateStartP, this.rotateEndP);
            this.quater.multiplyQuaternions(rotateQuaternion,this.quater);
        }

        this.quater.normalize();
        this.mainGroup.setRotationFromQuaternion(this.quater);
        this.mainGroup.position.z += this.zoomValue;
        this.zoomValue = 0;
    },

    render: function () {
        if(this.mouseDown &&selectState)
        {
            // find intersections using mouse
            var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 1 );
            this.projector.unprojectVector( vector, this.camera );

            this.raycaster.set( this.camera.position, vector.sub( this.camera.position ).normalize() );

            var intersects = this.raycaster.intersectObjects( this.mainGroup.children, true);

            if ( intersects.length > 0 ) {

                if ( this.currentIntersected !== undefined ) {
                    this.currentIntersected.material.color.setRGB(1,1,0);
                }

                this.currentIntersected = intersects[ 0 ].object;
                switch (this.currentIntersected.geometry.name)
                {
                    case 'cc':
                        this.count[0]++;
                        break;
                    case 'cg':
                        this.count[1]++;
                        break;
                    case 'cst':
                        this.count[2]++;
                        break;
                    case 'ifo':
                        this.count[3]++;
                        break;
                    case 'ilf':
                        this.count[4]++;
                        break;
                    default:
                        break;
                }
                this.currentIntersected.material.linewidth = 5;

                this.selectHelper.visible = true;
                this.selectHelper.position.copy( intersects[ 0 ].point );

            }
            else {

                this.currentIntersected = undefined;

                this.selectHelper.visible = false;

            }
        }

        this.renderer.render(this.scene, this.camera);
    }
};


function BubbleWidget(id,name,mousePosX,mousePosY)
{
    this.connectionId = null;
    this.id = id;
    this.name = name;
    this.initPosX = mousePosX;
    this.initPosY = mousePosY;
}
BubbleWidget.prototype= {
    addBubble : function()
    {
        var _this = this;
        var bubblediv = $(this.bubble_div(this.id,this.name, this.initPosX, this.initPosY));
        var bundles = ['cc','cg','cst','ifo','ilf'];
        $("#bubble").append(bubblediv);
        var bubble = new Bubble(this.id,this.name);
        try {
            bubble.init();
            bubble.fillScene();
            bubble.animate();
        }
        catch(e) {
            var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
            bubble.container.append(errorReport+e);
        }

        function currentToBoxPos(mousePosX,mousePosY)
        {
            var widthPercent = mousePosX / window.innerWidth;
            var heightPercent = mousePosY / (window.innerHeight -50);
            var left = nvWidth * widthPercent;
            var top = 50 * heightPercent; //50 is the height of the navigation bar;
            return {x: left, y: top};
        }

        var boxWidth = $('#bubble'+_this.id).width()/window.innerWidth * nvWidth;
        var boxHeight = $('#bubble' + _this.id).height()/(window.innerHeight -50) * 50;
        var pos = currentToBoxPos(this.initPosX,this.initPosY);
        var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        var currentView = new Rectangle(navigationCanvas, pos.x, pos.y, boxWidth, boxHeight, color, true );
        navigationCanvas.addShape(currentView);

        $(".bubble").draggable({ containment: '#bgCanvas', scroll: false ,
            stop: function(ev, ui){
                var position = ui.position;  //drag stop position
                var currentPos = currentToBoxPos(position.left,position.top);
                //var originalPosition = ui.originalPosition; //drag begin position
                var currentId = parseInt( $(this).attr('id').replace(/bubble/, '') );
                navigationCanvas.updateRectPos(currentId, currentPos.x, currentPos.y);
            }
        });
        $("canvas").draggable({ containment: '#bgCanvas', scroll: false }).resizable();
        function findMaxIndex(count)
        {
            var maxindex = -1;
            var max =0;
            for(var i=0; i < count.length; ++i)
                if(count[i]>0)
                {
                    if(count[i] >max)
                    {
                        max = count[i];
                        maxindex = i;
                    }
                }
            return maxindex;
        }

        var parent =$('#bubble'+ _this.id ).contextMenu({
            selector: '.dragheader',
            callback: function(key, options) {
                if(key==="delete")
                {
                    parent.remove();
                    navigationCanvas.remove(_this.id);
                    delete bubble;

                    widgets[_this.id] = null;

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
                    BUBBLE_COUNT++;
                    var index = findMaxIndex(bubble.count);
                    if(index!==-1)
                    {
                        var posx = $('#bubble'+_this.id).offset().left;//offset() or position()
                        var posy =$('#bubble'+_this.id).offset().top;
                        var bwiget = new BubbleWidget(BUBBLE_COUNT,bundles[index],posx +$('#bubble'+_this.id).width() + 30,posy);
                        bwiget.addBubble();
                        widgets.push(bwiget);
                        //addBubble(BUBBLE_COUNT, bundles[index], posx+$('#bubble'+_this.id).width() + 30, posy );
                        var begin ={x:posx+$('#bubble'+_this.id).width(), y:posy + $('#bubble' + _this.id).height()/2};
                        var end ={x:posx+$('#bubble'+_this.id).width() + 30, y:posy + $('#bubble' + _this.id).height()/2};

                        var connection = new Connection(begin, end);
                        pathConnection.addConnection(connection);
                        var connectionId = pathConnection.connections.length -1;
                        widgets[_this.id].connectionId = connectionId;
                        widgets[_this.id + 1].connectionId = connectionId;
                    }
                    else{
                        alert('Please select a bundle, before export the certain bundle!');
                    }
                }

            },
            items: {
                "delete": {name: "Delete"},
                "select": {name: "Select"},
                "rotate": {name: "Rotate"},
                "export": {name: "Export"}
            }
        });

        parent.children(".dragheader").children(".open_para").click( function() {
            parent.children("#paraMenu").toggle();
            BUBBLE_COUNT--;
        });
    },
    bubble_div : function (id,name,mousePosX,mousePosY) {
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
};




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