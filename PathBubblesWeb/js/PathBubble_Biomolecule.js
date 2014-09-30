/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/17/2014
 * @name        PathBubble_Biomolecule
 */
//Bubble===>BubbleView==>Compartment ==>Biomolecules
PATHBUBBLES.Biomolecule = PATHBUBBLES.Biomolecule|| {};
//Biomolecules below:
//Compartment  M
//Complex C
//Protein P
//Physical_Entity E
//DNA D
//RNA R

//Dissociation K
//Association B
//Transition T

PATHBUBBLES.Biomolecule.Compartment = function(bubbleView, dataId, x, y, w, h, text){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.type = "M";
    this.x = x;
    this.y = y;
    this.w = w || 1;
    this.h = h || 1;
    this.shape = new PATHBUBBLES.Shape.Rectangle(this, this.x, this.y, this.w ,this.h, "#C2C2C2", "#ffffff", 2, 10);

    this.parent = bubbleView;

    this.name = text;
    this.textObj = new PATHBUBBLES.Text(this,this.name);
    this.textObj.fillColor = '#666666';
    this.textObj.font = '8pt Calibri';
    this.textObj.textBaseline = "bottom";
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

};
PATHBUBBLES.Biomolecule.Compartment.prototype = Object.create( PATHBUBBLES.Object2D.prototype );
PATHBUBBLES.Biomolecule.Compartment.prototype = {
    constructor: PATHBUBBLES.Biomolecule.Compartment,
    addComplex:function(id, x, y, w, h, text){
        var complex = new PATHBUBBLES.Biomolecule.Complex(this, id, x *this.w, y*this.h, text);
//        if(PATHBUBBLES.objects.indexOf(complex)==-1)
//            PATHBUBBLES.objects.push(complex);
        if(this.parent.parent instanceof PATHBUBBLES.Bubble)
        {
            this.parent.parent.addObject(complex);
        }
        this.complexs.push(complex);
    },
    drawComplex:function(ctx,scale){
        for(var i=0; i<this.complexs.length; ++i)
        {
            this.complexs[i].draw(ctx, 1);
        }
    },
    addProtein: function(id, x, y, w, h, text){
        var protein = new PATHBUBBLES.Biomolecule.Protein(this, id, x *this.w, y*this.h, text);
//        if(PATHBUBBLES.objects.indexOf(protein)==-1)
//            PATHBUBBLES.objects.push(protein);
        if(this.parent.parent instanceof PATHBUBBLES.Bubble)
        {
            this.parent.parent.addObject(protein);
        }
        this.proteins.push(protein);
    },
    drawProtein:function(ctx,scale){
        for(var i=0; i<this.proteins.length; ++i)
        {
            this.proteins[i].draw(ctx, 1);
        }
    },
    addDNA: function(id, x, y, w, h, text){
        var dna = new PATHBUBBLES.Biomolecule.DNA(this, id, x *this.w, y*this.h, text);
//        if(PATHBUBBLES.objects.indexOf(dna)==-1)
//            PATHBUBBLES.objects.push(dna);
        if(this.parent.parent instanceof PATHBUBBLES.Bubble)
        {
            this.parent.parent.addObject(dna);
        }
        this.dnas.push(dna);
    },
    drawDNA:function(ctx,scale){
        for(var i=0; i<this.dnas.length; ++i)
        {
            this.dnas[i].draw(ctx, 1);
        }
    },
    addRNA: function(id, x, y, w, h, text){
        var rna = new PATHBUBBLES.Biomolecule.RNA(this, id, x *this.w, y*this.h, text);
//        if(PATHBUBBLES.objects.indexOf(rna)==-1)
//            PATHBUBBLES.objects.push(rna);
        if(this.parent.parent instanceof PATHBUBBLES.Bubble)
        {
            this.parent.parent.addObject(rna);
        }
        this.rnas.push(rna);
    },
    drawRNA:function(ctx,scale){
        for(var i=0; i<this.rnas.length; ++i)
        {
            this.rnas[i].draw(ctx, 1);
        }
    },
    addSmall_Molecule: function(id, x, y, w, h, text){
        var molecule = new PATHBUBBLES.Biomolecule.Small_Molecule(this, id, x *this.w, y*this.h, text);
//        molecule.duplicates = duplicates;
//        if(PATHBUBBLES.objects.indexOf(molecule)==-1)
//            PATHBUBBLES.objects.push(molecule);
        if(this.parent.parent instanceof PATHBUBBLES.Bubble)
        {
            this.parent.parent.addObject(molecule);
        }
        this.molecules.push(molecule);
    },
    drawSmall_Molecule:function(ctx,scale){
        for(var i=0; i<this.molecules.length; ++i)
        {
            this.molecules[i].draw(ctx, 1);
        }
    },
    addPhysical_Entity: function(id, x, y, w, h, text){
        var entity = new PATHBUBBLES.Biomolecule.Physical_Entity(this, id, x *this.w, y*this.h, text);
//        if(PATHBUBBLES.objects.indexOf(entity)==-1)
//            PATHBUBBLES.objects.push(entity);
        if(this.parent.parent instanceof PATHBUBBLES.Bubble)
        {
            this.parent.parent.addObject(entity);
        }
        this.entitys.push(entity);
    },
    drawPhysical_Entity:function(ctx,scale){
        for(var i=0; i<this.entitys.length; ++i)
        {
            this.entitys[i].draw(ctx, 1);
        }
    },
    addDissociation: function(id, x, y, text){
        var dissociation = new PATHBUBBLES.Biomolecule.Dissociation(this, id, x *this.w, y*this.h, text);
//        if(PATHBUBBLES.objects.indexOf(dissociation)==-1)
//            PATHBUBBLES.objects.push(dissociation);
        if(this.parent.parent instanceof PATHBUBBLES.Bubble)
        {
            this.parent.parent.addObject(dissociation);
        }
        this.dissociations.push(dissociation);
    },
    drawDissociation:function(ctx,scale){
        for(var i=0; i<this.dissociations.length; ++i)
        {
            this.dissociations[i].draw(ctx, 1);
        }
    },
    addAssociation: function(id, x, y, text){
        var association = new PATHBUBBLES.Biomolecule.Association(this, id, x *this.w, y*this.h, text );
//        if(PATHBUBBLES.objects.indexOf(association)==-1)
//            PATHBUBBLES.objects.push(association);
        if(this.parent.parent instanceof PATHBUBBLES.Bubble)
        {
            this.parent.parent.addObject(association);
        }
        this.associations.push(association);
    },
    drawAssociation:function(ctx,scale){
        for(var i=0; i<this.associations.length; ++i)
        {
            this.associations[i].draw(ctx, 1);
        }
    },
    addTransition: function(id, x, y, text ){
        var transition = new PATHBUBBLES.Biomolecule.Transition(this, id, x *this.w, y*this.h, text);
//        if(PATHBUBBLES.objects.indexOf(transition)==-1)
//            PATHBUBBLES.objects.push(transition);
        if(this.parent.parent instanceof PATHBUBBLES.Bubble)
        {
            this.parent.parent.addObject(transition);
        }

        this.transitions.push(transition);
    },
    drawTransition:function(ctx,scale){
        for(var i=0; i<this.transitions.length; ++i)
        {
            this.transitions[i].draw(ctx, 1);
        }
    },
    drawElements: function(ctx,scale){
        if(this.dissociations.length>0)
        {
            this.drawDissociation(ctx,scale);
        }
        if(this.associations.length>0)
        {
            this.drawAssociation(ctx,scale);
        }
        if(this.transitions.length>0)
        {
            this.drawTransition(ctx,scale);
        }
        if(this.complexs.length>0)
        {
            this.drawComplex(ctx,scale);
        }
        if(this.proteins.length>0)
        {
            this.drawProtein(ctx,scale);
        }
        if(this.dnas.length>0)
        {
            this.drawDNA(ctx,scale);
        }
        if(this.rnas.length>0)
        {
            this.drawRNA(ctx,scale);
        }
        if(this.molecules.length>0)
        {
            this.drawSmall_Molecule(ctx,scale);
        }
        if(this.entitys.length>0)
        {
            this.drawPhysical_Entity(ctx,scale);
        }
    },
    drawSelection: function(ctx) {
        var i, cur, half;
        var x = this.x+this.offsetX;
        var y = this.y+this.offsetY;
        var w = this.w;
        var h = this.h;
        // draw the boxes
        half = PATHBUBBLES.selectionBoxSize  / 2;
        // 0  1  2
        // 3     4
        // 5  6  7
        // top left, middle, right
        PATHBUBBLES.selectionBoxSize[0].x = x - half;
        PATHBUBBLES.selectionBoxSize[0].y = y - half;

        PATHBUBBLES.selectionBoxSize[1].x = x + w / 2 - half;
        PATHBUBBLES.selectionBoxSize[1].y = y - half;

        PATHBUBBLES.selectionBoxSize[2].x = x + w - half;
        PATHBUBBLES.selectionBoxSize[2].y = y - half;

        //middle left
        PATHBUBBLES.selectionBoxSize[3].x = x - half;
        PATHBUBBLES.selectionBoxSize[3].y = y + h / 2 - half;

        //middle right
        PATHBUBBLES.selectionBoxSize[4].x = x + w - half;
        PATHBUBBLES.selectionBoxSize[4].y = y + h / 2 - half;

        //bottom left, middle, right
        PATHBUBBLES.selectionBoxSize[6].x = x + w / 2 - half;
        PATHBUBBLES.selectionBoxSize[6].y = y + h - half;

        PATHBUBBLES.selectionBoxSize[5].x = x - half;
        PATHBUBBLES.selectionBoxSize[5].y = y + h - half;

        PATHBUBBLES.selectionBoxSize[7].x = x + w - half;
        PATHBUBBLES.selectionBoxSize[7].y = y + h - half;

        for (i = 0; i < 8; i += 1) {
            cur = PATHBUBBLES.selectionBoxSize[i];
//            ctx.save();	// save the context so we don't mess up others
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(cur.x, cur.y, PATHBUBBLES.selectionBoxSize, PATHBUBBLES.selectionBoxSize);
//            ctx.restore();
        }
    },
    draw: function(ctx,scale){
        this.setOffset();
        this.shape.strokeColor = "#C2C2C2";
        this.shape.fillColor = "#ffffff";
        this.shape.draw(ctx,scale);
        this.drawElements(ctx,scale);

        if(this.textObj)
        {
            if(scale ==1)
                this.textObj.draw(ctx, this.shape.x + this.w/2+this.offsetX, this.shape.y + this.h+this.offsetY);
        }
    },
    setOffset: function(){
        if(this.parent!==undefined)
        {
            this.offsetX = this.parent.offsetX + this.parent.x;
            this.offsetY = this.parent.offsetY + this.parent.y;
        }
        else
        {
            this.offsetX = 0;
            this.offsetY = 0;
        }

        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
        this.shape.x = this.x;
        this.shape.y = this.y;
    },
    contains : function(mx, my)
    {
        this.setOffset();
        return this.shape.contains(mx,my);
    }
};

