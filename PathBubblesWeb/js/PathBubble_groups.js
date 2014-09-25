/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/17/2014
 * @name        PathBubble_groups
 */
PATHBUBBLES.Groups = function () {
    PATHBUBBLES.Object2D.call(this);
    this.shape = new PATHBUBBLES.Shape.Path("#0000ff", "#ffffff", 10);
    this.type = "Group";
    this.arranged = [];
    this.tempPoints = [];
};
PATHBUBBLES.Groups.prototype = Object.create(PATHBUBBLES.Object2D.prototype);
PATHBUBBLES.Groups.prototype = {
    constructor: PATHBUBBLES.Groups,
    addToGroup: function (object) {
        if (object) {
            object.GROUP = true;
            object.parent = this;

//            if (this.children.length == 0) {
//                this.children.push(object);
//
//                return;
//            }
            if (this.children.indexOf(object) == -1)
            {

                this.children.push(object);
                if (this.arranged.length == 0) {
                this.tempPoints.length = 0;
                var left = {};
                left.x = object.x;
                left.y = object.y;
                left.type = "QCT";
                this.tempPoints.push(left);

                var right = {};
                right.x = object.x + object.w;
                right.y = object.y;
                right.type = "QCT";
                this.tempPoints.push(right);

                var bright = {};
                bright.x = object.x + object.w;
                bright.y = object.y + object.h;
                bright.type = "QCT";
                this.tempPoints.push(bright);
                var bleft = {};
                bleft.x = object.x;
                bleft.y = object.y + object.h;

                bleft.type = "QCT";
                this.tempPoints.push(bleft);
                this.arranged.push(object);
            }
                if(this.tempPoints.length!==0)
                {
                    for(var i=0; i<this.tempPoints.length; ++i)
                    {
                        this.tempPoints[i].x += this.offsetX;
                        this.tempPoints[i].offsetX = this.offsetX;
                        this.tempPoints[i].y += this.offsetY;
                        this.tempPoints[i].offsetY = this.offsetY;
                    }
                }
                var tempCompare = [];
                for (var j = 0; j < this.arranged.length; ++j) {
                    if (this.arranged[j] !== object) {
                        var objs = this.calculateUpDownLeftRight(this.arranged[j], object);
                        for (var ji = 0; ji < objs.length; ++ji) {
                            if (tempCompare.indexOf(objs[ji]) == -1)
                                objs[ji].object = this.arranged[j];
                            tempCompare.push(objs[ji]);
                        }
                    }
                }
                //if(tempCompare.length ==0)
                    //continue;
                var moveDistance = Infinity;
                var at = null;
                for (var ii = 0; ii < tempCompare.length; ++ii) {
                    if (tempCompare[ii].flag !== false && tempCompare[ii].moveDistance < moveDistance) {
                        moveDistance = tempCompare[ii].moveDistance;
                        at = tempCompare[ii];
                    }
                }
                if (at) {
                    object.shape.x = at.x;
                    object.shape.y = at.y;
                    object.x = at.x;
                    object.y = at.y;
                    object.w = at.w;
                    object.h = at.h;
                    if (this.arranged.indexOf(object) == -1)
                        this.arranged.push(object);

                    switch (at.type) {

                        case "left":   //find left-up corner coordinate position
                            var begin = -1;
                            var end = -1;
                            for (var k = 0; k < this.tempPoints.length; ++k) {
                                if (at.object.x == this.tempPoints[k].x &&
                                    at.object.y == this.tempPoints[k].y)  //left-up
                                {
                                    begin = k;
                                }
                                if (at.object.x == this.tempPoints[k].x &&  //left-down
                                    at.object.y + at.object.h == this.tempPoints[k].y) {
                                    end = k;
                                }
                                if (begin !== -1 && end !== -1) {
                                    break;
                                }
                            }
                            //put points before begin and after end

                            var right = {};
                            right.x = object.x + object.w;
                            right.y = object.y;
                            right.type = "QCT";
                            this.tempPoints.splice(begin, 0, right);
                            var left = {};
                            left.x = object.x;
                            left.y = object.y;
                            left.type = "QCT";
                            this.tempPoints.splice(begin, 0, left);

                            var bleft = {};
                            bleft.x = object.x;
                            bleft.y = object.y + object.h;
                            bleft.type = "QCT";
                            this.tempPoints.splice(end + 3, 0, bleft);

                            var bright = {};
                            bright.x = object.x + object.w;
                            bright.y = object.y + object.h;
                            bright.type = "QCT";
                            this.tempPoints.splice(end + 3, 0, bright);

                            break;
                        case "right":
                            var begin = -1;
                            for (var k = 0; k < this.tempPoints.length; ++k) {
                                if (at.object.x + at.object.w == this.tempPoints[k].x &&
                                    at.object.y == this.tempPoints[k].y)  //left-up
                                {
                                    begin = k;
                                    break;
                                }

                            }
                            //put points after begin and before end
                            var left = {};
                            left.x = object.x;
                            left.y = object.y;
                            left.type = "QCT";

                            this.tempPoints.splice(begin + 1, 0, left);
                            var right = {};
                            right.x = object.x + object.w;
                            right.y = object.y;
                            right.type = "QCT";
                            this.tempPoints.splice(begin + 2, 0, right);

                            var bright = {};
                            bright.x = object.x + object.w;
                            bright.y = object.y + object.h;
                            bright.type = "QCT";
                            this.tempPoints.splice(begin + 3, 0, bright);

                            var bleft = {};
                            bleft.x = object.x;
                            bleft.y = object.y + object.h;
                            bleft.type = "QCT";
                            this.tempPoints.splice(begin + 4, 0, bleft);
                            break;
                        case "up":
                            var begin = -1;
                            for (var k = 0; k < this.tempPoints.length; ++k) {
                                if (at.object.x == this.tempPoints[k].x &&
                                    at.object.y == this.tempPoints[k].y)  //left-up
                                {
                                    begin = k;
                                    break;
                                }

                            }
                            //put points after begin and before end
                            var bleft = {};
                            bleft.x = object.x;
                            bleft.y = object.y + object.h;
                            bleft.type = "QCT";
                            this.tempPoints.splice(begin + 1, 0, bleft);

                            var left = {};
                            left.x = object.x;
                            left.y = object.y;
                            left.type = "QCT";
                            this.tempPoints.splice(begin + 2, 0, left);
                            var right = {};
                            right.x = object.x + object.w;
                            right.y = object.y;
                            right.type = "QCT";
                            this.tempPoints.splice(begin + 3, 0, right);

                            var bright = {};
                            bright.x = object.x + object.w;
                            bright.y = object.y + object.h;
                            bright.type = "QCT";
                            this.tempPoints.splice(begin + 4, 0, bright);


                            break;
                        case "down":
                            var begin = -1;
                            for (var k = 0; k < this.tempPoints.length; ++k) {
                                if (at.object.x + at.object.w == this.tempPoints[k].x &&
                                    at.object.y + at.object.h == this.tempPoints[k].y)  //left-up
                                {
                                    begin = k;
                                    break;
                                }

                            }
                            //put points after begin and before end
                            var right = {};
                            right.x = object.x + object.w;
                            right.y = object.y;
                            right.type = "QCT";
                            this.tempPoints.splice(begin + 1, 0, right);

                            var bright = {};
                            bright.x = object.x + object.w;
                            bright.y = object.y + object.h;
                            bright.type = "QCT";
                            this.tempPoints.splice(begin + 2, 0, bright);

                            var bleft = {};
                            bleft.x = object.x;
                            bleft.y = object.y + object.h;
                            bleft.type = "QCT";
                            this.tempPoints.splice(begin + 3, 0, bleft);
                            var left = {};

                            left.x = object.x;
                            left.y = object.y;
                            left.type = "QCT";
                            this.tempPoints.splice(begin + 4, 0, left);
                            break;
                    }
                    if (this.tempPoints.length !== 0) {
                        for (var iii = 0; iii < this.tempPoints.length; ++iii)
                            for (var j = iii + 1; j < this.tempPoints.length - 1; ++j) {
                                if (this.tempPoints[iii] == this.tempPoints[j]) {
                                    this.tempPoints[iii] = null;
                                    this.tempPoints[j] = null;
                                }
                            }
                        this.processPolygon();
                    }
                }
//                var j=0;
//                while(this.arranged.length!== this.children.length)
//                {
//                    if (this.arranged[j] !== this.children[i]) {
//                        var at = this.calculateUpDownLeftRight(this.arranged[j], this.children[i]);
//                        if( at )
//                        {
//                            this.children[i].shape.x = at.x;
//                            this.children[i].shape.y = at.y;
//                            this.children[i].x = at.x;
//                            this.children[i].y = at.y;
//                            this.children[i].w = at.w;
//                            this.children[i].h = at.h;
//                            if(this.arranged.indexOf(this.children[i])==-1)
//                                this.arranged.push(this.children[i]);
//
//                            switch (at.type)
//                            {
//                                case "left":   //find left-up corner coordinate position
//                                    var begin = -1;
//                                    var end = -1;
//                                    for(var k=0; k<this.tempPoints.length; ++k)
//                                    {
//                                        if(this.arranged[j].x == this.tempPoints[k].x  &&
//                                            this.arranged[j].y == this.tempPoints[k].y  )  //left-up
//                                        {
//                                            begin = k;
//                                        }
//                                        if(this.arranged[j].x == this.tempPoints[k].x  &&  //left-down
//                                            this.arranged[j].y + this.arranged[j].h == this.tempPoints[k].y  )
//                                        {
//                                            end = k;
//                                        }
//                                        if(begin!==-1 && end !== -1)
//                                        {
//                                            break;
//                                        }
//                                    }
//                                    //put points before begin and after end
//
//                                    var right ={};
//                                    right.x = this.children[i].x + this.children[i].w;
//                                    right.y = this.children[i].y;
//                                    right.type = "QCT";
//                                    this.tempPoints.splice(begin,0,right);
//                                    var left ={};
//                                    left.x = this.children[i].x;
//                                    left.y = this.children[i].y;
//                                    left.type = "QCT";
//                                    this.tempPoints.splice(begin,0,left);
//
//                                    var bleft ={};
//                                    bleft.x = this.children[i].x;
//                                    bleft.y = this.children[i].y + this.children[i].h;
//                                    bleft.type = "QCT";
//                                    this.tempPoints.splice(end+3,0,bleft);
//
//                                    var bright ={};
//                                    bright.x = this.children[i].x + this.children[i].w;
//                                    bright.y = this.children[i].y + this.children[i].h;
//                                    bright.type = "QCT";
//                                    this.tempPoints.splice(end+3,0,bright);
//
//                                    break;
//                                case "right":
//                                    var begin = -1;
//                                    for(var k=0; k< this.tempPoints.length; ++k)
//                                    {
//                                        if(this.arranged[j].x + this.arranged[j].w== this.tempPoints[k].x  &&
//                                            this.arranged[j].y == this.tempPoints[k].y  )  //left-up
//                                        {
//                                            begin = k;
//                                            break;
//                                        }
//
//                                    }
//                                    //put points after begin and before end
//                                    var left ={};
//                                    left.x = this.children[i].x;
//                                    left.y = this.children[i].y;
//                                    left.type = "QCT";
//
//                                    this.tempPoints.splice(begin+1,0,left);
//                                    var right ={};
//                                    right.x = this.children[i].x + this.children[i].w;
//                                    right.y = this.children[i].y;
//                                    right.type = "QCT";
//                                    this.tempPoints.splice(begin+2,0,right);
//
//                                    var bright ={};
//                                    bright.x = this.children[i].x + this.children[i].w;
//                                    bright.y = this.children[i].y + this.children[i].h;
//                                    bright.type = "QCT";
//                                    this.tempPoints.splice(begin+3,0,bright);
//
//                                    var bleft ={};
//                                    bleft.x = this.children[i].x;
//                                    bleft.y = this.children[i].y + this.children[i].h;
//                                    bleft.type = "QCT";
//                                    this.tempPoints.splice(begin+4,0,bleft);
//                                    break;
//                                case "up":
//                                    var begin = -1;
//                                    for(var k=0; k<this.tempPoints.length; ++k)
//                                    {
//                                        if(this.arranged[j].x== this.tempPoints[k].x  &&
//                                            this.arranged[j].y == this.tempPoints[k].y  )  //left-up
//                                        {
//                                            begin = k;
//                                            break;
//                                        }
//
//                                    }
//                                    //put points after begin and before end
//                                    var bleft ={};
//                                    bleft.x = this.children[i].x;
//                                    bleft.y = this.children[i].y + this.children[i].h;
//                                    bleft.type = "QCT";
//                                    this.tempPoints.splice(begin+1,0,bleft);
//
//                                    var left ={};
//                                    left.x = this.children[i].x;
//                                    left.y = this.children[i].y;
//                                    left.type = "QCT";
//                                    this.tempPoints.splice(begin+2,0,left);
//                                    var right ={};
//                                    right.x = this.children[i].x + this.children[i].w;
//                                    right.y = this.children[i].y;
//                                    right.type = "QCT";
//                                    this.tempPoints.splice(begin+3,0,right);
//
//                                    var bright ={};
//                                    bright.x = this.children[i].x + this.children[i].w;
//                                    bright.y = this.children[i].y + this.children[i].h;
//                                    bright.type = "QCT";
//                                    this.tempPoints.splice(begin+4,0,bright);
//
//
//                                    break;
//                                case "down":
//                                    var begin = -1;
//                                    for(var k=0; k<this.tempPoints.length; ++k)
//                                    {
//                                        if(this.arranged[j].x + this.arranged[j].w == this.tempPoints[k].x  &&
//                                            this.arranged[j].y + this.arranged[j].h == this.tempPoints[k].y  )  //left-up
//                                        {
//                                            begin = k;
//                                            break;
//                                        }
//
//                                    }
//                                    //put points after begin and before end
//                                    var right ={};
//                                    right.x = this.children[i].x + this.children[i].w;
//                                    right.y = this.children[i].y;
//                                    right.type = "QCT";
//                                    this.tempPoints.splice(begin+1,0,right);
//
//                                    var bright ={};
//                                    bright.x = this.children[i].x + this.children[i].w;
//                                    bright.y = this.children[i].y + this.children[i].h;
//                                    bright.type = "QCT";
//                                    this.tempPoints.splice(begin+2,0,bright);
//
//                                    var bleft ={};
//                                    bleft.x = this.children[i].x;
//                                    bleft.y = this.children[i].y + this.children[i].h;
//                                    bleft.type = "QCT";
//                                    this.tempPoints.splice(begin+3,0,bleft);
//                                    var left ={};
//
//                                    left.x = this.children[i].x;
//                                    left.y = this.children[i].y;
//                                    left.type = "QCT";
//                                    this.tempPoints.splice(begin+4,0,left);
//                                    break;
//                            }
//                            break;
//                        }
//                    j++;
//                    }
//                }

            }
            return this;
        }
    },
    processPolygon: function () {
        this.shape.points.length = 0;
        for (var i = 0; i < this.tempPoints.length; ++i) {
            if (this.tempPoints[i]) {
                if(this.tempPoints[i])       //Here we need to know when draw the shape, we also add the offset again.
                {
                    this.tempPoints[i].x-=this.offsetX;
                    this.tempPoints[i].y-=this.offsetY;
                }
                var point = new PATHBUBBLES.Shape.PathPoint(this.tempPoints[i].x, this.tempPoints[i].y, "LT");
                if (this.shape.points.indexOf(point) == -1)
                    this.shape.points.push(point);
            }
        }
        return this;
    },
    calculateUpDownLeftRight: function (object, target) {
        var objects = [];
        var left = {};
        var right = {};
        var up = {};
        var down = {};
        left.x = object.x - target.w;
        left.y = target.y;
        left.w = target.w;
        left.h = target.h;
        left.flag = true;
        left.moveDistance = Math.abs(target.x - left.x);
        for (var i = 0; i < this.arranged.length; ++i) {
            if (this.detectOverlap(this.arranged[i], left)) {
                left.flag = false;
            }
        }
        left.type = "left";
        objects.push(left);

        right.x = object.x + object.w;
        right.y = target.y;
        right.w = target.w;
        right.h = target.h;
        right.flag = true;
        right.moveDistance = Math.abs(right.x - target.x);
        for (var i = 0; i < this.arranged.length; ++i) {
            if (this.detectOverlap(this.arranged[i], right)) {
                right.flag = false;
            }
        }
        right.type = "right";
        objects.push(right);
        up.x = target.x;
        up.y = object.y - target.h;
        up.w = target.w;
        up.h = target.h;
        up.flag = true;
        up.moveDistance = Math.abs(target.y - up.y);
        for (var i = 0; i < this.arranged.length; ++i) {
            if (this.detectOverlap(this.arranged[i], up)) {
                up.flag = false;
            }
        }
        up.type = "up";

        objects.push(up);
        down.x = target.x;
        down.y = object.y + object.h;
        down.w = target.w;
        down.h = target.h;
        down.flag = true;
        down.moveDistance = Math.abs(down.y - target.y);
        for (var i = 0; i < this.arranged.length; ++i) {
            if (this.detectOverlap(this.arranged[i], down)) {
                down.flag = false;
            }
        }
        down.type = "down";
        objects.push(down);
        return objects;
//        var index=-1;
//        var distance= Infinity;
//        for (var i = 0; i < objects.length; ++i) {
//            if(objects[i].flag !== false && objects[i].moveDistance <distance)
//            {
//                distance = objects[i].moveDistance;
//                index = i;
//            }
//        }
//        if(index !=-1)
//        {
//            return objects[index];
//        }
//        else
//            return null;

    },

    detectOverlap: function (object1, object2) {
        return (object1.x < object2.x + object2.w &&
            object1.x + object1.w > object2.x &&
            object1.y < object2.y + object2.h &&
            object1.h + object1.y > object2.y) ||
            (object2.x < object1.x + object1.w &&
                object2.x + object2.w > object1.x &&
                object2.y < object1.y + object1.h &&
                object2.h + object2.y > object1.y);
    },
    upGroup: function (object) {

    },
    setOffset: function () {
        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
    },
    draw: function (ctx) {
        if (this.shape.points.length) {
            this.setOffset();
            this.shape.draw(ctx);
        }
    }

};
