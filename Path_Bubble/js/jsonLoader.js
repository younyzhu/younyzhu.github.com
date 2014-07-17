/**
 * Created by Yongnan on 7/3/2014.
 */
JsonLoader = function () {
    this.e = 0;
    this.v = 0;
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
        mainManagement = new MainManage($("#bgCanvas")[0]);
        Bubbles = new Visualization();
        mainManagement.addShape(Bubbles);
        this.e = 0;
        this.v = 0;
        if (dataObject instanceof  Object) {
            this.parseCompartments(dataObject.compartments);
            this.parseActivations(dataObject.activations);
            this.parseArrows(dataObject.arrows);
            this.parseInhibitions(dataObject.inhibitions);
            this.processEdges(dataObject);
        }
        if (graphs.length !== 0)
            springy = new Manage({graphs: graphs});
    },
    parseCompartments: function (compartments) {
        var graphId = 0; //belongs to which graph
        var w = window.innerWidth;
        var h = window.innerHeight;
        for (var i = 0; i < compartments.length; ++i) {
            var graph = new Graph();
            graph.setBoundingCB(compartments[i].x * w, compartments[i].y * h, compartments[i].w * w, compartments[i].h * h);
            var nodeIndex = 0; //the index in each graph
            Bubbles.addCompartment(compartments[i].id, compartments[i].x, compartments[i].y, compartments[i].w, compartments[i].h, compartments[i].name);
            var complexs = compartments[i].children.complexs;
            for (var j = 0; j < complexs.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        this.v++;
                        mainManagement.shapes[k].addComplex(complexs[j].id, complexs[j].x, complexs[j].y, complexs[j].w, complexs[j].h);
                        for (var m = 0; m < mainManagement.shapes.length; ++m) {
                            if (mainManagement.shapes[m].id === complexs[j].id && mainManagement.shapes[m].type === "C") {
                                mainManagement.shapes[m].graphId = graphId;
                                mainManagement.shapes[m].nodeIndex = nodeIndex;
                                nodeIndex++;
                                graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            var dnas = compartments[i].children.dnas;
            for (var j = 0; j < dnas.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        this.v++;
                        mainManagement.shapes[k].addDNA(dnas[j].id, dnas[j].x, dnas[j].y, dnas[j].w, dnas[j].h, dnas[j].name);
                        for (var m = 0; m < mainManagement.shapes.length; ++m) {
                            if (mainManagement.shapes[m].id === dnas[j].id && mainManagement.shapes[m].type === "D") {
                                mainManagement.shapes[m].graphId = graphId;
                                mainManagement.shapes[m].nodeIndex = nodeIndex;
                                nodeIndex++;
                                graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            var entitys = compartments[i].children.entitys;
            for (var j = 0; j < entitys.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        this.v++;
                        mainManagement.shapes[k].addPhysical_Entity(entitys[j].id, entitys[j].x, entitys[j].y, entitys[j].w, entitys[j].h, entitys[j].name);
                        for (var m = 0; m < mainManagement.shapes.length; ++m) {
                            if (mainManagement.shapes[m].id === entitys[j].id && mainManagement.shapes[m].type === "E") {
                                mainManagement.shapes[m].graphId = graphId;
                                mainManagement.shapes[m].nodeIndex = nodeIndex;
                                nodeIndex++;
                                graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            var molecules = compartments[i].children.molecules;
            for (var j = 0; j < molecules.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        this.v++;
                        mainManagement.shapes[k].addSmall_Molecule(molecules[j].id, molecules[j].x, molecules[j].y, molecules[j].w, molecules[j].h, molecules[j].name);
                        for (var m = 0; m < mainManagement.shapes.length; ++m) {
                            if (mainManagement.shapes[m].id === molecules[j].id && mainManagement.shapes[m].type === "S") {
                                mainManagement.shapes[m].graphId = graphId;
                                mainManagement.shapes[m].nodeIndex = nodeIndex;
                                nodeIndex++;
                                graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            var proteins = compartments[i].children.proteins;
            for (var j = 0; j < proteins.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        this.v++;
                        mainManagement.shapes[k].addProtein(proteins[j].id, proteins[j].x, proteins[j].y, proteins[j].w, proteins[j].h, proteins[j].name);
                        for (var m = 0; m < mainManagement.shapes.length; ++m) {
                            if (mainManagement.shapes[m].id === proteins[j].id && mainManagement.shapes[m].type === "P") {
                                mainManagement.shapes[m].graphId = graphId;
                                mainManagement.shapes[m].nodeIndex = nodeIndex;
                                nodeIndex++;
                                graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            var associations = compartments[i].children.associations;
            for (var j = 0; j < associations.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        this.v++;
                        mainManagement.shapes[k].addAssociation(associations[j].id, associations[j].x, associations[j].y, associations[j].w, associations[j].h);
                        for (var m = 0; m < mainManagement.shapes.length; ++m) {
                            if (mainManagement.shapes[m].id === associations[j].id && mainManagement.shapes[m].type === "B") {   //associations
                                mainManagement.shapes[m].graphId = graphId;
                                mainManagement.shapes[m].nodeIndex = nodeIndex;
                                nodeIndex++;
                                graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            var dissociations = compartments[i].children.dissociations;
            for (var j = 0; j < dissociations.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        this.v++;
                        mainManagement.shapes[k].addDissociation(dissociations[j].id, dissociations[j].x, dissociations[j].y, dissociations[j].w, dissociations[j].h);
                        for (var m = 0; m < mainManagement.shapes.length; ++m) {
                            if (mainManagement.shapes[m].id === dissociations[j].id && mainManagement.shapes[m].type === "K") {   //dissociations
                                mainManagement.shapes[m].graphId = graphId;
                                mainManagement.shapes[m].nodeIndex = nodeIndex;
                                nodeIndex++;
                                graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            var transitions = compartments[i].children.transitions;
            for (var j = 0; j < transitions.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        this.v++;
                        mainManagement.shapes[k].addTransition(transitions[j].id, transitions[j].x, transitions[j].y, transitions[j].w, transitions[j].h);
                        for (var m = 0; m < mainManagement.shapes.length; ++m) {
                            if (mainManagement.shapes[m].id === transitions[j].id && mainManagement.shapes[m].type === "T") {
                                mainManagement.shapes[m].graphId = graphId;
                                mainManagement.shapes[m].nodeIndex = nodeIndex;
                                nodeIndex++;
                                graph.addEachNode(nodeIndex, mainManagement.shapes[m]);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            graphs.push(graph);
            graphId++;
        }
    },

    parseActivations: function (activations) {
        for (var i = 0; i < activations.length; ++i) {
            if (activations[i].beginNodeId < 0 && activations[i].endNodeId < 0) {
                continue;
            }
            this.e++;
            Bubbles.addActivation(activations[i].id, activations[i].beginType, activations[i].beginNodeId, activations[i].endType, activations[i].endNodeId);
        }
    },
    parseArrows: function (arrows) {
        for (var i = 0; i < arrows.length; ++i) {
            if (arrows[i].beginNodeId < 0 && arrows[i].endNodeId < 0) {
                continue;
            }
            this.e++;
            Bubbles.addArrow(arrows[i].id, arrows[i].beginType, arrows[i].beginNodeId, arrows[i].endType, arrows[i].endNodeId);
        }
    },
    parseInhibitions: function (inhibitions) {
        for (var i = 0; i < inhibitions.length; ++i) {
            if (inhibitions[i].beginNodeId < 0 && inhibitions[i].endNodeId < 0) {
                continue;
            }
            this.e++;
            Bubbles.addInhibition(inhibitions[i].id, inhibitions[i].beginType, inhibitions[i].beginNodeId, inhibitions[i].endType, inhibitions[i].endNodeId);
        }
    },


    processEdges: function (dataObject) {
        for (var i = 0; i < dataObject.activations.length; ++i) {
            var graphId1, graphId2;//belongs to which graph
            var nodeIndex1, nodeIndex2;
            var flag = 0;
            var activation = dataObject.activations[i];
            for (var k = 0; k < mainManagement.shapes.length; ++k) {
                if (mainManagement.shapes[k].id === activation.beginNodeId && mainManagement.shapes[k].type === activation.beginType) {
                    graphId1 = mainManagement.shapes[k].graphId;
                    nodeIndex1 = mainManagement.shapes[k].nodeIndex;
                    flag++;
                    continue;
                }
                if (mainManagement.shapes[k].id === activation.endNodeId && mainManagement.shapes[k].type === activation.endType) {
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

        for (var i = 0; i < dataObject.arrows.length; ++i) {
            var graphId1, graphId2;//belongs to which graph
            var nodeIndex1, nodeIndex2;
            var flag = 0;
            var arrow = dataObject.arrows[i];
            for (var k = 0; k < mainManagement.shapes.length; ++k) {
                if (mainManagement.shapes[k].id === arrow.beginNodeId && mainManagement.shapes[k].type === arrow.beginType) {
                    graphId1 = mainManagement.shapes[k].graphId;
                    nodeIndex1 = mainManagement.shapes[k].nodeIndex;
                    flag++;
                    continue;
                }
                if (mainManagement.shapes[k].id === arrow.endNodeId && mainManagement.shapes[k].type === arrow.endType) {
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
        for (var i = 0; i < dataObject.inhibitions.length; ++i) {
            var graphId1, graphId2;//belongs to which graph
            var nodeIndex1, nodeIndex2;
            var flag = 0;
            var inhibition = dataObject.inhibitions[i];
            for (var k = 0; k < mainManagement.shapes.length; ++k) {
                if (mainManagement.shapes[k].id === inhibition.beginNodeId && mainManagement.shapes[k].type === inhibition.beginType) {
                    graphId1 = mainManagement.shapes[k].graphId;
                    nodeIndex1 = mainManagement.shapes[k].nodeIndex;
                    flag++;
                    continue;
                }
                if (mainManagement.shapes[k].id === inhibition.endNodeId && mainManagement.shapes[k].type === inhibition.endType) {
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
};