PATHBUBBLES.Biomolecule.Complex = function(compartment, dataId, x, y, text){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.parent = compartment;
    this.type = "C";
    this.x = x;
    this.y = y;
    this.shape = new PATHBUBBLES.Shape.Rectangle(this, this.x, this.y, 15 ,6, "#C2C2C2", "#FFE2B7", 1, 0);

    this.name = text;
    this.textObj = new PATHBUBBLES.Text(this,this.name);
    this.textObj.fillColor = '#666666';
    this.textObj.font = '8pt Calibri';
};
PATHBUBBLES.Biomolecule.Complex.prototype = Object.create( PATHBUBBLES.Object2D.prototype );
PATHBUBBLES.Biomolecule.Complex.prototype = {
    constructor: PATHBUBBLES.Biomolecule.Complex,
    draw: function(ctx,scale){
        this.setOffset();
        this.shape.strokeColor = "#C2C2C2";
        this.shape.fillColor = "#FFE2B7";
        this.shape.draw(ctx,scale);
        if(this.textObj)
        {
            if(scale ==1)
                this.textObj.draw(ctx, this.shape.x + this.w/2+this.offsetX,this.shape.y + this.h/2+this.offsetY);
        }
    },
    setOffset: function(){
        if(this.parent!==undefined)
        {
            this.offsetX = this.parent.offsetX + this.parent.x;
            this.offsetY = this.parent.offsetY + this.parent.y;
        }
        else
        {
            this.offsetX = 0;
            this.offsetY = 0;
        }

        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
        this.shape.x = this.x;
        this.shape.y = this.y;
    },
    contains : function(mx, my)
    {
        this.setOffset();
        return this.shape.contains(mx,my);
    }
};

