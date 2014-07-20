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
    WindowResize($("#bgCanvas")[0]);
    //THREEx.FullScreen.bindKey({ charCode: 'f'.charCodeAt(0) });
    //var str = "./data/SMAD23 Phosphorylation Motif Mutants in Cancer_26_new.xml";
    //var str = "./data/Apoptosis_new.xml";
    var str = "./data/Apoptosis.json";
    var check = new Check();
    var format = check.checkFileFormat(str);
    var loader;
    if (format === "XML") {
        loader = new XMLLoader();
        loader.load(str);
    }
    else if (format === "JSON") {
        loader = new JsonLoader();
        loader.load(str);
    }

    var workerId = "";
    var startTime = new Date();
    log.screenSize = {width: window.innerWidth, height: window.innerHeight};
    log.startTime = startTime.toLocaleTimeString() + " " + startTime.toLocaleDateString();

    var endTime = 0;
    var elapsedTime = 0;
    var params = {
        loadFile: function () {
            $('#myInput').click();
        },
        stop: function () {
            if (springy !== null) {
                graphs.length = 0;
                springy.stopLayout();
                springy = null;
                mainManagement.valid = false;
                mainManagement.draw();
                var time = new Date();
                log.StopForceDirectTime = time.toLocaleTimeString() + " " + time.toLocaleDateString();
                log.log = "Stop Force direct";
            }
        },
        load: function () {
            var selected_file = $('#myInput').get(0).files[0];
            if (selected_file === null) {
                alert("Please select data file!");
            }
            else {
                graphs.length = 0;
                if (springy !== null) {
                    springy.stopLayout();
                    springy = null;
                }
                mainManagement.shapes.length = 0;
                mainManagement.clear();
                var localFileLoader = new LocalFileLoader();
                localFileLoader.load(selected_file);
            }
        },
        text: "",
        planarity: function () {
            if (loader.v > 3)
                if (loader.e <= 3 * loader.v - 6) {
                    alert("This is a planner graph!");
                }
                else {
                    alert("This is a non-planner graph!");
                }
        },
        leftCrossing: function () {

            var detection = new Detection(mainManagement.shapes, loader.e);
            var crossingNum = detection.findCrossing();
            alert(crossingNum);
        },
        sendJson: function () {
            if (workerId === "") {
                alert("Please input your amazon mechnical turk Worker Id.");
                return;
            }
            endTime = new Date();
            log.endTime = endTime.toLocaleTimeString() + " " + endTime.toLocaleDateString();
            elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;
            log.elapsedTime = elapsedTime;

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
                    name: workerId + ".json",
                    logName: workerId + "log.json",
                    log: JSON.stringify(log)
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
        },
        sendXML: function () {
            if (workerId === "") {
                alert("Please input your amazon mechnical turk Worker Id.");
                return;
            }
            endTime = new Date();
            log.endTime = endTime.toLocaleTimeString() + " " + endTime.toLocaleDateString();
            elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;
            log.elapsedTime = elapsedTime;

            var results = [ ];
            results.push('<?xml version="1.0" encoding="ISO-8859-1"?>');
            results.push(preElement(false, "Pathway"));
            results.push(preElement(true, "ANodeBlock", " Num='0'"));  //has /
            var compartments = mainManagement.shapes[0].compartments;
            var num = " Num = '";
            num += compartments.length;
            num += "'";
            results.push(preElement(false, "compartmentBlock ", num));  //has /
            var width = window.innerWidth;
            var height = window.innerHeight;

            var complexLength = 0, entityLength = 0, proteinLength = 0, smallMoleculeLength = 0, dnaLength = 0, reactionLength = 0;
            for (var i = 0; i < compartments.length; ++i) {
                var a = " j = '";
                a += compartments[i];
                a += "'";
                results.push(preElement(false, "compartment", a));
                for (var j = 0; j < mainManagement.shapes.length; ++j) {
                    if (mainManagement.shapes[j].id === compartments[i] && mainManagement.shapes[j].type === "M") {
                        var name = mainManagement.shapes[j].text;
                        results.push(element("Name", name));
                        var position = "(";
                        position += mainManagement.shapes[j].x / width;
                        position += ",";
                        position += mainManagement.shapes[j].y / height;
                        position += ",";
                        position += mainManagement.shapes[j].w / width;
                        position += ",";
                        position += mainManagement.shapes[j].h / height;
                        position += ")";
                        results.push(element("Position", position));

                        var contain = "(";
                        var complexs = mainManagement.shapes[j].complexs;
                        complexLength += complexs.length;
                        for (var k = 0; k < complexs.length; ++k) {
                            contain += "C, ";
                            contain += complexs[k];
                            contain += ", ";
                        }

                        var entitys = mainManagement.shapes[j].entitys;
                        entityLength += entitys.length;
                        for (var k = 0; k < entitys.length; ++k) {
                            contain += "E, ";
                            contain += entitys[k];
                            contain += ", ";
                        }

                        var dnas = mainManagement.shapes[j].dnas;
                        dnaLength += dnas.length;
                        for (var k = 0; k < dnas.length; ++k) {
                            contain += "D, ";
                            contain += dnas[k];
                            contain += ", ";
                        }
                        var proteins = mainManagement.shapes[j].proteins;
                        proteinLength += proteins.length;
                        for (var k = 0; k < proteins.length; ++k) {
                            contain += "P, ";
                            contain += proteins[k];
                            contain += ", ";
                        }

                        var associations = mainManagement.shapes[j].associations;
                        reactionLength += associations.length;
                        for (var k = 0; k < associations.length; ++k) {
                            contain += "R, ";
                            contain += associations[k];
                            contain += ", ";
                        }
                        var dissociations = mainManagement.shapes[j].dissociations;
                        reactionLength += dissociations.length;
                        for (var k = 0; k < dissociations.length; ++k) {
                            contain += "R, ";
                            contain += dissociations[k];
                            contain += ", ";
                        }

                        var transitions = mainManagement.shapes[j].transitions;
                        reactionLength += transitions.length;
                        for (var k = 0; k < transitions.length; ++k) {
                            contain += "R, ";
                            contain += transitions[k];
                            contain += ", ";
                        }
                        contain += ")";
                        results.push(element("Contain", contain));
                    }
                }
                results.push(postElement("compartment"));
            }
            results.push(postElement("compartmentBlock "));

            var num = " Num = '";
            num += complexLength;
            num += "'";
            results.push(preElement(false, "complexBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "C") {
                    var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[0].compartments[graphId] && mainManagement.shapes[j].type === "M") {

                            var childOffsetx = mainManagement.shapes[j].childOffsetx;
                            var childOffsety = mainManagement.shapes[j].childOffsety;
                            var offsetX = childOffsetx - mainManagement.shapes[j].x;
                            var offsetY = childOffsety - mainManagement.shapes[j].y;

                            var w = mainManagement.shapes[j].w;
                            var h = mainManagement.shapes[j].h;


                            var a = " j = '";
                            a += mainManagement.shapes[i].id;
                            a += "'";
                            results.push(preElement(false, "complex", a));

                            var position = "(";
                            position += (mainManagement.shapes[i].x+offsetX)  / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y+offsetY) / h;
                            position += ",";
                            position += mainManagement.shapes[i].w / w;
                            position += ",";
                            position += mainManagement.shapes[i].h / h;
                            position += ")";
                            results.push(element("Position", position));
                            results.push(postElement("complex"));
                            break;
                        }
                    }
                }
            }
            results.push(postElement("complexBlock"));

            var num = " Num = '";
            num += entityLength;
            num += "'";
            results.push(preElement(false, "physicalEntityBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "E") {
                    var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[0].compartments[graphId] && mainManagement.shapes[j].type === "M") {

                            var childOffsetx = mainManagement.shapes[j].childOffsetx;
                            var childOffsety = mainManagement.shapes[j].childOffsety;
                            var offsetX = childOffsetx - mainManagement.shapes[j].x;
                            var offsetY = childOffsety - mainManagement.shapes[j].y;

                            var w = mainManagement.shapes[j].w;
                            var h = mainManagement.shapes[j].h;
                            var a = " j = '";
                            a += mainManagement.shapes[i].id;
                            a += "'";
                            results.push(preElement(false, "physicalEntity", a));

                            var position = "(";
                            position += (mainManagement.shapes[i].x+offsetX)  / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y+offsetY) / h;
                            position += ",";
                            position += mainManagement.shapes[i].w / w;
                            position += ",";
                            position += mainManagement.shapes[i].h / h;
                            position += ")";
                            results.push(element("Position", position));
                            results.push(postElement("physicalEntity"));
                        }
                    }
                }
            }
            results.push(postElement("physicalEntityBlock"));

            var num = " Num = '";
            num += proteinLength;
            num += "'";
            results.push(preElement(false, "proteinBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "P") {
                    var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[0].compartments[graphId] && mainManagement.shapes[j].type === "M") {

                            var childOffsetx = mainManagement.shapes[j].childOffsetx;
                            var childOffsety = mainManagement.shapes[j].childOffsety;
                            var offsetX = childOffsetx - mainManagement.shapes[j].x;
                            var offsetY = childOffsety - mainManagement.shapes[j].y;

                            var w = mainManagement.shapes[j].w;
                            var h = mainManagement.shapes[j].h;
                            var a = " j = '";
                            a += mainManagement.shapes[i].id;
                            a += "'";
                            results.push(preElement(false, "protein ", a));
                            var name = mainManagement.shapes[i].text;
                            results.push(element("Name", name));
                            var position = "(";
                            position += (mainManagement.shapes[i].x+offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y+offsetY) / h;
                            position += ",";
                            position += mainManagement.shapes[i].w / w;
                            position += ",";
                            position += mainManagement.shapes[i].h / h;
                            position += ")";
                            results.push(element("Position", position));
                            results.push(postElement("protein "));
                        }
                    }
                }
            }
            results.push(postElement("proteinBlock"));

            var num = " Num = '";
            num += smallMoleculeLength;
            num += "'";
            results.push(preElement(false, "smallMoleculeBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "S") {
                    var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[0].compartments[graphId] && mainManagement.shapes[j].type === "M") {
                            var childOffsetx = mainManagement.shapes[j].childOffsetx;
                            var childOffsety = mainManagement.shapes[j].childOffsety;
                            var offsetX = childOffsetx - mainManagement.shapes[j].x;
                            var offsetY = childOffsety - mainManagement.shapes[j].y;

                            var w = mainManagement.shapes[j].w;
                            var h = mainManagement.shapes[j].h;
                            var a = " j = '";
                            a += mainManagement.shapes[i].id;
                            a += "'";
                            results.push(preElement(false, "smallMolecule ", a));
                            var name = mainManagement.shapes[i].text;
                            results.push(element("Name", name));
                            var position = "(";
                            position += (mainManagement.shapes[i].x+offsetX)  / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y+offsetY) / h;
                            position += ",";
                            position += mainManagement.shapes[i].w / w;
                            position += ",";
                            position += mainManagement.shapes[i].h / h;
                            position += ")";
                            results.push(element("Position", position));
                            results.push(postElement("smallMolecule "));

                        }
                    }
                }
            }
            results.push(postElement("smallMoleculeBlock "));

            var num = " Num = '";
            num += reactionLength;
            num += "'";
            results.push(preElement(false, "reactionBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "T" || mainManagement.shapes[i].type === "B" || mainManagement.shapes[i].type === "K") {
                    var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[0].compartments[graphId] && mainManagement.shapes[j].type === "M") {
                            var childOffsetx = mainManagement.shapes[j].childOffsetx;
                            var childOffsety = mainManagement.shapes[j].childOffsety;
                            var offsetX = childOffsetx - mainManagement.shapes[j].x;
                            var offsetY = childOffsety - mainManagement.shapes[j].y;

                            var w = mainManagement.shapes[j].w;
                            var h = mainManagement.shapes[j].h;
                            var a = " j = '";
                            a += mainManagement.shapes[i].id;
                            a += "'";
                            results.push(preElement(false, "reaction ", a));

                            var name = mainManagement.shapes[i].text;
                            results.push(element("Name", name));

                            var type = mainManagement.shapes[i].type;
                            results.push(element("Type", type));
                            var position = "(";
                            position += (mainManagement.shapes[i].x+offsetX)  / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y+offsetY) / h;
                            position += ",";
                            position += mainManagement.shapes[i].w / w;
                            position += ",";
                            position += mainManagement.shapes[i].h / h;
                            position += ")";
                            results.push(element("Position", position));
                            results.push(postElement("reaction "));
                        }
                    }
                }
            }
            results.push(postElement("reactionBlock"));

            var edgeLength = 0;
            edgeLength += mainManagement.shapes[0].activations.length;
            edgeLength += mainManagement.shapes[0].arrows.length;
            edgeLength += mainManagement.shapes[0].inhibitions.length;

            var num = " Num = '";
            num += edgeLength;
            num += "'";
            results.push(preElement(false, "edgeBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "A" || mainManagement.shapes[i].type === "I" || mainManagement.shapes[i].type === "J") {
                    var a = " j = '";
                    a += mainManagement.shapes[i].id;
                    a += "'";
                    results.push(preElement(false, "edge ", a));
                    var name = mainManagement.shapes[i].text;
                    results.push(element("Name", name));

                    var ends = "(";
                    if(mainManagement.shapes[i].beginType === "T" || mainManagement.shapes[i].type === "B" || mainManagement.shapes[i].type === "K")
                         ends += "R";
                    else
                        ends += mainManagement.shapes[i].beginType;
                    ends += ", ";
                    ends += mainManagement.shapes[i].beginNodeId;
                    ends += ", ";
                    if(mainManagement.shapes[i].endType === "T" || mainManagement.shapes[i].type === "B" || mainManagement.shapes[i].type === "K")
                        ends += "R";
                    else
                        ends += mainManagement.shapes[i].endType;
                    ends += ", ";
                    ends += mainManagement.shapes[i].endNodeId;
                    ends += ")";

                    results.push(element("Ends", ends));
                    results.push(postElement("edge "));
                }
            }
            results.push(postElement("edgeBlock "));
            results.push(postElement("Pathway"));
            var end_result = results.join(' ');

            $.ajax({
                url: 'xml.php',
                type: "POST",  // type should be POST
                data: {
                    xml: end_result,
                    name: workerId + ".xml",

                    logName: workerId + "log.json",
                    log: JSON.stringify(log)
                }, // send the string directly
                dataType: "text",
                success: function (data) {
                    console.log(data);
                    return true;
                },
                complete: function () {
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log('ajax loading error...');
                    return false;
                }
            });

        }
    };

    function preElement(flag, name, attributes) {   //http://oreilly.com/pub/h/2127
        var xml;
        if (flag) {
            if (attributes !== undefined)
                xml = '<' + name + attributes + '/>';
            else
                xml = '<' + name + '/>';
        }
        else {
            if (attributes !== undefined)
                xml = '<' + name + attributes + '>';
            else
                xml = '<' + name + '>';

        }
        return xml
    }

    function postElement(name) {   //http://oreilly.com/pub/h/2127
        var xml;
        xml = '</' + name + '>';
        return xml
    }

    // XML writer with attributes and smart attribute quote escaping
    function element(name, content, attributes) {   //http://oreilly.com/pub/h/2127

        var xml;
        if (!content) {
            if (attributes !== undefined)
                xml = '<' + name + attributes + '/>';
            else
                xml = '<' + name + '/>';
        }
        else {
            if (attributes !== undefined)
                xml = '<' + name + attributes + '>' + content + '</' + name + '>';
            else
                xml = '<' + name + '>' + content + '</' + name + '>';
        }
        return xml
    }

    var gui = new dat.GUI();
    gui.add(params, 'stop').name('Stop Force layout');
    var f1 = gui.addFolder('Load data');
    f1.add(params, 'loadFile').name('Choose Data File');
    f1.add(params, 'load').name('Load');
    var f2 = gui.addFolder('Send data');
    f2.add(params, 'text').name('Your Worker ID:').onFinishChange(function (value) {
        workerId = value;
        alert("Please make sure " + workerId + " is your Worker Id");
    });
    f2.add(params, 'sendJson').name('SendJson');
    f2.add(params, 'sendXML').name('SendXML');
    var f3 = gui.addFolder('Planarity Detection');
    f3.add(params, 'planarity').name('Is Planarity?');
    f3.add(params, 'leftCrossing').name('Left Crossing?');
});