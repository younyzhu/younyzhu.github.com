/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/16/2014
 * @name        main
 */
var scene;
var canvas;
var navCanvas;
var viewpoint=null;
var navInterection;
var interection;
$(document).ready(function (){
    scene = new PATHBUBBLES.Scene();
    viewpoint = new PATHBUBBLES.ViewPoint();
    var bubble2 = new PATHBUBBLES.Bubble(800,100,200,200,'#00ffff', '#ffffff',40,2);
    scene.addObject(bubble2);
    var bubble3 = new PATHBUBBLES.Bubble(150,200,400,400,'#00ffff', '#ffffff',40,3);
    scene.addObject(bubble3);
   var complex = new PATHBUBBLES.Biomolecule.Complex(0,50,10,"TEXT",1);
    bubble2.addObject(complex);
    var dissociation = new PATHBUBBLES.Biomolecule.Dissociation(1,150,30,"TEXT",1);
    bubble3.addObject(dissociation);
    var association = new PATHBUBBLES.Biomolecule.Association(2,190,40,"TEXT",1);
    bubble3.addObject(association);
    var transition = new PATHBUBBLES.Biomolecule.Transition(3,190,40,"TEXT",1);
    bubble3.addObject(transition);
    var protein = new PATHBUBBLES.Biomolecule.Protein(4,290,40,"TEXT",1);
    bubble3.addObject(protein);
    var dna = new PATHBUBBLES.Biomolecule.DNA(5,250,40,"DNA",1);
    bubble3.addObject(dna);
    var entity = new PATHBUBBLES.Biomolecule.Physical_Entity(5,350,80,"entity",1);
    bubble3.addObject(entity);
    var molecule = new PATHBUBBLES.Biomolecule.Small_Molecule(5,350,40,"Molecule",1);
    bubble3.addObject(molecule);
    var bubble4 = new PATHBUBBLES.Bubble(220,220,520,250,'#00ffff', '#ffffff',40,5);


//    var bubble5 = new PATHBUBBLES.Bubble(620,320,220,250,'#00ffff', '#ffffff',40,5);
//    scene.addObject(bubble5);
//    var bubble6 = new PATHBUBBLES.Bubble(820,250,530,530,'#00ffff', '#ffffff',40,4);
//    scene.addObject(bubble6);
//    var group = new PATHBUBBLES.Groups();
////
//    group.addToGroup(bubble3);
//    group.addToGroup(bubble2);
//    group.addToGroup(bubble4);
//    group.addToGroup(bubble5);
//    group.addToGroup(bubble6);
//    scene.addObject(group);
    canvas = $("#bgCanvas")[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    navCanvas = $("#navCanvas")[0];
    navCanvas.height =50;
    navCanvas.width = window.innerWidth;
    var renderer = new PATHBUBBLES.Renderer();
    navInterection = new PATHBUBBLES.NavInteraction(renderer);
    interection = new PATHBUBBLES.Interaction(renderer);

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
                if(viewpoint)
                {
                    bubble4.offsetX = viewpoint.x;
                    bubble4.offsetY = viewpoint.y;
                }
                scene.addObject(bubble4);
            }
            else if(key === 'Delete_All')
            {
                PATHBUBBLES.objects.length =0;
                for(var i= 0, l=scene.children.length;i<l; ++i)
                {
                    if(scene.children[i])
                    scene.removeObject(scene.children[i]);
                }
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