PATHBUBBLES.Biomolecule.Physical_Entity = function(compartment, dataId, x, y, text){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.parent = compartment;
    this.type = "E";
    this.x = x;
    this.y = y;
    this.shape = new PATHBUBBLES.Shape.Rectangle(this, this.x, this.y, 30 ,13, "#C2C2C2", "#00ff00", 1, 0);

    this.name = text;
    this.textObj = new PATHBUBBLES.Text(this,this.name);
    this.textObj.fillColor = '#666666';
    this.textObj.font = '8pt Calibri';
};
PATHBUBBLES.Biomolecule.Physical_Entity.prototype = Object.create( PATHBUBBLES.Object2D.prototype );
PATHBUBBLES.Biomolecule.Physical_Entity.prototype = {
    constructor: PATHBUBBLES.Biomolecule.Physical_Entity,
    draw: function(ctx,scale){
        this.setOffset();
        this.shape.strokeColor = "#C2C2C2";
        this.shape.fillColor = "#00ff00";
        this.shape.draw(ctx,scale);
        if(this.textObj)
        {
            if(scale ==1)
                this.textObj.draw(ctx, this.shape.x + this.w/2+this.offsetX,this.shape.y + this.h/2+this.offsetY);
        }
    },
    setOffset: function(){
        if(this.parent!==undefined)
        {
            this.offsetX = this.parent.offsetX + this.parent.x;
            this.offsetY = this.parent.offsetY + this.parent.y;
        }
        else
        {
            this.offsetX = 0;
            this.offsetY = 0;
        }

        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
        this.shape.x = this.x;
        this.shape.y = this.y;
    },
    contains : function(mx, my)
    {
        this.setOffset();
        return this.shape.contains(mx,my);
    }
};

