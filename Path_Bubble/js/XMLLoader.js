/**
 * Created by Yongnan on 7/3/2014.
 */
XMLLoader = function () {
    this.e = 0;
    this.v = 0;
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
        this.e = 0;
        this.v = 0;
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
        this.processLinks();
        this.arrangeGraphBox();
        if (graphs.length !== 0)
            springy = new Manage({graphs: graphs});
    },
    arrangeGraphBox: function(){
        if(graphs.length>=1) {
            for (var i = 0; i < graphs.length - 1; ++i)
                for (var j = i + 1; j < graphs.length; ++j) {
                    if (graphs[i].boundingY > graphs[j].boundingY) {
                        var tmp = graphs[i];
                        graphs[i] = graphs[j];
                        graphs[j] = tmp;
                    }
                }
            var index = [];
            index.push(0);
            for (i = 0, j = i + 1; i < graphs.length && j < graphs.length; j++) {
                if (graphs[i].boundingY === graphs[j].boundingY) {
                    continue;
                }
                index.push(j);
                i = j;
            }

            if (index[graphs.length - 1] !== graphs.length) {
                index.push(graphs.length);
            }
            var levels = [];
            if(index.length === 1)
            {
                var level = [];
                for(i=0; i<graphs.length && i<index[0]; ++i)
                {
                    level.push(graphs[i]);
                }
                levels.push(level);
            }
            else {
                for (i = 0,j = i + 1; j < index.length; ++i, j++)
                    {
                        var level = [];
                        for(var k=index[i]; k<graphs.length && k<index[j]; ++k)
                        {
                            level.push(graphs[k]);
                        }
                        levels.push(level);
                    }
            }
        }
        for(var k=0; k<levels.length; ++k)
        {
            if(levels[k].length >1)
            {
                for (var i = 0; i < levels[k].length - 1; ++i)
                    for (var j = i + 1; j < levels[k].length; ++j) {
                        if (levels[k][i].boundingX > levels[k][j].boundingX) {
                            var tmp = levels[k][i];
                            levels[k][i] = levels[k][j];
                            levels[k][j] = tmp;
                        }
                    }
            }
        }
        //   num / (w * h) === k  here, k = 0.0007
        //   w/h = 1/0.618 ==>   num / (h/0.618 * h)  === 0.0007  ==>       h = sqrt(num * 0.618/0.0007) ~= sqrt(num * 883)
        for(var i=0; i< levels.length; ++i)
        {
            var max = 0;
            for(var j=0; j< levels[i].length; ++j)
            {
                var nodeNum = levels[i][j].nodes.length;
                var idealH = Math.sqrt(nodeNum * 1200);
                var idealW = idealH / 0.618;
                levels[i][j].boundingH = idealH;
                levels[i][j].boundingW = idealW;
                if(max <idealH)
                {
                    max = idealH;
                }
            }
            levels[i].maxHeight = max;
        }
        var paddingX = 5;
        var paddingY = 5;
        for(var i=0; i< levels.length; ++i)
        {
            var tempy=0;
            if(i===0)
            {
                tempy = paddingY;
            }
            else
            {
                tempy = (i+1) * paddingY;
                for(k =0; k<i; k++)
                {
                    tempy+=levels[k].maxHeight;
                }
            }
            //Now we know the ypos, width, height
            //so we need to get xpos
            var needWidth = -paddingX;
            for(var j=0; j< levels[i].length; ++j)
            {
                needWidth += paddingX+ levels[i][j].boundingW;
            }
            var offsetX= 0;
            if(needWidth < window.innerWidth)
            {
               offsetX =  (window.innerWidth - needWidth)/2.0;
            }
            var tempx = 0;
            for(var j=0; j< levels[i].length; ++j)
            {
                if(j===0)
                {
                    tempx = 0;
                }
                else
                {
                    tempx = j * paddingY;
                    for(k =0; k<j; k++)
                    {
                        tempx+=levels[i][k].boundingW;
                    }
                }
                levels[i][j].boundingX = tempx + offsetX;
                levels[i][j].boundingY = tempy;
            }
        }
        for(var i=0; i<levels.length; ++i)
        {
            for(var j=0; j<levels[i].length; ++j)
            {
                for(var k=0; k<mainManagement.shapes.length; ++k)
                {
                    if(levels[i][j].compartmentId === mainManagement.shapes[k].id  && mainManagement.shapes[k].type === "M")
                    {
                        mainManagement.shapes[k].x = levels[i][j].boundingX;
                        mainManagement.shapes[k].y = levels[i][j].boundingY;
                        mainManagement.shapes[k].w = levels[i][j].boundingW;
                        mainManagement.shapes[k].h = levels[i][j].boundingH;
                    }
                }
            }
        }
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
        this.e ++;
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
        var width = window.innerWidth;
        var height = window.innerHeight;
        var graphId = 0; //belongs to which graph

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
                var graph = new Graph();
                graph.compartmentId = i;
                var tX = x*width;
                var tY = y*height;
                var tWidth = width * w;
                var tHeight = height * h;
                if(tWidth/tHeight !== 1/0.618)
                {
                    var tw = tHeight/0.618;
                    var offsetX = (tw - tWidth)/2.0;
                    tX = tX - offsetX;
                    tWidth = tw;
                }
                graph.setBoundingCB(tX, tY, tWidth, tHeight);

                 /*graph.setBoundingCB(x*width, y*height, width * w, height * h);
                */var nodeIndex = 0; //the index in each graph
                Bubbles.addCompartment(i, x, y, w, h, name);
                var len = contain.length / 2;
                for (var j = 0; j < len; ++j) {
                    var type = contain[2 * j];
                    var index = parseInt(contain[2 * j + 1]);
                    this.addElement(i, type, index,graph, graphId, nodeIndex);
                    nodeIndex++;
                }
                graphs.push(graph);
                graphId++;
            }
        }
    },
    addElement: function (comparmentId, type, index,graph, graphId, nodeIndex) {
        this.v ++;
        switch (type) {
            case "C":  //COMPLEX
            {
                //if (comparmentId < mainManagement.shapes.length) {
                    var complexE = this.complexBlock.find('complex[j="' + index + '"]'); //Complex we do not need to use the name
                    var position = complexE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                    for (var i = 0; i < mainManagement.shapes.length; i++) {
                        if (mainManagement.shapes[i].id === comparmentId && mainManagement.shapes[i].type === "M") {
                            mainManagement.shapes[i].addComplex(index, position[0], position[1], position[2], position[3],comparmentId);

                            for (var m = 0; m < mainManagement.shapes.length; ++m) {
                                if (mainManagement.shapes[m].id === index && mainManagement.shapes[m].type === "C") {
                                    mainManagement.shapes[m].graphId = graphId;
                                    mainManagement.shapes[m].nodeIndex = nodeIndex;
                                    graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                    break;
                                }
                            }
                        }
                    }
                //}
                break;
            }
            case "E": //Entity
            {
                //if (comparmentId < mainManagement.shapes.length) {
                    var entityE = this.physicalEntityBlock.find('physicalEntity[j="' + index + '"]'); //Complex we do not need to use the name
                    var position = entityE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                    var name = entityE.find("Name").text();
                    for (var i = 0; i < mainManagement.shapes.length; i++) {
                        if (mainManagement.shapes[i].id === comparmentId && mainManagement.shapes[i].type === "M") {
                            mainManagement.shapes[i].addPhysical_Entity(index, position[0], position[1], position[2], position[3], name,comparmentId);

                            for (var m = 0; m < mainManagement.shapes.length; ++m) {
                                if (mainManagement.shapes[m].id === index && mainManagement.shapes[m].type === "E") {
                                    mainManagement.shapes[m].graphId = graphId;
                                    mainManagement.shapes[m].nodeIndex = nodeIndex;
                                    graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                    break;
                                }
                            }
                        }
                    }
               // }
                break;
            }
            case "S":     //MOLECULE
            {
               // if (comparmentId < mainManagement.shapes.length) {
                    var moleculeE = this.smallMoleculeBlock.find('smallMolecule[j="' + index + '"]'); //Complex we do not need to use the name
                    var position = moleculeE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                    var name = moleculeE.find("Name").text();
                    for (var i = 0; i < mainManagement.shapes.length; i++) {
                        if (mainManagement.shapes[i].id === comparmentId && mainManagement.shapes[i].type === "M") {
                            mainManagement.shapes[i].addSmall_Molecule(index, position[0], position[1], position[2], position[3], name,comparmentId);

                            for (var m = 0; m < mainManagement.shapes.length; ++m) {
                                if (mainManagement.shapes[m].id === index && mainManagement.shapes[m].type === "S") {
                                    mainManagement.shapes[m].graphId = graphId;
                                    mainManagement.shapes[m].nodeIndex = nodeIndex;
                                    graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                    break;
                                }
                            }
                        }
                    }
               // }
                break;
            }
            case "P":     //PROTEIN
            {
                //if (comparmentId < mainManagement.shapes.length) {
                    var proteinE = this.proteinBlock.find('protein[j="' + index + '"]'); //Complex we do not need to use the name
                    var position = proteinE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                    var name = proteinE.find("Name").text();
                    for (var i = 0; i < mainManagement.shapes.length; i++) {
                        if (mainManagement.shapes[i].id === comparmentId && mainManagement.shapes[i].type === "M") {
                            mainManagement.shapes[i].addProtein(index, position[0], position[1], position[2], position[3], name,comparmentId);

                            for (var m = 0; m < mainManagement.shapes.length; ++m) {
                                if (mainManagement.shapes[m].id === index && mainManagement.shapes[m].type === "P") {
                                    mainManagement.shapes[m].graphId = graphId;
                                    mainManagement.shapes[m].nodeIndex = nodeIndex;
                                    graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                    break;
                                }
                            }
                        }
                    }
               // }
                break;
            }
            case "D":     //DNA
            {
                //if (comparmentId < mainManagement.shapes.length) {
                    var dnaE = this.dnaBlock.find('Dna[j="' + index + '"]'); //Complex we do not need to use the name
                    var position = dnaE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                    var name = dnaE.find("Name").text();
                    for (var i = 0; i < mainManagement.shapes.length; i++) {
                        if (mainManagement.shapes[i].id === comparmentId && mainManagement.shapes[i].type === "M") {
                            mainManagement.shapes[i].addDNA(index, position[0], position[1], position[2], position[3], name,comparmentId);

                            for (var m = 0; m < mainManagement.shapes.length; ++m) {
                                if (mainManagement.shapes[m].id === index && mainManagement.shapes[m].type === "D") {
                                    mainManagement.shapes[m].graphId = graphId;
                                    mainManagement.shapes[m].nodeIndex = nodeIndex;
                                    graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                    break;
                                }
                            }
                        }
                    }
                //}
                break;
            }
            case "R":   //Reaction
            {
                //if (comparmentId < mainManagement.shapes.length) {
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
                            {
                                mainManagement.shapes[i].addDissociation(index, position[0], position[1], position[2], position[3],comparmentId);
                                for (var m = 0; m < mainManagement.shapes.length; ++m) {
                                    if (mainManagement.shapes[m].id === index && mainManagement.shapes[m].type === "K") {
                                        mainManagement.shapes[m].graphId = graphId;
                                        mainManagement.shapes[m].nodeIndex = nodeIndex;
                                        graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                        break;
                                    }
                                }
                            }
                            else if(typeR === "T")
                            {
                                mainManagement.shapes[i].addTransition(index, position[0], position[1], position[2], position[3]);
                                for (var m = 0; m < mainManagement.shapes.length; ++m) {
                                    if (mainManagement.shapes[m].id === index && mainManagement.shapes[m].type === "T") {
                                        mainManagement.shapes[m].graphId = graphId;
                                        mainManagement.shapes[m].nodeIndex = nodeIndex;
                                        graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                        break;
                                    }
                                }
                            }
                            else if(typeR === "B")
                            {
                                mainManagement.shapes[i].addAssociation(index, position[0], position[1], position[2], position[3]);
                                for (var m = 0; m < mainManagement.shapes.length; ++m) {
                                    if (mainManagement.shapes[m].id === index && mainManagement.shapes[m].type === "B") {
                                        mainManagement.shapes[m].graphId = graphId;
                                        mainManagement.shapes[m].nodeIndex = nodeIndex;
                                        graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                //}
                break;
            }
        }
    },
    processLinks: function () {
        for (var i = 0; i < Bubbles.activations.length; ++i) {
            var graphId1, graphId2;//belongs to which graph
            var nodeIndex1, nodeIndex2;
            var flag = 0;

            for (var j = 0; j < mainManagement.shapes.length; ++j) {
                if (mainManagement.shapes[j].id === Bubbles.activations[i]) {
                    for (var k = 0; k < mainManagement.shapes.length; ++k) {
                        if (mainManagement.shapes[k].id === mainManagement.shapes[j].beginNodeId && mainManagement.shapes[k].type === mainManagement.shapes[j].beginType) {
                            graphId1 = mainManagement.shapes[k].graphId;
                            nodeIndex1 = mainManagement.shapes[k].nodeIndex;
                            flag++;
                            continue;
                        }
                        if (mainManagement.shapes[k].id === mainManagement.shapes[j].endNodeId && mainManagement.shapes[k].type === mainManagement.shapes[j].endType) {
                            graphId2 = mainManagement.shapes[k].graphId;
                            nodeIndex2 = mainManagement.shapes[k].nodeIndex;
                            flag++;
                            continue;
                        }
                        if (flag === 2) {
                            break;
                        }
                    }
                    if ((flag === 2) && (graphId1 === graphId2)) {
                        if (graphId1 >= 0 && graphId1 < graphs.length) {
                            graphs[graphId1].addEachLink(nodeIndex1, nodeIndex2);
                        }
                    }
                }
            }
        }

        for (var i = 0; i < Bubbles.arrows.length; ++i) {

            var graphId1, graphId2;//belongs to which graph
            var nodeIndex1, nodeIndex2;
            var flag = 0;
            for (var j = 0; j < mainManagement.shapes.length; ++j) {
                if (mainManagement.shapes[j].id === Bubbles.arrows[i]) {
                    for (var k = 0; k < mainManagement.shapes.length; ++k) {
                        if (mainManagement.shapes[k].id === mainManagement.shapes[j].beginNodeId && mainManagement.shapes[k].type === mainManagement.shapes[j].beginType) {
                            graphId1 = mainManagement.shapes[k].graphId;
                            nodeIndex1 = mainManagement.shapes[k].nodeIndex;
                            flag++;
                            continue;
                        }
                        if (mainManagement.shapes[k].id === mainManagement.shapes[j].endNodeId && mainManagement.shapes[k].type === mainManagement.shapes[j].endType) {
                            graphId2 = mainManagement.shapes[k].graphId;
                            nodeIndex2 = mainManagement.shapes[k].nodeIndex;
                            flag++;
                            continue;
                        }
                        if (flag === 2) {
                            break;
                        }
                    }
                    if ((flag === 2) && (graphId1 === graphId2)) {
                        if (graphId1 >= 0 && graphId1 < graphs.length) {
                            graphs[graphId1].addEachLink(nodeIndex1, nodeIndex2);
                        }
                    }
                }
            }
        }

        for (var i = 0; i < Bubbles.inhibitions.length; ++i) {
            var graphId1, graphId2;//belongs to which graph
            var nodeIndex1, nodeIndex2;
            var flag = 0;
            for (var j = 0; j < mainManagement.shapes.length; ++j) {
                if (mainManagement.shapes[j].id === Bubbles.inhibitions[i]) {
                    for (var k = 0; k < mainManagement.shapes.length; ++k) {
                        if (mainManagement.shapes[k].id === mainManagement.shapes[j].beginNodeId && mainManagement.shapes[k].type === mainManagement.shapes[j].beginType) {
                            graphId1 = mainManagement.shapes[k].graphId;
                            nodeIndex1 = mainManagement.shapes[k].nodeIndex;
                            flag++;
                            continue;
                        }
                        if (mainManagement.shapes[k].id === mainManagement.shapes[j].endNodeId && mainManagement.shapes[k].type === mainManagement.shapes[j].endType) {
                            graphId2 = mainManagement.shapes[k].graphId;
                            nodeIndex2 = mainManagement.shapes[k].nodeIndex;
                            flag++;
                            continue;
                        }
                        if (flag === 2) {
                            break;
                        }
                    }
                    if ((flag === 2) && (graphId1 === graphId2)) {
                        if (graphId1 >= 0 && graphId1 < graphs.length) {
                            graphs[graphId1].addEachLink(nodeIndex1, nodeIndex2);
                        }
                    }
                }
            }
        }
    }
};
