/**
 * Created by Yongnan on 7/3/2014.
 */
JsonLogLoader = function () {
    this.logData=null;
};
JsonLogLoader.prototype = {
    constructor: JsonLogLoader,
    load: function (url) {
        var _this = this;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "text",
            success: function (json) {
                if (typeof json == 'string' || json instanceof String) {
                    json = json.replace(/\\'/g, "'"); //dataType: "text"
                    json = json.replace(/\\"/g, '"'); //dataType: "text"
                    json = JSON.parse(json);
                    _this.logData = json;
                }
            }
        });
    }
};
