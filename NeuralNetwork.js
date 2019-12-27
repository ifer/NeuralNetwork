const fs = require('fs');
const yargs = require('yargs');
const math = require('mathjs');

const tools = require('./tools.js');
const log = tools.log;
const show = tools.show;
const showtable = tools.showtable;
// const showmatrix = tools.showmatrix;

class NeuralNetwork {

    constructor(input_nodes, hidden_nodes, output_nodes, learning_rate) {
        this.input_nodes = input_nodes;
        this.hidden_nodes = hidden_nodes;
        this.output_nodes = output_nodes;
        this.learning_rate = learning_rate


        //Initialize weights input -> hidden

        let wih = [[0.41013894330284730, .21559973133654697, -0.29906325635887731],
                   [-0.022678018342761508, -0.05772194616960702, -0.050299826966814920],
                   [0.105869722197729170, .052048253518870210, .288460120358204]];

        // Make a matrix of size hidden_nodes * input_nodes and fill with random values between -0.5 and 0.5
        // let wih = math.random([hidden_nodes, input_nodes], -0.5, 0.5);
        this.weights_ih = math.matrix(wih);
        showtable(this.weights_ih, "%+.15f  %+.15f  %+.15f", 'this.weights_ih');

        //Initialize weights hidden -> output

        let who = [
            [0.4295469119631883, -0.090369188714601420, 0.2432947435364325510],
            [0.379175092801161460, 0.218140591170924440, 0.409597246942038362],
            [-0.25827629729809720, 0.2242482212950132, -0.3847805736758598]
        ];
        // Make a matrix of size output_nodes * hidden_nodes and fill with random values between -0.5 and 0.5
        // let who = math.random([output_nodes, hidden_nodes], -0.5, 0.5);
        this.weights_ho = math.matrix(who);
        showtable(this.weights_ho, "%+.15f  %+.15f  %+.15f", 'this.weights_ho');


    }

    train(input_array, target_array){
        let inputs = math.matrix(input_array);
        showtable(inputs, "%+.15f", "inputs")

        let targets = math.matrix(target_array);
        showtable(targets, "%+.15f", "targets")

        //Get the matrix containing values entering hidden nodes
        let hidden_inputs = math.multiply(this.weights_ih, inputs);
        showtable(hidden_inputs, "%+.15f", "hidden_inputs");

        //Get the matrix containing output values of hidden nodes,
        //i.e. after application of the activation function;
        let hidden_outputs = math.map(hidden_inputs, sigmoid);
        showtable(hidden_outputs, "%+.15f", "hidden_outputs");

        //Get the matrix containing values entering final output nodes
        let final_inputs = math.multiply(this.weights_ho, hidden_outputs);
        showtable(final_inputs, "%+.15f", "final_inputs");

        //Get the matrix containing output values of hidden nodes,
        //i.e. after application of the activation function;
        let final_outputs = math.map(final_inputs, sigmoid);
        showtable(final_outputs, "%+.15f", "final_outputs");

        //Calculate errors in output layer
        let output_errors = math.subtract(targets, final_outputs);
        showtable(output_errors, "%+.15f", "output_errors");

        //Calculate errors of hidden-output weights
        let weights_ho_t = math.transpose(this.weights_ho);
        let hidden_errors = math.multiply(weights_ho_t, output_errors);
        showtable(hidden_errors, "%+.15f", "hidden_errors");

        //UPDATE WEIGHTS PROCEDURE
        //Implement [ output_errors * final_outputs * (sigmoid(outputN) * (1 - sigmoid(outputN)))]

        // I. update the weights for the links between the hidden and output layers

        //Calculate the derivatives of the activation function at the values of final outputs
        //(final_outputs are already sigmoid(outputN))
        let deriv_a = math.subtract(math.matrix(math.ones([this.output_nodes, 1])), final_outputs);
        //Multiply derivatives by final outputs and by output errors
        let deriv_product_a = math.dotMultiply(output_errors, math.dotMultiply(final_outputs, deriv_a));
        showtable(deriv_product_a, "%+.15f", "deriv_product_a");

        //Calculate weight differences by multiplying deriv_product_a with hidden_outputs transposed
        //and then moderate by myltiplying by the learning_rate
        let weightDiffs_a = math.multiply(math.multiply(deriv_product_a,   math.transpose(hidden_outputs)), this.learning_rate);
        showtable(weightDiffs_a, "%+.15f %+.15f %+.15f", "weightDiffs_a");
        //Correct Weights hidden->output
        this.weights_ho = math.add(this.weights_ho, weightDiffs_a);
        showtable(this.weights_ho, "%+.15f %+.15f %+.15f", "this.weights_ho");

        // II. update the weights for the links between the hidden and output layers
        
        //Calculate the derivatives of the activation function at the values of final outputs
        //(final_outputs are already sigmoid(outputN))
        let deriv_b = math.subtract(math.matrix(math.ones([this.output_nodes, 1])), hidden_outputs);
        //Multiply derivatives by final outputs and by output errors
        let deriv_product_b = math.dotMultiply(hidden_errors, math.dotMultiply(hidden_outputs, deriv_b));
        showtable(deriv_product_b, "%+.15f", "deriv_product_b");

        //Calculate weight differences by multiplying deriv_product_a with hidden_outputs transposed
        //and then moderate by myltiplying by the learning_rate
        let weightDiffs_b = math.multiply(math.multiply(deriv_product_b,   math.transpose(inputs)), this.learning_rate);
        showtable(weightDiffs_b, "%+.15f %+.15f %+.15f", "weightDiffs_b");
        //Correct Weights hidden->output
        this.weights_ih = math.add(this.weights_ih, weightDiffs_b);
        showtable(this.weights_ih, "%+.15f %+.15f %+.15f", "this.weights_ih");


    }

    query(input_array){
        let inputs = math.matrix(input_array);

        //Get the matrix containing values entering hidden nodes
        let hidden_inputs = math.multiply(this.weights_ih, inputs);
        showtable(hidden_inputs, "%+.15f", "hidden_inputs");

        //Get the matrix containing output values of hidden nodes,
        //i.e. after application of the activation function;
        let hidden_outputs = math.map(hidden_inputs, sigmoid);
        showtable(hidden_outputs, "%+.15f", "hidden_outputs");

        //Get the matrix containing values entering final output nodes
        let final_inputs = math.multiply(this.weights_ho, hidden_outputs);
        showtable(final_inputs, "%+.15f", "final_inputs");

        //Get the matrix containing output values of hidden nodes,
        //i.e. after application of the activation function;
        let final_outputs = math.map(final_inputs, sigmoid);
        showtable(final_outputs, "%+.15f", "final_outputs");
    }

    testMe() {
        // con("NeuralNetwork works!");
        showtable(this.weights_ih, "%+.15f  %+.15f  %+.15f", 'this.weights_ih');
        showtable(this.weights_ho, "%+.15f  %+.15f  %+.15f", 'this.weights_ho');

    }
}

function sigmoid(x){
    return (1 / (1 + math.exp(-x)));
}


module.exports = NeuralNetwork;
