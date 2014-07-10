/**
 * Created by Yongnan on 7/10/2014.
 */
function Detection(shapes, e) {

    this.shapes = shapes;
    this.e = e;
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
        var a =null, b=null,c=null,d=null;
        var flag =0;
        for(var j=0; j< mainManagement.shapes.length; j++)
        {
            if(mainManagement.shapes[j].id === edge1.beginNodeId && mainManagement.shapes[j].type === edge1.beginType)
            {
                flag++;
                a = {x: mainManagement.shapes[j].x + mainManagement.shapes[j].offsetX, y: mainManagement.shapes[j].y  + mainManagement.shapes[j].offsetY};
                continue;
            }
            if(mainManagement.shapes[j].id === edge1.endNodeId && mainManagement.shapes[j].type === edge1.endType)
            {
                flag++;
                b = {x: mainManagement.shapes[j].x + mainManagement.shapes[j].offsetX, y: mainManagement.shapes[j].y  + mainManagement.shapes[j].offsetY };
                continue;
            }
             if(flag===2)
             {
                 flag=0;
                 break;
             }
        }
        for(var j=0; j< mainManagement.shapes.length; j++)
        {
            if(mainManagement.shapes[j].id === edge2.beginNodeId && mainManagement.shapes[j].type === edge2.beginType)
            {
                flag++;
                c = {x: mainManagement.shapes[j].x + mainManagement.shapes[j].offsetX, y: mainManagement.shapes[j].y  + mainManagement.shapes[j].offsetY };
                continue;
            }
            if(mainManagement.shapes[j].id === edge2.endNodeId && mainManagement.shapes[j].type === edge2.endType)
            {
                flag++;
                d = {x: mainManagement.shapes[j].x + mainManagement.shapes[j].offsetX, y: mainManagement.shapes[j].y  + mainManagement.shapes[j].offsetY };
                continue;
            }
            if(flag===2)
            {
                flag=0;
                break;
            }
        }
        if(a&&b&&c&&d)
        {
            var Interset = this.segmentsIntr(a,b,c,d);
            a= null;
            b = null;
            c = null;
            d = null;
            return Interset;
        }
    },
    findCrossing: function () {
        var crossingCount = 0;
        var edge1 = null, edge2 = null;
        for (var j = 0; j < this.e - 2; j++) {
            for (var i = 0; i < this.shapes.length; ++i) {
                if (this.shapes[i].id === j && (this.shapes[i].type === "J" || this.shapes[i].type === "A" || this.shapes[i].type === "I") && this.shapes[i].type !== "M") {
                    edge1 = this.shapes[i];
                    break;
                }
            }
            if (edge1) {
                for (var k = j + 1; k < this.e -1; k++) {
                    for (var i = 0; i < this.shapes.length; ++i) {
                        if (this.shapes[i].id === k && (this.shapes[i].type === "J" || this.shapes[i].type === "A" || this.shapes[i].type === "I" && this.shapes[i].type !== "M")) {
                            edge2 = this.shapes[i];
                            if (edge1 && edge2) {
                                if (this.edgeIntersection(edge1, edge2)) {
                                    crossingCount++;
                                }
                            }
                            edge2 = null;
                        }
                    }
                }
            }
            edge1 = null;
            edge2 = null;
        }
        return crossingCount;
    }
};
