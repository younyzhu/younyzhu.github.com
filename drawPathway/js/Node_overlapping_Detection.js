/**
 * Created by Yongnan on 7/24/2014.
 */
function OverlappingDetection(shapes, v) {
    this.shapes = shapes;
    this.v = v;  //number of Nodes
}
OverlappingDetection.prototype = {
    findNumberofOverlappint: function () {
        if (this.v <= 1)
            return 0;
        else {
            var shape1 = null;
            var shape2 = null;
            var count = 0;
            for (var i = 0; i < this.shapes.length - 1; ++i) {
                if (this.shapes[i].type === "C" || this.shapes[i].type === "P" || this.shapes[i].type === "D" ||
                    this.shapes[i].type === "S" || this.shapes[i].type === "E" || this.shapes[i].type === "Rna" ||
                    this.shapes[i].type === "T" || this.shapes[i].type === "B" || this.shapes[i].type === "K") {
                    shape1 = this.shapes[i];
                    if (shape1) {
                        for (var j = i + 1; j < this.shapes.length; ++j) {
                            if (this.shapes[j].type === "C" || this.shapes[j].type === "P" || this.shapes[j].type === "D" ||
                                this.shapes[j].type === "S" || this.shapes[j].type === "E" ||this.shapes[j].type === "Rna" ||
                                this.shapes[j].type === "T" || this.shapes[j].type === "B" || this.shapes[j].type === "K") {
                                shape2 = this.shapes[j];
                                if (shape2) {
                                    if (this.intersection2shapes(shape1, shape2)) {
                                        count++;
                                    }
                                    shape2 = null;
                                }
                            }
                        }
                        shape1 = null;
                    }
                }
            }
            return count;
        }
    },
    intersection2shapes: function (shape1, shape2) {
        var x1 = shape1.x + shape1.offsetX;
        var y1 = shape1.y + shape1.offsetY;
        var w1 = shape1.w;
        var h1 = shape1.h;
        var x2 = shape2.x + shape2.offsetX;
        var y2 = shape2.y + shape2.offsetY;
        var w2 = shape2.w;
        var h2 = shape2.h;
        return ( (x2 >= x1 && x2 <= (x1 + w1)) && ( (y2 >= y1) && y2 <= (y1 + h1)) ||
            (x1 >= x2 && x1 <= (x2 + w2)) && ( (y1 >= y2) && y1 <= (y2 + h2)) ||
            ( (x2 >= x1 && x2 <= (x1 + w1)) && ( (y2 <= y1) && y1 <= (y2 + h2))) ||
            ( (x1 >= x2 && x1 <= (x2 + w2)) && ( (y1 <= y2) && y2 <= (y1 + h1)))
            );
    }
};