const fs = require ('fs');
const readline = require('readline');
const yargs = require ('yargs');
const math = require('mathjs');

const tools = require('./tools.js');
const log = tools.log;
const show = tools.show;
const logtab = tools.logtab;

const NeuralNetwork = require('./NeuralNetwork');

var neuralNetwork = new NeuralNetwork(3,5,1,0.1);


//Get the data and metadata
var md = {};
let abort=false;
let e;
let n=0;

var data = readData('normalized_car_features.csv');
console.log(data.length);

var md = readMetadata('normalized_car_features.csv');
console.log(md.length);

for (let i=0; i<data.length; i++){
    console.log(data[i]);
}

// const readInterface = readline.createInterface({
//     input: fs.createReadStream('normalized_car_features.csv')
// });
//
// readInterface
//     .on('line', (line) => {
//         n++;
//         if (n == 1){ //header1: read metadata
//             let m = line.split(',');
//             if (m.length != 6){
//                 console.log (`Error: number of columns=${m.length} instead of 6 at line ${n} (metadata header). Aborting..`);
//                 abort=true;
//                 readInterface.close();
//                 readInterface.removeAllListeners();
//                 return;
//             }
//             md.mean_km = parseFloat(m[0]);
//             md.std_km = parseFloat(m[1]);
//             md.mean_age = parseFloat(m[2]);
//             md.std_age = parseFloat(m[3]);
//             md.min_price = parseFloat(m[4]);
//             md.max_price = parseFloat(m[5]);
//             return;
//         }
//         else if (n == 2){ //header2: skip
//             return;
//         }
//
//         let a = line.split(',');
//         if (a.length != 4){
//             console.log (`Error: number of columns=${a.length} instead of 4 at line ${n}. Aborting..`);
//             abort=true;
//             readInterface.close();
//             readInterface.removeAllListeners();
//         }
//         data.push(line);
//     })
//     .on('close', () => {
//         if (!abort){
//             console.log (`Finished: e=${e} n=${n}`);
//         }
//     });

function readData (filename){
    let lines = fs.readFileSync(filename, 'utf-8')
                    .split('\n')
                    .filter(isData);
    return (lines);
}

function readMetadata (filename){
    let lines = fs.readFileSync(filename, 'utf-8')
                    .split('\n')
                    .filter(isMetadata);
    return (lines);
}

function isMetadata(value, index){
    if (index == 1){
        return true;
    }
    else {
        return false;
    }
}

function isData(value, index){
    if (index > 1){
        return true;
    }
    else {
        return false;
    }

}



//Convert input and output into 2-dimensional arrays
// let input = [];
// let output = [];
// input.push([parseFloat(a[0])],[parseFloat(a[1])],[parseFloat(a[2])]);
// output.push([parseFloat(a[3])]);
// e = neuralNetwork.train(input, output, md);





function runTests(){
    let normInput = normalize(16800, 'Diesel', 5);
    let nKm = normInput[0];
    let nFuel = normInput[1];
    let nAge = normInput[2];

    let ans = neuralNetwork.query([[nKm], [nFuel], [nAge]]);
    show(denormalize(ans[0][0]));
}

function normalize(km, fuel, age){
    let nKm = (km - md.mean_km) / md.std_km;
    let nFuel = (fuel == 'Diesel') ? -1 : 1;
    let nAge = (age - md.mean_age) / md.std_age;
    return [md.nKm, md.nFuel, md.nAge];
}



function denormalize(nPrice) {
    let price = nPrice * (md.max_price - md.min_price) + md.min_price;
    return (price);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
