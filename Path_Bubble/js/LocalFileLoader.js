/**
 * Created by Yongnan on 7/6/2014.
 */
/**
 * Created by Yongnan on 6/22/2014.
 * This function is used for load nii formation file
 * Parted of the code is modified from https://github.com/xtk/X/blob/master/io/parserNII.js
 */

LocalFileLoader = function (id) {
    this.id = id;
    this.statusDomElement = null;
};
LocalFileLoader.prototype = {

    constructor: LocalFileLoader,
    load: function (url) {
        var _this = this;

        var check = new Check();
        if(typeof url === 'undefined')
        {
            alert("Please Choose the data which needs to load!");
            return;
        }

        var format = check.checkFileFormat(url.name);
        if(format ==="")
            return;

        var reader = new FileReader();
        this.statusDomElement = this.addStatusElement();
        $("#bubble")[0].appendChild(this.statusDomElement);
        reader.readAsText(url,"UTF-8");
        reader.onerror = function () {
            _this.statusDomElement.innerHTML = "Could not read file, error code is " + reader.error.code;
        };
        reader.onprogress = function (event) {
            _this.updateProgress(event);
        };

        reader.onload = function () {
            var tempdata = "";
            tempdata = reader.result;
            if (tempdata != null) {
                if(format === "XML")
                {
                    var parser = new DOMParser(),
                        xmlDom = parser.parseFromString(tempdata, "text/xml");
                    var xmlLoader = new XMLLoader();

                    $(xmlDom).find("Pathway").each(function () {
                        xmlLoader.parse($(this));
                    });
                }
                else if(format === "JSON")
                {
                    var json = JSON.parse(  tempdata  );
                    var jsonLoader = new JsonLoader();
                    jsonLoader.parse(json);
                }

            }
        };
    },
    addStatusElement: function () {
        var e = document.getElementById('status');
        if(e === null)
        {
            e = document.createElement( "div" );
            e.id = 'status';
        }
        else
            e.style.display = 'block';
        e.style.position = "absolute";
        e.style.fontWeight = 'bold';
        e.style.top = "50%";
        e.style.fontSize = "1.2em";
        e.style.textAlign = "center";
        e.style.color = "#f00";
        e.style.width = "100%";
        e.style.zIndex = 1000;
        e.innerHTML = "Loading ...";
        return e;
    },
    updateProgress: function ( progress ) {
        var message = "Loaded ";
        if ( progress.total ) {
            message += ( 100 * progress.loaded / progress.total ).toFixed(0) + "%";
        } else {
            message += ( progress.loaded / 1024 ).toFixed(2) + " KB";
        }
        this.statusDomElement.innerHTML = message;
        if( progress.loaded === progress.total  )
        {
            this.statusDomElement.style.display = 'none';
        }
    }

};


