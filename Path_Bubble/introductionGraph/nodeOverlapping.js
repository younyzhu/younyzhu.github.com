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

    Bubbles.addCompartment(0, 0.1,0.35, 0.3, 0.4, "H");   //Compartment
    for (var k = 0; k < mainManagement.shapes.length; k++) {
        if (mainManagement.shapes[k].id === 0 && mainManagement.shapes[k].type === "M") {
            mainManagement.shapes[k].addProtein(0,0.2,0.2,0.6,0.3,"C");
            mainManagement.shapes[k].addPhysical_Entity(0,0.68,0.8,0.6,0.3, "A");
            mainManagement.shapes[k].addDNA(0,0.8,0.2,0.6,0.3,"B");
            mainManagement.shapes[k].addAssociation(0,0.8,0.8,0.6,0.3,"D");
            break;
        }
    }
    Bubbles.addActivation(0, "C", 0, "T",0);
    Bubbles.addArrow(0, "T", 0, "P",0);

    Bubbles.addActivation(1, "P", 0, "B",0);
    Bubbles.addInhibition(1, "P", 0, "D",0);
    Bubbles.addArrow(1, "D", 0, "B",0);
    Bubbles.addArrow(2, "B", 0, "E",0);
});