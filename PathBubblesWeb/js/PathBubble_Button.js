/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/27/2014
 * @name        PathBubble_Button
 */
PATHBUBBLES.Button = function (menuBar, id)
{
    this.id = id;
    this.menuBar = menuBar;
    this.x = 20;
    this.w = 80;
    this.y = 20 + this.id * this.h;
    this.h = 20;
};
PATHBUBBLES.Button.prototype = {
    constructor: PATHBUBBLES.Button,
    addButton: function () {
        this.menuBar.buttons.push(this);

        var $menuBarId = $('#'+ this.menuBar.bubble.id );
        if ($menuBarId.length > 0 ) {
            var tmp = '';
            tmp += '<input type="file" id=file'+ this.id + ' style="position: absolute; left:' + this.x + ' px; top:' + this.y + 'px; display: none;">';
            tmp += '<input type="button" id=button'+ this.id + ' style="position: absolute; left:' + this.x + ' px; top:' + this.y+25 + 'px; display: none;">';
            $menuBarId.append( $(tmp) );
        }
        else
        {
            var tmp = '';
            tmp += '<div id ="menuView' + this.menuBar.bubble.id + '" style="position: absolute; left:' + this.menuBar.x + ' px; top: ' + (this.menuBar.y + 20) + ' px; width: ' + this.menuBar.w +' px; height: ' + (this.menuBar.h - 20) +' px; ">';
            tmp += '<input type="file" id=file'+ this.id + ' style="position: absolute; left:' + this.x + ' px; top: ' + this.y + ' px; display: none;">';
            tmp += '<input type="button" id=button'+ this.id + ' value= "Load" style="position: absolute; left:' + this.x + ' px; top: ' + this.y+25 + ' px; display: none;">';
            tmp += '</div>';
            $("#bubble").append( $(tmp) );
        }
    },
    show:function(){
        var $menuBarbubble = $('#menuView'+ this.menuBar.bubble.id);
        $menuBarbubble.find('#file'+ this.id).show();
        $menuBarbubble.find('#button'+ this.id).show();
    },
    hide:function(){
        var $menuBarbubble = $('#menuView'+ this.menuBar.bubble.id);
        $menuBarbubble.find('#file'+ this.id).hide();
        $menuBarbubble.find('#button'+ this.id).hide();
    },
    update: function(){
        var $menuBarbubble = $('#menuView'+ this.menuBar.bubble.id);
        $menuBarbubble.find('#file'+ this.id).css({
           left:this.menuBar.x+10 ,
           top: this.menuBar.y+90,
           width: 180
        });
        $menuBarbubble.find('#button'+ this.id).css({
            left:this.menuBar.x+10 ,
            top: this.menuBar.y+115,
            width: 180
        });
    }
};