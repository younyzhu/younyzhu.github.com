/**
 * Created by Yongnanzhu on 5/19/2014.
 */
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

function NodeLink( id, connectTo)
{
    this.connectionId = id;
    this.connectTo = connectTo;
}


function Bubble(id,selectfiber)
{
    this.CleanSelected = false;
    this.rotateState = true;
    this.selectState = false;
    ////////////////////////////////////////////////////////////////////////////////
    //this.connectionId = null;
    //this.connectTo = null;
    this.connectionLinks = [];
    /*global THREE, window, document*/
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.id = id;

    this.mainGroup = new THREE.Object3D();
    //var controls;
    //var container = document.getElementById('container'+ id);
    this.container = $('#container' + id)[0];
    this.cWidth = 400;
    this.cHeight = 400;
    this.selectFiber = selectfiber;   //if selectFiber = null, there is no selected fibers

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

    this.selectInfo = [ [], [], [], [], []];

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
    getlinkNodes: function()
    {
        return this.connectionLinks;
    },
    spliceNodeLink : function(index)
    {
        if(index >= 0&& index < this.connectionLinks.length) {
            this.connectionLinks.splice(index, 1);
        }
    },
    addlinkNode: function(node){
        this.connectionLinks.push(node);
    },
    setCleanState: function (state){
        this.CleanSelected = state;
    },
    setRotateState: function (){
        this.rotateState = true;
        this.selectState = false;
    },
    setSelectState: function (){
        this.rotateState = false;
        this.selectState = true;
    },
    /*
     setConnection: function (connectId, connectTo){
     this.connectionId = connectId;
     this.connectTo = connectTo;
     },*/
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
        //this.selectFiber : cc cg cst ifo ilf
        var cc_loader;
        var cg_loader ;
        var cst_loader;
        var ifo_loader ;
        var ilf_loader;
        if(this.selectFiber !==null)
        {
            cc_loader = new GeometryLoader(manager,'cc',this.selectFiber[0] );
            cg_loader = new GeometryLoader(manager,'cg',this.selectFiber[1] );
            cst_loader = new GeometryLoader(manager,'cst',this.selectFiber[2] );
            ifo_loader = new GeometryLoader(manager,'ifo',this.selectFiber[3] );
            ilf_loader = new GeometryLoader(manager ,'ilf',this.selectFiber[4] );
        }
        else
        {
            cc_loader = new GeometryLoader(manager,'cc');
            cg_loader = new GeometryLoader(manager,'cg');
            cst_loader = new GeometryLoader(manager,'cst');
            ifo_loader = new GeometryLoader(manager,'ifo' );
            ilf_loader = new GeometryLoader(manager ,'ilf' );
        }

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

        cg_loader.load( './data/s1_cg.data', function ( object ) {
            if (cg_loader.center !== null) {
                object.position.x = -cg_loader.center.x;
                object.position.y = -cg_loader.center.y;
                object.position.z = -cg_loader.center.z;
                scope.mainGroup.add(object);
            }
        });

        cst_loader.load( './data/s1_cst.data', function ( object ) {
            if (cst_loader.center !== null ) {
                //-116,-126,-94
                object.position.x = 4-cst_loader.center.x;
                object.position.y = -12-cst_loader.center.y;
                object.position.z = -25-cst_loader.center.z;

                scope.mainGroup.add(object);
            }
        });


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
            var $containerId = $('#container'+ scope.id);
            scope.cWidth = $containerId.width();
            scope.cHeight = $containerId.height();
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

        if(this.selectState)
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
        if(this.rotateState)
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
        if(this.mouseDown &&this.selectState)
        {
            // find intersections using mouse
            var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 1 );
            this.projector.unprojectVector( vector, this.camera );

            this.raycaster.set( this.camera.position, vector.sub( this.camera.position ).normalize() );

            var intersects = this.raycaster.intersectObjects( this.mainGroup.children, true);

            if ( intersects.length > 0 ) {

                this.currentIntersected = intersects[ 0 ].object;
                if ( this.currentIntersected !== undefined ) {
                    this.currentIntersected.material.color.setRGB(1,1,0);
                    switch (this.currentIntersected.name)
                    {
                        case 'cc':
                        {
                            var flag = false;
                            var tmp = parseInt(this.currentIntersected.geometry.name);
                            for(i=0; i < this.selectInfo[0].length; ++i)
                            {
                                if(this.selectInfo[0][i] === tmp)
                                {
                                    flag = true;
                                    break;
                                }
                            }
                            if(!flag)
                                this.selectInfo[0].push( tmp );
                            break;
                        }

                        case 'cg':
                            flag = false;
                            tmp = parseInt(this.currentIntersected.geometry.name);
                            for(i=0; i < this.selectInfo[1].length; ++i)
                            {
                                if(this.selectInfo[1][i] === tmp)
                                {
                                    flag = true;
                                    break;
                                }
                            }
                            if(!flag)
                                this.selectInfo[1].push( tmp );
                            break;
                        case 'cst':
                            flag = false;
                            tmp = parseInt(this.currentIntersected.geometry.name);
                            for(i=0; i < this.selectInfo[2].length; ++i)
                            {
                                if(this.selectInfo[2][i] === tmp)
                                {
                                    flag = true;
                                    break;
                                }
                            }
                            if(!flag)
                                this.selectInfo[2].push( tmp );
                            break;
                        case 'ifo':
                            flag = false;
                            tmp = parseInt(this.currentIntersected.geometry.name);
                            for(i=0; i < this.selectInfo[3].length; ++i)
                            {
                                if(this.selectInfo[3][i] === tmp)
                                {
                                    flag = true;
                                    break;
                                }
                            }
                            if(!flag)
                                this.selectInfo[3].push( tmp );
                            break;
                        case 'ilf':
                            flag = false;
                            tmp = parseInt(this.currentIntersected.geometry.name);
                            for(i=0; i < this.selectInfo[4].length; ++i)
                            {
                                if(this.selectInfo[4][i] === tmp)
                                {
                                    flag = true;
                                    break;
                                }
                            }
                            if(!flag)
                                this.selectInfo[4].push( tmp );
                            break;
                        default:
                            break;
                    }
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
        if(this.CleanSelected === true)
        {
            var childs = this.mainGroup.children;
            for(var i = 0; i < childs.length; ++i)
            {
                for(var j =0; j< childs[i].children.length ;++j)
                {
                    var grayness = childs[i].children[j].material.grayness;
                    childs[i].children[j].material.color.setRGB(grayness,grayness,grayness);
                }
            }
            for(i=0;i<this.selectInfo.length;i++)
            {
                this.selectInfo[i] = [];
            }
            this.CleanSelected = false;
        }

        this.renderer.render(this.scene, this.camera);
    }
};
function getWidgetCenter(index){
    var $bubbleId = $('#bubble'+index);
    var posx = $bubbleId.offset().left;//offset() or position()
    var posy = $bubbleId.offset().top;
    return {x: posx+$bubbleId.width()/2, y:posy + $bubbleId.height()/2};
}
function updateBubblePos(index, x, y)
{
    var $bubbleId = $('#bubble'+index);
    var posx = $bubbleId.offset().left;//offset() or position()
    var posy =$bubbleId.offset().top;
    $bubbleId.css({
        left: posx + x,
        top: posy + y
    });

    var le = Bubbles[index].getlinkNodes().length;
    for(var i= 0; i<le; ++i)
    {
        var next = Bubbles[index].getlinkNodes()[i].connectTo;
        if(Bubbles[index].getlinkNodes()[i].connectionId !== null&& Bubbles[index]!==null && Bubbles[next]!==null )
        {
            pathConnection.update( Bubbles[index].getlinkNodes()[i].connectionId, getWidgetCenter(index), getWidgetCenter(next) );
        }
    }
}

function addBubble(id, name, selectIfo, mousePosX,mousePosY)
{
    var bubblediv = $(bubble_div(id,name,mousePosX,mousePosY));
    var bundles = ['cc','cg','cst','ifo','ilf'];
    $("#bubble").append(bubblediv);
    var bubble = new Bubble(id,selectIfo);
    Bubbles.push(bubble);
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
    var $bubbleId = $('#bubble'+id);
    var boxWidth = $bubbleId.width()/window.innerWidth * nvWidth;
    var boxHeight = $bubbleId.height()/(window.innerHeight -50) * 50;
    var pos = currentToBoxPos(mousePosX,mousePosY);
    var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    var currentView = new Rectangle(navigationCanvas, pos.x, pos.y, boxWidth, boxHeight, color, true );
    navigationCanvas.addShape(currentView);

    $(".bubble").draggable({ containment: '#bgCanvas', scroll: false ,
        drag: function(ev, ui) {
            var position = ui.position;  //drag stop position
            var currentPos = currentToBoxPos(position.left,position.top);
            //var originalPosition = ui.originalPosition; //drag begin position
            var currentId = parseInt( $(this).attr('id').replace(/bubble/, '') );
            navigationCanvas.updateRectPos(currentId, currentPos.x, currentPos.y);

            var le = Bubbles[id].getlinkNodes().length;
            for(var i= 0; i<le; ++i)
            {
                var next = Bubbles[currentId].getlinkNodes()[i].connectTo;
                if(Bubbles[currentId].getlinkNodes()[i].connectionId !== null&& Bubbles[currentId]!==null && Bubbles[next]!==null )
                {
                    pathConnection.update( Bubbles[currentId].getlinkNodes()[i].connectionId, getWidgetCenter(currentId), getWidgetCenter(next) );
                }
            }


            /*
             var next = bubble.connectTo;
             if(bubble.connectionId !== null&& Bubbles[id]!==null && Bubbles[next]!==null )
             {
             pathConnection.update( bubble.connectionId, getWidgetCenter(id), getWidgetCenter(next) );
             } */
        },
        stop: function(ev, ui) {
            var position = ui.position;  //drag stop position
            var currentPos = currentToBoxPos(position.left, position.top);
            //var originalPosition = ui.originalPosition; //drag begin position
            var currentId = parseInt($(this).attr('id').replace(/bubble/, ''));
            navigationCanvas.updateRectPos(currentId, currentPos.x, currentPos.y);

            var le = Bubbles[id].getlinkNodes().length;
            for (var i = 0; i < le; ++i) {
                var next = Bubbles[currentId].getlinkNodes()[i].connectTo;
                if (Bubbles[currentId].getlinkNodes()[i].connectionId !== null && Bubbles[currentId] !== null && Bubbles[next] !== null) {
                    pathConnection.update(Bubbles[currentId].getlinkNodes()[i].connectionId, getWidgetCenter(currentId), getWidgetCenter(next));
                }
            }
        }
    });
    $("canvas").draggable({ containment: '#bgCanvas', scroll: false}).resizable({
        resize: function(ev, ui) {
            var width = $bubbleId.width()/window.innerWidth * nvWidth;
            var height = $bubbleId.height()/(window.innerHeight -50) * 50;
            navigationCanvas.updateRectResize(id, width, height);
            /*
             var next = bubble.connectTo;
             if (bubble.connectionId !== null && Bubbles[id] !== null && Bubbles[next] !== null) {
             pathConnection.update(bubble.connectionId, getWidgetCenter(id), getWidgetCenter(next));
             } */

            var le = Bubbles[id].getlinkNodes().length;
            for(var i= 0; i<le; ++i)
            {
                var next = Bubbles[id].getlinkNodes()[i].connectTo;
                if(Bubbles[id].getlinkNodes()[i].connectionId !== null&& Bubbles[id]!==null && Bubbles[next]!==null )
                {
                    pathConnection.update( Bubbles[id].getlinkNodes()[i].connectionId, getWidgetCenter(id), getWidgetCenter(next) );
                }
            }
        }
    });

    function SelectionDetect(selectInfo)
    {
        var flag= false;
        for(var i=0; i< selectInfo.length; ++i)
        {
            if(selectInfo[i].length !==0)
            {
                flag = true;
                break;
            }
        }
        return flag;
    }

    var parent =$bubbleId.contextMenu({
        selector: '.dragheader',
        callback: function(key, options) {
            if(key==="delete")
            {
                parent.remove();
                navigationCanvas.remove(id);
                /*
                 if( Bubbles[id].connectionId !== null)
                 {
                 var nex = Bubbles[id].connectTo;
                 pathConnection.remove(Bubbles[id].connectionId);
                 Bubbles[nex].setConnection(null, null);
                 } */
                var le = Bubbles[id].getlinkNodes().length;
                for(var i= 0; i<le; ++i)
                {
                    var next = Bubbles[id].getlinkNodes()[i].connectTo;
                    for(var j=0; j<Bubbles[next].getlinkNodes().length; ++j)
                    {
                        if(Bubbles[id].getlinkNodes()[i].connectionId === Bubbles[next].getlinkNodes()[j].connectionId)
                            Bubbles[next].spliceNodeLink(j);
                    }

                    pathConnection.remove( Bubbles[id].getlinkNodes()[i].connectionId );
                }
                delete bubble;
                Bubbles[id] = null;
            }
            else if(key==="select")
            {
                bubble.setSelectState();
                //rotateState = false;
                //selectState = true;
            }
            else if(key==="clean_selected")
            {
                bubble.setCleanState(true);
                //rotateState = false;
                //selectState = true;
            }
            else if(key==="rotate")
            {
                bubble.setRotateState();
                //rotateState = true;
                //selectState = false;
            }
            else if(key==="export")
            {
                BUBBLE_COUNT++;

                if(SelectionDetect(bubble.selectInfo))
                {
                    var posx = $bubbleId.offset().left;//offset() or position()
                    var posy =$bubbleId.offset().top;
                    addBubble(BUBBLE_COUNT,'Selected fiber bundles', bubble.selectInfo, posx + $bubbleId.width() + 30, posy );

                    var connection = new Connection(getWidgetCenter(id), getWidgetCenter(BUBBLE_COUNT));
                    pathConnection.addConnection(connection);
                    var connectId = pathConnection.connections.length-1;

                    var node1 = new NodeLink(connectId,BUBBLE_COUNT);
                    Bubbles[id].addlinkNode(node1);
                    var node2 = new NodeLink(connectId,id);
                    Bubbles[BUBBLE_COUNT].addlinkNode(node2);
                    //Bubbles[id].setConnection(connectId,BUBBLE_COUNT);
                    //Bubbles[BUBBLE_COUNT].setConnection(connectId,id);
                }
                else{
                    alert('Please select a bundle, before export the certain bundle!');
                }
            }

        },
        items: {
            "delete": {name: "Delete"},
            "select": {name: "Select"},
            "clean_selected": {name: "Clean selected"},
            "rotate": {name: "Rotate"},
            "export": {name: "Export"}
        }
    });

    parent.children(".dragheader").children(".open_para").click( function() {
        parent.children("#paraMenu").toggle();
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
//This function is called when the navigation bar is move,actually,
//the navigation bar can move in horizontal direction
//So the whole bubble in screen space is just need to change the x-pos
function resetAllBubblesPos(xChange)
{
    $('#bubble').children('.bubble').each(function ()
    {
        var offLeft = $(this).position().left;
        $(this).css({left: offLeft - xChange});
        var id = parseInt( $(this).attr('id').replace(/bubble/, '') );
        var le = Bubbles[id].getlinkNodes().length;
        for(var i= 0; i<le; ++i)
        {
            var next = Bubbles[id].getlinkNodes()[i].connectTo;
            if(Bubbles[id].getlinkNodes()[i].connectionId !== null&& Bubbles[id]!==null && Bubbles[next]!==null )
            {
                pathConnection.update( Bubbles[id].getlinkNodes()[i].connectionId, getWidgetCenter(id), getWidgetCenter(next) );
            }
        }

    });
}
function getWidgetInformation(index)
{
    var $bubbleId = $('#bubble'+index);
    var width = $bubbleId.width();
    var height = $bubbleId.height();
    var posx = $bubbleId.offset().left;//offset() or position()
    var posy = $bubbleId.offset().top;
    var center = {x: posx+$bubbleId.width()/2, y:posy + $bubbleId.height()/2};
    return {w:width,h:height,left:posx,top:posy,center:center};
}
function manageBubblePos(index)
{
    /*
     var childs = $('#bubble').children('.bubble');
     for(var i=0; i<childs.length; ++i)
     {
     if(i!==index)
     {

     if(checkCollisions(i,index))
     {
     // alert("Collision!");
     var $bubbleId = $('#bubble'+i);
     var $bubbleIndex = $('#bubble'+index);
     // $bubbleId.animate({ "left": "-="+step1+"px" }, "fast" );

     var bubble1 = getWidgetInformation(i);
     var bubble2 = getWidgetInformation(index);

     var center = {x:(bubble1.center.x+bubble2.center.x)/2.0, y:(bubble1.center.y+bubble2.center.y)/2.0};

     if(Math.abs(center.x-bubble1.center.x) < bubble1.w/2.0 || Math.abs(center.y-bubble1.center.y) < bubble1.h/2.0)
     {
     var Wlen = (bubble1.w/2 +bubble2.w/2) - Math.abs(bubble2.center.x - bubble1.center.x);
     var Hlen = (bubble1.h/2 +bubble2.h/2) - Math.abs(bubble2.center.y - bubble1.center.y);
     var step11 = Wlen * (bubble1.w)/(bubble1.w +bubble2.w);
     var step12 = Wlen * (bubble2.w)/(bubble1.w +bubble2.w);
     var step21 = Hlen * (bubble1.h)/(bubble1.h +bubble2.h);
     var step22 = Hlen * (bubble2.h)/(bubble1.h +bubble2.h);
     var IdLeft, IdTop;
     var IndexLeft, IndexTop;
     if(bubble1.center.x <center.x)
     {
     IdLeft = "-="+step11+"px";
     IndexLeft = "+="+step12+"px";
     }
     else
     {
     IdLeft = "+="+step11+"px";
     IndexLeft = "-="+step12+"px";
     }

     if(bubble1.center.y <center.y)
     {
     IdTop = "+="+step21+"px" ;
     IndexTop = "-="+ step22 +"px" ;
     }
     else
     {
     IdTop = "-="+step21+"px" ;
     IndexTop = "+="+ step22 +"px" ;
     }
     $bubbleId.animate({"left": IdLeft, "top": IdTop });
     $bubbleIndex.animate({ "left": IndexLeft, "top": IndexTop  } );
     }
     }
     }
     }
     */
    $('#bubble').children('.bubble').each(function () {
        var id = parseInt( $(this).attr('id').replace(/bubble/, '') );
        if(id!==index)
        {

            if(checkCollisions(id,index))
            {
                // alert("Collision!");
                var $bubbleId = $('#bubble'+id);
                var $bubbleIndex = $('#bubble'+index);
                // $bubbleId.animate({ "left": "-="+step1+"px" }, "fast" );

                var bubble1 = getWidgetInformation(id);
                var bubble2 = getWidgetInformation(index);

                var center = {x:(bubble1.center.x+bubble2.center.x)/2.0, y:(bubble1.center.y+bubble2.center.y)/2.0};

                if(Math.abs(center.x-bubble1.center.x) < bubble1.w/2.0 || Math.abs(center.y-bubble1.center.y) < bubble1.h/2.0)
                {
                    var Wlen = (bubble1.w/2 +bubble2.w/2) - Math.abs(bubble2.center.x - bubble1.center.x);
                    var Hlen = (bubble1.h/2 +bubble2.h/2) - Math.abs(bubble2.center.y - bubble1.center.y);
                    var step11 = Wlen * (bubble1.w)/(bubble1.w +bubble2.w);
                    var step12 = Wlen * (bubble2.w)/(bubble1.w +bubble2.w);
                    var step21 = Hlen * (bubble1.h)/(bubble1.h +bubble2.h);
                    var step22 = Hlen * (bubble2.h)/(bubble1.h +bubble2.h);
                    var IdLeft, IdTop;
                    var IndexLeft, IndexTop;
                    if(bubble1.center.x <center.x)
                    {
                        IdLeft = "-="+step11+"px";
                        IndexLeft = "+="+step12+"px";
                    }
                    else
                    {
                        IdLeft = "+="+step11+"px";
                        IndexLeft = "-="+step12+"px";
                    }

                    if(bubble1.center.y <center.y)
                    {
                        IdTop = "+="+step21+"px" ;
                        IndexTop = "-="+ step22 +"px" ;
                    }
                    else
                    {
                        IdTop = "-="+step21+"px" ;
                        IndexTop = "+="+ step22 +"px" ;
                    }
                    $bubbleId.animate({"left": IdLeft, "top": IdTop });
                    $bubbleIndex.animate({ "left": IndexLeft, "top": IndexTop  } );
                }
            }
        }
    });
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