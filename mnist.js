const fs = require ('fs');
const readline = require('readline');
const yargs = require ('yargs');
const math = require('mathjs');

const tools = require('./tools.js');
const NeuralNetwork = require('./NeuralNetwork');

const log = tools.log;
const show = tools.show;
const showtable = tools.showtable;


const input_nodes = 784;
const hidden_nodes = 200;
const output_nodes = 10;
const learning_rate = 0.1;
const epochs = 1;

const dev_train_file = 'mnist_dataset/mnist_train_100.csv';
const dev_test_file = 'mnist_dataset/mnist_test_10.csv';

const prod_train_file = 'mnist_dataset/mnist_train.csv';
const prod_test_file = 'mnist_dataset/mnist_test.csv';

var neuralNetwork = new NeuralNetwork(input_nodes, hidden_nodes, output_nodes, learning_rate);


var traindata = readData(prod_train_file);
var testdata = readData(prod_test_file);

console.log("Training...");
train(traindata);

console.log("Testing...");
test(testdata);

function train(dataset){
    let totalLoops = epochs * dataset.length;
    let completed;

    for (let j=0; j<epochs; j++){
        for (let i=0; i<dataset.length; i++){
            if (dataset[i].length == 0){  //empty line
                continue;
            }

            let a = dataset[i].split(',');
            if (a.length != 785){
                console.log (`Error: number of columns=${a.length} instead of  784 at line ${i}. Aborting..`);
                break;
            }

            let targets = new Array(10).fill(0.01);
            targets[parseInt(a[0])] = 0.99;

            a.shift(); //remove first element - we already used it
            let inputs = a.map(scale);

            neuralNetwork.train(inputs, targets, false);

            if (i > 0 && i % 3000 == 0){
                completed = ((((j+1)*(i+1)) / totalLoops) * 100).toFixed(2);
                console.log(`${completed}% completed`);
            }
        }

        // if (j % 10 == 0){
        //     // console.log(`j=${j} error=${(math.transpose(errors))._data[0]}`);
        //     console.log(`j=${j} error=${errors}`);
        // }
    }
}

function test(dataset){
    let scorecard = [];

    for (let i=0; i<dataset.length; i++){
        if (dataset[i].length == 0){  //empty line
            continue;
        }

        let a = dataset[i].split(',');
        if (a.length != 785){
            console.log (`Error: number of columns=${a.length} instead of  784 at line ${i}. Aborting..`);
            break;
        }

        correct_label=a[0];

        a.shift(); //remove first element - we already used it
        let inputs = a.map(scale);

        results = neuralNetwork.query(inputs);
        results = math.squeeze(results); // convert 2d matrix to 1d
        let label = results.indexOf(math.max(results)); //predicted number is the index of max value
        // show(`correct_label=${correct_label}, network's answer=${label}`);
        if (correct_label == label){
            scorecard.push(1);
        }
        else {
            scorecard.push(0);
        }
    }
    // show(scorecard);
    show(`Performance=${math.sum(scorecard)/scorecard.length}`);
}



function readData (filename){
    let lines = fs.readFileSync(filename, 'utf-8')
                    .split('\n')
                    .filter((value, index)=>{return value!=''});
    return (lines);
}

function scale(x){
    return(((x/255.0)*0.99)+0.01);
}
