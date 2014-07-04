/**
 * Created by Yongnan on 7/3/2014.
 */
XMLLoader = function (){
};
XMLLoader.prototype = {
    constructor: XMLLoader,
    load: function(url){
        var _this = this;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "xml",
            success: function (xml) {
                $(xml).find("Pathway").each(function () {
                    _this.parse($(this));
                });
            }
        });
    },
    parse: function($this){
        mainManagement = new MainManage($("#bgCanvas")[0]);
        Bubbles = new Bubble(0,mainManagement, 400, 20, 850, 850);
        mainManagement.addShape(Bubbles);

        var compartmentBlock = $this.find("compartmentBlock");
        this.parseCompartmentBlock(compartmentBlock);

        var complexBlock = $this.find("complexBlock");
        var proteinBlock = $this.find("proteinBlock");
        var physicalEntityBlock = $this.find("physicalEntityBlock");
        var smallMoleculeBlock = $this.find("smallMoleculeBlock");
        var DnaBlock = $this.find("DnaBlock");
        var reactionBlock = $this.find("reactionBlock");
        var edgeBlock = $this.find("edgeBlock");
    },
    parseCompartmentBlock: function(compartmentBlock){
        var length = compartmentBlock.children().length;
        for( var i=0; i< length; ++i)
        {
            var currentCompartment = compartmentBlock.find('compartment[j="' + i + '"]');
            var name = currentCompartment.find("Name").text();
            var position = currentCompartment.find("Position").text()
                .replace("(", "")   //remove the right bracket
                .replace(")", "") //remove the left bracket;
                .split(",");
            var contain = currentCompartment.find("Contain").text()//when contain = "()"
                .replace("(", "")   //remove the right bracket
                .replace(")", "") //remove the left bracket;
                .split(",");
            if(contain.length>1) //when length =1  just = "" //contain = "()"
            {
                var x = parseFloat(position[0]);
                var y = parseFloat(position[1]);
                var w = parseFloat(position[2]);
                var h = parseFloat(position[3]);
                //Bubbles.addCompartment(i, x, y, w, h, name);
                //var currentView = new Compartment(i,this.canvas, this.initX + x * 500, this.initY + y * 500, w * 500, h * 500, name);
                //this.canvas.addShape(currentView);
            }
        }

        Bubbles.addCompartment(1, 0.1, 0.2, 0.6, 0.6, "Compartment");
        mainManagement.shapes[1].addProtein(2,0.4,0.2,0.2,0.1,"Protein");
        mainManagement.shapes[1].addComplex(3,0.1,0.2,0.2,0.1);
        mainManagement.shapes[1].addDNA(4,0.6,0.2,0.2,0.1,"DNA");
        mainManagement.shapes[1].addSmall_Molecule(5,0.6,0.6,0.2,0.1,"Small_Molecule");
        mainManagement.shapes[1].addDissociation(6,0.4,0.4);
        mainManagement.shapes[1].addAssociation(7,0.3,0.3);
        mainManagement.shapes[1].addTransition(8,0.5,0.5);
    }
};
