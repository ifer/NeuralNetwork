const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const math = require('mathjs');

let dataPattern=[
    '0,0,0',
    '1,1,0',
    '0,1,1',
    '1,0,1'
];


var wstream = fs.createWriteStream('./xordata.csv');

for(let i=0; i<50000; i++){
    let line = dataPattern[math.floor(math.random(0,4))];
    wstream.write(line + '\n');
}
wstream.end();
