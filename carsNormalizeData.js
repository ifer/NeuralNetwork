const fs = require ('fs');
const readline = require('readline');
const math = require('mathjs');

const tools = require('./tools.js');
const log = tools.log;
const show = tools.show;
const logtab = tools.logtab;

const readInterface = readline.createInterface({
    input: fs.createReadStream('car_features.csv'),
    // output: process.stdout,
    console: false
});

var cleanedData = [];
var mean_km;
var std_km;
var mean_age;
var std_age;
var min_price;
var max_price;

// cleaning: we keep the car Diesel and Essence for which the price is higher than 1000 euros
// also removing the headers column
let abort=false;
let n=0;
let km = [];
let age = [];
let price = [];
readInterface
    .on('line', (line) => {
        n++;
        if (n == 1) //header
            return;

        let a = line.split(',');
        if (a.length != 4){
            console.log (`Error: number of columns=${a.length} instead of 4 at line ${n}. Aborting..`);
            abort=true;
            readInterface.close();
            readInterface.removeAllListeners();
        }

        let car = {};
        car.km = parseInt(a[0]);
        car.fuel = a[1];
        car.age = parseInt(a[2]);
        car.price = parseInt(a[3]);
        if ((car.fuel == 'Diesel' || car.fuel == 'Essence') && car.price > 1000){
            cleanedData.push(car);
        }


    })
    .on('close', () => {
        if (!abort){
            console.log (`Finished: size of original=${n-1} size of cleaned = ${cleanedData.length}`);
            normalize();
            writeToFile();
        }
    });

function normalize(){
    //standardize kilometers: (x - mean)/std
    let km = cleanedData.map((value, index) => {return value['km']});
    mean_km = math.mean(km);
    std_km = math.std(km);
    // console.log(`mean_km=${mean_km}, std_km=${std_km}`);
    cleanedData.map((x) => {x['km']=((parseInt(x['km']) - mean_km)/std_km).toFixed(5)});
    // for(let i=0; i<8; i++){
    //     show(cleanedData[i]["km"]);
    // }

    // binary convert fuel: Diesel = -1, Essence = 1
    cleanedData.map((x) => {x['fuel'] = (x['fuel'] == 'Diesel')? -1 : 1});
    // for(let i=0; i<8; i++){
    //     show(cleanedData[i]['fuel']);
    // }

    // standardize age: (x - mean)/std
    let age = cleanedData.map((value, index) => {return value['age']});
    mean_age = math.mean(age);
    std_age = math.std(age);
    // console.log(`mean_age=${mean_age}, std_age=${std_age}`);
    cleanedData.map((x) => {x['age']=((parseInt(x['age']) - mean_age)/std_age).toFixed(5)});
    // for(let i=0; i<8; i++){
    //     show(cleanedData[i]['age']);
    // }

    // standardize price: (x - min)/(max - min)
    let price = cleanedData.map((value, index) => {return value['price']});
    min_price = math.min(price);
    max_price = math.max(price);
    cleanedData.map((x) => {x['price'] = ((parseInt(x['price']) - min_price)/(max_price - min_price)).toFixed(5) });
    // for(let i=0; i<8; i++){
    //     show(cleanedData[i]['price']);
    // }
}

function writeToFile(){
    var wstream = fs.createWriteStream('./normalized_car_features.csv');

    let header1 =  mean_km + "," + std_km  + "," + mean_age +   "," +  std_age  + "," +  min_price  + "," +  max_price;
    wstream.write(header1 + '\n');

    let header2 = 'km,fuel,age,price';
    wstream.write(header2 + '\n');

    for(let i=0; i<cleanedData.length; i++){
    // for(let i=0; i<10; i++){
        // show(cleanedData[i]);
        let line = cleanedData[i]['km'] + ',' + cleanedData[i]['fuel'] + ',' + cleanedData[i]['age'] + ',' + cleanedData[i]['price'];
        wstream.write(line + '\n');
    }
    wstream.end();
}
