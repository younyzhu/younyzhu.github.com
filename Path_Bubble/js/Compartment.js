/**
 * Created by Yongnan on 7/2/2014.
 */
function Compartment(id, state, x, y, w, h, text) {
    this.type = "M";        //COMPARTMENT   ===>   M
    this.id = id || 0;     //this rectangle belongs to which bubble or chart
    this.state = state;
    this.x = x;
    this.y = y;
    this.w = w || 1;
    this.h = h || 1;
    this.radius = 10;
    this.text = text;
    this.textObj = new Text(text);
    this.strokeColor = "#000000";
    this.fillColor = "#ffffff";
    this.lineWidth = 2;
    this.offsetX =0;
    this.offsetY =0;
    //Complex, DNA, Protein, Reaction are inside the compartment
    this.complexs = [];
    this.dnas = [];
    this.proteins = [];
    this.molecules =[];
    //this.reactions = []; //reaction is divided into 3 parts association, dissociation, inhibition
    this.associations = [];
    this.dissociations = [];
    this.transitions = [];
    this.entitys = [];
}

Compartment.prototype = {
    addComplex:function(id, x, y, w, h){
        var complex = new Complex(id, x *this.w, y*this.h, w*this.w, h*this.h);
        mainManagement.addShape(complex);
        this.complexs.push(id);
    },
    drawComplex:function(ctx){
        for(var i=0; i<this.complexs.length; ++i)
        {
            for(var j=0; j< mainManagement.shapes.length; j++)
            {
                if(mainManagement.shapes[j].id === this.complexs[i] && mainManagement.shapes[j].type === "C")    //COMPLEX
                {
                    mainManagement.shapes[j].draw(ctx, this.x + this.offsetX, this.y + this.offsetY);
                }
            }
        }
    },
    addProtein: function(id, x, y, w, h,text){
        var protein = new Protein(id, x *this.w, y*this.h, w*this.w, h*this.h, text);
        protein.offsetX = this.offsetX;
        protein.offsetY = this.offsetY;
        mainManagement.addShape(protein);
        this.proteins.push(id);
    },
    drawProtein:function(ctx){
        for(var i=0; i<this.proteins.length; ++i)
        {
            for(var j=0; j< mainManagement.shapes.length; j++)
            {
                if(mainManagement.shapes[j].id === this.proteins[i] && mainManagement.shapes[j].type === "P")
                {
                    mainManagement.shapes[j].draw(ctx, this.x + this.offsetX, this.y + this.offsetY);
                }
            }
        }
    },
    addDNA: function(id, x, y, w, h, text){
        var dna = new DNA(id, x *this.w, y*this.h, w*this.w, h*this.h,text);
        dna.offsetX = this.offsetX;
        dna.offsetY = this.offsetY;
        mainManagement.addShape(dna);
        this.dnas.push(id);
    },
    drawDNA:function(ctx){
        for(var i=0; i<this.dnas.length; ++i)
        {
            for(var j=0; j< mainManagement.shapes.length; j++)
            {
                if(mainManagement.shapes[j].id === this.dnas[i] && mainManagement.shapes[j].type === "D")
                {
                    mainManagement.shapes[j].draw(ctx, this.x + this.offsetX, this.y + this.offsetY);
                }
            }
        }
    },
    addSmall_Molecule: function(id, x, y, w, h,text){
        var molecule = new Small_Molecule(id, x *this.w, y*this.h, w*this.w, h*this.h,text);
        molecule.offsetX = this.offsetX;
        molecule.offsetY = this.offsetY;
        mainManagement.addShape(molecule);
        this.molecules.push(id);
    },
    drawSmall_Molecule:function(ctx){
        for(var i=0; i<this.molecules.length; ++i)
        {
            for(var j=0; j< mainManagement.shapes.length; j++)
            {
                if(mainManagement.shapes[j].id === this.molecules[i] && mainManagement.shapes[j].type === "S")
                {
                    mainManagement.shapes[j].draw(ctx, this.x + this.offsetX, this.y + this.offsetY);
                }
            }
        }
    },
    addPhysical_Entity: function(id, x, y, w, h,text){
        var entity = new Physical_Entity(id, x *this.w, y*this.h, w*this.w, h*this.h,text);
        entity.offsetX = this.offsetX;
        entity.offsetY = this.offsetY;
        mainManagement.addShape(entity);
        this.entitys.push(id);
    },
    drawPhysical_Entity:function(ctx){
        for(var i=0; i<this.entitys.length; ++i)
        {
            for(var j=0; j< mainManagement.shapes.length; j++)
            {
                if(mainManagement.shapes[j].id === this.entitys[i] && mainManagement.shapes[j].type === "E")
                {
                    mainManagement.shapes[j].draw(ctx, this.x + this.offsetX, this.y + this.offsetY);
                }
            }
        }
    },
    addDissociation: function(id, x, y, w, h){
        var dissociation = new Dissociation(id, x * this.w, y * this.h, w*this.w, h*this.h);
        dissociation.offsetX = this.offsetX;
        dissociation.offsetY = this.offsetY;
        mainManagement.addShape(dissociation);
        this.dissociations.push(id);
    },
    drawDissociation:function(ctx){
        for(var i=0; i<this.dissociations.length; ++i)
        {
            for(var j=0; j< mainManagement.shapes.length; j++)
            {
                if(mainManagement.shapes[j].id === this.dissociations[i] && mainManagement.shapes[j].type === "K")
                {
                    mainManagement.shapes[j].draw(ctx, this.x + this.offsetX, this.y + this.offsetY);
                }
            }
        }
    },
    addAssociation: function(id, x, y, w, h){
        var association = new Association(id, x * this.w, y * this.h, w*this.w, h*this.h);
        association.offsetX = this.offsetX;
        association.offsetY = this.offsetY;
        mainManagement.addShape(association);
        this.associations.push(id);
    },
    drawAssociation:function(ctx){
        for(var i=0; i<this.associations.length; ++i)
        {
            for(var j=0; j< mainManagement.shapes.length; j++)
            {
                if(mainManagement.shapes[j].id === this.associations[i] && mainManagement.shapes[j].type === "B")
                {
                    mainManagement.shapes[j].draw(ctx, this.x + this.offsetX, this.y + this.offsetY);
                }
            }
        }
    },
    addTransition: function(id, x, y, w, h){
        var transition = new Transition(id, x * this.w, y * this.h, w*this.w, h*this.h);
        transition.offsetX = this.offsetX;
        transition.offsetY = this.offsetY;
        mainManagement.addShape(transition);
        this.transitions.push(id);
    },
    drawTransition:function(ctx){
        for(var i=0; i<this.transitions.length; ++i)
        {
            for(var j=0; j< mainManagement.shapes.length; j++)
            {
                if(mainManagement.shapes[j].id === this.transitions[i] && mainManagement.shapes[j].type === "T")
                {
                    mainManagement.shapes[j].draw(ctx, this.x + this.offsetX, this.y + this.offsetY);
                }
            }
        }
    },
    draw: function (ctx, offsetX, offsetY) {
        this.offsetX =offsetX;
        this.offsetY =offsetY;
        this.drawCompartment(ctx);
        this.drawElements(ctx);
        if (this.state.selection === this) {
             this.drawSelection(ctx);
        }
        if (this.textObj) {
            var x = this.x+this.offsetX;
            var y = this.y+this.offsetY;
            var w = this.w;
            var h = this.h;
            this.textObj.draw(x + w / 2, y + h - 10, ctx);
        }
    },
    drawElements: function(ctx){
        if(this.dissociations.length>0)
        {
            this.drawDissociation(ctx);
        }
        if(this.associations.length>0)
        {
            this.drawAssociation(ctx);
        }
        if(this.transitions.length>0)
        {
            this.drawTransition(ctx);
        }
        if(this.complexs.length>0)
        {
            this.drawComplex(ctx);
        }
        if(this.proteins.length>0)
        {
            this.drawProtein(ctx);
        }
        if(this.dnas.length>0)
        {
            this.drawDNA(ctx);
        }
        if(this.molecules.length>0)
        {
            this.drawSmall_Molecule(ctx);
        }
        if(this.entitys.length>0)
        {
            this.drawPhysical_Entity(ctx);
        }
    },
    drawCompartment: function(ctx){
        var x = this.x+ this.offsetX;
        var y = this.y+ this.offsetY;
        var w = this.w;
        var h = this.h;
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;

        var r = x + w;
        var b = y + h;
        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        ctx.moveTo(x + this.radius, y);
        ctx.lineTo(r - this.radius, y);
        ctx.quadraticCurveTo(r, y, r, y + this.radius);
        ctx.lineTo(r, y + h - this.radius);
        ctx.quadraticCurveTo(r, b, r - this.radius, b);
        ctx.lineTo(x + this.radius, b);
        ctx.quadraticCurveTo(x, b, x, b - this.radius);
        ctx.lineTo(x, y + this.radius);
        ctx.quadraticCurveTo(x, y, x + this.radius, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    },
    drawSelection: function(ctx){
        var i, cur, half;
        var x = this.x+this.offsetX;
        var y = this.y+this.offsetY;
        var w = this.w;
        var h = this.h;
        // draw the boxes
        half = this.state.selectionBoxSize / 2;
        // 0  1  2
        // 3     4
        // 5  6  7
        // top left, middle, right
        this.state.selectionHandles[0].x = x - half;
        this.state.selectionHandles[0].y = y - half;

        this.state.selectionHandles[1].x = x + w / 2 - half;
        this.state.selectionHandles[1].y = y - half;

        this.state.selectionHandles[2].x = x + w - half;
        this.state.selectionHandles[2].y = y - half;

        //middle left
        this.state.selectionHandles[3].x = x - half;
        this.state.selectionHandles[3].y = y + h / 2 - half;

        //middle right
        this.state.selectionHandles[4].x = x + w - half;
        this.state.selectionHandles[4].y = y + h / 2 - half;

        //bottom left, middle, right
        this.state.selectionHandles[6].x = x + w / 2 - half;
        this.state.selectionHandles[6].y = y + h - half;

        this.state.selectionHandles[5].x = x - half;
        this.state.selectionHandles[5].y = y + h - half;

        this.state.selectionHandles[7].x = x + w - half;
        this.state.selectionHandles[7].y = y + h - half;

        for (i = 0; i < 8; i += 1) {
            cur = this.state.selectionHandles[i];
            ctx.save();	// save the context so we don't mess up others
            ctx.fillStyle = "#ffff00";
            ctx.fillRect(cur.x, cur.y, this.state.selectionBoxSize, this.state.selectionBoxSize);
            ctx.restore();
        }
    },
    contains: function (mx, my) {
        var x = this.x + this.offsetX;
        var y = this.y + this.offsetY;
        return  (x<= mx) && (x + this.w >= mx) && (y <= my) && (y + this.h >= my);
    }
};