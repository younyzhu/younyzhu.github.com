/**
 * Created by Yongnanzhu on 5/12/2014.
 */

//Global variable for counting the bubble number
var Bubbles = null;
var mainManagement = null;
var graphs = [];
var log = {};
var pathfileNameObj = null;
var WINDOW_WIDTH = window.innerWidth;
var WINDOW_HEIGHT = window.innerHeight;
var loader;
var COLORS = [];
COLORS.push("#e41a1c");
COLORS.push("#377eb8");
COLORS.push("#4daf4a");
COLORS.push("#984ea3");
COLORS.push("#f781bf");
COLORS.push("#8dd347");
COLORS.push("#bedada");
COLORS.push("#fb8072");
COLORS.push("#a65628");
COLORS.push("#ff7f00");
COLORS.push("#fdb462");
COLORS.push("#b3de69");
COLORS.push("#fccde5");
COLORS.push("#0000ff");
COLORS.push("#bc80bd");
COLORS.push("#ccebc5");
COLORS.push("#ff00ff");
COLORS.push("#808000");
var changeLog = [];
var changedLogloader = null;
$(document).ready(function () {
    $.extend({
        getQueryString: function (name) {
            function parseParams() {
                var params = {},
                    e,
                    a = /\+/g,  // Regex for replacing addition symbol with a space
                    r = /([^&=]+)=?([^&]*)/g,
                    d = function (s) {
                        return decodeURIComponent(s.replace(a, " "));
                    },
                    q = window.location.search.substring(1);

                while (e = r.exec(q))
                    params[d(e[1])] = d(e[2]);

                return params;
            }

            if (!this.queryStringParams)
                this.queryStringParams = parseParams();

            return this.queryStringParams[name];
        }
    });
    var status = addStatusElement();
    $("#bubble")[0].appendChild(status);
    function addStatusElement() {
        var e = document.getElementById('status');
        if (e === null) {
            e = document.createElement("div");
            e.id = 'status';
        }
        else
            e.style.display = 'block';
        e.style.position = "absolute";
        e.style.fontWeight = 'bold';
        e.style.top = "50%";
        e.style.fontSize = "1.2em";
        e.style.textAlign = "center";
        e.style.color = "#000";
        e.style.width = "100%";
        e.style.zIndex = 1000;
        e.innerHTML = "Loading ...";
        return e;
    }

    //var str = "./PathwayData/Endogenous sterols.xml";
    //changedLogloader = new JsonLogLoader();      //For animation purpose
    //changedLogloader.load("./changeData/AS.json");
    var selectValue = null;
    var str = "./ReactomHierarchyData/Abacavir transport and metabolism.xml";

    function deleteTmpData(str) {
        $.ajax({
            url: 'deleteTmpFile.php',
            type: "POST",  // type should be POST
            data: {
                name: str
            }, // send the string directly
            dataType: "json",
            success: function (data) {
                console.log(data);
                return true;
            },
            complete: function () {
            },
            error: function (xhr, textStatus, errorThrown) {

                return false;
            }
        });
    }

    loader = new XMLLoader(str);
    loader.load(str);
    var workerId = "";
    if ($.getQueryString('workerId') !== undefined) {
        workerId = $.getQueryString('workerId');
    }
    var startTime = new Date();

    log.screenSize = {width: window.innerWidth, height: window.innerHeight};
    log.startTime = startTime.toLocaleTimeString() + " " + startTime.toLocaleDateString();

    var endTime = 0;
    var elapsedTime = 0;

    var params = {
        loadFile: function () {
            $('#myInput').click();
        },
        //pathwayList: "",
        load: function () {
            var selected_file = $('#myInput').get(0).files[0];
            if (selected_file === undefined /*&& selectValue === null*/) {
                alert("Please select data file!");
            }
            else if (selected_file !== undefined /*&& selectValue === null*/) {
                mainManagement.shapes.length = 0;
                mainManagement.clear();
                var status = addStatusElement();
                $("#bubble")[0].appendChild(status);
                var localFileLoader = new LocalFileLoader();
                str = selected_file.name;
                localFileLoader.load(selected_file);
            }
            /*else if (selected_file === undefined && selectValue !== null) {
             mainManagement.shapes.length = 0;
             mainManagement.clear();
             var status = addStatusElement();
             $("#bubble")[0].appendChild(status);
             var localFileLoader = new XMLLoader(selectValue);

             localFileLoader.load("./ReactomHierarchyData/" + selectValue);
             }*/
        },
        text: workerId,
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
        nodeOverlapping: function () {
            var odetection = new OverlappingDetection(mainManagement.shapes, loader.v);
            var overlappingNum = odetection.findNumberofOverlappint();
            alert(overlappingNum);
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
            log.fileName = str;
            var esdetection = new Detection(mainManagement.shapes, loader.e);
            var endEdgeCrossing = esdetection.findCrossing();
            var nodetection = new OverlappingDetection(mainManagement.shapes, loader.v);
            var endNodeOverlapping = nodetection.findNumberofOverlappint();
            log.NodeOverlapping = { start: loader.startNodeOverlapping, end: endNodeOverlapping, difference: endNodeOverlapping - loader.startNodeOverlapping};
            log.EdgeCrossing = { start: loader.startEdgeCrossing, end: endEdgeCrossing, difference: endEdgeCrossing - loader.startEdgeCrossing};
            log.workId = workerId;
            var objects = mainManagement.shapes;
            var w = WINDOW_WIDTH;
            var h = WINDOW_HEIGHT;
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
                    str: str,
                    logName: workerId + "log.json",
                    log: JSON.stringify(log)
                }, // send the string directly
                dataType: "json",
                success: function (data) {
                    alert("Saved. Thanks!");
                    return true;
                },
                complete: function () {
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert("Sorry, your work can not be saved, Please try it again!");
                    return false;
                }
            });
            deleteTmpData(str);
        },
        download: function () {
            if (workerId === "") {
                alert("Please input your amazon mechnical turk Worker Id.");
                return;
            }
            endTime = new Date();
            log.endTime = endTime.toLocaleTimeString() + " " + endTime.toLocaleDateString();
            elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;
            log.elapsedTime = elapsedTime;
            log.fileName = str;
            var esdetection = new Detection(mainManagement.shapes);
            var endEdgeCrossing = esdetection.findCrossing();
            var nodetection = new OverlappingDetection(mainManagement.shapes, loader.v);
            var endNodeOverlapping = nodetection.findNumberofOverlappint();
            var upwarddetection = new UpwardsDetection(mainManagement.shapes);
            var upward = upwarddetection.findNumberofUpwardsEdges();
            log.NodeOverlapping = { start: loader.startNodeOverlapping, end: endNodeOverlapping, difference: loader.startNodeOverlapping - endNodeOverlapping };
            log.EdgeCrossing = { start: loader.startEdgeCrossing, end: endEdgeCrossing, difference: loader.startEdgeCrossing - endEdgeCrossing};
            log.Upwardarrow = { start: loader.startUpward, end: upward, difference: loader.startUpward - upward};
            log.workId = workerId;
            var results = [ ];
            results.push('<?xml version="1.0" encoding="ISO-8859-1"?>');
            results.push(preElement(false, "Pathway"));
            results.push(preElement(true, "ANodeBlock", " Num='0'"));  //has /
            results.push(preElement(false, "Canvas"));  //has /
            var position = "(";
            position += WINDOW_WIDTH;
            position += ",";
            position += WINDOW_HEIGHT;
            position += ")";
            results.push(element("Size", position));
            results.push(postElement("Canvas"));
            var childrenName = "";
            childrenName += "(";
            for (var i = 0; i < Bubbles.childrenNames.length; ++i) {
                childrenName += Bubbles.childrenNames[i];
                if (i < Bubbles.childrenNames.length - 1)
                    childrenName += ",";
            }
            childrenName += ")";
            results.push(preElement(false, "ChildrenName"));  //has /
            results.push(element("Name", childrenName));
            results.push(postElement("ChildrenName"));

            var compartments = Bubbles.compartments;
            var num = " Num = '";
            num += compartments.length + 1;
            num += "'";
            results.push(preElement(false, "compartmentBlock ", num));  //has /
            //var width = window.innerWidth;
            //var height = window.innerHeight;
            var width = WINDOW_WIDTH;
            var height = WINDOW_HEIGHT;
            var complexLength = 0, entityLength = 0, rnaLength = 0, proteinLength = 0, smallMoleculeLength = 0, dnaLength = 0, reactionLength = 0;
            for (var i = 0; i < compartments.length; ++i) {
                var a = " j = '";
                a += compartments[i].id;
                a += "'";
                results.push(preElement(false, "compartment", a));
                if (compartments[i].type === "M") {
                    var name = compartments[i].text;
                    results.push(element("Name", name));
                    var position = "(";
                    position += compartments[i].x / width;
                    position += ",";
                    position += compartments[i].y / height;
                    position += ",";
                    position += compartments[i].w / width;
                    position += ",";
                    position += compartments[i].h / height;
                    position += ")";
                    results.push(element("Position", position));

                    var contain = "(";
                    var complexs = compartments[i].complexs;
                    complexLength += complexs.length;
                    for (var k = 0; k < complexs.length; ++k) {
                        contain += "C,";
                        contain += complexs[k].id;
                        contain += ",";
                        for (var tt = 0; tt < complexs[k].colors.length; ++tt) {
                            contain += complexs[k].colors[tt];
                            if (tt < complexs[k].colors.length - 1)
                                contain += " ";
                        }
                        contain += ";";
                    }

                    var entitys = compartments[i].entitys;
                    entityLength += entitys.length;
                    for (var k = 0; k < entitys.length; ++k) {
                        contain += "E,";
                        contain += entitys[k].id;
                        contain += ",";
                        for (var tt = 0; tt < entitys[k].colors.length; ++tt) {
                            contain += entitys[k].colors[tt];
                            if (tt < entitys[k].colors.length - 1)
                                contain += " ";
                        }
                        contain += ";";
                    }

                    var dnas = compartments[i].dnas;
                    dnaLength += dnas.length;
                    for (var k = 0; k < dnas.length; ++k) {
                        contain += "D";
                        contain += dnas[k].id;
                        contain += ",";
                        for (var tt = 0; tt < dnas[k].colors.length; ++tt) {
                            contain += dnas[k].colors[tt];
                            if (tt < dnas[k].colors.length - 1)
                                contain += " ";
                        }
                        contain += ";";
                    }

                    var rnas = compartments[i].rnas;
                    rnaLength += rnas.length;
                    for (var k = 0; k < rnas.length; ++k) {
                        contain += "Rna";
                        contain += rnas[k].id;
                        contain += ",";
                        for (var tt = 0; tt < rnas[k].colors.length; ++tt) {
                            contain += rnas[k].colors[tt];
                            if (tt < rnas[k].colors.length - 1)
                                contain += " ";
                        }
                        contain += ";";
                    }

                    var proteins = compartments[i].proteins;
                    proteinLength += proteins.length;
                    for (var k = 0; k < proteins.length; ++k) {
                        contain += "P,";
                        contain += proteins[k].id;
                        contain += ",";
                        for (var tt = 0; tt < proteins[k].colors.length; ++tt) {
                            contain += proteins[k].colors[tt];
                            if (tt < proteins[k].colors.length - 1)
                                contain += " ";
                        }
                        contain += ";";
                    }

                    var molecules = compartments[i].molecules;
                    smallMoleculeLength += molecules.length;
                    for (var k = 0; k < molecules.length; ++k) {
                        contain += "S,";
                        contain += molecules[k].id;
                        contain += ",";
                        for (var tt = 0; tt < molecules[k].colors.length; ++tt) {
                            contain += molecules[k].colors[tt];
                            if (tt < molecules[k].colors.length - 1)
                                contain += " ";
                        }
                        contain += ";";
                    }

                    var associations = compartments[i].associations;
                    reactionLength += associations.length;
                    for (var k = 0; k < associations.length; ++k) {
                        contain += "R,";
                        contain += associations[k].id;
                        contain += ", ";
                        contain += ";";
                    }
                    var dissociations = compartments[i].dissociations;
                    reactionLength += dissociations.length;
                    for (var k = 0; k < dissociations.length; ++k) {
                        contain += "R,";
                        contain += dissociations[k].id;
                        contain += ", ";
                        contain += ";";
                    }

                    var transitions = compartments[i].transitions;
                    reactionLength += transitions.length;
                    for (var k = 0; k < transitions.length; ++k) {
                        contain += "R,";
                        contain += transitions[k].id;
                        contain += ", ";
                        contain += ";";
                    }
                    contain += ")";
                    results.push(element("Contain", contain));
                }
                results.push(postElement("compartment"));
            }
            results.push(postElement("compartmentBlock "));

            var maxid = 0;
            for (var i = 0; i < compartments.length; ++i) {
                for (var j = 0; j < compartments[i].complexs.length; ++j) {
                    maxid = Math.max(maxid, compartments[i].complexs[j].id);
                }
            }
            var num = " Num = '";
            num += maxid + 1;
            num += "'";
            results.push(preElement(false, "complexBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "C") {
                    //var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[i].compartmentId && mainManagement.shapes[j].type === "M") {

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

                            var name = mainManagement.shapes[i].text;
                            results.push(element("Name", name));

                            var position = "(";
                            position += (mainManagement.shapes[i].x + offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y + offsetY) / h;
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

            var maxid = 0;
            for (var i = 0; i < compartments.length; ++i) {
                for (var j = 0; j < compartments[i].entitys.length; ++j) {
                    maxid = Math.max(maxid, compartments[i].entitys[j].id);
                }
            }
            var num = " Num = '";
            num += maxid + 1;
            num += "'";
            results.push(preElement(false, "physicalEntityBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "E") {
                    //var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[i].compartmentId && mainManagement.shapes[j].type === "M") {

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
                            var name = mainManagement.shapes[i].text;
                            results.push(element("Name", name));
                            var position = "(";
                            position += (mainManagement.shapes[i].x + offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y + offsetY) / h;
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

            var maxid = 0;
            for (var i = 0; i < compartments.length; ++i) {
                for (var j = 0; j < compartments[i].proteins.length; ++j) {
                    maxid = Math.max(maxid, compartments[i].proteins[j].id);
                }
            }
            var num = " Num = '";
            num += maxid + 1;
            num += "'";
            results.push(preElement(false, "proteinBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "P") {
                    //var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[i].compartmentId && mainManagement.shapes[j].type === "M") {

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
                            position += (mainManagement.shapes[i].x + offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y + offsetY) / h;
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

            var maxid = 0;
            for (var i = 0; i < compartments.length; ++i) {
                for (var j = 0; j < compartments[i].dnas.length; ++j) {
                    maxid = Math.max(maxid, compartments[i].dnas[j].id);
                }
            }
            var num = " Num = '";
            num += maxid + 1;
            num += "'";
            results.push(preElement(false, "DnaBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "D") {
                    //var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[i].compartmentId && mainManagement.shapes[j].type === "M") {

                            var childOffsetx = mainManagement.shapes[j].childOffsetx;
                            var childOffsety = mainManagement.shapes[j].childOffsety;
                            var offsetX = childOffsetx - mainManagement.shapes[j].x;
                            var offsetY = childOffsety - mainManagement.shapes[j].y;

                            var w = mainManagement.shapes[j].w;
                            var h = mainManagement.shapes[j].h;
                            var a = " j = '";
                            a += mainManagement.shapes[i].id;
                            a += "'";
                            results.push(preElement(false, "dna ", a));
                            var name = mainManagement.shapes[i].text;
                            results.push(element("Name", name));
                            var position = "(";
                            position += (mainManagement.shapes[i].x + offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y + offsetY) / h;
                            position += ",";
                            position += mainManagement.shapes[i].w / w;
                            position += ",";
                            position += mainManagement.shapes[i].h / h;
                            position += ")";
                            results.push(element("Position", position));
                            results.push(postElement("dna "));
                        }
                    }
                }
            }
            results.push(postElement("DnaBlock"));

            var maxid = 0;
            for (var i = 0; i < compartments.length; ++i) {
                for (var j = 0; j < compartments[i].rnas.length; ++j) {
                    maxid = Math.max(maxid, compartments[i].rnas[j].id);
                }
            }
            var num = " Num = '";
            num += maxid + 1;
            num += "'";
            results.push(preElement(false, "RnaBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "Rna") {
                    //var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[i].compartmentId && mainManagement.shapes[j].type === "M") {

                            var childOffsetx = mainManagement.shapes[j].childOffsetx;
                            var childOffsety = mainManagement.shapes[j].childOffsety;
                            var offsetX = childOffsetx - mainManagement.shapes[j].x;
                            var offsetY = childOffsety - mainManagement.shapes[j].y;

                            var w = mainManagement.shapes[j].w;
                            var h = mainManagement.shapes[j].h;
                            var a = " j = '";
                            a += mainManagement.shapes[i].id;
                            a += "'";
                            results.push(preElement(false, "rna ", a));
                            var name = mainManagement.shapes[i].text;
                            results.push(element("Name", name));
                            var position = "(";
                            position += (mainManagement.shapes[i].x + offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y + offsetY) / h;
                            position += ",";
                            position += mainManagement.shapes[i].w / w;
                            position += ",";
                            position += mainManagement.shapes[i].h / h;
                            position += ")";
                            results.push(element("Position", position));
                            results.push(postElement("rna "));
                        }
                    }
                }
            }
            results.push(postElement("RnaBlock"));

            var maxid = 0;
            for (var i = 0; i < compartments.length; ++i) {
                for (var j = 0; j < compartments[i].molecules.length; ++j) {
                    maxid = Math.max(maxid, compartments[i].molecules[j].id);
                }
            }
            var num = " Num = '";
            num += maxid + 1;
            num += "'";
            results.push(preElement(false, "smallMoleculeBlock ", num));
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "S") {
                    //var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[i].compartmentId && mainManagement.shapes[j].type === "M") {
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
                            position += (mainManagement.shapes[i].x + offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y + offsetY) / h;
                            position += ",";
                            position += mainManagement.shapes[i].w / w;
                            position += ",";
                            position += mainManagement.shapes[i].h / h;
                            position += ")";
                            results.push(element("Position", position));
                            results.push(postElement("smallMolecule "));
                            var duplicateMolecules = "(";
                            if (mainManagement.shapes[i].duplicates.length > 1) {
                                for (var ks = 0; ks < mainManagement.shapes[i].duplicates.length; ++ks) {
                                    duplicateMolecules += mainManagement.shapes[i].duplicates[ks];
                                    if (ks < mainManagement.shapes[i].duplicates.length - 1)
                                        duplicateMolecules += ",";
                                }
                            }
                            duplicateMolecules += ")";
                            results.push(element("DuplicateMolecules", duplicateMolecules));
                        }
                    }
                }
            }
            results.push(postElement("smallMoleculeBlock "));

            var num = " Num = '";
            num += reactionLength + 1;
            num += "'";
            results.push(preElement(false, "reactionBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "T" || mainManagement.shapes[i].type === "B" || mainManagement.shapes[i].type === "K") {
                    //var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[i].compartmentId && mainManagement.shapes[j].type === "M") {
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
                            position += (mainManagement.shapes[i].x + offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y + offsetY) / h;
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
            edgeLength += Bubbles.activations.length;
            edgeLength += Bubbles.arrows.length;
            edgeLength += Bubbles.inhibitions.length;

            var num = " Num = '";
            num += edgeLength;
            num += "'";
            results.push(preElement(false, "edgeBlock ", num));  //has /
            for (var i = 0; i < Bubbles.activations.length; ++i) {

                var a = " j = '";
                a += Bubbles.activations[i].id;
                a += "'";
                results.push(preElement(false, "edge ", a));
                var name = Bubbles.activations[i].type;
                results.push(element("Name", name));

                var ends = "(";
                if (Bubbles.activations[i].beginNode.type === "T" || Bubbles.activations[i].beginNode.type === "B" || Bubbles.activations[i].beginNode.type === "K")
                    ends += "R";
                else
                    ends += Bubbles.activations[i].beginNode.type;
                ends += ", ";
                ends += Bubbles.activations[i].beginNode.id;
                ends += ", ";
                if (Bubbles.activations[i].endNode.type === "T" || Bubbles.activations[i].endNode.type === "B" || Bubbles.activations[i].endNode.type === "K")
                    ends += "R";
                else
                    ends += Bubbles.activations[i].endNode.type;
                ends += ", ";
                ends += Bubbles.activations[i].endNode.id;
                ends += ")";

                results.push(element("Ends", ends));
                results.push(postElement("edge "));
            }
            for (var i = 0; i < Bubbles.arrows.length; ++i) {

                var a = " j = '";
                a += Bubbles.arrows[i].id;
                a += "'";
                results.push(preElement(false, "edge ", a));
                var name = Bubbles.arrows[i].type;
                results.push(element("Name", name));

                var ends = "(";
                if (Bubbles.arrows[i].beginNode.type === "T" || Bubbles.arrows[i].beginNode.type === "B" || Bubbles.arrows[i].beginNode.type === "K")
                    ends += "R";
                else
                    ends += Bubbles.arrows[i].beginNode.type;
                ends += ", ";
                ends += Bubbles.arrows[i].beginNode.id;
                ends += ", ";
                if (Bubbles.arrows[i].endNode.type === "T" || Bubbles.arrows[i].endNode.type === "B" || Bubbles.arrows[i].endNode.type === "K")
                    ends += "R";
                else
                    ends += Bubbles.arrows[i].endNode.type;
                ends += ", ";
                ends += Bubbles.arrows[i].endNode.id;
                ends += ")";

                results.push(element("Ends", ends));
                results.push(postElement("edge "));
            }

            for (var i = 0; i < Bubbles.inhibitions.length; ++i) {

                var a = " j = '";
                a += Bubbles.inhibitions[i].id;
                a += "'";
                results.push(preElement(false, "edge ", a));
                var name = Bubbles.inhibitions[i].type;
                results.push(element("Name", name));

                var ends = "(";
                if (Bubbles.inhibitions[i].beginNode.type === "T" || Bubbles.inhibitions[i].beginNode.type === "B" || Bubbles.inhibitions[i].beginNode.type === "K")
                    ends += "R";
                else
                    ends += Bubbles.inhibitions[i].beginNode.type;
                ends += ", ";
                ends += Bubbles.inhibitions[i].beginNode.id;
                ends += ", ";
                if (Bubbles.inhibitions[i].endNode.type === "T" || Bubbles.inhibitions[i].endNode.type === "B" || Bubbles.inhibitions[i].endNode.type === "K")
                    ends += "R";
                else
                    ends += Bubbles.inhibitions[i].endNode.type;
                ends += ", ";
                ends += Bubbles.inhibitions[i].endNode.id;
                ends += ")";

                results.push(element("Ends", ends));
                results.push(postElement("edge "));
            }
            results.push(postElement("edgeBlock "));
            results.push(postElement("Pathway"));

            var dt = new Date();
            var time = dt.toLocaleTimeString();
            var year = dt.getFullYear();
            var month = dt.getMonth() + 1;
            var date = dt.getDate();
            time = time.replace(/[:]+/g, ' ');
            time = time + " " + date + " " + month + " " + year;
            if (str.lastIndexOf('/') !== -1)
                str = str.substring(str.lastIndexOf('/') + 1);
            if (str.lastIndexOf('.') !== -1)
                str = str.substr(0, str.lastIndexOf('.'));

            var end_result = results.join(' ');
            download(end_result, str, "text/xml");
            $.ajax({
                url: 'xml.php',
                type: "POST",  // type should be POST
                data: {
                    changeLog: JSON.stringify(changeLog),
                    xml: end_result,
                    name: str + "_" + workerId + "_" + time + ".xml",
                    str: str,
                    logName: str + "_" + workerId + "_" + time + ".json",
                    log: JSON.stringify(log)
                }, // send the string directly
                dataType: "text",
                success: function (data) {
                    alert("Saved. Thanks!");
                    return true;
                },
                complete: function () {
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert("Sorry, your work can not be saved, Please try it again!");
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
            log.fileName = str;
            var esdetection = new Detection(mainManagement.shapes);
            var endEdgeCrossing = esdetection.findCrossing();
            var nodetection = new OverlappingDetection(mainManagement.shapes, loader.v);
            var endNodeOverlapping = nodetection.findNumberofOverlappint();
            var upwarddetection = new UpwardsDetection(mainManagement.shapes);
            var upward = upwarddetection.findNumberofUpwardsEdges();
            log.NodeOverlapping = { start: loader.startNodeOverlapping, end: endNodeOverlapping, difference: loader.startNodeOverlapping - endNodeOverlapping };
            log.EdgeCrossing = { start: loader.startEdgeCrossing, end: endEdgeCrossing, difference: loader.startEdgeCrossing - endEdgeCrossing};
            log.Upwardarrow = { start: loader.startUpward, end: upward, difference: loader.startUpward - upward};
            log.workId = workerId;
            var results = [ ];
            results.push('<?xml version="1.0" encoding="ISO-8859-1"?>');
            results.push(preElement(false, "Pathway"));
            results.push(preElement(true, "ANodeBlock", " Num='0'"));  //has /
            results.push(preElement(false, "Canvas"));  //has /
            var position = "(";
            position += WINDOW_WIDTH;
            position += ",";
            position += WINDOW_HEIGHT;
            position += ")";
            results.push(element("Size", position));
            results.push(postElement("Canvas"));
            var childrenName = "";
            childrenName += "(";
            for (var i = 0; i < Bubbles.childrenNames.length; ++i) {
                childrenName += Bubbles.childrenNames[i];
                if (i < Bubbles.childrenNames.length - 1)
                    childrenName += ",";
            }
            childrenName += ")";
            results.push(preElement(false, "ChildrenName"));  //has /
            results.push(element("Name", childrenName));
            results.push(postElement("ChildrenName"));

            var compartments = Bubbles.compartments;
            var num = " Num = '";
            num += compartments.length + 1;
            num += "'";
            results.push(preElement(false, "compartmentBlock ", num));  //has /
            //var width = window.innerWidth;
            //var height = window.innerHeight;
            var width = WINDOW_WIDTH;
            var height = WINDOW_HEIGHT;
            var complexLength = 0, entityLength = 0, rnaLength = 0, proteinLength = 0, smallMoleculeLength = 0, dnaLength = 0, reactionLength = 0;
            for (var i = 0; i < compartments.length; ++i) {
                var a = " j = '";
                a += compartments[i].id;
                a += "'";
                results.push(preElement(false, "compartment", a));
                if (compartments[i].type === "M") {
                    var name = compartments[i].text;
                    results.push(element("Name", name));
                    var position = "(";
                    position += compartments[i].x / width;
                    position += ",";
                    position += compartments[i].y / height;
                    position += ",";
                    position += compartments[i].w / width;
                    position += ",";
                    position += compartments[i].h / height;
                    position += ")";
                    results.push(element("Position", position));

                    var contain = "(";
                    var complexs = compartments[i].complexs;
                    complexLength += complexs.length;
                    for (var k = 0; k < complexs.length; ++k) {
                        contain += "C,";
                        contain += complexs[k].id;
                        contain += ",";
                        for (var tt = 0; tt < complexs[k].colors.length; ++tt) {
                            contain += complexs[k].colors[tt];
                            if (tt < complexs[k].colors.length - 1)
                                contain += " ";
                        }
                        contain += ";";
                    }

                    var entitys = compartments[i].entitys;
                    entityLength += entitys.length;
                    for (var k = 0; k < entitys.length; ++k) {
                        contain += "E,";
                        contain += entitys[k].id;
                        contain += ",";
                        for (var tt = 0; tt < entitys[k].colors.length; ++tt) {
                            contain += entitys[k].colors[tt];
                            if (tt < entitys[k].colors.length - 1)
                                contain += " ";
                        }
                        contain += ";";
                    }

                    var dnas = compartments[i].dnas;
                    dnaLength += dnas.length;
                    for (var k = 0; k < dnas.length; ++k) {
                        contain += "D";
                        contain += dnas[k].id;
                        contain += ",";
                        for (var tt = 0; tt < dnas[k].colors.length; ++tt) {
                            contain += dnas[k].colors[tt];
                            if (tt < dnas[k].colors.length - 1)
                                contain += " ";
                        }
                        contain += ";";
                    }

                    var rnas = compartments[i].rnas;
                    rnaLength += rnas.length;
                    for (var k = 0; k < rnas.length; ++k) {
                        contain += "Rna";
                        contain += rnas[k].id;
                        contain += ",";
                        for (var tt = 0; tt < rnas[k].colors.length; ++tt) {
                            contain += rnas[k].colors[tt];
                            if (tt < rnas[k].colors.length - 1)
                                contain += " ";
                        }
                        contain += ";";
                    }

                    var proteins = compartments[i].proteins;
                    proteinLength += proteins.length;
                    for (var k = 0; k < proteins.length; ++k) {
                        contain += "P,";
                        contain += proteins[k].id;
                        contain += ",";
                        for (var tt = 0; tt < proteins[k].colors.length; ++tt) {
                            contain += proteins[k].colors[tt];
                            if (tt < proteins[k].colors.length - 1)
                                contain += " ";
                        }
                        contain += ";";
                    }

                    var molecules = compartments[i].molecules;
                    smallMoleculeLength += molecules.length;
                    for (var k = 0; k < molecules.length; ++k) {
                        contain += "S,";
                        contain += molecules[k].id;
                        contain += ",";
                        for (var tt = 0; tt < molecules[k].colors.length; ++tt) {
                            contain += molecules[k].colors[tt];
                            if (tt < molecules[k].colors.length - 1)
                                contain += " ";
                        }
                        contain += ";";
                    }

                    var associations = compartments[i].associations;
                    reactionLength += associations.length;
                    for (var k = 0; k < associations.length; ++k) {
                        contain += "R,";
                        contain += associations[k].id;
                        contain += ", ";
                        contain += ";";
                    }
                    var dissociations = compartments[i].dissociations;
                    reactionLength += dissociations.length;
                    for (var k = 0; k < dissociations.length; ++k) {
                        contain += "R,";
                        contain += dissociations[k].id;
                        contain += ", ";
                        contain += ";";
                    }

                    var transitions = compartments[i].transitions;
                    reactionLength += transitions.length;
                    for (var k = 0; k < transitions.length; ++k) {
                        contain += "R,";
                        contain += transitions[k].id;
                        contain += ", ";
                        contain += ";";
                    }
                    contain += ")";
                    results.push(element("Contain", contain));
                }
                results.push(postElement("compartment"));
            }
            results.push(postElement("compartmentBlock "));

            var maxid = 0;
            for (var i = 0; i < compartments.length; ++i) {
                for (var j = 0; j < compartments[i].complexs.length; ++j) {
                    maxid = Math.max(maxid, compartments[i].complexs[j].id);
                }
            }
            var num = " Num = '";
            num += maxid + 1;
            num += "'";
            results.push(preElement(false, "complexBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "C") {
                    //var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[i].compartmentId && mainManagement.shapes[j].type === "M") {

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

                            var name = mainManagement.shapes[i].text;
                            results.push(element("Name", name));

                            var position = "(";
                            position += (mainManagement.shapes[i].x + offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y + offsetY) / h;
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

            var maxid = 0;
            for (var i = 0; i < compartments.length; ++i) {
                for (var j = 0; j < compartments[i].entitys.length; ++j) {
                    maxid = Math.max(maxid, compartments[i].entitys[j].id);
                }
            }
            var num = " Num = '";
            num += maxid + 1;
            num += "'";
            results.push(preElement(false, "physicalEntityBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "E") {
                    //var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[i].compartmentId && mainManagement.shapes[j].type === "M") {

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
                            var name = mainManagement.shapes[i].text;
                            results.push(element("Name", name));
                            var position = "(";
                            position += (mainManagement.shapes[i].x + offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y + offsetY) / h;
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

            var maxid = 0;
            for (var i = 0; i < compartments.length; ++i) {
                for (var j = 0; j < compartments[i].proteins.length; ++j) {
                    maxid = Math.max(maxid, compartments[i].proteins[j].id);
                }
            }
            var num = " Num = '";
            num += maxid + 1;
            num += "'";
            results.push(preElement(false, "proteinBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "P") {
                    //var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[i].compartmentId && mainManagement.shapes[j].type === "M") {

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
                            position += (mainManagement.shapes[i].x + offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y + offsetY) / h;
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

            var maxid = 0;
            for (var i = 0; i < compartments.length; ++i) {
                for (var j = 0; j < compartments[i].dnas.length; ++j) {
                    maxid = Math.max(maxid, compartments[i].dnas[j].id);
                }
            }
            var num = " Num = '";
            num += maxid + 1;
            num += "'";
            results.push(preElement(false, "DnaBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "D") {
                    //var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[i].compartmentId && mainManagement.shapes[j].type === "M") {

                            var childOffsetx = mainManagement.shapes[j].childOffsetx;
                            var childOffsety = mainManagement.shapes[j].childOffsety;
                            var offsetX = childOffsetx - mainManagement.shapes[j].x;
                            var offsetY = childOffsety - mainManagement.shapes[j].y;

                            var w = mainManagement.shapes[j].w;
                            var h = mainManagement.shapes[j].h;
                            var a = " j = '";
                            a += mainManagement.shapes[i].id;
                            a += "'";
                            results.push(preElement(false, "dna ", a));
                            var name = mainManagement.shapes[i].text;
                            results.push(element("Name", name));
                            var position = "(";
                            position += (mainManagement.shapes[i].x + offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y + offsetY) / h;
                            position += ",";
                            position += mainManagement.shapes[i].w / w;
                            position += ",";
                            position += mainManagement.shapes[i].h / h;
                            position += ")";
                            results.push(element("Position", position));
                            results.push(postElement("dna "));
                        }
                    }
                }
            }
            results.push(postElement("DnaBlock"));

            var maxid = 0;
            for (var i = 0; i < compartments.length; ++i) {
                for (var j = 0; j < compartments[i].rnas.length; ++j) {
                    maxid = Math.max(maxid, compartments[i].rnas[j].id);
                }
            }
            var num = " Num = '";
            num += maxid + 1;
            num += "'";
            results.push(preElement(false, "RnaBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "Rna") {
                    //var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[i].compartmentId && mainManagement.shapes[j].type === "M") {

                            var childOffsetx = mainManagement.shapes[j].childOffsetx;
                            var childOffsety = mainManagement.shapes[j].childOffsety;
                            var offsetX = childOffsetx - mainManagement.shapes[j].x;
                            var offsetY = childOffsety - mainManagement.shapes[j].y;

                            var w = mainManagement.shapes[j].w;
                            var h = mainManagement.shapes[j].h;
                            var a = " j = '";
                            a += mainManagement.shapes[i].id;
                            a += "'";
                            results.push(preElement(false, "rna ", a));
                            var name = mainManagement.shapes[i].text;
                            results.push(element("Name", name));
                            var position = "(";
                            position += (mainManagement.shapes[i].x + offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y + offsetY) / h;
                            position += ",";
                            position += mainManagement.shapes[i].w / w;
                            position += ",";
                            position += mainManagement.shapes[i].h / h;
                            position += ")";
                            results.push(element("Position", position));
                            results.push(postElement("rna "));
                        }
                    }
                }
            }
            results.push(postElement("RnaBlock"));

            var maxid = 0;
            for (var i = 0; i < compartments.length; ++i) {
                for (var j = 0; j < compartments[i].molecules.length; ++j) {
                    maxid = Math.max(maxid, compartments[i].molecules[j].id);
                }
            }
            var num = " Num = '";
            num += maxid + 1;
            num += "'";
            results.push(preElement(false, "smallMoleculeBlock ", num));
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "S") {
                    //var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[i].compartmentId && mainManagement.shapes[j].type === "M") {
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
                            position += (mainManagement.shapes[i].x + offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y + offsetY) / h;
                            position += ",";
                            position += mainManagement.shapes[i].w / w;
                            position += ",";
                            position += mainManagement.shapes[i].h / h;
                            position += ")";
                            results.push(element("Position", position));
                            results.push(postElement("smallMolecule "));
                            var duplicateMolecules = "(";
                            if (mainManagement.shapes[i].duplicates.length > 1) {
                                for (var ks = 0; ks < mainManagement.shapes[i].duplicates.length; ++ks) {
                                    duplicateMolecules += mainManagement.shapes[i].duplicates[ks];
                                    if (ks < mainManagement.shapes[i].duplicates.length - 1)
                                        duplicateMolecules += ",";
                                }
                            }
                            duplicateMolecules += ")";
                            results.push(element("DuplicateMolecules", duplicateMolecules));
                        }
                    }
                }
            }
            results.push(postElement("smallMoleculeBlock "));

            var num = " Num = '";
            num += reactionLength + 1;
            num += "'";
            results.push(preElement(false, "reactionBlock ", num));  //has /
            for (var i = 0; i < mainManagement.shapes.length; ++i) {
                if (mainManagement.shapes[i].type === "T" || mainManagement.shapes[i].type === "B" || mainManagement.shapes[i].type === "K") {
                    //var graphId = mainManagement.shapes[i].graphId;
                    for (var j = 0; j < mainManagement.shapes.length; ++j) {
                        if (mainManagement.shapes[j].id === mainManagement.shapes[i].compartmentId && mainManagement.shapes[j].type === "M") {
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
                            position += (mainManagement.shapes[i].x + offsetX) / w;
                            position += ",";
                            position += (mainManagement.shapes[i].y + offsetY) / h;
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
            edgeLength += Bubbles.activations.length;
            edgeLength += Bubbles.arrows.length;
            edgeLength += Bubbles.inhibitions.length;

            var num = " Num = '";
            num += edgeLength;
            num += "'";
            results.push(preElement(false, "edgeBlock ", num));  //has /
            for (var i = 0; i < Bubbles.activations.length; ++i) {

                var a = " j = '";
                a += Bubbles.activations[i].id;
                a += "'";
                results.push(preElement(false, "edge ", a));
                var name = Bubbles.activations[i].type;
                results.push(element("Name", name));

                var ends = "(";
                if (Bubbles.activations[i].beginNode.type === "T" || Bubbles.activations[i].beginNode.type === "B" || Bubbles.activations[i].beginNode.type === "K")
                    ends += "R";
                else
                    ends += Bubbles.activations[i].beginNode.type;
                ends += ", ";
                ends += Bubbles.activations[i].beginNode.id;
                ends += ", ";
                if (Bubbles.activations[i].endNode.type === "T" || Bubbles.activations[i].endNode.type === "B" || Bubbles.activations[i].endNode.type === "K")
                    ends += "R";
                else
                    ends += Bubbles.activations[i].endNode.type;
                ends += ", ";
                ends += Bubbles.activations[i].endNode.id;
                ends += ")";

                results.push(element("Ends", ends));
                results.push(postElement("edge "));
            }
            for (var i = 0; i < Bubbles.arrows.length; ++i) {

                var a = " j = '";
                a += Bubbles.arrows[i].id;
                a += "'";
                results.push(preElement(false, "edge ", a));
                var name = Bubbles.arrows[i].type;
                results.push(element("Name", name));

                var ends = "(";
                if (Bubbles.arrows[i].beginNode.type === "T" || Bubbles.arrows[i].beginNode.type === "B" || Bubbles.arrows[i].beginNode.type === "K")
                    ends += "R";
                else
                    ends += Bubbles.arrows[i].beginNode.type;
                ends += ", ";
                ends += Bubbles.arrows[i].beginNode.id;
                ends += ", ";
                if (Bubbles.arrows[i].endNode.type === "T" || Bubbles.arrows[i].endNode.type === "B" || Bubbles.arrows[i].endNode.type === "K")
                    ends += "R";
                else
                    ends += Bubbles.arrows[i].endNode.type;
                ends += ", ";
                ends += Bubbles.arrows[i].endNode.id;
                ends += ")";

                results.push(element("Ends", ends));
                results.push(postElement("edge "));
            }

            for (var i = 0; i < Bubbles.inhibitions.length; ++i) {

                var a = " j = '";
                a += Bubbles.inhibitions[i].id;
                a += "'";
                results.push(preElement(false, "edge ", a));
                var name = Bubbles.inhibitions[i].type;
                results.push(element("Name", name));

                var ends = "(";
                if (Bubbles.inhibitions[i].beginNode.type === "T" || Bubbles.inhibitions[i].beginNode.type === "B" || Bubbles.inhibitions[i].beginNode.type === "K")
                    ends += "R";
                else
                    ends += Bubbles.inhibitions[i].beginNode.type;
                ends += ", ";
                ends += Bubbles.inhibitions[i].beginNode.id;
                ends += ", ";
                if (Bubbles.inhibitions[i].endNode.type === "T" || Bubbles.inhibitions[i].endNode.type === "B" || Bubbles.inhibitions[i].endNode.type === "K")
                    ends += "R";
                else
                    ends += Bubbles.inhibitions[i].endNode.type;
                ends += ", ";
                ends += Bubbles.inhibitions[i].endNode.id;
                ends += ")";

                results.push(element("Ends", ends));
                results.push(postElement("edge "));
            }

            results.push(postElement("edgeBlock "));
            results.push(postElement("Pathway"));
            var end_result = results.join(' ');
            var dt = new Date();
            var time = dt.toLocaleTimeString();
            var year = dt.getFullYear();
            var month = dt.getMonth() + 1;
            var date = dt.getDate();
            time = time.replace(/[:]+/g, ' ');
            time = time + " " + date + " " + month + " " + year;
            if (str.lastIndexOf('/') !== -1)
                str = str.substring(str.lastIndexOf('/') + 1);
            if (str.lastIndexOf('.') !== -1)
                str = str.substr(0, str.lastIndexOf('.'));
            $.ajax({
                url: 'xml.php',
                type: "POST",  // type should be POST
                data: {
                    changeLog: JSON.stringify(changeLog),
                    xml: end_result,
                    name: str + "_" + workerId + "_" + time + ".xml",
                    str: str,
                    logName: str + "_" + workerId + "_" + time + ".json",
                    log: JSON.stringify(log)
                }, // send the string directly
                dataType: "text",
                success: function (data) {
                    alert("Saved. Thanks!");
                    return true;
                },
                complete: function () {
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert("Sorry, your work can not be saved, Please try it again!");
                    return false;
                }
            });
            deleteTmpData(str);
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

    //var gui = new dat.GUI();
    var gui = new dat.GUI();
    //gui.add(params, 'stop').name('Stop Force layout');

    var f1 = gui.addFolder('Load data');
    f1.add(params, 'loadFile').name('Choose Data File');
    f1.add(params, 'load').name('Load');
    // Choose from accepted values
    gui.add(params, 'text').name('Your Student ID:').listen().onFinishChange(function (value) {
        if (value !== "" && confirm('Is" ' + value + ' "your student id?') === true) {
            workerId = value;
        } else {
            params.text = "";
        }
    });

    gui.add(params, 'download').name('Download'); //use xml or json its OK
    gui.add(params, 'sendXML').name('Send'); //use xml or json its OK

    $.ajax({
        type: "GET",
        url: "Metabolism.xml",
        dataType: "text",

        success: function (xml) {
            if (typeof xml === 'string' || xml instanceof String) {
                var setting = {callback: {
                    onClick: onClick
                }};
                var $doc = $.parseXML(xml);
                var zNodes = [];
                var temp =[]
                $($doc).find('Pathways').children('Pathway').each(function () {//homo sapiens =====>   Metabolism[**Level1**]
                    $(this).children('Pathway').each(function () {            //homo sapiens =====>   Metabolism[**Level1**] ====>  [**Level2**]
                        var objName = $(this).attr('displayName');
                        objName = objName.replace(/[()<>:,&.'"\/\\|?*]+/g, '');
                        var children = $(this).children('Pathway');

                        var level1 = {};
                        level1.name = objName;
                        if (children.length > 0) {
                            level1.children = [];
                        }
                        $(this).children('Pathway').each(function () {            //homo sapiens =====>   Metabolism[**Level1**] ====>  [**Level2**] ====>  [**Level3**]
                            var objName = $(this).attr('displayName');
                            objName = objName.replace(/[()<>:,&.'"\/\\|?*]+/g, '');
                            var children = $(this).children('Pathway');

                            var level2 = {};
                            level2.name = objName;
                            if (children.length > 0) {
                                level2.children = [];
                            }
                            $(this).children('Pathway').each(function () {            //homo sapiens =====>   Metabolism[**Level1**] ====>  [**Level2**] ====>  [**Level3**] ====>  [**Level4**]
                                var objName = $(this).attr('displayName');
                                objName = objName.replace(/[()<>:,&.'"\/\\|?*]+/g, '');
                                var children = $(this).children('Pathway');
                                var level3 = {};
                                level3.name = objName;
                                if (children.length > 0) {
                                    level3.children = [];
                                }
                                $(this).children('Pathway').each(function () {            //homo sapiens =====>   Metabolism[**Level1**] ====>  [**Level2**] ====>  [**Level3**] ====>  [**Level4**] ====>  [**Level5**]
                                    var objName = $(this).attr('displayName');
                                    objName = objName.replace(/[()<>:,&.'"\/\\|?*]+/g, '');
                                    var children = $(this).children('Pathway');
                                    var level4 = {};
                                    level4.name = objName;
                                    if (children.length > 0) {
                                        level4.children = [];
                                    }
                                    $(this).children('Pathway').each(function () {       //homo sapiens =====>   Metabolism[**Level1**] ====>  [**Level2**] ====>  [**Level3**] ====>  [**Level4**] ====>  [**Level5**]====>  [**Level6**]
                                        var objName = $(this).attr('displayName');
                                        objName = objName.replace(/[()<>:,&.'"\/\\|?*]+/g, '');
                                        var level5 = {};
                                        level5.name = objName;
                                        temp.push(level5);
                                        level4.children.push(level5);
                                    });
                                    temp.push(level4);
                                    level3.children.push(level4);
                                });
                                temp.push(level3);
                                level2.children.push(level3);
                            });
                            temp.push(level2);
                            level1.children.push(level2);
                        });
                        temp.push(level1);
                        zNodes.push(level1);
                    });
                });
                $.ajax({
                    type: "GET",
                    url: "getXmlFileName.php",
                    success: function (result) {
                        if (!( result instanceof Array)) {
                            result = JSON.parse(result);
                        }
                        if (result instanceof Array) {
                           for(var i=0;i<temp.length; ++i)
                           {
                               for(var j=0; j<result.length; ++j)
                               {
                                   if((temp[i].name +".xml")=== result[j])
                                   {
                                      break;
                                   }
                               }
                               if(j>=result.length)
                               {
                                   temp[i].name = "(NA)" + temp[i].name;
                               }
                           }
                        }
                        $("#expandAllBtn").bind("click", {type: "expandAll"}, expandNode);
                        $("#collapseAllBtn").bind("click", {type: "collapseAll"}, expandNode);
                        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                    }
                });
                function onClick(event, treeId, treeNode, clickFlag) {
                    mainManagement.shapes.length = 0;
                    mainManagement.clear();
                    var status = addStatusElement();
                    $("#bubble")[0].appendChild(status);
                    var localFileLoader = new XMLLoader(treeNode.name);
                    str = treeNode.name;
                    localFileLoader.load("./ReactomHierarchyData/" + treeNode.name + ".xml");
                }


            }
        }
    });
    function expandNode(e) {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
            type = e.data.type,
            nodes = zTree.getSelectedNodes();
        if (type.indexOf("All") < 0 && nodes.length == 0) {
            alert("Please select one parent node at first...");
        }

        if (type == "expandAll") {
            zTree.expandAll(true);
        } else if (type == "collapseAll") {
            zTree.expandAll(false);
        }
        /*else {
         var callbackFlag = $("#callbackTrigger").attr("checked");
         for (var i = 0, l = nodes.length; i < l; i++) {
         zTree.setting.view.fontCss = {};
         if (type == "expand") {
         zTree.expandNode(nodes[i], true, null, null, callbackFlag);
         } else if (type == "collapse") {
         zTree.expandNode(nodes[i], false, null, null, callbackFlag);
         } else if (type == "toggle") {
         zTree.expandNode(nodes[i], null, null, null, callbackFlag);
         } else if (type == "expandSon") {
         zTree.expandNode(nodes[i], true, true, null, callbackFlag);
         } else if (type == "collapseSon") {
         zTree.expandNode(nodes[i], false, true, null, callbackFlag);
         }
         }
         } */
    }
});
var mouse_position;
var animating = false;
$(document).mousemove(function (e) {
    if (animating) {
        return;
    }
    mouse_position = e.clientX;

    if (mouse_position <= 200) {
        //SLIDE IN MENU
        animating = true;
        $('#panel').animate({
            left: 0,
            opacity: 1
        }, 100, function () {
            animating = false;
        });

    } else if (mouse_position > 200) {
        animating = true;
        $('#panel').animate({
            left: -300,
            opacity: 0
        }, 100, function () {
            animating = false;
        });
    }
});