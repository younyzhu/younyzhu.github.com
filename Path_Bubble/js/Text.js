/**
 * Created by Yongnan on 7/3/2014.
 */
/**
 * Created by Yongnan on 7/2/2014.
 */
function Text(text )
{
    this.fillColor = 'blue';
    this.text = text;
}

Text.prototype ={

    draw : function(x, y, ctx)
    {
        ctx.save();	// save the context so we don't mess up others
        ctx.font = '12pt Calibri';
        // textAlign aligns text horizontally relative to placement
        ctx.textAlign = 'center';
        // textBaseline aligns text vertically relative to font style
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.fillColor;
        ctx.fillText(this.text, x, y);
        ctx.restore();	// restore context to what it was on entry
    }
};