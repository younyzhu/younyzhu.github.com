/**
 * Created by Yongnan on 7/3/2014.
 */
JsonLoader = function () {

};
JsonLoader.prototype = {
    constructor: JsonLoader,
    load: function (url) {
        var _this = this;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function (json) {
                if (typeof json == 'string' || json instanceof String) {
                    //json = json.replace(/\\/g, ""); dataType: "text",
                    json = JSON.parse(json);
                }
                _this.parse(json);
            }
        });
    },
    parse: function (dataObject) {
        if (dataObject instanceof  Object) {
            this.parseCompartments(dataObject.compartments);
            this.parseActivations(dataObject.activations);
            this.parseArrows(dataObject.arrows);
            this.parseInhibitions(dataObject.inhibitions);
        }
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
            if (index.length === 1) {
                var level = [];
                for (i = 0; i < graphs.length && i < index[0]; ++i) {
                    level.push(graphs[i]);
                }
                levels.push(level);
            }
            else {
                for (i = 0, j = i + 1; j < index.length; ++i, j++) {
                    var level = [];
                    for (var k = index[i]; k < graphs.length && k < index[j]; ++k) {
                        level.push(graphs[k]);
                    }
                    levels.push(level);
                }
            }

            for (var k = 0; k < levels.length; ++k) {
                if (levels[k].length > 1) {
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
            for (var i = 0; i < levels.length; ++i) {
                var max = 0;
                for (var j = 0; j < levels[i].length; ++j) {
                    var nodeNum = levels[i][j].nodes.length;
                    var idealH = Math.sqrt(nodeNum * 1200);
                    var idealW = idealH / 0.618;
                    levels[i][j].boundingH = idealH;
                    levels[i][j].boundingW = idealW;
                    if (max < idealH) {
                        max = idealH;
                    }
                }
                levels[i].maxHeight = max;
            }
            var paddingX = 5;
            var paddingY = 5;
            for (var i = 0; i < levels.length; ++i) {
                var tempy = 0;
                if (i === 0) {
                    tempy = paddingY;
                }
                else {
                    tempy = (i + 1) * paddingY;
                    for (k = 0; k < i; k++) {
                        tempy += levels[k].maxHeight;
                    }
                }
                //Now we know the ypos, width, height
                //so we need to get xpos
                var needWidth = -paddingX;
                for (var j = 0; j < levels[i].length; ++j) {
                    needWidth += paddingX + levels[i][j].boundingW;
                }
                var offsetX = 0;
                if (needWidth < window.innerWidth) {
                    offsetX = (window.innerWidth - needWidth) / 2.0;
                }
                var tempx = 0;
                for (var j = 0; j < levels[i].length; ++j) {
                    if (j === 0) {
                        tempx = 0;
                    }
                    else {
                        tempx = j * paddingY;
                        for (k = 0; k < j; k++) {
                            tempx += levels[i][k].boundingW;
                        }
                    }
                    levels[i][j].boundingX = tempx + offsetX;
                    levels[i][j].boundingY = tempy;
                }
            }
            for (var i = 0; i < levels.length; ++i) {
                for (var j = 0; j < levels[i].length; ++j) {
                    for (var k = 0; k < Data.compartments.length; ++k) {
                        if(levels[i][j].compartmentId === Data.compartments.id ) {
                            Data.compartments[k].x = levels[i][j].boundingX;
                            Data.compartments[k].y = levels[i][j].boundingY;
                            Data.compartments[k].w = levels[i][j].boundingW;
                            Data.compartments[k].h = levels[i][j].boundingH;
                        }
                    }
                }
            }
        }
    },
    parseCompartments: function (compartments) {
        var graphId = 0; //belongs to which graph
        var w = window.innerWidth;
        var h = window.innerHeight;
        for (var i = 0; i < compartments.length; ++i) {
            var graph = new Graph();
            graph.compartmentId = compartments[i].id;
            graph.setBoundingCB(compartments[i].x * w, compartments[i].y * h, compartments[i].w * w, compartments[i].h * h);
            var nodeIndex = 0; //the index in each graph

           // Bubbles.addCompartment(compartments[i].id, compartments[i].x, compartments[i].y, compartments[i].w, compartments[i].h, compartments[i].name);
            var compartment ={};
            compartment.childOffsetx = compartments[i].x * w;
            compartment.childOffsety = compartments[i].y * h;
            compartment.x = compartments[i].x * w;
            compartment.y = compartments[i].y * h;
            compartment.w = compartments[i].w * w;
            compartment.h = compartments[i].h * h;
            compartment.id = compartments[i].id;
            compartment.complexs = [];
            compartment.dnas = [];
            compartment.proteins = [];
            compartment.molecules = [];
            compartment.associations = [];
            compartment.dissociations = [];
            compartment.transitions = [];
            compartment.entitys = [];

            var complexs = compartments[i].children.complexs;
            for (var j = 0; j < complexs.length; ++j) {
                var complex = {};
                complex.id = complexs[j].id;
                complex.x = complexs[j].x * compartment.w;
                complex.y = complexs[j].y * compartment.h;
                complex.w = 20;
                complex.h = 6;
                complex.offsetX = 0;
                complex.offsetY = 0;

                complex.graphId = graphId;
                complex.nodeIndex = nodeIndex;
                nodeIndex++;
                graph.addEachNode(nodeIndex, complex);
                compartment.complexs.push(complex);
            }
            var dnas = compartments[i].children.dnas;
            for (var j = 0; j < dnas.length; ++j) {
                var dna = {};
                dna.id = dnas[j].id;
                dna.x = dnas[j].x * compartment.w;
                dna.y = dnas[j].y * compartment.h;
                dna.w = 40;
                dna.h = 15;
                dna.offsetX = 0;
                dna.offsetY = 0;
                dna.graphId = graphId;
                dna.nodeIndex = nodeIndex;
                nodeIndex++;
                graph.addEachNode(nodeIndex, dna);
                compartment.dnas.push(dna);
            }
            var proteins = compartments[i].children.proteins;
            for (var j = 0; j < proteins.length; ++j) {
                var protein = {};
                protein.id = proteins[j].id;
                protein.x = proteins[j].x * compartment.w;
                protein.y = proteins[j].y * compartment.h;
                protein.w = 40;
                protein.h = 15;
                protein.offsetX = 0;
                protein.offsetY = 0;

                protein.graphId = graphId;
                protein.nodeIndex = nodeIndex;
                nodeIndex++;
                graph.addEachNode(nodeIndex, protein);
                compartment.proteins.push(protein);
            }
            var molecules = compartments[i].children.molecules;
            for (var j = 0; j < molecules.length; ++j) {
                var molecule = {};
                molecule.id = molecules[j].id;
                molecule.x = molecules[j].x * compartment.w;
                molecule.y = molecules[j].y * compartment.h;
                molecule.offsetX = 0;
                molecule.offsetY = 0;
                molecule.w = 40;
                molecule.h = 15;

                molecule.graphId = graphId;
                molecule.nodeIndex = nodeIndex;
                nodeIndex++;
                graph.addEachNode(nodeIndex, molecule);
                compartment.molecules.push(molecule);
            }
            var associations = compartments[i].children.associations;
            for (var j = 0; j < associations.length; ++j) {
                var association = {};
                association.id = associations[j].id;
                association.x = associations[j].x * compartment.w;
                association.y = associations[j].y * compartment.h;
                association.offsetX = 0;
                association.offsetY = 0;
                association.w = 6;
                association.h = 6;
                association.graphId = graphId;
                association.nodeIndex = nodeIndex;
                nodeIndex++;
                graph.addEachNode(nodeIndex, association);
                compartment.associations.push(association);
            }
            var dissociations = compartments[i].children.dissociations;
            for (var j = 0; j < dissociations.length; ++j) {
                var dissociation = {};
                dissociation.id = dissociations[j].id;
                dissociation.x = dissociations[j].x * compartment.w;
                dissociation.y = dissociations[j].y * compartment.h;
                dissociation.offsetX = 0;
                dissociation.offsetY = 0;
                dissociation.w = 6;
                dissociation.h = 6;
                dissociation.graphId = graphId;
                dissociation.nodeIndex = nodeIndex;
                nodeIndex++;
                graph.addEachNode(nodeIndex, dissociation);
                compartment.dissociations.push(dissociation);
            }
            var transitions = compartments[i].children.transitions;
            for (var j = 0; j < transitions.length; ++j) {
                var transition = {};
                transition.id = transitions[j].id;
                transition.x = transitions[j].x * compartment.w;
                transition.y = transitions[j].y * compartment.h;
                transition.offsetX = 0;
                transition.offsetY = 0;
                transition.w = 6;
                transition.h = 6;
                transition.graphId = graphId;
                transition.nodeIndex = nodeIndex;
                nodeIndex++;
                graph.addEachNode(nodeIndex, transition);
                compartment.transitions.push(transition);
            }
            var entitys = compartments[i].children.entitys;
            for (var j = 0; j < entitys.length; ++j) {
                var entity = {};
                entity.id = entitys[j].id;
                entity.x = entitys[j].x * compartment.w;
                entity.y = entitys[j].y * compartment.h;
                entity.offsetX = 0;
                entity.offsetY = 0;
                entity.offsetX = 40;
                entity.offsetY = 15;
                entity.graphId = graphId;
                entity.nodeIndex = nodeIndex;
                nodeIndex++;
                graph.addEachNode(nodeIndex, entity);
                compartment.entitys.push(entity);
            }
            Data.compartments.push(compartment);
            graphs.push(graph);
            graphId++;
        }
    },
    parseActivations: function (activations) {
        for (var i = 0; i < activations.length; ++i) {
            if (activations[i].beginNodeId < 0 && activations[i].endNodeId < 0) {
                continue;
            }
            var beginNode = null, endNode = null;
            for(var j=0; j<Data.compartments.length; ++j)
            {
                 var data;
                 if(activations[i].beginType === "C" )
                 {
                     data = Data.compartments[j].complexs;
                 }
                 else if(activations[i].beginType === "D" )
                 {
                     data = Data.compartments[j].dnas;
                 }
                 else if(activations[i].beginType === "P" )
                 {
                     data = Data.compartments[j].proteins;
                 }
                 else if(activations[i].beginType === "S" )
                 {
                     data = Data.compartments[j].molecules;
                 }
                 else if(activations[i].beginType === "B" )
                 {
                     data = Data.compartments[j].associations;
                 }
                 else if(activations[i].beginType === "K" )
                 {
                     data = Data.compartments[j].dissociations;
                 }
                 else if(activations[i].beginType === "T" )
                 {
                     data = Data.compartments[j].transitions;
                 }
                 else if(activations[i].beginType === "E" )
                 {
                     data = Data.compartments[j].entitys;
                 }
                 for(var k=0; k<data.length; ++k)
                 {
                     if(data[k].id === activations[i].beginNodeId)
                     {
                         beginNode = data[k];
                         break;
                     }
                 }
                if(beginNode !== null)
                {
                    break;
                }
            }
            for(var j=0; j<Data.compartments.length; ++j)
            {
                var data;
                if(activations[i].endType === "C" )
                {
                    data = Data.compartments[j].complexs;
                }
                else if(activations[i].endType === "D" )
                {
                    data = Data.compartments[j].dnas;
                }
                else if(activations[i].endType === "P" )
                {
                    data = Data.compartments[j].proteins;
                }
                else if(activations[i].endType === "S" )
                {
                    data = Data.compartments[j].molecules;
                }
                else if(activations[i].endType === "B" )
                {
                    data = Data.compartments[j].associations;
                }
                else if(activations[i].endType === "K" )
                {
                    data = Data.compartments[j].dissociations;
                }
                else if(activations[i].endType === "T" )
                {
                    data = Data.compartments[j].transitions;
                }
                else if(activations[i].endType === "E" )
                {
                    data = Data.compartments[j].entitys;
                }
                for(var k=0; k<data.length; ++k)
                {
                    if(data[k].id === activations[i].endNodeId)
                    {
                        endNode = data[k];
                        break;
                    }
                }
                if(endNode !== null)
                {
                    break;
                }
            }
            if(beginNode.graphId === endNode.graphId)
            {
                graphs[beginNode.graphId].addEachLink(beginNode.nodeIndex, endNode.nodeIndex);
            }
        }
    },
    parseArrows: function (arrows) {
        for (var i = 0; i < arrows.length; ++i) {
            if (arrows[i].beginNodeId < 0 && arrows[i].endNodeId < 0) {
                continue;
            }
            var beginNode = null, endNode = null;
            for(var j=0; j<Data.compartments.length; ++j)
            {
                var data;
                if(arrows[i].beginType === "C" )
                {
                    data = Data.compartments[j].complexs;
                }
                else if(arrows[i].beginType === "D" )
                {
                    data = Data.compartments[j].dnas;
                }
                else if(arrows[i].beginType === "P" )
                {
                    data = Data.compartments[j].proteins;
                }
                else if(arrows[i].beginType === "S" )
                {
                    data = Data.compartments[j].molecules;
                }
                else if(arrows[i].beginType === "B" )
                {
                    data = Data.compartments[j].associations;
                }
                else if(arrows[i].beginType === "K" )
                {
                    data = Data.compartments[j].dissociations;
                }
                else if(arrows[i].beginType === "T" )
                {
                    data = Data.compartments[j].transitions;
                }
                else if(arrows[i].beginType === "E" )
                {
                    data = Data.compartments[j].entitys;
                }
                for(var k=0; k<data.length; ++k)
                {
                    if(data[k].id === arrows[i].beginNodeId)
                    {
                        beginNode = data[k];
                        break;
                    }
                }
                if(beginNode !== null)
                {
                    break;
                }
            }
            for(var j=0; j<Data.compartments.length; ++j)
            {
                var data;
                if(arrows[i].endType === "C" )
                {
                    data = Data.compartments[j].complexs;
                }
                else if(arrows[i].endType === "D" )
                {
                    data = Data.compartments[j].dnas;
                }
                else if(arrows[i].endType === "P" )
                {
                    data = Data.compartments[j].proteins;
                }
                else if(arrows[i].endType === "S" )
                {
                    data = Data.compartments[j].molecules;
                }
                else if(arrows[i].endType === "B" )
                {
                    data = Data.compartments[j].associations;
                }
                else if(arrows[i].endType === "K" )
                {
                    data = Data.compartments[j].dissociations;
                }
                else if(arrows[i].endType === "T" )
                {
                    data = Data.compartments[j].transitions;
                }
                else if(arrows[i].endType === "E" )
                {
                    data = Data.compartments[j].entitys;
                }
                for(var k=0; k<data.length; ++k)
                {
                    if(data[k].id === arrows[i].endNodeId)
                    {
                        endNode = data[k];
                        break;
                    }
                }
                if(endNode !== null)
                {
                    break;
                }
            }
            if(beginNode.graphId === endNode.graphId)
            {
                graphs[beginNode.graphId].addEachLink(beginNode.nodeIndex, endNode.nodeIndex);
            }
        }
    },
    parseInhibitions: function (inhibitions) {
        for (var i = 0; i < inhibitions.length; ++i) {
            if (inhibitions[i].beginNodeId < 0 && inhibitions[i].endNodeId < 0) {
                continue;
            }
            var beginNode = null, endNode = null;
            for(var j=0; j<Data.compartments.length; ++j)
            {
                var data;
                if(inhibitions[i].beginType === "C" )
                {
                    data = Data.compartments[j].complexs;
                }
                else if(inhibitions[i].beginType === "D" )
                {
                    data = Data.compartments[j].dnas;
                }
                else if(inhibitions[i].beginType === "P" )
                {
                    data = Data.compartments[j].proteins;
                }
                else if(inhibitions[i].beginType === "S" )
                {
                    data = Data.compartments[j].molecules;
                }
                else if(inhibitions[i].beginType === "B" )
                {
                    data = Data.compartments[j].associations;
                }
                else if(inhibitions[i].beginType === "K" )
                {
                    data = Data.compartments[j].dissociations;
                }
                else if(inhibitions[i].beginType === "T" )
                {
                    data = Data.compartments[j].transitions;
                }
                else if(inhibitions[i].beginType === "E" )
                {
                    data = Data.compartments[j].entitys;
                }
                for(var k=0; k<data.length; ++k)
                {
                    if(data[k].id === inhibitions[i].beginNodeId)
                    {
                        beginNode = data[k];
                        break;
                    }
                }
                if(beginNode !== null)
                {
                    break;
                }
            }
            for(var j=0; j<Data.compartments.length; ++j)
            {
                var data;
                if(inhibitions[i].endType === "C" )
                {
                    data = Data.compartments[j].complexs;
                }
                else if(inhibitions[i].endType === "D" )
                {
                    data = Data.compartments[j].dnas;
                }
                else if(inhibitions[i].endType === "P" )
                {
                    data = Data.compartments[j].proteins;
                }
                else if(inhibitions[i].endType === "S" )
                {
                    data = Data.compartments[j].molecules;
                }
                else if(inhibitions[i].endType === "B" )
                {
                    data = Data.compartments[j].associations;
                }
                else if(inhibitions[i].endType === "K" )
                {
                    data = Data.compartments[j].dissociations;
                }
                else if(inhibitions[i].endType === "T" )
                {
                    data = Data.compartments[j].transitions;
                }
                else if(inhibitions[i].endType === "E" )
                {
                    data = Data.compartments[j].entitys;
                }
                for(var k=0; k<data.length; ++k)
                {
                    if(data[k].id === inhibitions[i].endNodeId)
                    {
                        endNode = data[k];
                        break;
                    }
                }
                if(endNode !== null)
                {
                    break;
                }
            }
            if(beginNode.graphId === endNode.graphId)
            {
                graphs[beginNode.graphId].addEachLink(beginNode.nodeIndex, endNode.nodeIndex);
            }
        }
    }

};
