const fs = require ('fs');
const yargs = require ('yargs');

const tools = require('./tools.js');
const log = tools.log;
const con = tools.con;
const logtab = tools.logtab;

const NeuralNetwork = require('./NeuralNetwork');

var neuralNetwork = new NeuralNetwork(3,3,3,0.3);
neuralNetwork.testMe();
