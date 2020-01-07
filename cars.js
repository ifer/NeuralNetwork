const fs = require ('fs');
const readline = require('readline');
const yargs = require ('yargs');
const math = require('mathjs');

const tools = require('./tools.js');
const log = tools.log;
const show = tools.show;
const logtab = tools.logtab;

const NeuralNetwork = require('./NeuralNetwork');



const trainingDatathreshold = 0.8;
const iterations = 100;
const learning_rate = 0.2;

var neuralNetwork = new NeuralNetwork(3, 5, 1, learning_rate);

//Get the data and metadata
var metadata = {};
let abort=false;
let errors;
let n=0;

var data = readData('normalized_car_features.csv');
// console.log(data.length);

metadata = readMetadata('normalized_car_features.csv');
// console.log(metadata);

[trainingData, testData ] = splitData(data, trainingDatathreshold);

// let smallSet =  data.filter((value, index) => {
//                         if(index < 10)
//                             return true;
//                         else
//                             return false;
//                     });

//train(smallSet);

console.log("## TRAINING ##");
train(trainingData);
// console.log("## TESTING ##");
// test(testData);
console.log("## PREDICTING ##");
runPredictions();


function train(dataset){
    shuffle(dataset);
    for (let j=0; j<iterations; j++){
        for (let i=0; i<dataset.length; i++){
            if (dataset[i].length == 0){  //empty line
                continue;
            }
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
            let getErrors = (j % 10 == 0) ? true : false;
            errors = neuralNetwork.train(input, output, getErrors);
        }
        if (j % 10 == 0){
            // console.log(`j=${j} error=${(math.transpose(errors))._data[0]}`);
            console.log(`j=${j} error=${errors}`);
        }
    }
}

function test(dataset){

    for (let i=0; i<dataset.length; i++){
        if (dataset[i].length == 0){  //empty line
            continue;
        }
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

        let getErrors = (i % 10 == 0) ? true : false;
        errors = neuralNetwork.query(input, output, getErrors);
        if (i % 50 == 0){
            // console.log(`j=${j} error=${(math.transpose(errors))._data[0]}`);
            console.log(`i=${i} error=${errors}`);
        }
    }
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


function runPredictions(){
    let features = [
        {km: 9000, fuel:'Essence', age:3},
        {km:168000, fuel:'Diesel', age:5},
    ];

    for (let i=0; i<features.length; i++){
        let criteria = normalize(features[i]);
        let nPrice = neuralNetwork.query(criteria);
        let price = denormalize('price', nPrice, metadata);
        show(`km=${features[i].km}, fuel=${features[i].fuel}, age=${features[i].age}, predicted price: ${price}`);
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
