PathBubbles--A web-version of biological data visualization framework
============


**Website** : [http://younyzhu.github.io/PathBubblesWeb/](http://younyzhu.github.io/PathBubblesWeb/)

**Operation** : `Right Click`   ===>  `Select Menu`

Introduction
============
   Pathbubbles Project from  [https://sites.google.com/a/umbc.edu/pathbubbles/home](https://sites.google.com/a/umbc.edu/pathbubbles/home)     
   You can get detailed informaiton from [https://sites.google.com/a/umbc.edu/pathbubbles/pathbubbles-1-0](https://sites.google.com/a/umbc.edu/pathbubbles/pathbubbles-1-0)  
   This project is trying to design a web version of Pathbubbles to assist biologist in interactive exploring and analyzing dataset.
Framework
============

 ### Goal for framework

 (1) Extendable

 (2) Readble

 (3) Include basic PathBubble characteristic: virtual space, navagation bar, group, multi-view

 ### Hierarchical scene graph object

 (1) scene==> Bubble ==> object inside bubble.

  all the elements in scene graph is inherent from Object2D


 (2) render ==> to manage the render event and mouse operation (this needs to reconsider)

  all the basic element is encapsulated into the basic class.


Study Log
============
* 9/16/2014

 begin to set up basic framework, Bubble, Object2d, render, scene, shape

 ![image1](https://raw.githubusercontent.com/younyzhu/younyzhu.github.com/master/PathBubblesWeb/image/framework1.PNG)

 ![image2](https://raw.githubusercontent.com/younyzhu/younyzhu.github.com/master/PathBubblesWeb/image/framework2.PNG)

* 9/17/2014

Try to add group, add space management (bug needs to be fixed)    



* 9/24/2014 

Add mouse move interaction, and if two object intersect with each other, they will group together (it seems still has some problems for grouping layout algorithm)

Add mouse right click on `cavas`, you can open a bubble.

The Great *challenge* is to add right click context menu for a certain object [It seems nobody has done this before!]

I will try to find a way.