PATHBUBBLES.Biomolecule.DNA = function(compartment, dataId, x, y, text){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.parent = compartment;
    this.type = "D";
    this.x = x;
    this.y = y;
    this.w = 40 ;
    this.h = 15 ;
    this.shape = new PATHBUBBLES.Shape.Hexahedron(this.x, this.y, this.w ,this.h, "#C2C2C2", "#D6EAAC", 1, 0);
    this.name = text;
    this.textObj = new PATHBUBBLES.Text(this,this.name);
    this.textObj.fillColor = '#666666';
    this.textObj.font = '8pt Calibri';
};
PATHBUBBLES.Biomolecule.DNA.prototype = Object.create( PATHBUBBLES.Object2D.prototype );
PATHBUBBLES.Biomolecule.DNA.prototype = {
    constructor: PATHBUBBLES.Biomolecule.DNA,
    draw: function(ctx,scale){
        this.setOffset();
        this.shape.strokeColor = "#C2C2C2";
        this.shape.fillColor = "#D6EAAC";
        this.shape.draw(ctx,scale);
        if(this.textObj)
        {
            if(scale ==1)
                this.textObj.draw(ctx, this.shape.x + this.w/2+this.offsetX,this.shape.y + this.h/2+this.offsetY);
        }
    },
    setOffset: function(){
        if(this.parent!==undefined)
        {
            this.offsetX = this.parent.offsetX + this.parent.x;
            this.offsetY = this.parent.offsetY + this.parent.y;
        }
        else
        {
            this.offsetX = 0;
            this.offsetY = 0;
        }

        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
        this.shape.x = this.x;
        this.shape.y = this.y;
    },
    contains : function(mx, my)
    {
        this.setOffset();
        return this.shape.contains(mx,my);
    }
};

