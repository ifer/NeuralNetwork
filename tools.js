//tools.js

var sprintf = require('sprintf-js').sprintf;
var vsprintf = require('sprintf-js').vsprintf;

const math = require('mathjs');


var log = (entry) => {
    var now = new Date().toString();
    var line = `${now}: ${entry}`;
    console.log (line);
}

var show = (entry) => {
    console.log (entry);
}

var showtable = (obj, format) => {
    let array;
    if(math.typeOf(obj)==='Matrix')
        array = obj._data;
    else
        array = obj;

    for (let i=0; i<array.length; i++){
        console.log(vsprintf(format, array[i]));
    }
}



module.exports = {
    log,
    show,
    showtable,
}
