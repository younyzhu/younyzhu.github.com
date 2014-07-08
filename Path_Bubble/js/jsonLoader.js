/**
 * Created by Yongnan on 7/3/2014.
 */
JsonLoader = function () {
};
JsonLoader.prototype = {
    constructor: JsonLoader,
    parse: function (dataObject) {
        mainManagement = new MainManage($("#bgCanvas")[0]);
        Bubbles = new Visualization();
        mainManagement.addShape(Bubbles);
        if (dataObject instanceof  Object) {
            this.parseCompartments(dataObject.compartments);
            this.parseActivations(dataObject.activations);
            this.parseArrows(dataObject.arrows);
            this.parseInhibitions(dataObject.inhibitions);
        }
    },
    parseCompartments: function (compartments) {
        for (var i = 0; i < compartments.length; ++i) {
            Bubbles.addCompartment(compartments[i].id, compartments[i].x, compartments[i].y, compartments[i].w, compartments[i].h, compartments[i].name);
            var complexs = compartments[i].children.complexs;
            for (var j = 0; j < complexs.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        mainManagement.shapes[k].addComplex(complexs[j].id, complexs[j].x, complexs[j].y, complexs[j].w, complexs[j].h);
                        break;
                    }
                }
            }
            var dnas = compartments[i].children.dnas;
            for (var j = 0; j < dnas.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        mainManagement.shapes[k].addDNA(dnas[j].id, dnas[j].x, dnas[j].y, dnas[j].w, dnas[j].h, dnas[j].name);
                        break;
                    }
                }
            }
            var entitys = compartments[i].children.entitys;
            for (var j = 0; j < entitys.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        mainManagement.shapes[k].addPhysical_Entity(entitys[j].id, entitys[j].x, entitys[j].y, entitys[j].w, entitys[j].h, entitys[j].name);
                        break;
                    }
                }
            }
            var molecules = compartments[i].children.molecules;
            for (var j = 0; j < molecules.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        mainManagement.shapes[k].addSmall_Molecule(molecules[j].id, molecules[j].x, molecules[j].y, molecules[j].w, molecules[j].h, molecules[j].name);
                        break;
                    }
                }
            }
            var proteins = compartments[i].children.proteins;
            for (var j = 0; j < proteins.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        mainManagement.shapes[k].addProtein(proteins[j].id, proteins[j].x, proteins[j].y, proteins[j].w, proteins[j].h, proteins[j].name);
                        break;
                    }
                }
            }
            var associations = compartments[i].children.associations;
            for (var j = 0; j < associations.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        mainManagement.shapes[k].addAssociation(associations[j].id, associations[j].x, associations[j].y, associations[j].w, associations[j].h);
                        break;
                    }
                }
            }
            var dissociations = compartments[i].children.dissociations;
            for (var j = 0; j < dissociations.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        mainManagement.shapes[k].addDissociation(dissociations[j].id, dissociations[j].x, dissociations[j].y, dissociations[j].w, dissociations[j].h);
                        break;
                    }
                }
            }
            var transitions = compartments[i].children.transitions;
            for (var j = 0; j < transitions.length; ++j) {
                for (var k = 0; k < mainManagement.shapes.length; k++) {
                    if (mainManagement.shapes[k].id === compartments[i].id && mainManagement.shapes[k].type === "M") {
                        mainManagement.shapes[k].addTransition(transitions[j].id, transitions[j].x, transitions[j].y, transitions[j].w, transitions[j].h);
                        break;
                    }
                }
            }
        }
    },

    parseActivations: function (activations) {
        for (var i = 0; i < activations.length; ++i) {
            if (activations[i].beginNodeId < 0 && activations[i].endNodeId < 0) {
                continue;
            }
            Bubbles.addArrow(activations[i].id, activations[i].beginType, activations[i].beginNodeId, activations[i].endType, activations[i].endNodeId);
        }
    },
    parseArrows: function (arrows) {
        for (var i = 0; i < arrows.length; ++i) {
            if (arrows[i].beginNodeId < 0 && arrows[i].endNodeId < 0) {
                continue;
            }
            Bubbles.addArrow(arrows[i].id, arrows[i].beginType, arrows[i].beginNodeId, arrows[i].endType, arrows[i].endNodeId);
        }
    },
    parseInhibitions: function (inhibitions) {
        for (var i = 0; i < inhibitions.length; ++i) {
            if (inhibitions[i].beginNodeId < 0 && inhibitions[i].endNodeId < 0) {
                continue;
            }
            Bubbles.addInhibition(inhibitions[i].id, inhibitions[i].beginType, inhibitions[i].beginNodeId, inhibitions[i].endType, inhibitions[i].endNodeId);
        }
    }
};
