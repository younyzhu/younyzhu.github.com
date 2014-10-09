/**
 * Created by Yongnan on 7/10/2014.
 */
function Detection(shapes) {
    this.shapes = shapes;
}
Detection.prototype = {
    constructor: Detection,
    //from http://fins.iteye.com/blog/1522259
    //如果"线段ab和点c构成的三角形面积"与"线段ab和点d构成的三角形面积" 构成的三角形面积的正负符号相异,
    //那么点c和点d位于线段ab两侧
    //三角形三点a(x,y) b(x,y) c(x,y), 三角形面积为 var triArea=( (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x) ) /2 ;
    segmentsIntr: function (a, b, c, d) {
        var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);// 三角形abc 面积的2倍
        var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);// 三角形abd 面积的2倍

        // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
        if (area_abc * area_abd >= 0) {
            return false;
        }
        // 三角形cda 面积的2倍
        var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
        // 三角形cdb 面积的2倍
        // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
        var area_cdb = area_cda + area_abc - area_abd;
        if (area_cda * area_cdb >= 0) {
            return false;
        }
        //计算交点坐标
        /*
         var t = area_cda / ( area_abd - area_abc );
         var dx = t * (b.x - a.x),
         dy = t * (b.y - a.y);
         return { x: a.x + dx, y: a.y + dy };
         */
        return true;
    },

    edgeIntersection: function (edge1, edge2) {
        var a = null, b = null, c = null, d = null;
        if(edge1 &&edge2)
        {
            a = {x: edge1.beginNode.x + edge1.beginNode.offsetX, y: edge1.beginNode.y + edge1.beginNode.offsetY};
            b = {x: edge1.endNode.x + edge1.endNode.offsetX, y: edge1.endNode.y + edge1.endNode.offsetY };
            c = {x: edge2.beginNode.x + edge2.beginNode.offsetX, y: edge2.beginNode.y + edge2.beginNode.offsetY};
            d = {x: edge2.endNode.x + edge2.endNode.offsetX, y: edge2.endNode.y + edge2.endNode.offsetY };
        }
        if (a && b && c && d) {
            var Interset = this.segmentsIntr(a, b, c, d);
            a = null;
            b = null;
            c = null;
            d = null;
            return Interset;
        }
    },
    findCrossing: function () {
        var crossingCount = 0;
        var activations = this.shapes[0].activations;
        var inhibitions = this.shapes[0].inhibitions;
        var arrows = this.shapes[0].arrows;

        for (var i = 0; i < activations.length; i++) {
            for (var j = i + 1; j < activations.length; ++j) {
                if (this.edgeIntersection(activations[i], activations[j])) {
                    crossingCount++;
                }
            }
        }
        for (var i = 0; i < inhibitions.length; i++) {
            for (var j = i + 1; j < inhibitions.length; ++j) {
                if (this.edgeIntersection(inhibitions[i], inhibitions[j])) {
                    crossingCount++;
                }
            }
        }
        for (var i = 0; i < arrows.length; i++) {
            for (var j = i + 1; j < arrows.length; ++j) {
                if (this.edgeIntersection(arrows[i], arrows[j])) {
                    crossingCount++;
                }
            }
        }
        for (var i = 0; i < activations.length; ++i) {
            for (j = 0; j < inhibitions.length; ++j) {
                if (activations[i] && inhibitions[j]) {
                    if (this.edgeIntersection(activations[i], inhibitions[j])) {
                        crossingCount++;
                    }
                }
            }
        }
        for (var i = 0; i < activations.length; ++i) {
            for (j = 0; j < arrows.length; ++j) {
                if (activations[i] && arrows[j]) {
                    if (this.edgeIntersection(activations[i], arrows[j])) {
                        crossingCount++;
                    }
                }
            }
        }
        for (var i = 0; i < inhibitions.length; ++i) {
            for (j = 0; j < arrows.length; ++j) {
                if (inhibitions[i] && arrows[j]) {
                    if (this.edgeIntersection(inhibitions[i], arrows[j])) {
                        crossingCount++;
                    }
                }
            }
        }

        return crossingCount;
    }
};
