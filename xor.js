const fs = require ('fs');
const yargs = require ('yargs');

const tools = require('./tools.js');
const log = tools.log;
const con = tools.con;
const logtab = tools.logtab;

const NeuralNetwork = require('./NeuralNetwork');

// var neuralNetwork = new NeuralNetwork(3,3,3,0.3);
var neuralNetwork = new NeuralNetwork(2,4,1,0.1);
// neuralNetwork.query([[1.0],
//                      [0.5],
//                      [-1.5]]);

// neuralNetwork.train([[1.0],
//                      [0.5],
//                     [-1.5]],
//                     [[1.5],
//                      [0.2],
//                     [-0.2]]);
neuralNetwork.train([[1],[0]], [[1]]);
