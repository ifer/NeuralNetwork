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


var showtable = (obj,  title) => {
    let array;
    if(math.typeOf(obj)==='Matrix')
        array = obj._data;
    else
        array = obj;

    if (array.length == 0){
        console.log ("WARNING: " + title + "is empty");
        return;
    }

    if (title){
        console.log(title + ":");
    }

    let n = array[0].length; //Count columns
    let format = '';
    for (let i=0; i<n; i++){ //Build format as float
        format += "%+.15f ";
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
