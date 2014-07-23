/**
 * Created by Yongnan on 7/3/2014.
 */
XMLLoader = function () {
};
XMLLoader.prototype = {
    constructor: XMLLoader,
    load: function (url) {
        var _this = this;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "xml",
            success: function (xml) {
                $(xml).find("Pathway").each(function () {
                    _this.parse($(this));
                });
            }
        });
    },
    parse: function ($this) {
        var compartmentBlock = $this.find("compartmentBlock");
        this.complexBlock = $this.find("complexBlock");
        this.proteinBlock = $this.find("proteinBlock");
        this.physicalEntityBlock = $this.find("physicalEntityBlock");
        this.smallMoleculeBlock = $this.find("smallMoleculeBlock");
        this.dnaBlock = $this.find("DnaBlock");
        this.reactionBlock = $this.find("reactionBlock");
        this.edgeBlock = $this.find("edgeBlock");
        this.parseCompartmentBlock(compartmentBlock);
        this.parseEdges();
        this.arrangeGraphBox();
        if (graphs.length !== 0)
            springy = new Manage({graphs: graphs});
    },
    arrangeGraphBox: function(){
        if(graphs.length>=1) {
            for (var i = 0; i < graphs.length - 1; ++i)
                for (var j = i + 1; j < graphs.length; ++j) {
                    if (graphs[i].boundingY > graphs[j].boundingY) {
                        var tmp = graphs[i];
                        graphs[i] = graphs[j];
                        graphs[j] = tmp;
                    }
                }
            var index = [];
            index.push(0);
            for (i = 0, j = i + 1; i < graphs.length && j < graphs.length; j++) {
                if (graphs[i].boundingY === graphs[j].boundingY) {
                    continue;
                }
                index.push(j);
                i = j;
            }

            if (index[graphs.length - 1] !== graphs.length) {
                index.push(graphs.length);
            }
            var levels = [];
            if (index.length === 1) {
                var level = [];
                for (i = 0; i < graphs.length && i < index[0]; ++i) {
                    level.push(graphs[i]);
                }
                levels.push(level);
            }
            else {
                for (i = 0, j = i + 1; j < index.length; ++i, j++) {
                    var level = [];
                    for (var k = index[i]; k < graphs.length && k < index[j]; ++k) {
                        level.push(graphs[k]);
                    }
                    levels.push(level);
                }
            }

            for (var k = 0; k < levels.length; ++k) {
                if (levels[k].length > 1) {
                    for (var i = 0; i < levels[k].length - 1; ++i)
                        for (var j = i + 1; j < levels[k].length; ++j) {
                            if (levels[k][i].boundingX > levels[k][j].boundingX) {
                                var tmp = levels[k][i];
                                levels[k][i] = levels[k][j];
                                levels[k][j] = tmp;
                            }
                        }
                }
            }
            //   num / (w * h) === k  here, k = 0.0007
            //   w/h = 1/0.618 ==>   num / (h/0.618 * h)  === 0.0007  ==>       h = sqrt(num * 0.618/0.0007) ~= sqrt(num * 883)
            for (var i = 0; i < levels.length; ++i) {
                var max = 0;
                for (var j = 0; j < levels[i].length; ++j) {
                    var nodeNum = levels[i][j].nodes.length;
                    var idealH = Math.sqrt(nodeNum * 1200);
                    var idealW = idealH / 0.618;
                    levels[i][j].boundingH = idealH;
                    levels[i][j].boundingW = idealW;
                    if (max < idealH) {
                        max = idealH;
                    }
                }
                levels[i].maxHeight = max;
            }
            var paddingX = 5;
            var paddingY = 5;
            for (var i = 0; i < levels.length; ++i) {
                var tempy = 0;
                if (i === 0) {
                    tempy = paddingY;
                }
                else {
                    tempy = (i + 1) * paddingY;
                    for (k = 0; k < i; k++) {
                        tempy += levels[k].maxHeight;
                    }
                }
                //Now we know the ypos, width, height
                //so we need to get xpos
                var needWidth = -paddingX;
                for (var j = 0; j < levels[i].length; ++j) {
                    needWidth += paddingX + levels[i][j].boundingW;
                }
                var offsetX = 0;
                if (needWidth < window.innerWidth) {
                    offsetX = (window.innerWidth - needWidth) / 2.0;
                }
                var tempx = 0;
                for (var j = 0; j < levels[i].length; ++j) {
                    if (j === 0) {
                        tempx = 0;
                    }
                    else {
                        tempx = j * paddingY;
                        for (k = 0; k < j; k++) {
                            tempx += levels[i][k].boundingW;
                        }
                    }
                    levels[i][j].boundingX = tempx + offsetX;
                    levels[i][j].boundingY = tempy;
                }
            }
            for (var i = 0; i < levels.length; ++i) {
                for (var j = 0; j < levels[i].length; ++j) {
                    for (var k = 0; k < Data.compartments.length; ++k) {
                        if(levels[i][j].compartmentId === Data.compartments[k].id) {
                            Data.compartments[k].x = levels[i][j].boundingX;
                            Data.compartments[k].y = levels[i][j].boundingY;
                            Data.compartments[k].w = levels[i][j].boundingW;
                            Data.compartments[k].h = levels[i][j].boundingH;
                        }
                    }
                }
            }
        }
    },
    parseEdges: function () {
        var length = this.edgeBlock.children().length;
        for (var i = 0; i < length; ++i) {
            var currentEdge = this.edgeBlock.find('edge[j="' + i + '"]');
            var type = currentEdge.find("Name").text();
            var ends = currentEdge.find("Ends").text()
                .replace("(", "")   //remove the right bracket
                .replace(")", "") //remove the left bracket;
                .replace(/[_\s]/g, '').split(",");
            var beginType = ends[0];
            var beginIndex = parseInt(ends[1]);
            var endType = ends[2];
            var endIndex = parseInt(ends[3]);
            this.addEdges(type,i,beginType,beginIndex,endType,endIndex);
        }
    },
    addEdges: function (type, index, beginType, beginIndex, endType, endIndex) {
        if(beginIndex<0 ||endIndex<0)
            return ;
        switch (type) {
            case "J":  //Arrow (Black)
            {
                var beginNode = null, endNode = null;
                for(var j=0; j<Data.compartments.length; ++j)
                {
                    var data;
                    if (beginType === "C") {
                        data = Data.compartments[j].complexs;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "D") {
                        data = Data.compartments[j].dnas;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "P") {
                        data = Data.compartments[j].proteins;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "S") {
                        data = Data.compartments[j].molecules;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "E") {
                        data = Data.compartments[j].entitys;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "R") {
                        var flag =0;
                        while(flag !==-1)
                        {
                            if(flag ===0)
                            {
                                data = Data.compartments[j].associations;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === beginIndex) {
                                        beginNode = data[k];
                                        beginType = "B";
                                        flag = -1;
                                        break;
                                    }
                                }
                                flag =1;
                            }
                            else if(flag ===1)
                            {
                                data = Data.compartments[j].dissociations;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === beginIndex) {
                                        beginNode = data[k];
                                        beginType = "K";
                                        flag = -1;
                                        break;
                                    }
                                }
                                flag =2
                            }
                            else if(flag ===2)
                            {
                                data = Data.compartments[j].transitions;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === beginIndex) {
                                        beginNode = data[k];
                                        beginType = "T";
                                        flag = -1;
                                        break;
                                    }
                                }
                                flag = -1;
                            }
                        }
                    }

                    if (beginNode !== null) {
                        break;
                    }
                }
                for(var j=0; j<Data.compartments.length; ++j)
                {
                    var data;
                    if(endType === "C" )
                    {
                        data = Data.compartments[j].complexs;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];
                                break;
                            }
                        }
                    }
                    else if(endType === "D" )
                    {
                        data = Data.compartments[j].dnas;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];
                                break;
                            }
                        }
                    }
                    else if(endType === "P" )
                    {
                        data = Data.compartments[j].proteins;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];
                                break;
                            }
                        }
                    }
                    else if(endType === "S" )
                    {
                        data = Data.compartments[j].molecules;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];
                                break;
                            }
                        }
                    }
                    else if(endType === "E" )
                    {
                        data = Data.compartments[j].entitys;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];
                                break;
                            }
                        }
                    }
                    else if(endType === "R" )
                    {
                        var flag =0;
                        while(flag !==-1) {
                            if (flag === 0) {
                                data = Data.compartments[j].associations;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === endIndex) {
                                        endNode = data[k];
                                        endType = "B";
                                        flag =-1;
                                        break;
                                    }
                                }
                                flag = 1;
                            }
                            else if (flag === 1) {
                                data = Data.compartments[j].dissociations;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === endIndex) {
                                        endNode = data[k];
                                        endType = "K";
                                        flag =-1;
                                        break;
                                    }
                                }
                                flag = 2
                            }
                            else if (flag === 2) {
                                data = Data.compartments[j].transitions;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === endIndex) {
                                        endNode = data[k];
                                        endType = "T";
                                        flag =-1;
                                        break;
                                    }
                                }
                                flag =-1;
                            }
                        }
                    }
                    if(endNode !== null)
                    {
                        break;
                    }
                }
                if(beginNode.graphId === endNode.graphId)
                {
                    graphs[beginNode.graphId].addEachLink(beginNode.nodeIndex, endNode.nodeIndex);
                }
                var arrow = {};
                arrow.id = index;
                arrow.beginType = beginType;
                arrow.beginNodeId = beginIndex;
                arrow.endType = endType;
                arrow.endNodeId = endIndex;
                Data.arrows.push(arrow);
            }
            break;
            case "I":  //Inhibition (Cyan)
            {
                var beginNode = null, endNode = null;
                for(var j=0; j<Data.compartments.length; ++j)
                {
                    var data;
                    if (beginType === "C") {
                        data = Data.compartments[j].complexs;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "D") {
                        data = Data.compartments[j].dnas;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "P") {
                        data = Data.compartments[j].proteins;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "S") {
                        data = Data.compartments[j].molecules;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "E") {
                        data = Data.compartments[j].entitys;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "R") {
                        var flag =0;
                        while(flag !==-1)
                        {
                            if(flag ===0)
                            {
                                data = Data.compartments[j].associations;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === beginIndex) {
                                        beginNode = data[k];
                                        beginType = "B";
                                        flag = -1;
                                        break;
                                    }
                                }
                                flag =1;
                            }
                            else if(flag ===1)
                            {
                                data = Data.compartments[j].dissociations;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === beginIndex) {
                                        beginNode = data[k];
                                        beginType = "K";
                                        flag = -1;
                                        break;
                                    }
                                }
                                flag =2
                            }
                            else if(flag ===2)
                            {
                                data = Data.compartments[j].transitions;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === beginIndex) {
                                        beginNode = data[k];
                                        beginType = "T";
                                        flag = -1;
                                        break;
                                    }
                                }
                                flag = -1;
                            }
                        }

                    }

                    if (beginNode !== null) {
                        break;
                    }
                }
                for(var j=0; j<Data.compartments.length; ++j)
                {
                    var data;
                    if(endType === "C" )
                    {
                        data = Data.compartments[j].complexs;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];
                                break;
                            }
                        }
                    }
                    else if(endType === "D" )
                    {
                        data = Data.compartments[j].dnas;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];
                                break;
                            }
                        }
                    }
                    else if(endType === "P" )
                    {
                        data = Data.compartments[j].proteins;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];
                                break;
                            }
                        }
                    }
                    else if(endType === "S" )
                    {
                        data = Data.compartments[j].molecules;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];
                                break;
                            }
                        }
                    }
                    else if(endType === "E" )
                    {
                        data = Data.compartments[j].entitys;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];
                                break;
                            }
                        }
                    }
                    else if(endType === "R" )
                    {
                        var flag =0;
                        while(flag !==-1) {
                            if (flag === 0) {
                                data = Data.compartments[j].associations;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === endIndex) {
                                        endNode = data[k];
                                        endType = "B";
                                        flag =-1;
                                        break;
                                    }
                                }
                                flag = 1;
                            }
                            else if (flag === 1) {
                                data = Data.compartments[j].dissociations;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === endIndex) {
                                        endNode = data[k];
                                        endType = "K";
                                        flag =-1;
                                        break;
                                    }
                                }
                                flag = 2
                            }
                            else if (flag === 2) {
                                data = Data.compartments[j].transitions;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === endIndex) {
                                        endNode = data[k];
                                        endType = "T";
                                        flag =-1;
                                        break;
                                    }
                                }
                                flag =-1;
                            }
                        }
                    }
                    if(endNode !== null)
                    {
                        break;
                    }
                }
                if(beginNode.graphId === endNode.graphId)
                {
                    graphs[beginNode.graphId].addEachLink(beginNode.nodeIndex, endNode.nodeIndex);
                }
                var inhibition = {};
                inhibition.id = index;
                inhibition.beginType = beginType;
                inhibition.beginNodeId = beginIndex;
                inhibition.endType = endType;
                inhibition.endNodeId = endIndex;
                Data.inhibitions.push(inhibition);
            }
            break;
            case "A":  //Activation (Green)
            {
                var beginNode = null, endNode = null;
                for(var j=0; j<Data.compartments.length; ++j)
                {
                    var data;
                    if (beginType === "C") {
                        data = Data.compartments[j].complexs;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "D") {
                        data = Data.compartments[j].dnas;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "P") {
                        data = Data.compartments[j].proteins;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "S") {
                        data = Data.compartments[j].molecules;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "E") {
                        data = Data.compartments[j].entitys;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === beginIndex) {
                                beginNode = data[k];
                                break;
                            }
                        }
                    }
                    else if (beginType === "R") {
                        var flag =0;
                        while(flag !==-1)
                        {
                            if(flag ===0)
                            {
                                data = Data.compartments[j].associations;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === beginIndex) {
                                        beginNode = data[k];
                                        beginType = "B";
                                        flag = -1;
                                        break;
                                    }
                                }
                                flag =1;
                            }
                            else if(flag ===1)
                            {
                                data = Data.compartments[j].dissociations;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === beginIndex) {
                                        beginNode = data[k];
                                        beginType = "K";
                                        flag = -1;
                                        break;
                                    }
                                }
                                flag =2
                            }
                            else if(flag ===2)
                            {
                                data = Data.compartments[j].transitions;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === beginIndex) {
                                        beginNode = data[k];
                                        beginType = "T";
                                        flag = -1;
                                        break;
                                    }
                                }
                                flag = -1;
                            }
                        }

                    }

                    if (beginNode !== null) {
                        break;
                    }
                }
                for(var j=0; j<Data.compartments.length; ++j)
                {
                    var data;
                    if(endType === "C" )
                    {
                        data = Data.compartments[j].complexs;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];

                                break;
                            }
                        }
                    }
                    else if(endType === "D" )
                    {
                        data = Data.compartments[j].dnas;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];

                                break;
                            }
                        }
                    }
                    else if(endType === "P" )
                    {
                        data = Data.compartments[j].proteins;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];
                                break;
                            }
                        }
                    }
                    else if(endType === "S" )
                    {
                        data = Data.compartments[j].molecules;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];
                                break;
                            }
                        }
                    }
                    else if(endType === "E" )
                    {
                        data = Data.compartments[j].entitys;
                        for (var k = 0; k < data.length; ++k) {
                            if (data[k].id === endIndex) {
                                endNode = data[k];
                                break;
                            }
                        }
                    }
                    else if(endType === "R" )
                    {
                        var flag =0;
                        while(flag !==-1) {
                            if (flag === 0) {
                                data = Data.compartments[j].associations;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === endIndex) {
                                        endNode = data[k];
                                        endType = "B";
                                        flag =-1;
                                        break;
                                    }
                                }
                                flag = 1;
                            }
                            else if (flag === 1) {
                                data = Data.compartments[j].dissociations;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === endIndex) {
                                        endNode = data[k];
                                        endType = "K";
                                        flag =-1;
                                        break;
                                    }
                                }
                                flag = 2
                            }
                            else if (flag === 2) {
                                data = Data.compartments[j].transitions;
                                for (var k = 0; k < data.length; ++k) {
                                    if (data[k].id === endIndex) {
                                        endNode = data[k];
                                        endType = "T";
                                        flag =-1;
                                        break;
                                    }
                                }
                                flag =-1;
                            }
                        }
                    }
                    if(endNode !== null)
                    {
                        break;
                    }
                }
                if(beginNode.graphId === endNode.graphId)
                {
                    graphs[beginNode.graphId].addEachLink(beginNode.nodeIndex, endNode.nodeIndex);
                }
                var activation = {};
                activation.id = index;
                activation.beginType = beginType;
                activation.beginNodeId = beginIndex;
                activation.endType = endType;
                activation.endNodeId = endIndex;
                Data.activations.push(activation);
            }
            break;
        }
    },
    parseCompartmentBlock: function (compartmentBlock) {
        var length = compartmentBlock.children().length;
        var width = window.innerWidth;
        var height = window.innerHeight;
        var graphId = 0; //belongs to which graph

        for (var i = 0; i < length; ++i) {
            var currentCompartment = compartmentBlock.find('compartment[j="' + i + '"]');
            var name = currentCompartment.find("Name").text();
            var position = currentCompartment.find("Position").text()
                .replace("(", "")   //remove the right bracket
                .replace(")", "") //remove the left bracket;
                .split(",");
            var contain = currentCompartment.find("Contain").text()//when contain = "()"
                .replace("(", "")   //remove the right bracket
                .replace(")", "") //remove the left bracket;
                .replace(/[_\s]/g, '').split(",");
            if (contain.length > 1) //when length =1  just = "" //contain = "()"
            {
                var x = parseFloat(position[0]);
                var y = parseFloat(position[1]);
                var w = parseFloat(position[2]);
                var h = parseFloat(position[3]);
                var graph = new Graph();
                graph.compartmentId = i;
                Data.compartmentId.push(i);
                graph.setBoundingCB(x*width, y*height, width * w, height * h);
                var nodeIndex = 0; //the index in each graph

                var compartment ={};
                compartment.childOffsetx = x*width;
                compartment.childOffsety = y*height;
                compartment.name = name;
                compartment.x = x*width;
                compartment.y = y*height;
                compartment.w = width * w;
                compartment.h = height * h;
                compartment.id = i;
                compartment.complexs = [];
                compartment.dnas = [];
                compartment.proteins = [];
                compartment.molecules = [];
                compartment.associations = [];
                compartment.dissociations = [];
                compartment.transitions = [];
                compartment.entitys = [];

                var len = contain.length / 2;
                for (var j = 0; j < len; ++j) {
                    var type = contain[2 * j];
                    var index = parseInt(contain[2 * j + 1]);
                    this.addElement(compartment, type, index, graph, graphId, nodeIndex);
                    nodeIndex++;
                }
                Data.compartments.push(compartment);
                graphs.push(graph);
                graphId++;
            }
        }
    },
    addElement: function (compartment, type, index,graph, graphId, nodeIndex) {

        switch (type) {
            case "C":  //COMPLEX
            {
                //if (comparmentId < mainManagement.shapes.length) {
                    var complexE = this.complexBlock.find('complex[j="' + index + '"]'); //Complex we do not need to use the name
                    var position = complexE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                var complex = {};
                complex.id = index;
                complex.x = position[0] * compartment.w;
                complex.y = position[1] * compartment.h;
                complex.w = 20;
                complex.h = 6;

                complex.graphId = graphId;
                complex.nodeIndex = nodeIndex;
                graph.addEachNode(nodeIndex, complex);
                compartment.complexs.push(complex);
                break;
            }
            case "E": //Entity
            {
                //if (comparmentId < mainManagement.shapes.length) {
                    var entityE = this.physicalEntityBlock.find('physicalEntity[j="' + index + '"]'); //Complex we do not need to use the name
                var name = entityE.find("Name").text();
                    var position = entityE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                var entity = {};
                entity.id = index;
                entity.x = position[0].x * compartment.w;
                entity.y = position[1].y * compartment.h;
                entity.name = name;

                entity.w = 40;
                entity.h = 15;
                entity.graphId = graphId;
                entity.nodeIndex = nodeIndex;
                graph.addEachNode(nodeIndex, entity);
                compartment.entitys.push(entity);
                break;
            }
            case "S":     //MOLECULE
            {

                    var moleculeE = this.smallMoleculeBlock.find('smallMolecule[j="' + index + '"]'); //Complex we do not need to use the name
                var name = moleculeE.find("Name").text();
                    var position = moleculeE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                var molecule = {};
                molecule.id = index;
                molecule.x = position[0].x * compartment.w;
                molecule.y = position[1].y * compartment.h;
                molecule.name = name;

                molecule.w = 40;
                molecule.h = 15;

                molecule.graphId = graphId;
                molecule.nodeIndex = nodeIndex;
                graph.addEachNode(nodeIndex, molecule);
                compartment.molecules.push(molecule);
                break;
            }
            case "P":     //PROTEIN
            {
                //if (comparmentId < mainManagement.shapes.length) {
                    var proteinE = this.proteinBlock.find('protein[j="' + index + '"]'); //Complex we do not need to use the name
                var name = proteinE.find("Name").text();
                    var position = proteinE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                var protein = {};
                protein.id = index;
                protein.name = name;
                protein.x = position[0].x * compartment.w;
                protein.y = position[1].y * compartment.h;
                protein.w = 40;
                protein.h = 15;

                protein.graphId = graphId;
                protein.nodeIndex = nodeIndex;
                graph.addEachNode(nodeIndex, protein);
                compartment.proteins.push(protein);
                break;
            }
            case "D":     //DNA
            {
                //if (comparmentId < mainManagement.shapes.length) {
                    var dnaE = this.dnaBlock.find('Dna[j="' + index + '"]'); //Complex we do not need to use the name
                var name = dnaE.find("Name").text();
                    var position = dnaE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                var dna = {};
                dna.id = index;
                dna.name = name;
                dna.x = position[0].x * compartment.w;
                dna.y = position[1].y * compartment.h;
                dna.w = 40;
                dna.h = 15;

                dna.graphId = graphId;
                dna.nodeIndex = nodeIndex;
                graph.addEachNode(nodeIndex, dna);
                compartment.dnas.push(dna);
                break;
            }
            case "R":   //Reaction
            {
                //if (comparmentId < mainManagement.shapes.length) {
                    var reactionE = this.reactionBlock.find('reaction[j="' + index + '"]'); //Complex we do not need to use the name
                    var position = reactionE.find("Position").text()
                        .replace("(", "")   //remove the right bracket
                        .replace(")", "") //remove the left bracket;
                        .split(",");
                    var typeR = reactionE.find("Type").text();
                    if(typeR ==="K")
                    {
                        var dissociation = {};
                        dissociation.id = index;
                        dissociation.x = position[0].x * compartment.w;
                        dissociation.y = position[1].y * compartment.h;

                        dissociation.w = 6;
                        dissociation.h = 6;
                        dissociation.graphId = graphId;
                        dissociation.nodeIndex = nodeIndex;
                        graph.addEachNode(nodeIndex, dissociation);
                        compartment.dissociations.push(dissociation);
                    }
                    else if(typeR === "T")
                    {
                        var transition = {};
                        transition.id = index;
                        transition.x = position[0].x * compartment.w;
                        transition.y = position[1].y * compartment.h;

                        transition.w = 6;
                        transition.h = 6;
                        transition.graphId = graphId;
                        transition.nodeIndex = nodeIndex;
                        graph.addEachNode(nodeIndex, transition);
                        compartment.transitions.push(transition);
                    }
                    else if(typeR === "B")
                    {
                        var association = {};
                        association.id = index;
                        association.x = position[0].x * compartment.w;
                        association.y = position[1].y * compartment.h;
                        association.w = 6;
                        association.h = 6;
                        association.graphId = graphId;
                        association.nodeIndex = nodeIndex;
                        graph.addEachNode(nodeIndex, association);
                        compartment.associations.push(association);
                    }
                    break;
            }
        }
    }
};
