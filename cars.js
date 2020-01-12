const fs = require ('fs');
const readline = require('readline');
const yargs = require ('yargs');
const math = require('mathjs');

const tools = require('./tools.js');
const log = tools.log;
const show = tools.show;
const showtable = tools.showtable;

const NeuralNetwork = require('./NeuralNetwork');


const trainingDatathreshold = 0.8; //percentage of training set
const epochs = 10;
const learning_rate = 0.1;

var neuralNetwork = new NeuralNetwork(3, 10, 1, learning_rate);

//Get the data and metadata
var metadata = {};
let abort=false;
let errors;
let n=0;


var data = readData('car_normalized_features.csv');
// console.log(data.length);

metadata = readMetadata('car_normalized_features.csv');
// console.log(metadata);

[trainingData, testData ] = splitData(data, trainingDatathreshold);

//For debugging
// let smallSet =  data.filter((value, index) => {
//                         if(index < 10)
//                             return true;
//                         else
//                             return false;
//                     });
//
// train(smallSet);

console.log("## TRAINING ##");
train(trainingData);

try {
    neuralNetwork.saveModel("cars_model.dat");
}
catch(error) {
  console.error(error);
  return;
}

console.log("## TESTING ##");
test(testData);

console.log("## PREDICTING ##");
runPredictions();


function train(dataset){
    shuffle(dataset);
    for (let j=0; j<epochs; j++){
        let sqerr = 0.0;
        let n = 0;
        for (let i=0; i<dataset.length; i++){
            if (dataset[i].length == 0){  //empty line
                continue;
            }
            n++;

            let a = dataset[i].split(',');
            if (a.length != 4){
                console.log (`Error: number of columns=${a.length} instead of 4 at line ${n}. Aborting..`);
                break;
            }
            a = a.map((x)=>{return parseFloat(x)});
            let input = [a[0], a[1], a[2]];
            let output = [a[3]];

            sqerr += neuralNetwork.train(input, output, true);
            //Add square errors
            // sqerr += neuralNetwork.train(input, output, true);
            // show(`sqerr=${sqerr}`);

        }
        let meanSquaredError = (sqerr / n).toFixed(8);
        console.log (`Epoch: ${j+1}  Mean squared error=${meanSquaredError}`);
    }
}

function test(dataset){

    let sqerr = 0;
    let n =  0;
    let sumdiff = 0.0;
    let sumsqerr = 0.0;

    for (let i=0; i<dataset.length; i++){
        if (dataset[i].length == 0){  //empty line
            continue;
        }
        n++;

        let a = dataset[i].split(',');
        if (a.length != 4){
            console.log (`Error: number of columns=${a.length} instead of 4 at line ${n}. Aborting..`);
            break;
        }
        //Convert input and output into 2-dimensional arrays
        let input = [];
        let output = [];
        input.push([parseFloat(a[0])],[parseFloat(a[1])],[parseFloat(a[2])]);
        output.push([parseFloat(a[3])]);

        [target, output] = neuralNetwork.query(input, output, true);


        sqerr = neuralNetwork.squaredError(target, output);
        sumsqerr += sqerr;
        let targetPrice = denormalize('price',  target._data , metadata);
        let outputPrice = denormalize('price',  output._data , metadata);
        let diff = math.abs(targetPrice - outputPrice) / targetPrice;
        sumdiff+=diff;
        // console.log(`Predicted: ${outputPrice} actual:${targetPrice} diff=${diff.toFixed(5)} squared error=${sqerr.toFixed(8)}` );
    }
    // let meanSquaredError = (sqerr / n).toFixed(8);
    // console.log (`Testing result: Mean Squared Error=${meanSquaredError}`);
    let meanDiff = (sumdiff / n).toFixed(8);
    let meanSquaredError = (sumsqerr / n).toFixed(4);
    console.log (`Testing result: Mean diff=${meanDiff} Mean squared error=${meanSquaredError}`);
}


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
    let line = lines[0];

    let m = line.split(',');
    if (m.length != 6){
        console.log (`Error: number of columns=${m.length} instead of 6 at line 1 (metadata header). Aborting..`);
        return;
    }
    md={};
    md.mean_km = parseFloat(m[0]);
    md.std_km = parseFloat(m[1]);
    md.mean_age = parseFloat(m[2]);
    md.std_age = parseFloat(m[3]);
    md.min_price = parseFloat(m[4]);
    md.max_price = parseFloat(m[5]);

    return (md);
}

