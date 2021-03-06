/**
 * Created by Yongnan on 6/25/2014.
 */

function Comparison(id) {
    this.id = id;     //this id is to make sure which group this compare bubble in
    this.group = [];
}

Comparison.prototype = {
    constructor: Comparison,
    findCheckedBubbles: function () {
        var $bubble = $('#bubble');
        var _this = this;
        $bubble.children('.bubble').each(function () {
            if ($(this).find('#compareCheck').is(':checked') && !$(this).find('#compareCheck').is(':disabled')) {
                var currentId = parseInt($(this).attr('id').replace(/bubble/, ''));
                _this.group.push(currentId);
                $(this).find('#compareCheck').attr("disabled", true);
            }
        });
    },
    groupComparedBubble: function () {
        var _this = this;
        var color;
        var bubblediv;
        var pos,pos0;
        var wPos =0;
        for (var i = 0; i < this.group.length; ++i) {
            var id = this.group[i];
            var $bubbleId = $("#bubble" + id);
            Bubbles[id].COMPARE_FLAG = true;
            Bubbles[id].compareId = this.id;
            pos = getWidgetInformation(id);
            if (i === 0) {
                pos0 = getWidgetInformation(this.group[0]);
                bubblediv = $(this.bubble_Compare_div(this.id, pos0.left, pos0.top));
                $("#bubble").append(bubblediv);
            }
            wPos += pos.w;
            //pos.left += pos.w;
            $bubbleId.removeClass("shadow drag bubble ui-draggable ");
            $bubbleId.addClass("compare");
            $bubbleId.children('#paraMenu').css({left: wPos-17, top: '20px' });
            $bubbleId.removeAttr("style");

            $("#compareContainer" + this.id).append($bubbleId[0]);
            var parent = $('#compare' + this.id);
            parent.draggable({ containment: '#bgCanvas', scroll: false,  //just dragable
                drag: function (ev, ui) {
                    var position = ui.offset;  //drag stop position
                    var currentId = parseInt($(this).attr('id').replace(/compare/, ''));

                        for (var k = 0; k < navigationCanvas.shapes.length; ++k) {
                            if (navigationCanvas.shapes[k] === null)
                                continue;
                            if (navigationCanvas.shapes[k].type === "COMPARE" && navigationCanvas.shapes[k].Id === currentId) {
                                var currentPos = currentToBoxPos(position.left, position.top);
                                navigationCanvas.updateRectPos(k, currentPos.x, currentPos.y);
                            }
                        }
                }
            });

            parent.children(".dragheader").css('text-align', 'center');
            parent.children(".dragheader").children(".close").click(function () {
                _this.removeCompareBubble();
            });
            this.removeBubbles(id);
        }
        this.addCompareBubble(this.id,pos0,wPos,pos0.h);
    },
    removeBubbles: function (i) {
            for (var k = 0; k < navigationCanvas.shapes.length; ++k) {
                if (navigationCanvas.shapes[k] === null)
                    continue;
                if (navigationCanvas.shapes[k].type === "BUBBLE" && navigationCanvas.shapes[k].Id === i) {
                    navigationCanvas.remove(k);
                }
            }
    },
    addCompareBubble: function (id,pos, width,height){
        var currentPos = currentToBoxPos(pos.left, pos.top);
        var boxWidth = width / window.innerWidth * nvWidth;
        var boxHeight = height / (window.innerHeight - 50) * 50;
        var compareView = new Rectangle(navigationCanvas, currentPos.x, currentPos.y, boxWidth, boxHeight, null, true, id, "COMPARE");
        navigationCanvas.addShape(compareView);
    },
    removeCompareBubble: function () {
        for (var j = 0; j < this.group.length; ++j) {
            if (Bubbles[this.group[j]] !== null) {
                Bubbles[this.group[j]].COMPARE_FLAG = false;

                var le = Bubbles[this.group[j]].getlinkNodes().length;      //If the bubble has Node link
                for (var i = 0; i < le; ++i) {
                    var type = Bubbles[this.group[j]].getlinkNodes()[i].type;
                    if (type === "BUBBLE") {
                        var next = Bubbles[this.group[j]].getlinkNodes()[i].connectTo;
                        for (var k = 0; k < Bubbles[next].getlinkNodes().length; ++k) {
                            if (Bubbles[this.group[j]].getlinkNodes()[i].connectionId === Bubbles[next].getlinkNodes()[k].connectionId)
                                Bubbles[next].spliceNodeLink(k);
                        }
                    }
                    pathConnection.remove(Bubbles[this.group[j]].getlinkNodes()[i].connectionId);
                }

                Bubbles[this.group[j]].removeAllSelectors();
                Bubbles[this.group[j]] = null;
            }
        }
        for (var k = 0; k < navigationCanvas.shapes.length; ++k) {
            if (navigationCanvas.shapes[k] === null)
                continue;
            if (navigationCanvas.shapes[k].type === "COMPARE" && navigationCanvas.shapes[k].Id === this.id) {
                navigationCanvas.remove(k);
            }
        }
        $('#compare' + this.id).remove();
    },
    bubble_Compare_div: function (id, positionX, positionY) {
        var tmp = '';
        tmp += '<div id="compare' + id + '" class="compare shadow drag" style="position: absolute; left:' + positionX + 'px; top:' + positionY + 'px; ">';
        tmp += '    <div class="dragheader">Compare';
        tmp += '    <span class="close">X</span>';
        tmp += '    </div>';
        tmp += '    <div id="compareContainer' + id + '" >';//$("#bubble" + id).children();
        tmp += '    </div>';
        tmp += '</div>';
        return tmp;
    }
};
/*
 groupComparedBubble: function () {
 var _this = this;
 if (Bubbles.length <= 1)    //we get the Bubbles[0] =0;
 alert("There is not enough bubble in the space!");
 for (var i = 1; i < Bubbles.length - 1; ++i) // Bubbles begins with 1
 if (Bubbles[i] !== null)
 for (var j = i + 1; j < Bubbles.length; ++j)
 if (Bubbles[j] !== null) {
 var $bubbleI = $("#bubble" + i);
 var $bubbleJ = $('#bubble' + j);
 if ($bubbleI.length > 0 && $bubbleJ.length > 0)
 if (checkCollisions(i, j) && Bubbles[i].COMPARE_FLAG !== true && Bubbles[j].COMPARE_FLAG !== true)    //If two bubbles are collisions, we should line up those two bubble
 {
 Bubbles[i].COMPARE_FLAG = true;
 Bubbles[j].COMPARE_FLAG = true;
 Bubbles[i].compareId = this.id;
 Bubbles[j].compareId = this.id;

 this.group.push(i);
 this.group.push(j);
 var pos1 = getWidgetInformation(i);
 var pos2 = getWidgetInformation(j);

 var bubblediv = $(this.bubble_Compare_div(this.id, pos1.left, pos1.top));
 $("#bubble").append(bubblediv);
 $bubbleI.removeClass("shadow drag bubble ui-draggable ");
 $bubbleI.addClass("compare");
 $bubbleI.children('#paraMenu').css({left: pos1.w - 17, top:'20px' });
 $bubbleI.removeAttr("style");

 $bubbleJ.removeAttr("style");
 $bubbleJ.addClass("compare");
 $bubbleJ.removeClass("shadow drag bubble ui-draggable ");
 $bubbleJ.children('#paraMenu').css({left: pos1.w + pos2.w - 17, top: '20px'});
 //move i position
 var color;
 var currentPos = currentToBoxPos(pos1.left, pos1.top);
 for (var k = 0; k < navigationCanvas.shapes.length; ++k) {
 if (navigationCanvas.shapes[k] === null)
 continue;
 if (navigationCanvas.shapes[k].type === "BUBBLE" && navigationCanvas.shapes[k].Id === i)
 {
 navigationCanvas.updateRectPos(k, currentPos.x, currentPos.y);
 color = navigationCanvas.shapes[k].getColor();
 }

 }
 //move j position
 var currentPos = currentToBoxPos(pos1.w + pos1.left, pos1.top);
 for (var k = 0; k < navigationCanvas.shapes.length; ++k) {
 if (navigationCanvas.shapes[k] === null)
 continue;
 if (navigationCanvas.shapes[k].type === "BUBBLE" && navigationCanvas.shapes[k].Id === j)
 {
 navigationCanvas.updateRectPos(k, currentPos.x, currentPos.y);
 navigationCanvas.shapes[k].strokeColor = color;
 }
 }
 var $compareContainer = $("#compareContainer" + _this.id);
 $compareContainer.append($bubbleI[0]);
 $compareContainer.append($bubbleJ[0]);
 $(".drag").draggable({ containment: '#bgCanvas', scroll: false,  //just dragable
 drag: function (ev, ui) {
 var position = ui.offset;  //drag stop position
 var groups = Compares[_this.id].group;
 for(var t = 0; t<groups.length; t++)
 {
 for (var k = 0; k < navigationCanvas.shapes.length; ++k) {
 if (navigationCanvas.shapes[k] === null)
 continue;
 if (navigationCanvas.shapes[k].type === "BUBBLE" && navigationCanvas.shapes[k].Id === groups[t])
 {
 var currentPos = currentToBoxPos(position.left + t * $("#bubble"+groups[t]).width(), position.top);
 navigationCanvas.updateRectPos(k, currentPos.x, currentPos.y);
 }
 }
 }
 }
 });

 var parent = $('#compare' + this.id);
 parent.children(".dragheader").css('text-align','center');
 parent.children(".dragheader").children(".close").click(function () {
 //When remove a compare bubble, we should remove all the bubbles in the group (compare bubble, and also skip the bubble that has already been deleted)
 for (var m = 0; m < _this.group.length; ++m) {
 if(Bubbles[_this.group[m]] !== null)
 {
 Bubbles[_this.group[m]].COMPARE_FLAG = false;
 Bubbles[_this.group[m]].removeAllSelectors();
 Bubbles[_this.group[m]] = null;

 var groups = Compares[_this.id].group;
 for(var t = 0; t<groups.length; t++)
 {
 //move i position
 for (var k = 0; k < navigationCanvas.shapes.length; ++k) {
 if (navigationCanvas.shapes[k] === null)
 continue;
 if (navigationCanvas.shapes[k].type === "BUBBLE" && navigationCanvas.shapes[k].Id === groups[t])
 {
 navigationCanvas.remove(k);
 }
 }
 }
 }
 }
 parent.remove();
 });
 }
 }
 },
 */


