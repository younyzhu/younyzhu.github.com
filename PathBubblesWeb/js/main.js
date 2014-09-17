/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/16/2014
 * @name        main
 */

$(document).ready(function (){
    var scene = new PATHBUBBLES.Scene();
    var bubble = new PATHBUBBLES.Bubble(100,100,290,250,'#ff0000', '#ffffff',20,40);
    scene.addObject(bubble);

    var bubble2 = new PATHBUBBLES.Bubble(200,200,490,450,'#ff0000', '#ffffff',20,40);
    scene.addObject(bubble2);
    var canvas = $("#bgCanvas")[0];
    var render = new PATHBUBBLES.Render(canvas, scene);
});
