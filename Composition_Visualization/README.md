#Composition Visualization
**Screen Shot**:

![./images/screen.png](./images/screen.png)
##Current Introduction
Composition visualization is attempted to create a web-based, convenient and scientific visualization Environment. We try to intergrate some great ideal in visBubble and codeBubble here......

##Project website
**Current Project Files:**[Composition Visualization](http://younyzhu.github.io/Composition_Visualization/visualization.htm)

##Current Operation:

When you open the website, you can click [f] on you keyboard to full screen mode, and with a [Esc] to exit full screen.        
1. On the top is a navigation bar which is to manage the virtual space.    
2. The big UI is the main current view space. You can move in the big square in the navigation bar to adjust the virtual space.    
3. Right click on the space to Open a bubble(menu).    
4. Right click on the space to delete all the bubble(menu).    
5. Right click on the dragging bar[top of a bubble] of a bubble to refine the brain model:   
 
 * After click the refine button, there will come a bar with [+], [-], [add],[delete],[or]    
 * [+],[-] is used to add or delete a selector sphere, you can use  mouse to move the sphere.    
 * When you are moving the sphere, you can also click [up], [down] in your keyboard to adjust the size of you selector sphere.     
 * You could select the fiber with the combination of the bool logical operation: [add],[or].
 * Before select you region of interest, you could also delete the fiber the occlude you, just by click [delete], which will make all the fibers delete when intersecting with the sphere. 
      
6. After you refine a bundle, you can right click in the dragging bar, to export a new bubble with the selected fibers.
7. You could keep selecting in this application.
8. And also with each bubble, there is a parameter bar, you can click [O] on the dragging bar:
	* In the dragging bar, you can adjust the parameter, such as shape, size... for visualizing the model.
9. Every selected bubble or the origin bubble, you can generate its own fa line chart, when you click each dot of the line chart, each fiber and the clicked dot will be highlighted.
10. By selecting your own file. you can load your custom model.

##Study Event

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

 1. use the requestAnimFrame to control the 2D canvas draw;   (For the navigation bar, I have consider the svg method or 2D canvas, and finally I pick up 2D canvas)   
 2. finished simple connect line drawing between two widgets;   
 3. And make the operation coordinate.   
 4. modify the link connection, so that we can support the multiply links. (For the link connect, I have consider the svg method or 2D canvas, and finally I pick up 2D canvas)   
 5. Add navigation Bar(Select the current viewpoint) move to control the current  viewpoint object move, this realize the virtual space screen

* 5/21/2014

 1. modify the bugs in navigation bar, and the coordinate with the current view box;   
 2. make the drag, draging and operation on virtual space coordinate.    

* 5/22/2014

 1. collision detection of the bubble widget   
 2. if two widget collision, they should automatic split.
Modify: change from geometry.name to line.name so in Bubble we need to modify   
 3. select the reserve of select data.   
 4. finished keep quary by select.   
(When you change the mode, you should use keyboard to rotate the model (Arrow key or (A,S,D,W)))    
 [I use the line.name to keep the fiber bundle name, and use the line.geometry.name to keep the select fiber bundle]   
 ----This is used for 5 single fiber bundle
5.Start to convert to a single fiber bundle.

* 5/23/2014----5/26/2014

 1. build ray caster to select and drag the sphere multi-shpere selectors
 2. build the intersection between the sphere and the fibers(line)
 3. finished fiber bundle: Logical operation: (AND OR), SELECT DELETE
--Two class: FiberSelector.js (Selector: for every sphere selector, FiberSelector: manage the whole selector and select the select result);
Those are in the sphereSelector.html.

* 5/27/2014

 1. Modify the bug in the delete function of multi-selection
//Connect the selector in sphereSelector.html
so change some files here: ObjectLoader.js
I was very angry about me, I spend a day to find another bug: the program goes well when I write in sphereSelector.html,
However, when I moved it to the bubble program,
It cannot move. At spend a day to find the bugs in ray caster, and the difference between the two program.
Today I find the program is in the Mousedown MouseMove event EventListener. It shoud not be the problem!!!
I was so careless!!

* 5/28/2014

 1. Split the file(bubbleWidget.js) -> bubble.js and bubbleWidget.js
 2. In FiberSelector.js, we has a global variable, which is to store the deleted fiber,so that we do not need to calculate the intersection of the deleted fibers.  
**Illustruction:** I use this.SelectResults to store the fibers that are selected by current selectors,
                   and I use this.deletedFibers to store all the fibers that have been deleted from the current model.
 3. ObjectLoader.js: this.selectedFibers, this.deletedFibers. [Model = select_fibers + deleted_fibers + left_fibers]   
When loader a dataset, we need to know which is to select and which is to delete:   
  * if the this.deletedFibers.length === 0, we just need to load the select fibers;
  * if this.selectedFibers.length === 0, we need to loader the model wipes out the deleted fibers;
  * if this.selectedFibers.length !== 0 && this.deletedFibers.length !== 0, we just need to load the selected fiber.         

     
* 5/29/2014     

 1. Reading Dr Xu's paper considering his three lights: direct light, indirect light, ambient light.    
 2. Considering view-dependent ribbons, As Webgl do not has Geometry shader, in order to generate the view-dependent ribbons,
 we should calculate with the camera and adjust the ribbon every frame in cpu, it is time consuming.
 3. Applying the Three.js library's cast shading (in shadowMap.html), we make the light source adjustable and look at the effect.
 Looking at the code and considering its implementation.    

* 5/30/2014    

 1. Reading Dr Xu's paper, and some SSAO, LineAO paper he refers
 2. It seems it is hard to use view-dependent ribbon of his ideal.
 An ideal: for SSAO, we should balance the trade-off between global structure and local detail.

* 6/1/2014

 1. Since the view-dependent ribbon can not implement in three.js, so I changed to ribbon.
 2. First I would applied the Three.js cast shadow here, and then find a way to modified the shadow alogrithm.
    * ShadowMapping: [introduction](http://www.nutty.ca/?page_id=352&link=shadow_map#tabs-4)
    * SSAO: [http://www.nutty.ca/?page_id=352&link=ssao](http://www.nutty.ca/?page_id=352&link=ssao)      

* 6/2/2014
 
 1. read the ShadowMapping Code THREE.js has, and its ShadowMapping Plugin(PCF filter and soft PCF filter).
 2. modify the ShadowMapping Plugin with customShader, and try to apply the VSM, and ESM from
[http://www.nutty.ca/?page_id=352&link=shadow_map#tabs-4](http://www.nutty.ca/?page_id=352&link=shadow_map#tabs-4)
 3. successfully applied the VSM alogrithm.

* 6/3/2014

 1. [Test/ShadowMap.html](https://younyzhu.github.com/Composition_Visualization/Test/ShadowMap.html), you can adjust custombubble.js to adjust shadowType(PCF, PCFSoft, VSM,ESM)
      this.renderer.shadowMapType = THREE.PCFShadowMap;
      this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
      this.renderer.shadowMapType = THREE.VSMShadowMap;   //Try to apply VSMShadowMap
      this.renderer.shadowMapType = THREE.ESMShadowMap;   //Try to apply ESMShadowMap
 2. Use mouse to pick up the light(ball) to deside the light position, press [t] to output the depth map
 3. CastShadow alogrithm encode depth map with phong shading and filter alogrithm    
 4. Looking at the SSAO alogrithm Three.js has and some article he refers, looking at some other ssao alogrithms:
 [http://www.nutty.ca/?page_id=352&link=ssao](http://www.nutty.ca/?page_id=352&link=ssao),
 [http://codeflow.org/entries/2011/oct/25/webgl-screenspace-ambient-occlusion/](http://codeflow.org/entries/2011/oct/25/webgl-screenspace-ambient-occlusion/)
  The latter one looks pretty good.

* 6/4/2014
 1. Continue trying to code the SSAO, but I find it is hard to debug the shader, so I think I should modify the shader(SSAO) Three.js has, and then applied with the cast shadow which is done before.
 2. So I spend a lot of time to combine the SSAO with the casting shadow. Finally, it seems works.
 3. [Test/ssao.html](https://younyzhu.github.com/Composition_Visualization/Test/ssao.html): SSAO + one light(top right) (phong shading with casting shadow) + Directional light(position:0, 0, 1)
 4. Parameters need to adjust.

* 6/5/2014

 1. intergrate the SSAO + casting shadow to the UI    
 2. fix a bug when resizing the window and zoom in and out define a depthPassShader    
 3. begin writing another SSAO shader

* 6/6/2014

 1. It seems the shader has the problem and can not find it.
 2. I spend almost a day to inspect the shader and can not find where is the problem.
 3. I output the view-space position, normal, depth, origin color and the result seems right. I caluate the Ao use another method, the problem still exist.
 4. Maybe it is not my shader problem, it is just the normal.

* 6/7/2014
 
 1. still stuck in the new ssao shader, do not find where is wrong.
 2. try to fix the composition visualization problem and fix.  
 3. It seems ssao do not work, so I just put it down first.

* 6/8/2014    

 1. add color picker to changed the model color
 2. write a line chart part, so that we can visualize the FA value

* 6/9/2014

 still trying the shader, but now find the bug

* 6/10/2014

  1. Learning the data processing
  2. Installing the software and operation system(almost spend a night installing the OS, as some not compaitable with the software)
  3. Fix a bug of the navigation bar, you can double click the current bar, then it will draw the current bar in the navigation bar.

* 6/11/2014 - 6/17/2014
 spend a week processing the DTI raw data(DICOM), and generate the track file and fa.nii

* 6/18/2014
 1. Add error bar, but find no space.
 2. Add select dot point, so re-write the line.chart, when click the dots, the clicked dots will heightlighted, and also the fiber.
 3. The function describe ad fellow:    
     (1) when we click(mouse down) the dots in line chart, this clicked dot will be highlight, and also the corresponding line in the bubble will also be highlight.
     (2) when we mouse up, the highlight dot and line will get back to its origin color.   
 4.Split the trackball control with     
     (1). View-dependent trackball(just move the camera position) when use the line rendering (line rendering do not need the light, and will not be affected by the light position)
     (2). Object trackball, we just control the rotation and apply to the object, this will not affect the light position.
     (3). Fixed a bug in trackball.
     (4). As we need to connect bar chart: this is the different type. And I find my designed framework is bigger and bigger, which would mass up, so redesigning the framework is hugely needed. (It needs time to do this)
          and firt I just fixed some bugs of the origin program, and let all the box synchronize.
     //This version maybe much better. But framework needs to modify.

* 6/19/2014
 1. Reform the parameter menu,when you click the item of the menu, it will stretch, and show the detail function, fixed some bugs.
 2. Add local file loader, write a new local file loader **LocalObjectLoader.js** .

* 6/20/2014

 1. try to load raw data in the visualization
 2. compared the DICOM and the nii format, I decide to choose the nii which is one file and maybe compressed
 (we could use [gzip or gunzip](https://github.com/imaya/zlib.js) to decompress it)
 3. try to write a NiiLoader, load the binary data.
 4. As DICOM has to load lots of images, so I deside to load the nii image and again to learn to parse the nifti format in javascript

* 6/21/2014

 1. Actually, stuck in a bug of the program.
 2. A note from Programing:
     What the image store the data is just inverse with the array what we know in c, this is store according to its column,
     In order to figure this, I almost a day to figure, why my fa is different, and I also checked the C transform file wrote a few days ago, I doubt It is also wrong,
     Actually, It is wrong, because of the different way of array data storage policy
 3. And finally, I know what's the problem of extracting the FA in My c++ program, I can fixed.
 4. The basci program: [Test/TestNii_/nii.html](https://younyzhu.github.com/Composition_Visualization/Test//TestNii_/nii.html)
 5. Need TO do: need to store the loaded data, so that we can adjust the picture in the program, need to add interaction, need to syschronmize with the track model, need to add decompress the nii.gz file
 6. Add update texture, when we change the texture.
 7. add [gzip or gunzip](https://github.com/imaya/zlib.js) supported and now we can load `.nii` or `.nii.gz` file
 8. Try to integrate this nii mainpulation into the composition visualization.
`NiiLoader.js` Loader nitfi file into header and do some preprocess    
`NiiSlice.js`  Build the slice and add to the scene    
`PlaneGeometry.js`   Create a square geometry for put the texture of the nitfi image


**Till now incluse files**

    <!--Css style-->
    <link href="css/visualization.css" rel="stylesheet" type="text/css">
    <link href="./jqueryLib/jquery.contextMenu.css" rel="stylesheet" type="text/css" />
    <link href="./jqueryLib/jquery-ui-1.10.4.css" rel="stylesheet" type="text/css" />
    <!--Jquery Lib-->
    <script src="./jqueryLib/jquery-1.10.2.js" type="text/javascript"></script>
    <script src="./jqueryLib/jquery-ui-1.10.4.js" type="text/javascript"></script>
    <script src="./jqueryLib/jquery.ui.position.js" type="text/javascript"></script>
    <script src="./jqueryLib/jquery.contextMenu.js" type="text/javascript"></script>
    <!--Color Picker-->
    <link rel="stylesheet" media="screen" type="text/css" href="css/colorpicker.css" />
    <script type="text/javascript" src="js/colorpicker.js"></script>
    <!--Three.js lib(modified part R66)-->
    <script src="js/threer66.js"></script> <!-- modified part-->
    <!--Shader:postprocessing_basic-->
    <script type="text/javascript" src="js/postprocessing/EffectComposer.js"></script>
    <script type="text/javascript" src="js/postprocessing/ShaderPass.js"></script>
    <script type="text/javascript" src="js/postprocessing/RenderPass.js"></script>
    <script type="text/javascript" src="js/postprocessing/MaskPass.js"></script>
    <!--Shader-->
    <script type="text/javascript" src="js/shaders/CopyShader.js"></script>
    <script type="text/javascript" src="js/shaders/FXAAShader.js"></script>
    <script type="text/javascript" src="js/shaders/DepthPassPlugin.js"></script>
    <script src="js/customShader.js"></script>
    <!--Tool-->
    <script src="js/Detector.js"></script>
    <script src="js/TrackballControls.js"></script>
    <script src="js/ObjectTrackballControl.js"></script>
    <script src="js/THREEx.FullScreen.js"></script>
    <script src="js/KeyboardState.js"></script>
    <!--Main display-->
    <script src="js/main.js" type="text/javascript"></script>
    <script src="js/navigationBar.js" type="text/javascript"></script>
    <script src="js/bubbleWidget.js" type="text/javascript"></script>
    <script src="js/connections.js" type="text/javascript"></script>
    <script src="js/bubble.js" type="text/javascript"></script>
    <script src="js/FiberSelector.js"></script>
    <script src="js/chart.js"></script>
    <!--Shape-->
    <script src="js/ObjectLoader.js"></script>
    <script src="js/LocalObjectLoader.js"></script>
    <script src="js/ribbonGeometry.js" type="text/javascript"></script>
    <script src="js/tubeGeometry.js" type="text/javascript"></script>
