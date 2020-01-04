const fs = require ('fs');
const readline = require('readline');
const yargs = require ('yargs');
const math = require('mathjs');

const tools = require('./tools.js');
const log = tools.log;
const con = tools.con;
const logtab = tools.logtab;

const NeuralNetwork = require('./NeuralNetwork');

var neuralNetwork = new NeuralNetwork(2,8,1,0.5);

const readInterface = readline.createInterface({
    input: fs.createReadStream('xordata.csv'),
    // output: process.stdout,
    console: false
});

let abort=false;
let e;
let n=0;
readInterface
    .on('line', (line) => {
        n++;
        let a = line.split(',');
        if (a.length != 3){
            console.log (`Error: number of columns=${a.length} instead of 3 at line ${n}. Aborting..`);
            abort=true;
            readInterface.close();
            readInterface.removeAllListeners();
        }
        //Convert input and output into 2-dimensional arrays
        let input = [];
        let output = [];
        input.push([parseInt(a[0])],[parseInt(a[1])]);
        output.push([parseInt(a[2])]);
        e = neuralNetwork.train(input, output);
        if (e < 0.02){
          console.log (`Terminated: e=${e} line=${n}`);
          abort=true;
          readInterface.close();
          readInterface.removeAllListeners();
        }
    })
    .on('close', () => {
        if (!abort){
            console.log (`Finished: e=${e} n=${n}`);
        }
        runTests();
    });

function runTests(){
    neuralNetwork.query([[0],[0]]);
    neuralNetwork.query([[1],[1]]);
    neuralNetwork.query([[0],[1]]);
    neuralNetwork.query([[1],[0]]);
}
