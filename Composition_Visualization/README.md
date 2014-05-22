* before    
basic UI design    
* 5/16/2014    
ribbons, visualization_backup    
* 5/17/2014~ 5/18/2014    
add 2d canvas navigation bar(navigationBar.js), the relation between 2D canvas box component
with the object on the big canvas(main webGL 3D canvas).
finished the box dragging position coordinate
* 5/19/2014    
split the visualization.js into bubbleWidget.js and main.js
backup the bubbleWidget(bubbleWidget.js and main.js)
construct a new class: bubbleWidget which contains: the container(canvas),the id, the connectionId    
* 5/20/2014    
1.use the requestAnimFrame to control the 2D canvas draw;   (For the navigation bar, I have consider the svg method or 2D canvas, and finally I pick up 2D canvas)   
2.finished simple connect line drawing between two widgets;   
3.And make the operation coordinate.   
4.modify the link connection, so that we can support the multiply links. (For the link connect, I have consider the svg method or 2D canvas, and finally I pick up 2D canvas)   
5.Add navigation Bar(Select the current viewpoint) move to control the current  viewpoint object move, this realize the virtual space screen    
* 5/21/2014    
1.modify the bugs in navigation bar, and the coordinate with the current view box;   
2.make the drag, draging and operation on virtual space coordinate.    
* 5/22/2014        
1.collision detection of the bubble widget   
2.if two widget collision, they should automatic split.
Modify: change from geometry.name to line.name so in Bubble we need to modify   
3.select the reserve of select data.   
4.finished keep quary by select.   
(When you change the mode, you should use keyboard to rotate the model (Arrow key or (A,S,D,W)))    
 [I use the line.name to keep the fiber bundle name, and use the line.geometry.name to keep the select fiber bundle]   
 ----This is used for 5 single fiber bundle
5.Start to convert to a single fiber bundle.
 
 
 
 
 
**Till now incluse file**:
    //jquery related lab
    <script src="./jqueryLib/jquery-1.10.2.js" type="text/javascript"></script>
    <script src="./jqueryLib/jquery-ui-1.10.4.js" type="text/javascript"></script>
    <script src="./jqueryLib/jquery.ui.position.js" type="text/javascript"></script>
    <script src="./jqueryLib/jquery.contextMenu.js" type="text/javascript"></script>
    //Three.js related lab
    <script src="js/three.js"></script>
    <script src="js/Detector.js"></script>
    <script src="js/KeyboardState.js"></script>
    //Custom js code
    <script src="js/main.js" type="text/javascript"></script>              //main
    <script src="js/ObjectLoader.js"></script>      //model loader(line, also could include tube, ribbon js)
    <script src="js/navigationBar.js" type="text/javascript"></script>     //Draw 2D canvas on navigation bar
    <script src="js/bubbleWidget.js" type="text/javascript"></script>      //Bubble widget on the main
    <script src="js/connections.js" type="text/javascript"></script>       //connection line between two wodgets which have relationship in some kinds.