function splitData (data, threshold){
    trainRows = math.floor(data.length * threshold);
    trainingSet = data.filter((value, index) => {
                        if(index < trainRows)
                            return true;
                        else
                            return false;
                    });


    testRows = data.length - trainRows;
    testSet = data.filter((value, index) => {
                        if(index >= trainRows)
                            return true;
                        else
                            return false;
                    });

    return [trainingSet, testSet]

}

function isMetadata(value, index){
    if (index == 0){
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

/*



200000	Diesel	12	7386
*/

function runPredictions(){
    let features = [
        {km: 9000, fuel:'Essence', age:1, target:32180},
        {km:100000, fuel:'Essence', age:5, target:16689},
        {km:50000, fuel:'Diesel', age:1, target: 21838},
        {km:1500, fuel:'Diesel', age:1, target:31352},
        {km:150000, fuel:'Diesel', age:10, target:8919},
        {km:200000, fuel:'Essence', age:10, target:6236},
        {km:200000, fuel:'Diesel', age:12, target:6327},
        {km:168000, fuel:'Diesel', age:5, target:11654},
    ];

    for (let i=0; i<features.length; i++){
        let criteria = normalize(features[i]);
        let nPrice = neuralNetwork.query(criteria);
        let price = denormalize('price', nPrice, metadata);
        let diffrate = ((price - features[i].target)*100/features[i].target).toFixed(3);
        show(`km=${features[i].km}, fuel=${features[i].fuel}, age=${features[i].age}, predicted price: ${price}, target: ${features[i].target} diff: ${diffrate}%`);
    }
}

function normalize(features){
    nKm = (features.km - metadata.mean_km) / metadata.std_km;
    nFuel = (features.fuel == 'Diesel') ? -1 : 1;
    nAge = (features.age - metadata.mean_age) / metadata.std_age;
    return [[nKm], [nFuel], [nAge]];
}

// EXAMPLES denormalize
// let km     = denormalize('km',     nKm    , metadata);
// let fuel   = denormalize('fuel',   nFuel  , metadata);
// let age    = denormalize('age',    nAge   , metadata);
// let price  = denormalize('price',  nPrice , metadata);
// let target = denormalize('target', nTarget, metadata);

function denormalize(key, value, md){
    if (key == 'price'){
        let price = value * (md.max_price - md.min_price) + md.min_price;
        return (price.toFixed(0));
    }
    if (key == 'target'){
        let target = value * (md.max_price - md.min_price) + md.min_price;
        return (target.toFixed(0));
    }
    else if (key == 'km'){
        let km = (value * md.std_km) + md.mean_km;
        return km.toFixed(0);
    }
    else if (key == 'fuel'){
        let fuel = (value == -1) ? 'Diesel' : 'Essence';
        return fuel;
    }
    else if (key == 'age'){
        let age = (value * md.std_age) + md.mean_age;
        return age.toFixed(0);
    }
    else {
        return undefined;
    }
}



function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}



function denormalize(key, value, md){
    if (key == 'price'){
        let price = value * (md.max_price - md.min_price) + md.min_price;
        return (price.toFixed(0));
    }
    if (key == 'target'){
        let target = value * (md.max_price - md.min_price) + md.min_price;
        return (target.toFixed(0));
    }
    else if (key == 'km'){
        let km = (value * md.std_km) + md.mean_km;
        return km.toFixed(0);
    }
    else if (key == 'fuel'){
        let fuel = (value == -1) ? 'Diesel' : 'Essence';
        return fuel;
    }
    else if (key == 'age'){
        let age = (value * md.std_age) + md.mean_age;
        return age.toFixed(0);
    }
    else {
        return undefined;
    }
}
