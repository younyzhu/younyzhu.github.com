/**
 * Created by Yongnanzhu on 5/12/2014.
 */

//Global variable for counting the bubble number
var Bubbles = null;
var mainManagement = null;
var graphs = [];
var log = {};
var springy = null;
$(document).ready(function () {
    //WindowResize($("#bgCanvas")[0]);
    mainManagement = new MainManage($("#bgCanvas")[0]);
    Bubbles = new Visualization();
    mainManagement.addShape(Bubbles);
    Bubbles.addCompartment(0, 0.15,0.1, 0.2, 0.2, "G");   //Compartment
    for (var k = 0; k < mainManagement.shapes.length; k++) {
        if (mainManagement.shapes[k].id === 0 && mainManagement.shapes[k].type === "M") {
            mainManagement.shapes[k].addComplex(0,0.1,0.1,0.6,0.3, "E");
            mainManagement.shapes[k].addTransition(0,0.8,0.8,0.6,0.3, "F");
            break;
        }
    }
    Bubbles.addCompartment(1, 0.1,0.35, 0.3, 0.4, "H");   //Compartment
    for (var k = 0; k < mainManagement.shapes.length; k++) {
        if (mainManagement.shapes[k].id === 1 && mainManagement.shapes[k].type === "M") {
            mainManagement.shapes[k].addProtein(0,0.2,0.2,0.6,0.3,"C");
            mainManagement.shapes[k].addPhysical_Entity(0,0.2,0.8,0.6,0.3, "A");
            mainManagement.shapes[k].addDNA(0,0.8,0.2,0.6,0.3,"B");
            mainManagement.shapes[k].addAssociation(0,0.8,0.8,0.6,0.3,"D");
            break;
        }
    }
    Bubbles.addActivation(0, "C", 0, "T",0);
    Bubbles.addArrow(0, "T", 0, "P",0);
    Bubbles.addInhibition(0, "P", 0, "E",0);
    Bubbles.addActivation(1, "P", 0, "B",0);
    Bubbles.addArrow(2, "D", 0, "B",0);
    Bubbles.addArrow(3, "B", 0, "E",0);

    var params = {
        sendJson: function () {
            var objects = mainManagement.shapes;
            var w = mainManagement.shapes[0].w;
            var h = mainManagement.shapes[0].h;
            var jsonData = {};
            jsonData.compartments = [];
            jsonData.arrows = [];
            jsonData.inhibitions = [];
            jsonData.activations = [];
            for (var i = 0; i < objects.length; ++i) {
                if (objects[i].type === "M") {
                    var compartment = {};
                    compartment.id = objects[i].id;
                    compartment.type = objects[i].type;
                    compartment.name = objects[i].text;
                    compartment.x = objects[i].x / w;
                    compartment.y = objects[i].y / h;
                    compartment.childOffsetx = objects[i].childOffsetx / w;
                    compartment.childOffsety = objects[i].childOffsety / h;
                    compartment.w = objects[i].w / w;
                    compartment.h = objects[i].h / h;

                    compartment.children = {};
                    compartment.children.complexs = [];
                    compartment.children.dnas = [];
                    compartment.children.proteins = [];
                    compartment.children.molecules = [];
                    compartment.children.associations = [];
                    compartment.children.dissociations = [];
                    compartment.children.transitions = [];
                    compartment.children.entitys = [];

                    var offsetX = objects[i].childOffsetx - objects[i].x;
                    var offsetY = objects[i].childOffsety - objects[i].y;
                    for (var j = 0; j < objects[i].complexs.length; ++j) {
                        for (var k = 0; k < objects.length; ++k) {
                            if (objects[k].id === objects[i].complexs[j] && objects[k].type === "C") {
                                var complex = {};
                                complex.id = objects[k].id;
                                complex.type = objects[k].type;
                                complex.x = (objects[k].x + offsetX) / objects[i].w;
                                complex.y = (objects[k].y + offsetY) / objects[i].h;
                                complex.w = objects[k].w / objects[i].w;
                                complex.h = objects[k].h / objects[i].h;
                                compartment.children.complexs.push(complex);
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].dnas.length; ++j) {
                        for (var k = 0; k < objects.length; ++k) {
                            if (objects[k].id === objects[i].dnas[j] && objects[k].type === "D") {
                                var dna = {};
                                dna.id = objects[k].id;
                                dna.type = objects[k].type;
                                dna.name = objects[k].text;
                                dna.x = (objects[k].x + offsetX) / objects[i].w;
                                dna.y = (objects[k].y + offsetY) / objects[i].h;
                                dna.w = objects[k].w / objects[i].w;
                                dna.h = objects[k].h / objects[i].h;
                                compartment.children.dnas.push(dna);
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].proteins.length; ++j) {
                        for (var k = 0; k < objects.length; ++k) {
                            if (objects[k].id === objects[i].proteins[j] && objects[k].type === "P") {
                                var protein = {};
                                protein.id = objects[k].id;
                                protein.type = objects[k].type;
                                protein.name = objects[k].text;
                                protein.x = (objects[k].x + offsetX) / objects[i].w;
                                protein.y = (objects[k].y + offsetY) / objects[i].h;
                                protein.w = objects[k].w / objects[i].w;
                                protein.h = objects[k].h / objects[i].h;
                                compartment.children.proteins.push(protein);
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].molecules.length; ++j) {
                        for (var k = 0; k < objects.length; ++k) {
                            if (objects[k].id === objects[i].molecules[j] && objects[k].type === "S") {
                                var molecule = {};
                                molecule.id = objects[k].id;
                                molecule.type = objects[k].type;
                                molecule.name = objects[k].text;
                                molecule.x = (objects[k].x + offsetX) / objects[i].w;
                                molecule.y = (objects[k].y + offsetY) / objects[i].h;
                                molecule.w = objects[k].w / objects[i].w;
                                molecule.h = objects[k].h / objects[i].h;
                                compartment.children.molecules.push(molecule);
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].associations.length; ++j) {
                        for (var k = 0; k < objects.length; ++k) {
                            if (objects[k].id === objects[i].associations[j] && objects[k].type === "B") {
                                var association = {};
                                association.id = objects[k].id;
                                association.type = objects[k].type;
                                association.x = (objects[k].x + offsetX) / objects[i].w;
                                association.y = (objects[k].y + offsetY) / objects[i].h;
                                association.w = objects[k].w / objects[i].w;
                                association.h = objects[k].h / objects[i].h;
                                compartment.children.associations.push(association);
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].dissociations.length; ++j) {
                        for (var k = 0; k < objects.length; ++k) {
                            if (objects[k].id === objects[i].dissociations[j] && objects[k].type === "K") {
                                var dissociation = {};
                                dissociation.id = objects[k].id;
                                dissociation.type = objects[k].type;
                                dissociation.x = (objects[k].x + offsetX) / objects[i].w;
                                dissociation.y = (objects[k].y + offsetY) / objects[i].h;
                                dissociation.w = objects[k].w / objects[i].w;
                                dissociation.h = objects[k].h / objects[i].h;
                                compartment.children.dissociations.push(dissociation);
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].transitions.length; ++j) {
                        for (var k = 0; k < objects.length; ++k) {
                            if (objects[k].id === objects[i].transitions[j] && objects[k].type === "T") {
                                var transition = {};
                                transition.id = objects[k].id;
                                transition.type = objects[k].type;
                                transition.x = (objects[k].x + offsetX) / objects[i].w;
                                transition.y = (objects[k].y + offsetY) / objects[i].h;
                                transition.w = objects[k].w / objects[i].w;
                                transition.h = objects[k].h / objects[i].h;
                                compartment.children.transitions.push(transition);
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].entitys.length; ++j) {
                        for (var k = 0; k < objects.length; ++k) {
                            if (objects[k].id === objects[i].entitys[j] && objects[k].type === "E") {
                                var entity = {};
                                entity.id = objects[k].id;
                                entity.type = objects[k].type;
                                entity.name = objects[k].text;
                                entity.x = (objects[k].x + offsetX) / objects[i].w;
                                entity.y = (objects[k].y + offsetY) / objects[i].h;
                                entity.w = objects[k].w / objects[i].w;
                                entity.h = objects[k].h / objects[i].h;
                                compartment.children.entitys.push(entity);
                            }
                        }
                    }
                    jsonData.compartments.push(compartment);
                }
                else if (objects[i].type === "J")//Arrows
                {
                    var arrow = {};
                    arrow.id = objects[i].id;
                    arrow.type = objects[i].type;
                    arrow.beginType = objects[i].beginType;
                    arrow.beginNodeId = objects[i].beginNodeId;
                    arrow.endType = objects[i].endType;
                    arrow.endNodeId = objects[i].endNodeId;
                    jsonData.arrows.push(arrow);
                }
                else if (objects[i].type === "A")//Activation
                {
                    var activation = {};
                    activation.id = objects[i].id;
                    activation.type = objects[i].type;
                    activation.beginType = objects[i].beginType;
                    activation.beginNodeId = objects[i].beginNodeId;
                    activation.endType = objects[i].endType;
                    activation.endNodeId = objects[i].endNodeId;
                    jsonData.activations.push(activation);
                }
                else if (objects[i].type === "I")//Inhibition
                {
                    var inhibition = {};
                    inhibition.id = objects[i].id;
                    inhibition.type = objects[i].type;
                    inhibition.beginType = objects[i].beginType;
                    inhibition.beginNodeId = objects[i].beginNodeId;
                    inhibition.endType = objects[i].endType;
                    inhibition.endNodeId = objects[i].endNodeId;
                    jsonData.inhibitions.push(inhibition);
                }
            }
            //console.log(JSON.stringify(jsonData));
            $.ajax({
                url: 'json.php',
                type: "POST",  // type should be POST
                data: {
                    json: JSON.stringify(jsonData),
                    name: "fig3.json"
                }, // send the string directly
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    return true;
                },
                complete: function () {
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log('ajax saving json file error...');
                    return false;
                }
            });
        }
    };
    var gui = new dat.GUI();
    gui.add(params, 'sendJson').name('SendJson');
});