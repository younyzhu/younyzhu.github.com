## Path Bubble Layout Design

##Introduction   

##Current ProjectWebsite
  Please visit [website](http://younyzhu.github.io/Path_Bubble/pathBubble.html)     
##Operation
  
  1. Click `f` on your keyboard for full screen, Click `ESC` for exiting `Full Screen` mode.    
  2. Right Click open a bubble.
  
##Study Event

* 7/2/2014      
 1. Today, I begin to write the path bubble program. First, write the basic frame work, try to use html5 2d canvas to draw thing.
 
* 7/3/2014       
 1. Test using the widget to contain all the things, but it seems not very well. so I deside do not use bubble widget.    
 2. First, I will draw the basic shape first and then consider different types of layout and the logic.     
   
     * Finish drawing roundRectangle `Compartment.js`: Which is called `Compartment`, and also this rectangle needs to be draggable and resizeable.    
     * Finish drawing text `Text.js`: which is used for showing the `Compartment` name under the middile bottom of the rectangle.
     * Finish drawing `Protein.js`: which is used to draw the Protein.    
     * Finish drawing `DNA.js`: which is used to draw the DNA.
     * Finish drawing `Small_Molecule`: which is used to draw the small molecule.
     * Finish drawing `Complex.js`: which is used to draw the complex.
     * Finish drawing `Arrow.js`: which is used to draw the arrow.    
     * Finish drawing  `Transition.js`: which is used to draw the transition reaction with the combination of the `Arrow`  
     * Finished drawing `Assosiation.js`: which is used to draw the association reaction with the combination of the `Arrow`
     * Finished drawing `Dissosiation.js`: which is used to draw the dissociation reaction with the combination of the `Arrow`
     
     ![Image](./images/basicShape.PNG)    