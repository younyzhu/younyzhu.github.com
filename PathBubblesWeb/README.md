PathBubbles--A web-version of biological data visualization framework
============


**Website** : [http://younyzhu.github.io/PathBubblesWeb/](http://younyzhu.github.io/PathBubblesWeb/)



Introduction
============


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

