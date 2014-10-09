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
            if (activations[i]) {
                if (activations[i].beginNode && activations[i].endNode) {
                    //Here we can calculate the length of the arrow
                    var beginY = activations[i].beginNode.offsetY + activations[i].beginNode.y;
                    var endY = activations[i].endNode.offsetY + activations[i].endNode.y;
                    if (endY < beginY)// Here I define the upward which does not include the euqality
                    {
                        count++;
                    }
                }
            }
        }
        for (var i = 0; i < inhibitions.length; ++i) {
            if (inhibitions[i]) {
                if (inhibitions[i].beginNode && inhibitions[i].endNode) {
                    //Here we can calculate the length of the arrow
                    var beginY = inhibitions[i].beginNode.offsetY + inhibitions[i].beginNode.y;
                    var endY = inhibitions[i].endNode.offsetY + inhibitions[i].endNode.y;
                    if (endY < beginY)// Here I define the upward which does not include the euqality
                    {
                        count++;
                    }
                }
            }
        }
        for (var i = 0; i < arrows.length; ++i) {
            if (arrows[i]) {
                if (arrows[i].beginNode && arrows[i].endNode) {
                    //Here we can calculate the length of the arrow
                    var beginY = arrows[i].beginNode.offsetY + arrows[i].beginNode.y;
                    var endY = arrows[i].endNode.offsetY + arrows[i].endNode.y;
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
