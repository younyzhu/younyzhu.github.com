/**
 * Created by Yongnanzhu on 5/12/2014.
 */

//Global variable for counting the bubble number
var Bubbles = null;
var mainManagement = null;
$(document).ready(function () {
    THREEx.FullScreen.bindKey({ charCode: 'f'.charCodeAt(0) });
    var str = "./data/SMAD23 Phosphorylation Motif Mutants in Cancer_26_new.xml";
    var xmlLoader = new XMLLoader();
    xmlLoader.load(str);
    var workerId ="";
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
            if(xmlLoader.v >3)
                if(xmlLoader.e <= 3* xmlLoader.v - 6)
                {
                    alert("This is a planner graph!");
                }
                else
                {
                    alert("This is a non-planner graph!");
                }
        },
        leftCrossing: function(){

            var detection = new Detection(mainManagement.shapes, xmlLoader.e);
            var crossingNum = detection.findCrossing();
            alert(crossingNum);
        },
        send: function () {
            if(workerId === "")
            {
                alert("Please input your amazon mechnical turk Worker Id.");
                return;
            }
            var objects = mainManagement.shapes;
            var d3json = {};
            var groupId =0;
            var name =0;
            d3json.nodes = [];
            d3json.links = [];
            for (var i = 0; i < objects.length; ++i) {
                if (objects[i].type === "M") {
                    for (var j = 0; j < objects[i].complexs.length; ++j) {
                        for(var k=0; k<objects.length; ++k)
                        {
                            if(objects[k].id === objects[i].complexs[j] && objects[k].type === "C")
                            {
                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
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
                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
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
                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
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
                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
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
                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
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
                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
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
                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
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
                                var node = {};
                                node.name = name;
                                node.id = objects[k].id;
                                node.type = objects[k].type;
                                node.group = groupId;
                                d3json.nodes.push(node);
                                name++;
                            }
                        }
                    }
                    groupId++;
                }
                else if (objects[i].type === "J")//Arrows
                {
                    var group1, group2;
                    var name1, name2;

                        var nodes = d3json.nodes, flag =0;
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
                         if((flag ===2)  )
                         {
                             var link = {};
                             link.source = name1;
                             link.target = name2;
                             d3json.links.push(link);
                         }

                }
                else if (objects[i].type === "A")//Activation
                {
                    var group1, group2;
                    var name1, name2;

                    var nodes = d3json.nodes, flag =0;
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
                    if((flag ===2) )
                    {
                        var link = {};
                        link.source = name1;
                        link.target = name2;
                        d3json.links.push(link);
                    }
                }
                else if (objects[i].type === "I")//Inhibition
                {
                    var group1, group2;
                    var name1, name2;

                    var nodes = d3json.nodes, flag =0;
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
                    if((flag ===2) )
                    {
                        var link = {};
                        link.source = name1;
                        link.target = name2;
                        d3json.links.push(link);
                    }
                }
            }
            //console.log(JSON.stringify(jsonData));
            $.ajax({
                url: 'json.php',
                type: "POST",  // type should be POST
                data: {
                    json: JSON.stringify(d3json),

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