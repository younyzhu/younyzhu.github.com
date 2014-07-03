/**
 * Created by Yongnan on 7/3/2014.
 */
XMLLoader = function (){

};
XMLLoader.prototype = {
    constructor: XMLLoader,
    load: function(url,callback){
        var _this = this;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "xml",
            success: function (xml) {
                $(xml).find("Pathway").each(function () {
                    //alert($(this).text());
                    _this.parse($(this));
                });
            }
        });
    },
    parse: function($this){
        var compartmentBlock = $this.find("compartmentBlock");
        var complexBlock = $this.find("complexBlock");
        var proteinBlock = $this.find("proteinBlock");
        var physicalEntityBlock = $this.find("physicalEntityBlock");
        var smallMoleculeBlock = $this.find("smallMoleculeBlock");
        var DnaBlock = $this.find("DnaBlock");
        var reactionBlock = $this.find("reactionBlock");
        var edgeBlock = $this.find("edgeBlock");
    }
};
