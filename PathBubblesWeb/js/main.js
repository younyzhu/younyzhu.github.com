/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/16/2014
 * @name        main
 */
var scene;
$(document).ready(function (){
    scene = new PATHBUBBLES.Scene();
    var bubble2 = new PATHBUBBLES.Bubble(100,100,200,200,'#00ff00', '#ff0000',40,2);
    scene.addObject(bubble2);
    var bubble3 = new PATHBUBBLES.Bubble(150,200,200,200,'#0000ff', '#00ff00',40,3);
    scene.addObject(bubble3);
   var complex = new PATHBUBBLES.Biomolecule.Complex(130,130,"TEXT");
    bubble3.addObject(complex);

//    var bubble4 = new PATHBUBBLES.Bubble(220,220,520,250,'#00ffff', '#ffffff',40,5);
//    scene.addObject(bubble4);
//    var bubble5 = new PATHBUBBLES.Bubble(620,320,220,250,'#00ffff', '#ffffff',40,5);
//    scene.addObject(bubble5);
//    var bubble6 = new PATHBUBBLES.Bubble(820,250,530,530,'#00ffff', '#ffffff',40,4);
//    scene.addObject(bubble6);
    var group = new PATHBUBBLES.Groups();
//
    group.addToGroup(bubble3);
    group.addToGroup(bubble2);
//    group.addToGroup(bubble4);
//    group.addToGroup(bubble5);
//    group.addToGroup(bubble6);
    scene.addObject(group);
    var canvas = $("#bgCanvas")[0];
    var renderer = new PATHBUBBLES.Renderer(canvas, scene);
    var interection = new PATHBUBBLES.Interaction(renderer, canvas);
    function render() {

        requestAnimationFrame(render);
        renderer.render();
    }
    render();

    var mousePosX, mousePosY;

    $('#bgCanvas').on('contextmenu', function (e) {
        mousePosX = e.clientX;
        mousePosY = e.clientY;
    });
    $('#bubble').contextMenu({
        selector: '#bgCanvas',
        callback: function (key) {
            if (key === 'Open_Bubble') {
                var bubble4 = new PATHBUBBLES.Bubble(mousePosX, mousePosY);
                scene.addObject(bubble4);
            }
            else if(key === 'Delete_All')
            {
//                for(var i=0; i<scene.children.length; ++i)
//                {
//                    var index=PATHBUBBLES.objects.indexOf(scene.children[i]);
//                    PATHBUBBLES.objects.splice(index,1);
//                    delete scene.children[i];
//                }
                PATHBUBBLES.objects.length =0;
                scene.children.length =0;
            }
        },
        items: {
            "Open_Bubble": {name: "Open_bubble", enabled: false},
//            "Open_VC_Menu": {name: "Open_vc_menu", enabled: false},
//            "Compare": {name: "Compare", enabled: false},
            "sep1": "---------",
            "Delete_All": {name: "Delete_all", enabled: false}
        }
    });
});
