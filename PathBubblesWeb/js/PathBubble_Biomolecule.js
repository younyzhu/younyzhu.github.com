/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/17/2014
 * @name        PathBubble_Biomolecule
 */
PATHBUBBLES.Biomolecule = PATHBUBBLES.Biomolecule|| {};
//COMPARTMENT  M
//Complex C
//Dissociation K
//Association B
//Transition T
//Protein P

PATHBUBBLES.Biomolecule.Compartment = function(dataId, x, y,w,h, text){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.type = "M";
    this.x = x;
    this.y = y;
    this.w = w || 1;
    this.h = h || 1;
    this.shape = new PATHBUBBLES.Shape.Rectangle(this, this.x, this.y, this.w ,this.h, "#C2C2C2", "#ffffff", 2, 0);

    this.name = text;
    this.textObj = new PATHBUBBLES.Text(this,this.name);
    this.textObj.fillColor = '#666666';
    this.textObj.font = '8pt Calibri';

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

    this.childOffsetx = this.x;
    this.childOffsety = this.y;

};
PATHBUBBLES.Biomolecule.Compartment.prototype = Object.create( PATHBUBBLES.Object2D.prototype );
PATHBUBBLES.Biomolecule.Compartment.prototype = {
    constructor: PATHBUBBLES.Biomolecule.Compartment,
    draw: function(ctx,scale){
        this.setOffset();
        this.shape.strokeColor = "#C2C2C2";
        this.shape.fillColor = "#ffffff";
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

PATHBUBBLES.Biomolecule.Complex = function(dataId, x, y, text, compartmentId){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.compartmentId = compartmentId;
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

PATHBUBBLES.Biomolecule.Physical_Entity = function(dataId, x, y, text, compartmentId){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.compartmentId = compartmentId;
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

PATHBUBBLES.Biomolecule.DNA = function(dataId, x, y, text, compartmentId){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.compartmentId = compartmentId;
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

PATHBUBBLES.Biomolecule.RNA = function(dataId, x, y, text, compartmentId){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.compartmentId = compartmentId;
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

PATHBUBBLES.Biomolecule.Small_Molecule = function(dataId, x, y, text, compartmentId){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.compartmentId = compartmentId;
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

PATHBUBBLES.Biomolecule.Protein = function(dataId, x, y, text, compartmentId){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.compartmentId = compartmentId;
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

PATHBUBBLES.Biomolecule.Dissociation = function(dataId, x, y, text, compartmentId){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.type = "K";
    this.compartmentId = compartmentId;
    this.x = x;
    this.y = y;
    this.shape = new PATHBUBBLES.Shape.Triangle(x, y, 6 ,6, "#C2C2C2", "#ffffff", 1, 0);
    this.name = text;
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

PATHBUBBLES.Biomolecule.Association = function(dataId, x, y, text, compartmentId){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.type = "B";
    this.compartmentId = compartmentId;
    this.x = x;
    this.y = y;
    this.r = 3;
    this.shape = new PATHBUBBLES.Shape.Circle(this.x, this.y, this.r, "#C2C2C2", "#ffffff", 1, 0);
    this.name = text;
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

PATHBUBBLES.Biomolecule.Transition = function(dataId, x, y, text, compartmentId){
    PATHBUBBLES.Object2D.call(this);
    this.dataId = dataId||0;
    this.type = "T";
    this.compartmentId = compartmentId;
    this.x = x;
    this.y = y;
    this.w = 6;
    this.h =6;
    this.shape = new PATHBUBBLES.Shape.Rectangle(this, this.x, this.y, this.w, this.h, "#C2C2C2", "#ffffff", 1, 0);
    this.name = text;

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




