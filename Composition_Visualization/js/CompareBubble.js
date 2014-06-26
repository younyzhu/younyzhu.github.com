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
                var $bubbleI = $("#bubble" + i);
                var $bubbleJ = $('#bubble' + j);
                if ($bubbleI.length > 0 && $bubbleJ.length > 0  )
                    if (checkCollisions(i, j) &&  Bubbles[i].COMPARE_FLAG !== true &&  Bubbles[j].COMPARE_FLAG !== true )    //If two bubbles are collisions, we should line up those two bubble
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
                        $bubbleI.removeClass("shadow drag ui-draggable");
                        $bubbleI.addClass("compare");
                        $bubbleI.children('#paraMenu').css({left: pos1.w ,top: '20px'});
                        $bubbleI.removeAttr("style");
                        $bubbleJ.removeAttr("style");
                        $bubbleJ.removeClass("shadow drag ui-draggable");
                        $bubbleJ.children('#paraMenu').css({left: pos1.w+ pos2.w,top: '20px'});

                        $("#compareContainer" + this.id).append( $bubbleI[0] );
                        $("#compareContainer" + this.id).append( $bubbleJ[0] );
                        $(".drag").draggable();
                        var parent = $('#compare' + this.id);
                        var _this = this;
                        parent.children(".dragheader").children(".close").click(function () {
                            parent.remove();//also remove navigation bar rectangle and bubble
                            for(var i=0; i < _this.group.length; ++i)
                            {
                                Bubbles[_this.group[i]] = null;
                            }
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

