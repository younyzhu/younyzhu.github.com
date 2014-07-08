/**
 * Created by Yongnan on 7/3/2014.
 */
XMLLoader = function () {
};
XMLLoader.prototype = {
    constructor: XMLLoader,
    load: function (url) {
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
    parse: function ($this) {
        mainManagement = new MainManage($("#bgCanvas")[0]);
        Bubbles = new Visualization();
        //Bubbles = new Bubble(0, mainManagement, 400, 20, 850, 850);
        //Bubbles.offsetX = 400;
        //Bubbles.offsetY = 20;
        mainManagement.addShape(Bubbles);

        var compartmentBlock = $this.find("compartmentBlock");
        this.complexBlock = $this.find("complexBlock");
        this.proteinBlock = $this.find("proteinBlock");
        this.physicalEntityBlock = $this.find("physicalEntityBlock");
        this.smallMoleculeBlock = $this.find("smallMoleculeBlock");
        this.dnaBlock = $this.find("DnaBlock");
        this.reactionBlock = $this.find("reactionBlock");
        this.edgeBlock = $this.find("edgeBlock");
        this.parseCompartmentBlock(compartmentBlock);
        this.parseEdges();

    },
    parseEdges: function () {
        var length = this.edgeBlock.children().length;
        for (var i = 0; i < length; ++i) {
            var currentEdge = this.edgeBlock.find('edge[j="' + i + '"]');
            var type = currentEdge.find("Name").text();
            var ends = currentEdge.find("Ends").text()
                .replace("(", "")   //remove the right bracket
                .replace(")", "") //remove the left bracket;
                .replace(/[_\s]/g, '').split(",");
            var beginType = ends[0];
            var beginIndex = parseInt(ends[1]);
            var endType = ends[2];
            var endIndex = parseInt(ends[3]);
            this.addEdges(type,i,beginType,beginIndex,endType,endIndex);
        }
    },
    addEdges: function (type, index, beginType, beginIndex, endType, endIndex) {
        if(beginIndex<0 ||endIndex<0)
            return ;
        var beginId, beginT, endId, endT, flag =0;
        switch (type) {
            case "J":  //Arrow (Black)
            {
                flag =0;
                for (var i = 0; i < mainManagement.shapes.length; i++) {
                    if(beginType === "R")
                    {
                        if (mainManagement.shapes[i].id === beginIndex)
                            if(mainManagement.shapes[i].type === "T"|| mainManagement.shapes[i].type === "B" || mainManagement.shapes[i].type === "K") {
                            beginId = beginIndex;
                            beginT = mainManagement.shapes[i].type;
                            flag ++;
                        }
                    }
                    else
                    {
                        if (mainManagement.shapes[i].id === beginIndex && mainManagement.shapes[i].type === beginType) {
                            beginId = beginIndex;
                            beginT = mainManagement.shapes[i].type;
                            flag ++;
                        }
                    }
                    if(endType === "R") {
                        if (mainManagement.shapes[i].id === endIndex)
                            if(mainManagement.shapes[i].type === "T"|| mainManagement.shapes[i].type === "B" || mainManagement.shapes[i].type === "K") {
                            endId = endIndex;
                            endT = mainManagement.shapes[i].type;
                            flag ++;
                        }
                    }
                    else
                    {
                        if (mainManagement.shapes[i].id === endIndex && mainManagement.shapes[i].type === endType) {
                            endId = endIndex;
                            endT = mainManagement.shapes[i].type;
                            flag ++;
                        }
                    }
                    if(flag ===2)
                    {
                        flag =0;
                        Bubbles.addArrow(index, beginT, beginId, endT, endId);
                    }
                }
            }
            break;
            case "I":  //Inhibition (Cyan)
            {
                flag =0;
                for (var i = 0; i < mainManagement.shapes.length; i++) {
                    if(beginType === "R")
                    {
                        if (mainManagement.shapes[i].id === beginIndex)
                            if(mainManagement.shapes[i].type === "T"|| mainManagement.shapes[i].type === "B" || mainManagement.shapes[i].type === "K") {
                                beginId = beginIndex;
                                beginT = mainManagement.shapes[i].type;
                                flag ++;
                            }
                    }
                    else
                    {
                        if (mainManagement.shapes[i].id === beginIndex && mainManagement.shapes[i].type === beginType) {
                            beginId = beginIndex;
                            beginT = mainManagement.shapes[i].type;
                            flag ++;
                        }
                    }
                    if(endType === "R") {
                        if (mainManagement.shapes[i].id === endIndex)
                            if(mainManagement.shapes[i].type === "T"|| mainManagement.shapes[i].type === "B" || mainManagement.shapes[i].type === "K") {
                                endId = endIndex;
                                endT = mainManagement.shapes[i].type;
                                flag ++;
                            }
                    }
                    else
                    {
                        if (mainManagement.shapes[i].id === endIndex && mainManagement.shapes[i].type === endType) {
                            endId = endIndex;
                            endT = mainManagement.shapes[i].type;
                            flag ++;
                        }
                    }

                    if(flag ===2)
                    {
                        flag =0;
                        Bubbles.addInhibition(index, beginT, beginId, endT, endId);
                    }
                }
            }
            break;
            case "A":  //Activation (Green)
            {
                flag =0;
                for (var i = 0; i < mainManagement.shapes.length; i++) {
                    if(beginType === "R")
                    {
                        if (mainManagement.shapes[i].id === beginIndex)
                            if(mainManagement.shapes[i].type === "T"|| mainManagement.shapes[i].type === "B" || mainManagement.shapes[i].type === "K") {
                                beginId = beginIndex;
                                beginT = mainManagement.shapes[i].type;
                                flag ++;
                            }
                    }
                    else
                    {
                        if (mainManagement.shapes[i].id === beginIndex && mainManagement.shapes[i].type === beginType) {
                            beginId = beginIndex;
                            beginT = mainManagement.shapes[i].type;
                            flag ++;
                        }
                    }
                    if(endType === "R") {
                        if (mainManagement.shapes[i].id === endIndex)
                            if(mainManagement.shapes[i].type === "T"|| mainManagement.shapes[i].type === "B" || mainManagement.shapes[i].type === "K") {
                                endId = endIndex;
                                endT = mainManagement.shapes[i].type;
                                flag ++;
                            }
                    }
                    else
                    {
                        if (mainManagement.shapes[i].id === endIndex && mainManagement.shapes[i].type === endType) {
                            endId = endIndex;
                            endT = mainManagement.shapes[i].type;
                            flag ++;
                        }
                    }
                    if(flag ===2)
                    {
                        flag =0;
                        Bubbles.addActivation(index, beginT, beginId, endT, endId);
                    }
                }
            }
            break;
        }
    },
    parseCompartmentBlock: function (compartmentBlock) {
        var length = compartmentBlock.children().length;
        for (var i = 0; i < length; ++i) {
            var currentCompartment = compartmentBlock.find('compartment[j="' + i + '"]');
            var name = currentCompartment.find("Name").text();
            var position = currentCompartment.find("Position").text()
                .replace("(", "")   //remove the right bracket
                .replace(")", "") //remove the left bracket;
                .split(",");
            var contain = currentCompartment.find("Contain").text()//when contain = "()"
                .replace("(", "")   //remove the right bracket
                .replace(")", "") //remove the left bracket;
                .replace(/[_\s]/g, '').split(",");
            if (contain.length > 1) //when length =1  just = "" //contain = "()"
            {
                var x = parseFloat(position[0]);
                var y = parseFloat(position[1]);
                var w = parseFloat(position[2]);
                var h = parseFloat(position[3]);
                Bubbles.addCompartment(i, x, y, w, h, name);
                var len = contain.length / 2;
                for (var j = 0; j < len; ++j) {
                    var type = contain[2 * j];
                    var index = parseInt(contain[2 * j + 1]);
                    this.addElement(i, type, index);
                }
            }
        }
        /*
         Bubbles.addCompartment(1, 0.1, 0.2, 0.6, 0.6, "Compartment");
         mainManagement.shapes[1].addProtein(2,0.4,0.2,0.2,0.1,"Protein");
         mainManagement.shapes[1].addComplex(3,0.1,0.2,0.2,0.1);
         mainManagement.shapes[1].addDNA(4,0.6,0.2,0.2,0.1,"DNA");
         mainManagement.shapes[1].addSmall_Molecule(5,0.6,0.6,0.2,0.1,"Small_Molecule");
         mainManagement.shapes[1].addPhysical_Entity(65,0.3,0.6,0.5,0.8,"Physical_Entity");
         mainManagement.shapes[1].addDissociation(6,0.4,0.4);
         mainManagement.shapes[1].addAssociation(7,0.3,0.3);
         mainManagement.shapes[1].addTransition(8,0.5,0.5);
         Bubbles.addActivation(11, "PROTEIN", 2, "ASSOCIATION", 7);
         Bubbles.addInhibition(12, "DNA", 4, "MOLECULE", 5);
         Bubbles.addArrow(13, "MOLECULE", 5, "PROTEIN", 2);
         Bubbles.addArrow(14, "MOLECULE", 5, "DISSOCIATION", 6);
         Bubbles.addInhibition(15, "DISSOCIATION", 6, "TRANSITION", 8);
         */
    },
    addElement: function (comparmentId, type, index) {
        switch (type) {
            case "C":  //COMPLEX
            {
                if (comparmentId < mainManagement.shapes.length) {
                    var complexE = this.complexBlock.find('complex[j="' + index + '"]'); //Complex we do not need to use the name
                    var position = complexE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                    for (var i = 0; i < mainManagement.shapes.length; i++) {
                        if (mainManagement.shapes[i].id === comparmentId && mainManagement.shapes[i].type === "M") {
                            mainManagement.shapes[i].addComplex(index, position[0], position[1], position[2], position[3]);
                        }
                    }
                }
                break;
            }
            case "E": //Entity
            {
                if (comparmentId < mainManagement.shapes.length) {
                    var entityE = this.physicalEntityBlock.find('physicalEntity[j="' + index + '"]'); //Complex we do not need to use the name
                    var position = entityE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                    var name = entityE.find("Name").text();
                    for (var i = 0; i < mainManagement.shapes.length; i++) {
                        if (mainManagement.shapes[i].id === comparmentId && mainManagement.shapes[i].type === "M") {
                            mainManagement.shapes[i].addPhysical_Entity(index, position[0], position[1], position[2], position[3], name);
                        }
                    }
                }
                break;
            }
            case "S":     //MOLECULE
            {
                if (comparmentId < mainManagement.shapes.length) {
                    var moleculeE = this.smallMoleculeBlock.find('smallMolecule[j="' + index + '"]'); //Complex we do not need to use the name
                    var position = moleculeE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                    var name = moleculeE.find("Name").text();
                    for (var i = 0; i < mainManagement.shapes.length; i++) {
                        if (mainManagement.shapes[i].id === comparmentId && mainManagement.shapes[i].type === "M") {
                            mainManagement.shapes[i].addSmall_Molecule(index, position[0], position[1], position[2], position[3], name);
                        }
                    }
                }
                break;
            }
            case "P":     //PROTEIN
            {
                if (comparmentId < mainManagement.shapes.length) {
                    var proteinE = this.proteinBlock.find('protein[j="' + index + '"]'); //Complex we do not need to use the name
                    var position = proteinE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                    var name = proteinE.find("Name").text();
                    for (var i = 0; i < mainManagement.shapes.length; i++) {
                        if (mainManagement.shapes[i].id === comparmentId && mainManagement.shapes[i].type === "M") {
                            mainManagement.shapes[i].addProtein(index, position[0], position[1], position[2], position[3], name);
                        }
                    }
                }
                break;
            }
            case "D":     //DNA
            {
                if (comparmentId < mainManagement.shapes.length) {
                    var dnaE = this.dnaBlock.find('Dna[j="' + index + '"]'); //Complex we do not need to use the name
                    var position = dnaE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                    var name = dnaE.find("Name").text();
                    for (var i = 0; i < mainManagement.shapes.length; i++) {
                        if (mainManagement.shapes[i].id === comparmentId && mainManagement.shapes[i].type === "M") {
                            mainManagement.shapes[i].addDNA(index, position[0], position[1], position[2], position[3], name);
                        }
                    }
                }
                break;
            }
            case "R":   //Reaction
            {
                if (comparmentId < mainManagement.shapes.length) {
                    var reactionE = this.reactionBlock.find('reaction[j="' + index + '"]'); //Complex we do not need to use the name
                    var position = reactionE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                    var name = reactionE.find("Name").text();
                    var typeR = reactionE.find("Type").text();
                    for (var i = 0; i < mainManagement.shapes.length; i++) {
                        if (mainManagement.shapes[i].id === comparmentId && mainManagement.shapes[i].type === "M") {
                            if(typeR === "K")
                                mainManagement.shapes[i].addDissociation(index, position[0], position[1], position[2], position[3]);
                            else if(typeR === "T")
                                mainManagement.shapes[i].addTransition(index, position[0], position[1], position[2], position[3]);
                            else if(typeR === "B")
                                mainManagement.shapes[i].addAssociation(index, position[0], position[1], position[2], position[3]);
                        }
                    }
                }
                break;
            }
        }
    }
};
