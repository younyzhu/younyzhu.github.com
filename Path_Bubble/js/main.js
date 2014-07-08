/**
 * Created by Yongnanzhu on 5/12/2014.
 */

//Global variable for counting the bubble number
var Bubbles = null;
var mainManagement = null;
$(document).ready(function () {
    THREEx.FullScreen.bindKey({ charCode: 'f'.charCodeAt(0) });
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
                var localFileLoader = new LocalXMLLoader();
                localFileLoader.load(selected_file);
            }
        },
        send: function () {

            var objects = mainManagement.shapes;
            var w = mainManagement.shapes[0].w;
            var h = mainManagement.shapes[1].h;
            var data = {};
            data.compartments = [];
            data.arrows = [];
            data.inhibitions = [];
            data.activations = [];
            for (var i = 0; i < objects.length; ++i) {
                if (objects[i].type === "M") {
                    var compartment = {};
                    compartment.id = objects[i].id;
                    compartment.type = objects[i].type;
                    compartment.name = objects[i].text;
                    compartment.x = objects[i].x / w;
                    compartment.y = objects[i].y / h;
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
                    for (var j = 0; j < objects[i].complexs.length; ++j) {
                        for(var k=0; k<objects.length; ++k)
                        {
                            if(objects[k].id === objects[i].complexs[j] && objects[k].type === "C")
                            {
                                var complex = {};
                                complex.id = objects[k].id;
                                complex.type = objects[k].type;
                                complex.x = objects[k].x / objects[i].w;
                                complex.y = objects[k].y / objects[i].h;
                                complex.w = objects[k].w / objects[i].w;
                                complex.h = objects[k].h / objects[i].h;
                                compartment.children.complexs.push(complex);
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
                                dna.x = objects[k].x / objects[i].w;
                                dna.y = objects[k].y / objects[i].h;
                                dna.w = objects[k].w / objects[i].w;
                                dna.h = objects[k].h / objects[i].h;
                                compartment.children.dnas.push(dna);
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
                                protein.x = objects[k].x / objects[i].w;
                                protein.y = objects[k].y / objects[i].h;
                                protein.w = objects[k].w / objects[i].w;
                                protein.h = objects[k].h / objects[i].h;
                                compartment.children.proteins.push(protein);
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
                                molecule.x = objects[k].x / objects[i].w;
                                molecule.y = objects[k].y / objects[i].h;
                                molecule.w = objects[k].w / objects[i].w;
                                molecule.h = objects[k].h / objects[i].h;
                                compartment.children.molecules.push(molecule);
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
                                association.x = objects[k].x / objects[i].w;
                                association.y = objects[k].y / objects[i].h;
                                association.w = objects[k].w / objects[i].w;
                                association.h = objects[k].h / objects[i].h;
                                compartment.children.associations.push(association);
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
                                dissociation.x = objects[k].x / objects[i].w;
                                dissociation.y = objects[k].y / objects[i].h;
                                dissociation.w = objects[k].w / objects[i].w;
                                dissociation.h = objects[k].h / objects[i].h;
                                compartment.children.dissociations.push(dissociation);
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
                                transition.x = objects[k].x / objects[i].w;
                                transition.y = objects[k].y / objects[i].h;
                                transition.w = objects[k].w / objects[i].w;
                                transition.h = objects[k].h / objects[i].h;
                                compartment.children.transitions.push(transition);
                            }
                        }
                    }
                    for (var j = 0; j < objects[i].entitys.length; ++j) {
                        for(var k=0; k<objects.length; ++k)
                        {
                            if(objects[k].id === objects[i].entitys[j] && objects[k].type === "E")
                            {
                                var entity = {};
                                entity.id = objects[k].id;
                                entity.type = objects[k].type;
                                entity.x = objects[k].x / objects[i].w;
                                entity.y = objects[k].y / objects[i].h;
                                entity.w = objects[k].w / objects[i].w;
                                entity.h = objects[k].h / objects[i].h;
                                compartment.children.entitys.push(entity);
                            }
                        }
                    }
                    data.compartments.push(compartment);
                }
                else if (objects[i].type === "J")//arrows
                {
                    var arrow = {};
                    arrow.id = objects[i].id;
                    arrow.type = objects[i].type;
                    arrow.beginType = objects[i].beginType;
                    arrow.beginNodeId = objects[i].beginNodeId;
                    arrow.endType = objects[i].endType;
                    arrow.endNodeId = objects[i].endNodeId;

                    data.arrows.push(arrow);
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

                    data.inhibitions.push(inhibition);
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

                    data.activations.push(activation);
                }
            }

            /*
            $.ajax({
                url: 'http://localhost:63342',
                processData: false,
                type: "POST",  // type should be POST
                data: xml, // send the string directly
                success: function (response) {
                    alert(response);
                },
                error: function (response) {
                    alert(response);
                }
            });  */
        }
    };
    var gui = new dat.GUI();
    var f1 = gui.addFolder('Load data');
    f1.add(params, 'loadFile').name('Choose Data File');
    f1.add(params, 'load').name('Load');
    var f2 = gui.addFolder('Send data');
    f2.add(params, 'send').name('Send');
    var str = "./data/SMAD23 Phosphorylation Motif Mutants in Cancer_26_new.xml";
    var xmlLoader = new XMLLoader();
    xmlLoader.load(str);

    /*
     var currentView = new Compartment(0,navigationCanvas, 200, 200, 200, 200, 'rgba(255,0,0,0.7)');
     navigationCanvas.addShape(currentView);
     var complex = new Complex(1, 30, 70, 70, 30);
     navigationCanvas.addShape(complex);
     var protein = new Protein(2, 80, 20, 60, 30);
     navigationCanvas.addShape(protein);
     var dna = new DNA(5, 150, 20, 60, 30);
     navigationCanvas.addShape(dna);
     var molecule = new Small_Molecule(10, 180, 20, 100, 50);
     navigationCanvas.addShape(molecule);
     var arrow = new Arrow(12, 0,0, 150,230);
     navigationCanvas.addShape(arrow);
     var trans = new Transition(8,100,100);
     navigationCanvas.addShape(trans);
     var ass = new Association(10,200,100);
     navigationCanvas.addShape(ass);
     var diss = new Dissociation(10,300,100);
     navigationCanvas.addShape(diss);
     var inhibition = new Inhibition(15, 100,100,300,400);
     navigationCanvas.addShape(inhibition);
     var activation = new Activation(16, 100,100,100,400);
     navigationCanvas.addShape(activation);
     */

});