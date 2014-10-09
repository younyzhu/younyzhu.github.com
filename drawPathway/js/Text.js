/**
 * Created by Yongnan on 7/3/2014.
 */
/**
 * Created by Yongnan on 7/2/2014.
 */
function Text(text )
{
    this.fillColor = '#666666';
    this.text = text;
    this.font = '8pt Calibri';
}

Text.prototype ={

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