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

var showtable = (obj, format, title) => {
    let array;
    if(math.typeOf(obj)==='Matrix')
        array = obj._data;
    else
        array = obj;

    if (title){
        console.log(title + ":");
    }

    for (let i=0; i<array.length; i++){
        console.log(vsprintf(format, array[i]));
    }
    console.log('');
}



module.exports = {
    log,
    show,
    showtable,
}
