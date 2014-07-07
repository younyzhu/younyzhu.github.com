/**
 * Created by Yongnan on 7/3/2014.
 */
function Inhibition(id, beginType, beginNodeId, endType, endNodeId ) {
    this.type = "I";          //INHIBITION    ===>   I
    this.id = id || 0;
    this.beginType = beginType;
    this.beginNodeId = beginNodeId;
    this.endType = endType;
    this.endNodeId = endNodeId;
    this.dotRadius = 7;
    this.dotLimitRadius = 2;
    this.fillColor = "#FF8000";
    //Complex is contained in the Compartment and the Compartment is contained in the Bubble
    //So Offset = offsetBubble + offsetCompartment
    this.offsetX =0;
    this.offsetY =0;
}
Inhibition.prototype = {
    draw: function (ctx, offsetX, offsetY) {
        this.offsetX =offsetX;
        this.offsetY =offsetY;
        var flag =0;
        for(var j=0; j< mainManagement.shapes.length; j++) {
            if(flag === 2)
                break;
            if(mainManagement.shapes[j].type === this.beginType && mainManagement.shapes[j].id === this.beginNodeId)
            {
                if(this.beginType === "B" ||this.beginType === "K" ) {           //because those two has already fixed to center
                    var x1 = mainManagement.shapes[j].offsetX + mainManagement.shapes[j].x;
                    var y1 = mainManagement.shapes[j].offsetY + mainManagement.shapes[j].y;
                }
                else {
                    var x1 = mainManagement.shapes[j].offsetX + mainManagement.shapes[j].w / 2 + mainManagement.shapes[j].x;
                    var y1 = mainManagement.shapes[j].offsetY + mainManagement.shapes[j].h / 2 + mainManagement.shapes[j].y;
                }
                    flag++;
                    continue;

            }
            if(mainManagement.shapes[j].type === this.endType && mainManagement.shapes[j].id === this.endNodeId)
            {
                if(this.endType === "B" ||this.endType === "K" ) {           //because those two has already fixed to center
                    var x2 = mainManagement.shapes[j].offsetX  + mainManagement.shapes[j].x;
                    var y2 = mainManagement.shapes[j].offsetY  + mainManagement.shapes[j].y;
                }
                else
                {
                    var x2 = mainManagement.shapes[j].offsetX + mainManagement.shapes[j].w / 2 + mainManagement.shapes[j].x;
                    var y2 = mainManagement.shapes[j].offsetY + mainManagement.shapes[j].h / 2 + mainManagement.shapes[j].y;
                }
                flag++;
            }
        }
        if(flag ==2) {
            //var dotCount = Math.ceil((this.dotRadius - this.dotLimitRadius ) / 0.2);
            var dx = x2 - x1;
            var dy = y2 - y1;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var dotCount = Math.ceil(distance /100 * (this.dotRadius - this.dotLimitRadius ));
            var spaceX = dx / (dotCount - 1);
            var spaceY = dy / (dotCount - 1);
            var newX = x1;
            var newY = y1;
            for (var i = 0; i < dotCount; i++) {
                this.drawDot(newX, newY, (this.dotRadius - this.dotLimitRadius ) * (1 - i / dotCount) + this.dotLimitRadius, this.fillColor, ctx);
                newX += spaceX;
                newY += spaceY;
            }
            this.drawDot(x1, y1, 2, "red", ctx);
            this.drawDot(x2, y2, 2, "red", ctx);
        }
    },
    drawDot: function (x, y, dotRadius, dotColor, ctx) {
        ctx.save();	// save the context so we don't mess up others
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = dotColor;
        ctx.fill();
        ctx.restore();	// restore context to what it was on entry
    }
};