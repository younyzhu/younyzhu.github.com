/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/17/2014
 * @name        PathBubbles_text
 */
PATHBUBBLES.Text = function(text)
{
    this.fillColor = '#666666';
    this.text = text;
    this.font = '8pt Calibri';
};
PATHBUBBLES.Text.prototype ={
    constructor: PATHBUBBLES.Text,
    draw : function(x, y, ctx)
    {
        ctx.save();	// save the context so we don't mess up others
        ctx.font = this.font;
        // textAlign aligns text horizontally relative to placement
        ctx.textAlign = 'center';
        // textBaseline aligns text vertically relative to font style
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.fillColor;
        ctx.fillText(this.text, x, y);
        ctx.restore();	// restore context to what it was on entry
    },
    getTextHeight : function() {
        return 15;
    },
    getTextWidth : function(ctx) {
        ctx.save();
        ctx.font = this.font;
        var width = ctx.measureText(this.text).width;
        ctx.restore();
        return width;
    }
};
