/**
 * Created by Yongnan on 6/25/2014.
 */

function Comparison(id) {
    this.id = id;
    this.group = [];

}

Comparison.prototype = {
    constructor: Comparison,
    groupComparedBubble: function () {
        if (Bubbles.length <= 1)
            alert("There is not enough bubble in the space!");
        for (var i = 1; i < Bubbles.length - 1; ++i) // Bubbles begins with 1
            for (var j = i + 1; j < Bubbles.length; ++j) {
                if (checkCollisions(i, j))    //If two bubbles are collisions, we should line up those two bubble
                {
                    var pos1 = getPositions(i);
                    var pos2 = getPositions(j);

                    //$("#container" + i).append($("#container" + j).children()[0]);
                    //this.group.push({1: i, 2: j});
                    var bubblediv = $(this.bubble_Compare_div(this.id, pos1[0][0], pos1[1][0]));
                    $("#bubble").append(bubblediv);
                    $("#bubble" + i).removeClass("shadow");
                    $("#bubble" + i).removeAttr("style");
                    $("#bubble" + j).removeAttr("style");
                    $("#bubble" + j).removeClass("shadow");
                    $("#compareContainer"+ this.id).append($("#bubble" + i)[0]);
                    $("#compareContainer"+ this.id).append($("#bubble" + j)[0]);
                    $(".drag").draggable();
                    var parent = $('#compare' + this.id);
                    parent.children(".dragheader").children(".close").click( function(){
                        parent.remove();//also remove navigation bar rectangle and bubble
                    });
                }
            }
    },
    bubble_Compare_div: function (id, positionX, positionY) {
        var tmp = '';
        tmp += '<div id="compare' + id + '" class="widget shadow drag" style="position: absolute; left:' + positionX + 'px; top:' + positionY + 'px; ">';
        tmp += '    <div class="dragheader">Compare';
        tmp += '    <span class="close">X</span>';
        tmp += '    </div>';
        tmp += '    <div id="compareContainer' + id + '" >';//$("#bubble" + id).children();
        tmp += '    </div>';
        tmp += '</div>';
        return tmp;
    }
};

