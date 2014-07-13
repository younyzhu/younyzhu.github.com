/**
 * Created by Yongnan on 7/3/2014.
 */

function Arrow(id, beginType, beginNodeId, endType, endNodeId )
{
    this.type = "J";  //ARROW     ===>   J
    this.id = id;
    this.beginType = beginType;
    this.beginNodeId = beginNodeId;
    this.endType = endType;
    this.endNodeId = endNodeId;
    this.fillColor = "C2C2C2";
    //Complex is contained in the Compartment and the Compartment is contained in the Bubble
    //So Offset = offsetBubble + offsetCompartment
    this.offsetX =0;
    this.offsetY =0;
}
Arrow.prototype ={

    draw: function (ctx, offsetX, offsetY) {
        this.offsetX =offsetX;
        this.offsetY =offsetY;
        var flag =0;
        for(var j=0; j< mainManagement.shapes.length; j++) {
            if(flag === 2)
                break;
            if(mainManagement.shapes[j].type === this.beginType && mainManagement.shapes[j].id === this.beginNodeId)
            {
                if(this.beginType === "B" ||this.beginType === "K" )
                {           //because those two has already fixed to center
                    var x1 = mainManagement.shapes[j].offsetX + mainManagement.shapes[j].x;
                    var y1 = mainManagement.shapes[j].offsetY + mainManagement.shapes[j].y;
                }
                else
                {
                    var x1 = mainManagement.shapes[j].offsetX + mainManagement.shapes[j].w /2 + mainManagement.shapes[j].x;
                    var y1 = mainManagement.shapes[j].offsetY + mainManagement.shapes[j].h /2 + mainManagement.shapes[j].y;
                }

                flag++;
                continue;
            }
            if(mainManagement.shapes[j].type === this.endType && mainManagement.shapes[j].id === this.endNodeId)
            {
                if(this.endType === "B" ||this.endType === "D" ) {
                    var x2 = mainManagement.shapes[j].offsetX + mainManagement.shapes[j].x;
                    var y2 = mainManagement.shapes[j].offsetY + mainManagement.shapes[j].y;
                }
                else
                {
                    var x2 = mainManagement.shapes[j].offsetX + mainManagement.shapes[j].w / 2 + mainManagement.shapes[j].x;
                    var y2 = mainManagement.shapes[j].offsetY + mainManagement.shapes[j].h / 2 + mainManagement.shapes[j].y;
                }
                 flag++;
            }
        }
        if(flag ==2)
        {
            ctx.save();	// save the context so we don't mess up others
            ctx.fillStyle = this.fillColor;
            ctx.beginPath();
            if(Math.abs(y1 - y2) > Math.abs(x1 -x2))
            {
                ctx.moveTo(x1-2.5, y1 );
                ctx.lineTo(x1+2.5, y1 );
                ctx.lineTo(x2, y2);
            }
            else
            {
                ctx.moveTo(x1, y1-2.5 );
                ctx.lineTo(x1, y1+2.5 );
                ctx.lineTo(x2, y2);
            }
            ctx.fill();
            ctx.closePath();
            ctx.restore();	// restore context to what it was on entry
        }
    }
};
