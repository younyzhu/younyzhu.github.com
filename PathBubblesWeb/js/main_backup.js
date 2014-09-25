/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/16/2014
 * @name        main
 */

$(document).ready(function (){
    var scene = new PATHBUBBLES.Scene();
    var bubble = new PATHBUBBLES.Bubble(100,100,290,250,'#0000ff', '#ffffff',40);
    //scene.addObject(bubble);
    var bubble3 = new PATHBUBBLES.Bubble(100,100,290,250,'#00ff00', '#fff00f',40);
    scene.addObject(bubble3);
    var bubble2 = new PATHBUBBLES.Bubble(200,400,400,300,'#0000ff', '#ffffff',40);
    scene.addObject(bubble2);
    var bubble4 = new PATHBUBBLES.Bubble(320,250,200,200,'#00ffff', '#ffffff',40);
    var bubble5 = new PATHBUBBLES.Bubble(120,220,200,200,'#00ffff', '#ffffff',40);
    var group = new PATHBUBBLES.Groups();

    group.addToGroup(bubble);
//    group.addToGroup(bubble2);

    group.addToGroup(bubble4);
//    group.addToGroup(bubble3);
    group.addToGroup(bubble5);




    scene.addObject(group);

    var complex = new PATHBUBBLES.Biomolecule.Complex(230,230,"TEXT");
    bubble2.addObject(complex);
    var canvas = $("#bgCanvas")[0];
    var render = new PATHBUBBLES.Render(canvas, scene);
});
