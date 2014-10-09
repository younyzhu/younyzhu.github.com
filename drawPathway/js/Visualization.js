/**
 * Created by Yongnan on 7/6/2014.
 */

function Visualization(){
    this.type = "VISUALIZATION";
    this.compartments = [];
    this.x = 10+(window.innerWidth-WINDOW_WIDTH)/2;
    this.y = 113;
    this.selectRegionX = 0;
    this.selectRegionY = 0;

    this.w = WINDOW_WIDTH;
    this.h = WINDOW_HEIGHT;

    //this.arrows = [];//Because arrow can draw out of the compartment, so arrow is contained in the Bubble
    //Arrow is divide into three type, Black Arrow, green Activation, yellow Inhibition.
    this.arrows = [];
    this.inhibitions =[];
    this.activations =[];
}
Visualization.prototype ={
    draw: function (ctx) {

        if(this.compartments.length > 0){
            this.drawCompartment(ctx);
        }
        if(this.arrows.length > 0){
            this.drawArrow(ctx);
        }
        if(this.activations.length > 0){
            this.drawActivation(ctx);
        }
        if(this.inhibitions.length > 0){
            this.drawInhibition(ctx);
        }
        if(this.compartments.length > 0){
            this.drawCompartmentElements(ctx);
        }
        if(mainManagement.shapes.length > 0) {
            this.drawInformation(ctx);
        }
    },
    addArrow: function(id, beginNode, endNode  ){
        var arrow = new Arrow(id, beginNode, endNode );
        mainManagement.addShape(arrow);
        this.arrows.push(arrow);
    },
    drawArrow: function(ctx){
        for(var i=0; i<this.arrows.length; i++)
        {
            this.arrows[i].draw(ctx, this.x, this.y);
        }
    },
    addInhibition: function(id, beginNode, endNode  ){
        var inhibition = new Inhibition(id, beginNode, endNode );
        mainManagement.addShape(inhibition);
        this.inhibitions.push(inhibition);
    },
    drawInhibition: function(ctx){
        for(var i=0; i<this.inhibitions.length; i++)
        {
            this.inhibitions[i].draw(ctx, this.x, this.y);
        }
    },
    addActivation: function(id, beginNode, endNode   ){
        var activation = new Activation(id, beginNode, endNode );
        mainManagement.addShape(activation);
        this.activations.push(activation);
    },
    drawActivation: function(ctx){
        for(var i=0; i<this.activations.length; i++)
        {
            this.activations[i].draw(ctx, this.x, this.y);
        }
    },
    addCompartment: function(i, x, y, w, h, name,Offsetx, Offsety){
        var compartment = new Compartment(i, mainManagement, x *this.w, y*this.h, w*this.w, h*this.h, name,Offsetx, Offsety);
        mainManagement.addShape(compartment);
        this.compartments.push(compartment);
    },
    drawCompartment: function(ctx){
        for(var i=0; i<this.compartments.length; i++)
        {
            this.compartments[i].draw(ctx, this.x, this.y);    //This is the relative position (this.x, this.y) for all the compartment inside the bubble
        }
    },  //As Arrows should be draw on the lowest layer, so I first draw the arrow and then draw the other elements by dividing the drawCompartment function into two parts:  drawCompartment and  drawCompartmentElements
    drawCompartmentElements: function(ctx){
        for(var i=0; i<this.compartments.length; i++)
        {
            this.compartments[i].drawElements(ctx, this.x, this.y);
        }
    },
    contains: function (mx, my) {
        var x = this.selectRegionX;
        var y = this.selectRegionY;
        var w = this.w;
        var h = this.h;
        return  (x <= mx) && (x + w >= mx) &&
            (y <= my) && (y + h >= my);
    },
    drawInformation: function(ctx){
        var edetection = new Detection(mainManagement.shapes);
        var edgeCrossing= edetection.findCrossing();
        var odetection = new OverlappingDetection(mainManagement.shapes, loader.v);
        var nodeOverlapping = odetection.findNumberofOverlappint();
        var edgeStr = "Number of Edge Crossing: " + edgeCrossing;
        var edgeStrObj  = new Text( edgeStr );
        edgeStrObj.font = '12pt Arial';
        var w = edgeStrObj.getTextWidth(ctx)+10;
        edgeStrObj.draw(10 + w/2, 10 + 30/2 + 30, ctx );
        var nodeStr = "Number of Node Overlapping: " + nodeOverlapping;
        var nodeStrObj  = new Text( nodeStr );
        nodeStrObj.font = '12pt Arial';
        var w = nodeStrObj.getTextWidth(ctx)+10;
        nodeStrObj.draw(10 + w/2, 10 + 30/2 + 30+20, ctx );

        var upwarddetection = new UpwardsDetection(mainManagement.shapes);
        var upward = upwarddetection.findNumberofUpwardsEdges();
        var upwardArrowStr = "Number of Upward arrow: " + upward;
        var upwardArrowObj  = new Text( upwardArrowStr );
        upwardArrowObj.font = '12pt Arial';
        var w = upwardArrowObj.getTextWidth(ctx)+10;
        upwardArrowObj.draw(10 + w/2, 10 + 30/2 + 30+20+20, ctx );

    }
};
