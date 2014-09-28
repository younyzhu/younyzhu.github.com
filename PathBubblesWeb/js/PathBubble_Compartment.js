/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/26/2014
 * @name        PathBubble_Compartment
 */
PATHBUBBLES.Compartment = function(id, state, x, y, w, h, text, Offsetx, Offsety){
    PATHBUBBLES.Object2D.call(this);
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
    this.strokeColor = "#C2C2C2";
    this.fillColor = "#ffffff";
    this.lineWidth = 2;
    this.offsetX =0;
    this.offsetY =0;
    //Complex, DNA, Protein, Reaction are inside the compartment
    this.complexs = [];
    this.dnas = [];
    this.rnas = [];
    this.proteins = [];
    this.molecules =[];
    //this.reactions = []; //reaction is divided into 3 parts association, dissociation, inhibition
    this.associations = [];
    this.dissociations = [];
    this.transitions = [];
    this.entitys = [];

    this.childOffsetx = Offsetx||this.x;
    this.childOffsety = Offsety||this.y;
    this.flag = false;
};
PATHBUBBLES.Compartment.prototype = Object.create( PATHBUBBLES.Object2D.prototype );
PATHBUBBLES.Compartment.prototype = {
    addComplex:function(id, x, y, w, h,text,compartmentId,colors){
        var complex = new PATHBUBBLES.Biomolecule.Complex(id, x *this.w, y*this.h, w*this.w, h*this.h,text,compartmentId,colors);
        complex.offsetX = this.childOffsetx;
        complex.offsetY = this.childOffsety;
        mainManagement.addShape(complex);
        this.complexs.push(complex);
    },
    drawComplex:function(ctx){
        for(var i=0; i<this.complexs.length; ++i)
        {
            this.complexs[i].draw(ctx, this.childOffsetx + this.offsetX, this.childOffsety + this.offsetY);
        }
    },
    addProtein: function(id, x, y, w, h,text,compartmentId,colors){
        var protein = new Protein(id, x *this.w, y*this.h, w*this.w, h*this.h, text,compartmentId,colors);
        protein.offsetX = this.childOffsetx;
        protein.offsetY = this.childOffsety;
        mainManagement.addShape(protein);
        this.proteins.push(protein);
    },
    drawProtein:function(ctx){
        for(var i=0; i<this.proteins.length; ++i)
        {
            this.proteins[i].draw(ctx, this.childOffsetx + this.offsetX, this.childOffsety + this.offsetY);
        }
    },
    addDNA: function(id, x, y, w, h, text,compartmentId,colors){
        var dna = new DNA(id, x *this.w, y*this.h, w*this.w, h*this.h,text,compartmentId,colors);
        dna.offsetX = this.childOffsetx;
        dna.offsetY = this.childOffsety;
        mainManagement.addShape(dna);
        this.dnas.push(dna);
    },
    drawDNA:function(ctx){
        for(var i=0; i<this.dnas.length; ++i)
        {
            this.dnas[i].draw(ctx, this.childOffsetx + this.offsetX, this.childOffsety + this.offsetY);
        }
    },
    addRNA: function(id, x, y, w, h, text,compartmentId,colors){
        var rna = new RNA(id, x *this.w, y*this.h, w*this.w, h*this.h,text,compartmentId,colors);
        rna.offsetX = this.childOffsetx;
        rna.offsetY = this.childOffsety;
        mainManagement.addShape(rna);
        this.rnas.push(rna);
    },
    drawRNA:function(ctx){
        for(var i=0; i<this.rnas.length; ++i)
        {
            this.rnas[i].draw(ctx, this.childOffsetx + this.offsetX, this.childOffsety + this.offsetY);
        }
    },
    addSmall_Molecule: function(id, x, y, w, h,text,compartmentId,colors,duplicates){
        var molecule = new Small_Molecule(id, x *this.w, y*this.h, w*this.w, h*this.h,text,compartmentId,colors);
        molecule.duplicates = duplicates;
        molecule.offsetX = this.childOffsetx;
        molecule.offsetY = this.childOffsety;
        mainManagement.addShape(molecule);
        this.molecules.push(molecule);
    },
    drawSmall_Molecule:function(ctx){
        for(var i=0; i<this.molecules.length; ++i)
        {
            this.molecules[i].draw(ctx, this.childOffsetx + this.offsetX, this.childOffsety + this.offsetY);
        }
    },
    addPhysical_Entity: function(id, x, y, w, h,text,compartmentId,colors){
        var entity = new Physical_Entity(id, x *this.w, y*this.h, w*this.w, h*this.h,text,compartmentId,colors);
        entity.offsetX = this.childOffsetx;
        entity.offsetY = this.childOffsety;
        mainManagement.addShape(entity);
        this.entitys.push(entity);
    },
    drawPhysical_Entity:function(ctx){
        for(var i=0; i<this.entitys.length; ++i)
        {
            this.entitys[i].draw(ctx, this.childOffsetx + this.offsetX, this.childOffsety + this.offsetY);
        }
    },
    addDissociation: function(id, x, y, w, h,compartmentId,colors){
        var dissociation = new Dissociation(id, x * this.w, y * this.h, w*this.w, h*this.h,compartmentId,colors);
        dissociation.offsetX = this.childOffsetx;
        dissociation.offsetY = this.childOffsety;
        mainManagement.addShape(dissociation);
        this.dissociations.push(dissociation);
    },
    drawDissociation:function(ctx){
        for(var i=0; i<this.dissociations.length; ++i)
        {
            this.dissociations[i].draw(ctx, this.childOffsetx + this.offsetX, this.childOffsety + this.offsetY);
        }
    },
    addAssociation: function(id, x, y, w, h,compartmentId,colors){
        var association = new Association(id, x * this.w, y * this.h, w*this.w, h*this.h,compartmentId,colors);
        association.offsetX = this.childOffsetx;
        association.offsetY = this.childOffsety;
        mainManagement.addShape(association);
        this.associations.push(association);
    },
    drawAssociation:function(ctx){
        for(var i=0; i<this.associations.length; ++i)
        {
            this.associations[i].draw(ctx, this.childOffsetx + this.offsetX, this.childOffsety + this.offsetY);
        }
    },
    addTransition: function(id, x, y, w, h,compartmentId,colors){
        var transition = new Transition(id, x * this.w, y * this.h, w*this.w, h*this.h,compartmentId,colors);
        transition.offsetX = this.childOffsetx;
        transition.offsetY = this.childOffsety;
        mainManagement.addShape(transition);
        this.transitions.push(transition);
    },
    drawTransition:function(ctx){
        for(var i=0; i<this.transitions.length; ++i)
        {
            this.transitions[i].draw(ctx, this.childOffsetx + this.offsetX, this.childOffsety + this.offsetY);
        }
    },
    draw: function (ctx, offsetX, offsetY) {
        /*var tw = this.textObj.getTextWidth(ctx)+5;
         if(this.w <=tw)
         {
         this.w = tw;
         }*/
        this.offsetX =offsetX;
        this.offsetY =offsetY;
        this.drawCompartment(ctx);
        this.drawElements(ctx);
        if (this.flag) {
            this.drawSelection(ctx);
            this.drawStroke(ctx);
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
        if(this.rnas.length>0)
        {
            this.drawRNA(ctx);
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
    drawStroke: function(ctx){
        var x = this.x+ this.offsetX;
        var y = this.y+ this.offsetY;
        var w = this.w;
        var h = this.h;
        ctx.strokeStyle = "#ffff00";
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
        ctx.stroke();
        ctx.restore();
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
    drawSelection: function(ctx) {
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
            ctx.fillStyle = "#ff0000";
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