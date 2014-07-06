/**
 * Created by Yongnan on 7/6/2014.
 */

function Visualization(){
    this.type = "VISUALIZATION";
    this.compartments = [];
    this.x = 0;
    this.y = 0;
    this.selectRegionX = this.x;
    this.selectRegionY = this.y;

    this.w = window.innerWidth;
    this.h = window.innerHeight;
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
        if (mainManagement.selection === this) {
           this.drawSelection(ctx);
        }
        if(this.compartments.length > 0){
            this.drawCompartmentElements(ctx);
        }
    },
    drawSelection: function(ctx){

        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#ffff00";
        ctx.rect(this.selectRegionX, this.selectRegionY, window.innerWidth, window.innerHeight);
        ctx.stroke();
        ctx.restore();
    },
    addArrow: function(id, beginType, beginNodeId, endType, endNodeId  ){
        var arrow = new Arrow(id, beginType, beginNodeId, endType, endNodeId );
        //arrow.offsetX = this.offsetX;
        //arrow.offsetY = this.offsetY;
        mainManagement.addShape(arrow);
        this.arrows.push(id);
    },
    drawArrow: function(ctx){
        for(var i=0; i<this.arrows.length; i++)
        {
            for(var j=0; j< mainManagement.shapes.length; j++)
            {
                if(mainManagement.shapes[j].id === this.arrows[i] && mainManagement.shapes[j].type === "ARROW")
                {
                    mainManagement.shapes[j].draw(ctx, this.x, this.y);
                }
            }
        }
    },
    addInhibition: function(id, beginType, beginNodeId, endType, endNodeId){
        var inhibition = new Inhibition(id, beginType, beginNodeId, endType, endNodeId);
        //inhibition.offsetX = this.offsetX;
        //inhibition.offsetY = this.offsetY;
        mainManagement.addShape(inhibition);
        this.inhibitions.push(id);
    },
    drawInhibition: function(ctx){
        for(var i=0; i<this.inhibitions.length; i++)
        {
            for(var j=0; j< mainManagement.shapes.length; j++)
            {
                if(mainManagement.shapes[j].id === this.inhibitions[i] && mainManagement.shapes[j].type === "INHIBITION")
                {
                    mainManagement.shapes[j].draw(ctx, this.x, this.y);
                }
            }
        }
    },
    addActivation: function(id, beginType, beginNodeId, endType, endNodeId ){
        var activation = new Activation(id, beginType, beginNodeId, endType, endNodeId);
        //activation.offsetX = this.offsetX;
        //activation.offsetY = this.offsetY;
        mainManagement.addShape(activation);
        this.activations.push(id);
    },
    drawActivation: function(ctx){
        for(var i=0; i<this.activations.length; i++)
        {
            for(var j=0; j< mainManagement.shapes.length; j++)
            {
                if(mainManagement.shapes[j].id === this.activations[i] && mainManagement.shapes[j].type === "ACTIVATION")
                {
                    mainManagement.shapes[j].draw(ctx, this.x, this.y);
                }
            }
        }
    },
    addCompartment: function(i, x, y, w, h, name){
        //var compartment = new Compartment(i, mainManagement, x *window.innerWidth, y*window.innerHeight, w*window.innerWidth, h*window.innerHeight, name);
        var compartment = new Compartment(i, mainManagement, x *this.w, y*this.h, w*this.w, h*this.h, name);
        //compartment.offsetX = this.offsetX;
        //compartment.offsetY = this.offsetY;
        mainManagement.addShape(compartment);
        this.compartments.push(i);
    },
    drawCompartment: function(ctx){
        for(var i=0; i<this.compartments.length; i++)
        {
            // We can skip the drawing of elements that have moved off the screen:
            /*if (this.compartments[i].x <= this.width && this.compartments[i].y <= this.height &&
             this.compartments[i].x + this.compartments[i].w >= 0 && this.compartments[i].y + this.compartments[i].h >= 0) {
             }*/
            for(var j=0; j< mainManagement.shapes.length; j++)
            {
                if(mainManagement.shapes[j].id === this.compartments[i] && mainManagement.shapes[j].type === "COMPARTMENT")
                {
                    mainManagement.shapes[j].draw(ctx, this.x, this.y);
                }
            }
            //this.compartments[i].draw(ctx, this.x, this.y);    //This is the relative position (this.x, this.y) for all the compartment inside the bubble
        }
    },  //As Arrows should be draw on the lowest layer, so I first draw the arrow and then draw the other elements by dividing the drawCompartment function into two parts:  drawCompartment and  drawCompartmentElements
    drawCompartmentElements: function(ctx){
        for(var i=0; i<this.compartments.length; i++)
        {
            // We can skip the drawing of elements that have moved off the screen:
            /*if (this.compartments[i].x <= this.width && this.compartments[i].y <= this.height &&
             this.compartments[i].x + this.compartments[i].w >= 0 && this.compartments[i].y + this.compartments[i].h >= 0) {
             }*/
            for(var j=0; j< mainManagement.shapes.length; j++)
            {
                if(mainManagement.shapes[j].id === this.compartments[i] && mainManagement.shapes[j].type === "COMPARTMENT")
                {
                    mainManagement.shapes[j].drawElements(ctx, this.x, this.y);
                }
            }
            //this.compartments[i].draw(ctx, this.x, this.y);    //This is the relative position (this.x, this.y) for all the compartment inside the bubble
        }
    },
    contains: function (mx, my) {
        var x = this.selectRegionX;
        var y = this.selectRegionY;
        var w = this.w;
        var h = this.h;
        return  (x <= mx) && (x + w >= mx) &&
            (y <= my) && (y + h >= my);
    }
};
