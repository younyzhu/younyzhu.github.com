/**
 * Created by Yongnanzhu on 5/12/2014.
 */

//Global variable for counting the bubble number
var Bubbles = null;
var mainManagement = null;
var log = {};
$(document).ready(function () {
    THREEx.FullScreen.bindKey({ charCode: 'f'.charCodeAt(0) });
    //var str = "./data/Apoptosis induced DNA fragmentation_new.xml";
    var str = "./data/SMAD23 Phosphorylation Motif Mutants in Cancer_26_new.json";
    var check = new Check();
    var format = check.checkFileFormat(str);
    var v, e;
    var loader;
    if(format === "XML")
    {
        loader = new XMLLoader();
        loader.load(str);
    }
    else if(format === "JSON")
    {
        loader = new JsonLoader();
        loader.load(str);
    }

    var workerId ="";
    var startTime = new Date();
    log.screenSize = {width: window.innerWidth, height: window.innerHeight};
    log.startTime = startTime.toLocaleTimeString() + " " + startTime.toLocaleDateString();

    var endTime=0;
    var elapsedTime=0;
    var params = {
        loadFile: function () {
            $('#myInput').click();
        },
        load: function () {
            var selected_file = $('#myInput').get(0).files[0];
            if (selected_file === null) {
                alert("Please select data file!");
            }
            else {
                mainManagement.shapes.length = 0;
                mainManagement.clear();
                var localFileLoader = new LocalFileLoader();
                localFileLoader.load(selected_file);
            }
        },
        text: "",
        planarity: function() {
            if(loader.v >3)
                if(loader.e <= 3* loader.v - 6)
                {
                    alert("This is a planner graph!");
                }
                else
                {
                    alert("This is a non-planner graph!");
                }
        },
        leftCrossing: function(){

            var detection = new Detection(mainManagement.shapes, loader.e);
            var crossingNum = detection.findCrossing();
            alert(crossingNum);
        },
        send: function () {
            if(workerId === "")
            {
                alert("Please input your amazon mechnical turk Worker Id.");
                return;
            }
            endTime = new Date();
            log.endTime = endTime.toLocaleTimeString() + " " + endTime.toLocaleDateString();
            elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;
            log.elapsedTime = elapsedTime;

            var objects = mainManagement.shapes;
            var jsonData = [];
            var groupId =0;
            var width = window.innerWidth;
            var height = window.innerHeight;
            var w = mainManagement.shapes[0].w;
            var h = mainManagement.shapes[0].h;
            var Data = {};
            Data.compartments = [];
            Data.arrows = [];
            Data.inhibitions = [];
            Data.activations = [];
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


                    var d3json = {};
                    var name =0;
                    d3json.nodes = [];
                    d3json.links = [];

                    for (var j = 0; j < objects[i].complexs.length; ++j) {
                        for(var k=0; k<objects.length; ++k)
                        {
                            if(objects[k].id === objects[i].complexs[j] && objects[k].type === "C")
                            {
                                var complex = {};
                                complex.id = objects[k].id;
                                complex.type = objects[k].type;
                                complex.x = (objects[k].x+offsetX) / objects[i].w;
                                complex.y = (objects[k].y+offsetY) / objects[i].h;
                                complex.w = objects[k].w / objects[i].w;
                                complex.h = objects[k].h / objects[i].h;
                                compartment.children.complexs.push(complex);

                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
                                node.width = objects[k].w/width;
                                node.height = objects[k].h/height;
                                node.group = groupId;
                                d3json.nodes.push(node);
                                name++;
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].dnas.length; ++j) {
                        for(var k=0; k<objects.length; ++k)
                        {
                            if(objects[k].id === objects[i].dnas[j] && objects[k].type === "D")
                            {

                                var dna = {};
                                dna.id = objects[k].id;
                                dna.type = objects[k].type;
                                dna.name = objects[k].text;
                                dna.x = (objects[k].x + offsetX)/ objects[i].w;
                                dna.y = (objects[k].y + offsetY)/ objects[i].h;
                                dna.w = objects[k].w / objects[i].w;
                                dna.h = objects[k].h / objects[i].h;
                                compartment.children.dnas.push(dna);

                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
                                node.width = objects[k].w/width;
                                node.height = objects[k].h/height;
                                node.group = groupId;
                                d3json.nodes.push(node);
                                name++;
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].proteins.length; ++j) {
                        for(var k=0; k<objects.length; ++k)
                        {
                            if(objects[k].id === objects[i].proteins[j] && objects[k].type === "P")
                            {
                                var protein = {};
                                protein.id = objects[k].id;
                                protein.type = objects[k].type;
                                protein.name = objects[k].text;
                                protein.x = (objects[k].x + offsetX) / objects[i].w;
                                protein.y = (objects[k].y + offsetY)/ objects[i].h;
                                protein.w = objects[k].w / objects[i].w;
                                protein.h = objects[k].h / objects[i].h;
                                compartment.children.proteins.push(protein);

                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
                                node.width = objects[k].w/width;
                                node.height = objects[k].h/height;
                                node.group = groupId;
                                d3json.nodes.push(node);
                                name++;
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].molecules.length; ++j) {
                        for(var k=0; k<objects.length; ++k)
                        {
                            if(objects[k].id === objects[i].molecules[j] && objects[k].type === "S")
                            {
                                var molecule = {};
                                molecule.id = objects[k].id;
                                molecule.type = objects[k].type;
                                molecule.name = objects[k].text;
                                molecule.x = (objects[k].x + offsetX)/ objects[i].w;
                                molecule.y = (objects[k].y + offsetY)/ objects[i].h;
                                molecule.w = objects[k].w / objects[i].w;
                                molecule.h = objects[k].h / objects[i].h;
                                compartment.children.molecules.push(molecule);

                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
                                node.width = objects[k].w/width;
                                node.height = objects[k].h/height;
                                node.group = groupId;
                                d3json.push(node);
                                name++;
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].associations.length; ++j) {
                        for(var k=0; k<objects.length; ++k)
                        {
                            if(objects[k].id === objects[i].associations[j] && objects[k].type === "B")
                            {
                                var association = {};
                                association.id = objects[k].id;
                                association.type = objects[k].type;
                                association.x = (objects[k].x + offsetX) / objects[i].w;
                                association.y = (objects[k].y + offsetY)/ objects[i].h;
                                association.w = objects[k].w / objects[i].w;
                                association.h = objects[k].h / objects[i].h;
                                compartment.children.associations.push(association);

                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
                                node.width = objects[k].w/width;
                                node.height = objects[k].h/height;
                                node.group = groupId;
                                d3json.nodes.push(node);
                                name++;
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].dissociations.length; ++j) {
                        for(var k=0; k<objects.length; ++k)
                        {
                            if(objects[k].id === objects[i].dissociations[j] && objects[k].type === "K")
                            {

                                var dissociation = {};
                                dissociation.id = objects[k].id;
                                dissociation.type = objects[k].type;
                                dissociation.x = (objects[k].x + offsetX)/ objects[i].w;
                                dissociation.y = (objects[k].y + offsetY)/ objects[i].h;
                                dissociation.w = objects[k].w / objects[i].w;
                                dissociation.h = objects[k].h / objects[i].h;
                                compartment.children.dissociations.push(dissociation);


                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
                                node.width = objects[k].w/width;
                                node.height = objects[k].h/height;
                                node.group = groupId;
                                d3json.nodes.push(node);
                                name++;
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].transitions.length; ++j) {
                        for(var k=0; k<objects.length; ++k)
                        {
                            if(objects[k].id === objects[i].transitions[j] && objects[k].type === "T")
                            {
                                var transition = {};
                                transition.id = objects[k].id;
                                transition.type = objects[k].type;
                                transition.x = (objects[k].x + offsetX)/ objects[i].w;
                                transition.y = (objects[k].y +offsetY)/ objects[i].h;
                                transition.w = objects[k].w / objects[i].w;
                                transition.h = objects[k].h / objects[i].h;
                                compartment.children.transitions.push(transition);

                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
                                node.width = objects[k].w/width;
                                node.height = objects[k].h/height;
                                node.group = groupId;
                                d3json.nodes.push(node);
                                name++;
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].entitys.length; ++j) {
                        for(var k = 0; k < objects.length; ++k)
                        {
                            if(objects[k].id === objects[i].entitys[j] && objects[k].type === "E")
                            {
                                var entity = {};
                                entity.id = objects[k].id;
                                entity.type = objects[k].type;
                                entity.name = objects[k].text;
                                entity.x = (objects[k].x +offsetX)/ objects[i].w;
                                entity.y = (objects[k].y +offsetY)/ objects[i].h;
                                entity.w = objects[k].w / objects[i].w;
                                entity.h = objects[k].h / objects[i].h;
                                compartment.children.entitys.push(entity);

                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
                                node.width = objects[k].w/width;
                                node.height = objects[k].h/height;
                                node.group = groupId;
                                d3json.nodes.push(node);
                                name++;
                            }
                        }
                    }
                    Data.compartments.push(compartment);
                    jsonData.push(d3json);
                    groupId++;
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
                    Data.arrows.push(arrow);


                    var group1, group2;
                    var name1, name2;
                    for(var j=0; j< jsonData.length; j++)
                    {
                        var nodes = jsonData[j].nodes, flag =0;
                        for(var k=0; k < nodes.length; ++k)
                        {
                            if(nodes[k].id === objects[i].beginNodeId && nodes[k].type === objects[i].beginType)
                            {
                                group1 = nodes[k].group;
                                name1 = nodes[k].name;
                                flag ++;
                                continue;
                            }
                            if(nodes[k].id === objects[i].endNodeId && nodes[k].type === objects[i].endType)
                            {
                                group2 = nodes[k].group;
                                name2 = nodes[k].name;
                                flag ++;
                                continue;
                            }
                            if(flag ===2 )
                            {
                                break;
                            }
                        }
                         if((flag ===2) && (group1 === group2)  )
                         {
                             var link = {};
                             link.source = name1;
                             link.target = name2;
                             jsonData[j].links.push(link);
                         }
                    }
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
                    Data.activations.push(activation);

                    var group1, group2;
                    var name1, name2;
                    for(var j=0; j< jsonData.length; j++)
                    {
                        var nodes = jsonData[j].nodes, flag =0;
                        for(var k=0; k < nodes.length; ++k)
                        {
                            if(nodes[k].id === objects[i].beginNodeId && nodes[k].type === objects[i].beginType)
                            {
                                group1 = nodes[k].group;
                                name1 = nodes[k].name;
                                flag ++;
                                continue;
                            }
                            if(nodes[k].id === objects[i].endNodeId && nodes[k].type === objects[i].endType)
                            {
                                group2 = nodes[k].group;
                                name2 = nodes[k].name;
                                flag ++;
                                continue;
                            }
                            if(flag ===2 )
                            {
                                break;
                            }
                        }
                        if((flag ===2) && (group1 === group2)  )
                        {
                            var link = {};
                            link.source = name1;
                            link.target = name2;
                            jsonData[j].links.push(link);
                        }
                    }
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
                    Data.inhibitions.push(inhibition);


                    var group1, group2;
                    var name1, name2;
                    for(var j=0; j< jsonData.length; j++)
                    {
                        var nodes = jsonData[j].nodes, flag =0;
                        for(var k=0; k < nodes.length; ++k)
                        {
                            if(nodes[k].id === objects[i].beginNodeId && nodes[k].type === objects[i].beginType)
                            {
                                group1 = nodes[k].group;
                                name1 = nodes[k].name;
                                flag ++;
                                continue;
                            }
                            if(nodes[k].id === objects[i].endNodeId && nodes[k].type === objects[i].endType)
                            {
                                group2 = nodes[k].group;
                                name2 = nodes[k].name;
                                flag ++;
                                continue;
                            }
                            if(flag ===2 )
                            {
                                break;
                            }
                        }
                        if((flag ===2) && (group1 === group2)  )
                        {
                            var link = {};
                            link.source = name1;
                            link.target = name2;
                            jsonData[j].links.push(link);
                        }
                    }
                }
            }
            //console.log(JSON.stringify(jsonData));
            $.ajax({
                url: 'convertJson.php',
                type: "POST",  // type should be POST
                data: {
                    json: JSON.stringify(jsonData),
                    keepData: JSON.stringify(Data),
                    keepname: "1"+workerId+".json",
                    name: workerId+".json"
                }, // send the string directly
                dataType: "json",
                success: function (response) {
                    if(response['status'] === '200')
                    alert("Success!");
                }
            });
        }
    };
    var gui = new dat.GUI();
    var f1 = gui.addFolder('Load data');
    f1.add(params, 'loadFile').name('Choose Data File');
    f1.add(params, 'load').name('Load');
    var f2 = gui.addFolder('Send data');
    f2.add(params, 'text').name('Your Worker ID:').onFinishChange(function(value){
        workerId = value;
        alert("Please make sure " + workerId +" is your Worker Id");
    });
    f2.add(params, 'send').name('Send');
    var f3 = gui.addFolder('Planarity Detection');
    f3.add(params, 'planarity').name('Is Planarity?');
    f3.add(params, 'leftCrossing').name('Left Crossing?');
});