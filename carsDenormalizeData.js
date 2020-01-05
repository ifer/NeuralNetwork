const fs = require ('fs');
const readline = require('readline');
const math = require('mathjs');

const tools = require('./tools.js');
const log = tools.log;
const show = tools.show;
const logtab = tools.logtab;

const readInterface = readline.createInterface({
    input: fs.createReadStream('normalized_car_features.csv'),
    // output: process.stdout,
    console: false
});

var denormData = [];

// cleaning: we keep the car Diesel and Essence for which the price is higher than 1000 euros
// also removing the headers column
let abort=false;
let n=0;
let md = {};

readInterface
    .on('line', (line) => {
        n++;
        if (n == 1){ //header1: read metadata
            let m = line.split(',');
            if (m.length != 6){
                console.log (`Error: number of columns=${m.length} instead of 6 at line ${n} (metadata header). Aborting..`);
                abort=true;
                readInterface.close();
                readInterface.removeAllListeners();
                return;
            }
            md.mean_km = parseFloat(m[0]);
            md.std_km = parseFloat(m[1]);
            md.mean_age = parseFloat(m[2]);
            md.std_age = parseFloat(m[3]);
            md.min_price = parseFloat(m[4]);
            md.max_price = parseFloat(m[5]);
            return;
        }
        else if (n == 2){ //header2: skip
            return;
        }
        else if (n==20){
            readInterface.close();
            readInterface.removeAllListeners();
            return;
        }

        let a = line.split(',');
        if (a.length != 4){
            console.log (`Error: number of columns=${a.length} instead of 4 at line ${n}. Aborting..`);
            abort=true;
            readInterface.close();
            readInterface.removeAllListeners();
        }

        let car = {};
        car.km = denormalize('km', parseFloat(a[0]), md);
        car.fuel = denormalize('fuel', parseInt(a[1]), md);
        car.age = denormalize('age', parseFloat(a[2]), md);
        car.price = denormalize('price', parseFloat(a[3]), md);
        console.log(`${n}  ${car.km},${car.fuel},${car.age},${car.price}`);
        // console.log(`price=${denormalize('price', car.price, md)}`);
        // console.log(`km=${denormalize('km', car.km, md)}`);
        // console.log(`age=${denormalize('age', car.age, md)}`);
        // console.log(`fuel=${denormalize('fuel', car.fuel, md)}`);
        // denormData.push(car);
    })
    .on('close', () => {
        if (!abort){
            console.log (`Finished: size of original=${n-1} size of cleaned = ${denormData.length}`);
            // denormalize();
            // writeToFile();
        }
    });

    function denormalize(key, value, md){
        if (key == 'price'){
            let price = value * (md.max_price - md.min_price) + md.min_price;
            return (price.toFixed(0));
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
