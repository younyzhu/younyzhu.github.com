/**
 * Created by Yongnan on 7/2/2014.
 */
function Bubble(id, state, x, y, w, h) {
    this.type = "BUBBLE";
    this.id = id || 0;     //this rectangle belongs to which bubble or chart
    this.state = state;
    this.x = x;
    this.y = y;
    this.w = w || 1;
    this.h = h || 1;
    this.radius = 10;
    this.strokeColor = "#000000";
    this.fillColor = "#2F968B";
    this.lineWidth = 2;
    this.offsetX =0;
    this.offsetY =0;
    this.compartments = [];
    //this.arrows = [];//Because arrow can draw out of the compartment, so arrow is contained in the Bubble
    //Arrow is divide into three type, Black Arrow, green Activation, yellow Inhibition.
    this.arrows = [];
    this.inhibitions =[];
    this.activations =[];
}

Bubble.prototype = {
    draw: function (ctx) {
        this.drawBubble(ctx);
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
        if (this.state.selection === this) {
            this.drawSelection(ctx);
        }
        if(this.compartments.length > 0){
            this.drawCompartmentElements(ctx);
        }
    },
    addArrow: function(id,beginX,beginY,endX,endY ){
        var arrow = new Arrow(id,beginX*this.w,beginY*this.h,endX*this.w,endY*this.h);
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
    addInhibition: function(id,beginX,beginY,endX,endY ){
        var inhibition = new Inhibition(id,beginX*this.w,beginY*this.h,endX*this.w,endY*this.h);
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
    addActivation: function(id,beginX,beginY,endX,endY ){
        var inhibition = new Activation(id,beginX*this.w,beginY*this.h,endX*this.w,endY*this.h);
        mainManagement.addShape(inhibition);
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
    drawSelection: function(ctx){
        var i, cur, half;
        // draw the boxes
        half = this.state.selectionBoxSize / 2;
        // 0  1  2
        // 3     4
        // 5  6  7
        // top left, middle, right
        var x = this.x;
        var y = this.y;
        this.state.selectionHandles[0].x = x - half;
        this.state.selectionHandles[0].y = y - half;

        this.state.selectionHandles[1].x = x + this.w / 2 - half;
        this.state.selectionHandles[1].y = y - half;

        this.state.selectionHandles[2].x = x + this.w - half;
        this.state.selectionHandles[2].y = y - half;

        //middle left
        this.state.selectionHandles[3].x = x - half;
        this.state.selectionHandles[3].y = y + this.h / 2 - half;

        //middle right
        this.state.selectionHandles[4].x = x + this.w - half;
        this.state.selectionHandles[4].y = y + this.h / 2 - half;

        //bottom left, middle, right
        this.state.selectionHandles[6].x = x + this.w / 2 - half;
        this.state.selectionHandles[6].y = y + this.h - half;

        this.state.selectionHandles[5].x = x - half;
        this.state.selectionHandles[5].y = y + this.h - half;

        this.state.selectionHandles[7].x = x + this.w - half;
        this.state.selectionHandles[7].y = y + this.h - half;

        for (i = 0; i < 8; i += 1) {
            cur = this.state.selectionHandles[i];
            ctx.fillStyle = "#ffff00";
            ctx.fillRect(cur.x, cur.y, this.state.selectionBoxSize, this.state.selectionBoxSize);
        }
    },
    drawBubble: function(ctx){
        var r, thea;
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;

        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.stroke();
        ctx.restore();	// restore context to what it was on entry

        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        r = Math.sqrt((this.h/2)*(this.h/2) + 16 *this.w * this.w);
        thea = Math.atan(this.h/this.w/8);
        ctx.arc(this.x + this.w*4, this.y + this.h/2, r , Math.PI - thea,  Math.PI+thea, false);
        ctx.closePath();
        ctx.fill();
        //ctx.stroke();
        ctx.restore();	// restore context to what it was on entry

        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        r = Math.sqrt((this.h/2)*(this.h/2) + 16 *this.w * this.w);
        thea = Math.atan(this.h/this.w/8);
        ctx.arc(this.x- this.w*3, this.y + this.h/2, r , -thea,  thea, false);
        ctx.closePath();
        ctx.fill();
        //ctx.stroke();
        ctx.restore();	// restore context to what it was on entry

        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        r = Math.sqrt((this.w/2)*(this.w/2) + 16 * this.h * this.h);
        thea = Math.atan(this.w/this.h/8);
        ctx.arc(this.x + this.w/2, this.y + 4 * this.h, r , Math.PI*3/2-thea,  Math.PI*3/2 + thea, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();	// restore context to what it was on entry

        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        r = Math.sqrt((this.w/2)*(this.w/2) + 16*this.h*this.h);
        thea = Math.atan(this.w/this.h/8);
        ctx.arc(this.x + this.w/2, this.y-3*this.h , r , Math.PI/2-thea,  Math.PI/2 + thea, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();	// restore context to what it was on entry
    },
    addCompartment: function(i, x, y, w, h, name){
        var compartment = new Compartment(i, this.state, x *this.w, y*this.h, w*this.w, h*this.h, name);
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
        return  (this.x <= mx) && (this.x + this.w >= mx) &&
            (this.y <= my) && (this.y + this.h >= my);
    }
};