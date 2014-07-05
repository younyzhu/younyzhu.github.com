/**
 * Created by Yongnanzhu on 5/12/2014.
 */

//Global variable for counting the bubble number
var Bubbles = null;
var mainManagement = null;
$(document).ready(function () {
    THREEx.FullScreen.bindKey({ charCode: 'f'.charCodeAt(0) });
    var params = {
        loadFile : function() {
           $('#myInput').click();
        },
        button : function(){
            var selected_file = $('#myInput').get(0).files[0];
            if (selected_file === null) {
                alert("Please select data file!");
            }
            else
            {

                alert(selected_file.name);
            }
        }
    };
    var gui = new dat.GUI();
    var f1 = gui.addFolder('Load data');
    f1.add(params, 'loadFile').name('Choose Data File');
    f1.add(params, 'button').name('Load');


    var str = "./data/SMAD23_Phosphorylation_Motif_Mutants_in_Cancer_19_new.xml";
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