PATHBUBBLES.Biomolecule.RNA = function(compartment, dataId, x, y, text){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.parent = compartment;
    this.type = "D";
    this.x = x;
    this.y = y;
    this.w = 40 ;
    this.h = 15 ;
    this.shape = new PATHBUBBLES.Shape.Hexahedron(this.x, this.y, this.w ,this.h, "#C2C2C2", "#D6EAAC", 1, 0);
    this.name = text;
    this.textObj = new PATHBUBBLES.Text(this,this.name);
    this.textObj.fillColor = '#666666';
    this.textObj.font = '8pt Calibri';
};
PATHBUBBLES.Biomolecule.RNA.prototype = Object.create( PATHBUBBLES.Object2D.prototype );
PATHBUBBLES.Biomolecule.RNA.prototype = {
    constructor: PATHBUBBLES.Biomolecule.RNA,
    draw: function(ctx,scale){
        this.setOffset();
        this.shape.strokeColor = "#C2C2C2";
        this.shape.fillColor = "#D6EAAC";
        this.shape.draw(ctx,scale);
        if(this.textObj)
        {
            if(scale ==1)
                this.textObj.draw(ctx, this.shape.x + this.w/2+this.offsetX,this.shape.y + this.h/2+this.offsetY);
        }
    },
    setOffset: function(){
        if(this.parent!==undefined)
        {
            this.offsetX = this.parent.offsetX + this.parent.x;
            this.offsetY = this.parent.offsetY + this.parent.y;
        }
        else
        {
            this.offsetX = 0;
            this.offsetY = 0;
        }

        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
        this.shape.x = this.x;
        this.shape.y = this.y;
    },
    contains : function(mx, my)
    {
        this.setOffset();
        return this.shape.contains(mx,my);
    }
};

PATHBUBBLES.Biomolecule.Small_Molecule = function(compartment, dataId, x, y, text){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.parent = compartment;
    this.type = "S";
    this.x = x;
    this.y = y;
    this.w = 40 ;
    this.h = 15 ;
    this.shape = new PATHBUBBLES.Shape.Hexahedron(this.x, this.y, this.w ,this.h, "#C2C2C2", "#D6D7CA", 1, 0);
    this.name = text;
    this.textObj = new PATHBUBBLES.Text(this,this.name);
    this.textObj.fillColor = '#666666';
    this.textObj.font = '8pt Calibri';
};
PATHBUBBLES.Biomolecule.Small_Molecule.prototype = Object.create( PATHBUBBLES.Object2D.prototype );
PATHBUBBLES.Biomolecule.Small_Molecule.prototype = {
    constructor: PATHBUBBLES.Biomolecule.Small_Molecule,
    draw: function(ctx,scale){
        this.setOffset();
        this.shape.strokeColor = "#C2C2C2";
        this.shape.fillColor = "#D6D7CA";
        this.shape.draw(ctx,scale);
        if(this.textObj)
        {
            if(scale ==1)
                this.textObj.draw(ctx, this.shape.x + this.w/2+this.offsetX,this.shape.y + this.h/2+this.offsetY);
        }
    },
    setOffset: function(){
        if(this.parent!==undefined)
        {
            this.offsetX = this.parent.offsetX + this.parent.x;
            this.offsetY = this.parent.offsetY + this.parent.y;
        }
        else
        {
            this.offsetX = 0;
            this.offsetY = 0;
        }

        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
        this.shape.x = this.x;
        this.shape.y = this.y;
    },
    contains : function(mx, my)
    {
        this.setOffset();
        return this.shape.contains(mx,my);
    }
};

PATHBUBBLES.Biomolecule.Protein = function(compartment, dataId, x, y, text){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.parent = compartment;
    this.type = "P";
    this.x = x;
    this.y = y;
    this.w =40;
    this.h =15;
    this.shape = new PATHBUBBLES.Shape.Ellipse(this.x, this.y, this.w ,this.h, "#C2C2C2", "#FFFFCC", 1, 0);
    this.name = text;
    this.textObj = new PATHBUBBLES.Text(this,this.name);
    this.textObj.fillColor = '#666666';
    this.textObj.font = '8pt Calibri';

};
PATHBUBBLES.Biomolecule.Protein.prototype = Object.create( PATHBUBBLES.Object2D.prototype );
PATHBUBBLES.Biomolecule.Protein.prototype = {
    constructor: PATHBUBBLES.Biomolecule.Protein,
    draw: function(ctx,scale){
        this.setOffset();
        this.shape.draw(ctx,scale);
        if(this.textObj)
        {
            if(scale ==1)
                this.textObj.draw(ctx, this.shape.x + this.w/2+this.offsetX,this.shape.y + this.h/2+this.offsetY);
        }
    },
    setOffset: function(){
        if(this.parent!==undefined)
        {
            this.offsetX = this.parent.offsetX + this.parent.x;
            this.offsetY = this.parent.offsetY + this.parent.y;
        }
        else
        {
            this.offsetX = 0;
            this.offsetY = 0;
        }

        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
        this.shape.x = this.x;
        this.shape.y = this.y;
    },
    contains : function(mx, my)
    {
        this.setOffset();
        return this.shape.contains(mx,my);
    }
};

