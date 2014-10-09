/**
 * Created by Yongnan on 7/29/2014.
 */
function UpwardsDetection(shapes) {
    this.shapes = shapes;
}
UpwardsDetection.prototype = {
    findNumberofUpwardsEdges: function () {
        var activations = this.shapes[0].activations;
        var inhibitions = this.shapes[0].inhibitions;
        var arrows = this.shapes[0].arrows;
        var count = 0;
        for (var i = 0; i < activations.length; ++i) {
            var activation = null;
            for (var j = 0; j < this.shapes.length; ++j) {
                if (this.shapes[j].id === activations[i] && this.shapes[j].type === "A") {
                    activation = this.shapes[j];
                    break;
                }
            }
            if (activation) {
                var beginNode = null;
                var endNode = null;
                for (var k = 0; k < this.shapes.length; k++) {
                    if (this.shapes[k].id === activation.beginNodeId && this.shapes[k].type === activation.beginType) {
                        beginNode = this.shapes[k];
                        break;
                    }
                }
                for (var k = 0; k < this.shapes.length; k++) {
                    if (this.shapes[k].id === activation.endNodeId && this.shapes[k].type === activation.endType) {
                        endNode = this.shapes[k];
                        break;
                    }
                }
                if (beginNode && endNode) {
                    //Here we can calculate the length of the arrow
                    var beginY = beginNode.offsetY + beginNode.y;
                    var endY = endNode.offsetY + endNode.y;
                    if (endY < beginY)// Here I define the upward which does not include the euqality
                    {
                        count++;
                    }
                }
            }
        }
        for (var i = 0; i < inhibitions.length; ++i) {
            var inhibition = null;
            for (var j = 0; j < this.shapes.length; ++j) {
                if (this.shapes[j].id === inhibitions[i] && this.shapes[j].type === "I") {
                    inhibition = this.shapes[j];
                    break;
                }
            }
            if (inhibition) {
                var beginNode = null;
                var endNode = null;
                for (var k = 0; k < this.shapes.length; k++) {
                    if (this.shapes[k].id === inhibition.beginNodeId && this.shapes[k].type === inhibition.beginType) {
                        beginNode = this.shapes[k];
                        break;
                    }
                }
                for (var k = 0; k < this.shapes.length; k++) {
                    if (this.shapes[k].id === inhibition.endNodeId && this.shapes[k].type === inhibition.endType) {
                        endNode = this.shapes[k];
                        break;
                    }
                }
                if (beginNode && endNode) {
                    //Here we can calculate the length of the arrow
                    var beginY = beginNode.offsetY + beginNode.y;
                    var endY = endNode.offsetY + endNode.y;
                    if (endY < beginY)// Here I define the upward which does not include the euqality
                    {
                        count++;
                    }
                }
            }
        }
        for (var i = 0; i < arrows.length; ++i) {
            var arrow = null;
            for (var j = 0; j < this.shapes.length; ++j) {
                if (this.shapes[j].id === arrows[i] && this.shapes[j].type === "J") {
                    arrow = this.shapes[j];
                    break;
                }
            }
            if (arrow) {
                var beginNode = null;
                var endNode = null;
                for (var k = 0; k < this.shapes.length; k++) {
                    if (this.shapes[k].id === arrow.beginNodeId && this.shapes[k].type === arrow.beginType) {
                        beginNode = this.shapes[k];
                        break;
                    }
                }
                for (var k = 0; k < this.shapes.length; k++) {
                    if (this.shapes[k].id === arrow.endNodeId && this.shapes[k].type === arrow.endType) {
                        endNode = this.shapes[k];
                        break;
                    }
                }
                if (beginNode && endNode) {
                    //Here we can calculate the length of the arrow
                    var beginY = beginNode.offsetY + beginNode.y;
                    var endY = endNode.offsetY + endNode.y;
                    if (endY < beginY)// Here I define the upward which does not include the euqality
                    {
                        count++;
                    }
                }
            }
        }
        return count;
    }
};
