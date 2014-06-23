/**
 * Created by Yongnan on 6/22/2014.
 * Part of code modified from https://github.com/xtk/X/blob/master/io/loader.js
 */
var extensions =[
     'DATA',
     'GZ',
     'NII'
];
function checkFileFormat (filepath){
    //get the file extension
    var extension = filepath.split('.').pop().toUpperCase();
    // support no extensions
    if (extension == filepath.toUpperCase()) {
        // this means no extension
        extension = '';
    }
    // check if the file format is supported
    if( extensions.indexOf(extension) === -1) {
        throw new Error('The ' + extension + ' file format is not supported.');
    }
    return extension;
}