PATHBUBBLES.Biomolecule.Dissociation = function(compartment, dataId, x, y, text){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.type = "K";
    this.parent = compartment;
    this.x = x;
    this.y = y;
    this.shape = new PATHBUBBLES.Shape.Triangle(x, y, 6 ,6, "#C2C2C2", "#ffffff", 1, 0);
    this.name = text;
    this.connections =[];
};
PATHBUBBLES.Biomolecule.Dissociation.prototype = Object.create( PATHBUBBLES.Object2D.prototype );
PATHBUBBLES.Biomolecule.Dissociation.prototype =  {
    constructor: PATHBUBBLES.Biomolecule.Dissociation,
    draw: function(ctx,scale){
        this.setOffset();
        this.shape.draw(ctx,scale);
    },
    setOffset: function(){
        if(this.parent!==undefined)
        {
            this.offsetX = this.parent.offsetX + this.parent.x;
            this.offsetY = this.parent.offsetY + this.parent.y;
        }
        else
        {
            this.offsetX = 0;
            this.offsetY = 0;
        }

        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
        this.shape.x = this.x;
        this.shape.y = this.y;
    },
    contains : function(mx, my)
    {
        this.setOffset();
        return this.shape.contains(mx,my);
    }
};

PATHBUBBLES.Biomolecule.Association = function(compartment, dataId, x, y, text){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.type = "B";
    this.parent = compartment;
    this.x = x;
    this.y = y;
    this.r = 3;
    this.shape = new PATHBUBBLES.Shape.Circle(this.x, this.y, this.r, "#C2C2C2", "#ffffff", 1, 0);
    this.name = text;
    this.connections =[];
};
PATHBUBBLES.Biomolecule.Association.prototype = Object.create( PATHBUBBLES.Object2D.prototype );
PATHBUBBLES.Biomolecule.Association.prototype =  {
    constructor: PATHBUBBLES.Biomolecule.Association,
    draw: function(ctx,scale){
        this.setOffset();
        this.shape.draw(ctx,scale);
    },
    setOffset: function(){
        if(this.parent!==undefined)
        {
            this.offsetX = this.parent.offsetX + this.parent.x;
            this.offsetY = this.parent.offsetY + this.parent.y;
        }
        else
        {
            this.offsetX = 0;
            this.offsetY = 0;
        }

        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
        this.shape.x = this.x;
        this.shape.y = this.y;
    },
    contains : function(mx, my)
    {
        //this.setOffset();
        return this.shape.contains(mx,my);
    }
};

PATHBUBBLES.Biomolecule.Transition = function(compartment, dataId, x, y, text){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.type = "T";
    this.parent = compartment;
    this.x = x;
    this.y = y;
    this.w = 6;
    this.h =6;
    this.shape = new PATHBUBBLES.Shape.Rectangle(this, this.x, this.y, this.w, this.h, "#C2C2C2", "#ffffff", 1, 0);
    this.name = text;
    this.connections =[];
};
PATHBUBBLES.Biomolecule.Transition.prototype = Object.create( PATHBUBBLES.Object2D.prototype );
PATHBUBBLES.Biomolecule.Transition.prototype =  {
    constructor: PATHBUBBLES.Biomolecule.Transition,
    draw: function(ctx,scale){
        this.setOffset();
        this.shape.draw(ctx,scale);
    },
    setOffset: function(){
        if(this.parent!==undefined)
        {
            this.offsetX = this.parent.offsetX + this.parent.x;
            this.offsetY = this.parent.offsetY + this.parent.y;
        }
        else
        {
            this.offsetX = 0;
            this.offsetY = 0;
        }

        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
        this.shape.x = this.x;
        this.shape.y = this.y;
    },
    contains : function(mx, my)
    {
        //this.setOffset();
        return this.shape.contains(mx,my);
    }
};




