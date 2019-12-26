const fs = require ('fs');
const yargs = require ('yargs');
const math = require('mathjs');

const tools = require('./tools.js');
const log = tools.log;
const show = tools.show;
const showtable = tools.showtable;
// const showmatrix = tools.showmatrix;

class NeuralNetwork {

    constructor(input_nodes, hidden_nodes, output_nodes, learning_rate){
        this.input_nodes = input_nodes;
        this.hidden_nodes = hidden_nodes;
        this.output_nodes = output_nodes;
        this.learning_rate = learning_rate

        // this.weights_ih = new Matrix(hidden_nodes, input_nodes);

        let wih = [[0.41013894330284730, .21559973133654697, -0.29906325635887731],
                   [-0.022678018342761508, -0.05772194616960702, -0.050299826966814920],
                   [0.105869722197729170, .052048253518870210, .288460120358204]];

        this.weights_ih = math.matrix(wih);
        // print(this.weights_ih);
    }

    testMe (){
        // con("NeuralNetwork works!");
        showtable(this.weights_ih, "%+.15f  %+.15f  %+.15f");
    }
}

module.exports = NeuralNetwork;
