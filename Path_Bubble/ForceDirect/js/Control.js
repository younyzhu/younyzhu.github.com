/**
 * Created by Yongnan on 7/23/2014.
 */
function Control() {
    this.loader = null;
    var _this = this;

    function animate() {
        if (_this.loader === null) {
            _this.loader = new XMLLoader();
            _this.loader.load("../pathwayGraphXml/" + str[processedIdex]);
        }
        if (springy) {
            if (springy.getStopStatus() &&processedIdex !== str.length) {
                var w = window.innerWidth;
                var h = window.innerHeight;
                var jsonData = {};
                jsonData.compartments = [];
                jsonData.arrows = [];
                jsonData.inhibitions = [];
                jsonData.activations = [];
                for (var i = 0; i < Data.compartments.length; ++i) {
                    var compartment = {};
                    compartment.id = Data.compartments[i].id;
                    compartment.type = "M";
                    compartment.name = Data.compartments[i].name;
                    compartment.x = Data.compartments[i].x / w;
                    compartment.y = Data.compartments[i].y / h;
                    compartment.childOffsetx = Data.compartments[i].childOffsetx / w;
                    compartment.childOffsety = Data.compartments[i].childOffsety / h;
                    compartment.w = Data.compartments[i].w / w;
                    compartment.h = Data.compartments[i].h / h;

                    compartment.children = {};
                    compartment.children.complexs = [];
                    compartment.children.dnas = [];
                    compartment.children.proteins = [];
                    compartment.children.molecules = [];
                    compartment.children.associations = [];
                    compartment.children.dissociations = [];
                    compartment.children.transitions = [];
                    compartment.children.entitys = [];

                    var offsetX = Data.compartments[i].childOffsetx - Data.compartments[i].x;
                    var offsetY = Data.compartments[i].childOffsety - Data.compartments[i].y;
                    for (var j = 0; j < Data.compartments[i].complexs.length; ++j) {

                        var complex = {};
                        complex.id = Data.compartments[i].complexs[j].id;
                        complex.type = "C";
                        complex.x = (Data.compartments[i].complexs[j].x +offsetX) / Data.compartments[i].w;
                        complex.y = (Data.compartments[i].complexs[j].y +offsetY) / Data.compartments[i].h;
                        complex.w = Data.compartments[i].complexs[j].w / Data.compartments[i].w;
                        complex.h = Data.compartments[i].complexs[j].h / Data.compartments[i].h;
                        compartment.children.complexs.push(complex);

                    }
                    for (var j = 0; j < Data.compartments[i].dnas.length; ++j) {
                        var dna = {};
                        dna.id = Data.compartments[i].dnas[j].id;
                        dna.type = "D";
                        dna.name = Data.compartments[i].dnas[j].name;
                        dna.x = (Data.compartments[i].dnas[j].x + offsetX) / Data.compartments[i].w;
                        dna.y = (Data.compartments[i].dnas[j].y + offsetY) / Data.compartments[i].h;
                        dna.w = Data.compartments[i].dnas[j].w / Data.compartments[i].w;
                        dna.h = Data.compartments[i].dnas[j].h / Data.compartments[i].h;
                        compartment.children.dnas.push(dna);

                    }
                    for (var j = 0; j < Data.compartments[i].proteins.length; ++j) {
                        var protein = {};
                        protein.id = Data.compartments[i].proteins[j].id;
                        protein.type = "P";
                        protein.name = Data.compartments[i].proteins[j].name;
                        protein.x = (Data.compartments[i].proteins[j].x + offsetX) / Data.compartments[i].w;
                        protein.y = (Data.compartments[i].proteins[j].y + offsetY) / Data.compartments[i].h;
                        protein.w = Data.compartments[i].proteins[j].w / Data.compartments[i].w;
                        protein.h = Data.compartments[i].proteins[j].h / Data.compartments[i].h;
                        compartment.children.proteins.push(protein);

                    }
                    for (var j = 0; j < Data.compartments[i].molecules.length; ++j) {
                        var molecule = {};
                        molecule.id = Data.compartments[i].molecules[j].id;
                        molecule.type = "S";
                        molecule.name = Data.compartments[i].molecules[j].name;
                        molecule.x = (Data.compartments[i].molecules[j].x + offsetX) / Data.compartments[i].w;
                        molecule.y = (Data.compartments[i].molecules[j].y + offsetY) / Data.compartments[i].h;
                        molecule.w = Data.compartments[i].molecules[j].w / Data.compartments[i].w;
                        molecule.h = Data.compartments[i].molecules[j].h / Data.compartments[i].h;
                        compartment.children.molecules.push(molecule);

                    }
                    for (var j = 0; j < Data.compartments[i].associations.length; ++j) {
                        var association = {};
                        association.id = Data.compartments[i].associations[j].id;
                        association.type = "B";
                        association.x = (Data.compartments[i].associations[j].x + offsetX) / Data.compartments[i].w;
                        association.y = (Data.compartments[i].associations[j].y + offsetY) / Data.compartments[i].h;
                        association.w = Data.compartments[i].associations[j].w / Data.compartments[i].w;
                        association.h = Data.compartments[i].associations[j].h / Data.compartments[i].h;
                        compartment.children.associations.push(association);

                    }
                    for (var j = 0; j < Data.compartments[i].dissociations.length; ++j) {
                        var dissociation = {};
                        dissociation.id = Data.compartments[i].dissociations[j].id;
                        dissociation.type = "K";
                        dissociation.x = (Data.compartments[i].dissociations[j].x + offsetX) / Data.compartments[i].w;
                        dissociation.y = (Data.compartments[i].dissociations[j].y + offsetY) / Data.compartments[i].h;
                        dissociation.w = Data.compartments[i].dissociations[j].w / Data.compartments[i].w;
                        dissociation.h = Data.compartments[i].dissociations[j].h / Data.compartments[i].h;
                        compartment.children.dissociations.push(dissociation);

                    }
                    for (var j = 0; j < Data.compartments[i].transitions.length; ++j) {
                        var transition = {};
                        transition.id = Data.compartments[i].transitions[j].id;
                        transition.type = "T";
                        transition.x = (Data.compartments[i].transitions[j].x + offsetX) / Data.compartments[i].w;
                        transition.y = (Data.compartments[i].transitions[j].y + offsetY) / Data.compartments[i].h;
                        transition.w = Data.compartments[i].transitions[j].w / Data.compartments[i].w;
                        transition.h = Data.compartments[i].transitions[j].h / Data.compartments[i].h;
                        compartment.children.transitions.push(transition);

                    }
                    for (var j = 0; j < Data.compartments[i].entitys.length; ++j) {
                        var entity = {};
                        entity.id = Data.compartments[i].entitys[j].id;
                        entity.type = "E";
                        entity.x = (Data.compartments[i].entitys[j].x + offsetX) / Data.compartments[i].w;
                        entity.y = (Data.compartments[i].entitys[j].y + offsetY) / Data.compartments[i].h;
                        entity.w = Data.compartments[i].entitys[j].w / Data.compartments[i].w;
                        entity.h = Data.compartments[i].entitys[j].h / Data.compartments[i].h;
                        compartment.children.entitys.push(entity);

                    }

                    jsonData.compartments.push(compartment);
                }
                for (var i=0; i<Data.arrows.length; ++i) {
                    var arrow = {};
                    arrow.id = Data.arrows[i].id;
                    arrow.type = "J";
                    arrow.beginType = Data.arrows[i].beginType;
                    arrow.beginNodeId = Data.arrows[i].beginNodeId;
                    arrow.endType = Data.arrows[i].endType;
                    arrow.endNodeId = Data.arrows[i].endNodeId;
                    jsonData.arrows.push(arrow);
                }
                for (var i=0; i<Data.activations.length; ++i) {
                    var activation = {};
                    activation.id = Data.activations[i].id;
                    activation.type = "A";
                    activation.beginType = Data.activations[i].beginType;
                    activation.beginNodeId = Data.activations[i].beginNodeId;
                    activation.endType = Data.activations[i].endType;
                    activation.endNodeId = Data.activations[i].endNodeId;
                    jsonData.activations.push(activation);
                }
                for (var i=0; i<Data.inhibitions.length; ++i) {
                    var inhibition = {};
                    inhibition.id = Data.inhibitions[i].id;
                    inhibition.type = "I";
                    inhibition.beginType = Data.inhibitions[i].beginType;
                    inhibition.beginNodeId = Data.inhibitions[i].beginNodeId;
                    inhibition.endType = Data.inhibitions[i].endType;
                    inhibition.endNodeId = Data.inhibitions[i].endNodeId;
                    jsonData.inhibitions.push(inhibition);
                }
                $.ajax({
                    url: 'json.php',
                    type: "POST",  // type should be POST
                    data: {
                        json: JSON.stringify(jsonData),
                        name: "./data/"+str[processedIdex] + ".json"
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
                _this.loader = null;
                springy = null;
                graphs.length = 0;
                Data.compartments.length = 0;
                Data.arrows.length = 0;
                Data.inhibitions.length = 0;
                Data.activations.length = 0;
                processedIdex++;
            }
        }
        requestAnimationFrame(animate);
    }

    animate();

}
