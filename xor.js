const fs = require ('fs');
const yargs = require ('yargs');
const math = require('mathjs');

const tools = require('./tools.js');
const log = tools.log;
const con = tools.con;
const logtab = tools.logtab;

const NeuralNetwork = require('./NeuralNetwork');

let training_data = [{
        inputs: [
            [0],
            [0]
        ],
        outputs: [
            [0]
        ]
    },
    {
        inputs: [
            [1],
            [1]
        ],
        outputs: [
            [0]
        ]
    },
    {
        inputs: [
            [1],
            [0]
        ],
        outputs: [
            [1]
        ]
    },
    {
        inputs: [
            [0],
            [1]
        ],
        outputs: [
            [1]
        ]
    }
];

// var neuralNetwork = new NeuralNetwork(3,3,3,0.3);
var neuralNetwork = new NeuralNetwork(2,8,1,0.1);
// neuralNetwork.setLearningRate(0.1);
let e;
let n;
for (let i = 0; i < 50000; i++) {
  let data = training_data[math.floor(math.random(0,4))];
  e = neuralNetwork.train(data.inputs, data.outputs);
  n=i;
  if (e < 0.05){
      console.log (`Terminated: e=${e} i=${i}`)
      break;
  }

}
console.log (`Finished: e=${e} n=${n}`);

neuralNetwork.query([[0],[0]]);
neuralNetwork.query([[1],[1]]);
neuralNetwork.query([[0],[1]]);
neuralNetwork.query([[1],[0]]);
