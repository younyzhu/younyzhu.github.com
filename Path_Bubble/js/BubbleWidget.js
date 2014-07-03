/**
 * Created by Yongnan on 7/2/2014.
 */
function BubbleWidget(id, name, mousePosX, mousePosY) {
    this.id = id;
    this.name = name;
    this.mousePosX = mousePosX;
    this.mousePosY = mousePosY;
}
BubbleWidget.prototype = {
    initHtml: function () {
        var bubblediv = $(this.bubble_div(this.id, this.name, this.mousePosX, this.mousePosY));
        $("#bubble").append(bubblediv);
        var $bubbleId = $("#bubble" +this.id);
        $bubbleId.draggable({ containment: '#bgCanvas', scroll: false,  //just dragable, do not need to move
            drag: function (ev, ui) {
                var position = ui.position;
            }
        });
        $('canvas').draggable({ containment: '#bgCanvas', scroll: false}).resizable({
            resize: function (ev, ui) {
                var size = ui.size;
            }
        });
        $bubbleId.find(".open_para").click(function () {
            $bubbleId.find("#paraMenu").toggle();
        });
        $bubbleId.find("#load").click(function () {
            var selected_file = $bubbleId.find('#input').get(0).files[0];
            if (selected_file === null) {
                alert("Please select a file!");
            }
            else {

            }
        });
        function toggle(i) {
            var $sectionId = $bubbleId.find("#section_" + i);
            var scn = $sectionId.css('display');
            var btn = $bubbleId.find("#tog")[0];
            if (scn == "block") {
                $sectionId.hide();
                btn.innerHTML = "[+]";
            }
            else {
                $sectionId.show();
                btn.innerHTML = "[-]";
            }
        }

        function createToggle(i) {
            return function () {
                toggle(i);
            };
        }

        for (var i = 1; i <= 6; i++) {
            $bubbleId.find("#plus_" + i).click(createToggle(i));
        }
    },
    bubble_div: function (id, name, mousePosX, mousePosY) {
        var tmp = '';
        tmp += '<div id ="bubble' + id + '" class="bubble shadow drag" style="position: absolute; left:' + mousePosX + 'px; top:' + mousePosY + 'px; ">';    //$("#bubble" + id)
        tmp += '    <div id ="drag' + id + '" class="dragheader">';
        tmp += name;
        tmp += '        <span class="open_para">O</span>';
        tmp += '    </div>';
        //
        tmp += '    <div id="container' + id + '" height="400" width="400">';//$("#bubble" + id).children();
        tmp += '    <canvas id="canvas" width = "400" height = "400" style="position: absolute;">';
        tmp += '    </canvas>';
        tmp += '    </div>';
        //
        tmp += '    <div id="paraMenu" class="widget shadow" style="position: absolute; left:385px; top:-17px; display: none">';
        tmp += '        <div class="para_header"> ToolBox ';
        tmp += '        </div>';
        tmp += '        <ul id="para_items">';
        tmp += "            <li id='plus_1'> <span id='tog'>[+] </span> Input Model </li> ";
        tmp += '            <div id= "section_1" style="display: none">';
        tmp += '                <input type="file" id="input" class="para">';
        tmp += '                <button type="button" id="load" class="para">Load</button>';
        tmp += '            </div>';
        tmp += '        </ul>';
        tmp += '    </div>';
        //
        tmp += '</div>';
        return tmp;
    }
};
