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

       let wih = [
     	[-0.13329451999669395, 0.5356847145240633],
     	[ 0.13253193590206358, 0.7026761896813469],
         [-0.7112199236248813, -0.4533100789471374],
         [-0.8771618765666478,  0.09962577233243053]
        ];

        // Make a matrix of size hidden_nodes * input_nodes and fill with random values between -0.5 and 0.5
        // let wih = math.random([hidden_nodes, input_nodes], -0.5, 0.5);
        this.weights_ih = math.matrix(wih);
        showtable(this.weights_ih,'this.weights_ih');

        //Initialize weights hidden -> output

        let who = [[0.9386712269606536, 0.3014595084274925, 0.9414543269154678, 0.677659877263221]];
        // Make a matrix of size output_nodes * hidden_nodes and fill with random values between -0.5 and 0.5
        // let who = math.random([output_nodes, hidden_nodes], -0.5, 0.5);
        this.weights_ho = math.matrix(who);
        showtable(this.weights_ho,  'this.weights_ho');

        let bh = [
            [-0.20274250936739868],
            [-0.37579441132890823],
            [-0.38689842114593986],
            [-0.5385956218791592 ]
        ];
        this.bias_h = math.matrix(bh);
        showtable(this.bias_h, 'this.bias_h');

;
        let bo =[[-0.8436717079312817]];
        this.bias_o = math.matrix(bo);
        showtable(this.bias_o,  'this.bias_o');

    }

    train(input_array, target_array){
        let inputs = math.matrix(input_array);
        showtable(inputs, "inputs")

        let targets = math.matrix(target_array);
        showtable(targets, "targets")

        //Get the matrix containing values entering hidden nodes
        let hidden_inputs = math.multiply(this.weights_ih, inputs);
        showtable(hidden_inputs,  "hidden_inputs");

        //Add the hidden bias
        hidden_inputs = math.add(hidden_inputs, this.bias_h);
        showtable(hidden_inputs,  "hidden_inputs after bias");


        //Get the matrix containing output values of hidden nodes,
        //i.e. after application of the activation function;
        let hidden_outputs = math.map(hidden_inputs, sigmoid);
        showtable(hidden_outputs, "hidden_outputs");

        //Get the matrix containing values entering final output nodes
        let final_inputs = math.multiply(this.weights_ho, hidden_outputs);
        showtable(final_inputs,  "final_inputs");

        //Add the output bias
        final_inputs = math.add(final_inputs, this.bias_o);
        showtable(final_inputs,  "final_inputs after bias");

        //Get the matrix containing output values of hidden nodes,
        //i.e. after application of the activation function;
        let final_outputs = math.map(final_inputs, sigmoid);
        showtable(final_outputs, "final_outputs");

        //Calculate errors in output layer
        let output_errors = math.subtract(targets, final_outputs);
        showtable(output_errors,  "output_errors");

        //Calculate errors in hidden layer
        let weights_ho_t = math.transpose(this.weights_ho);
        let hidden_errors = math.multiply(weights_ho_t, output_errors);
        showtable(hidden_errors,  "hidden_errors");


        //UPDATE WEIGHTS PROCEDURE

        // 1. Update weights between hidden layer and output layer
        // Apply formula:
        // ΔW_jk = a * E_k * O_k(1-O_k)*O^T_j
        // k=output node index, j=hidden node index, a=learning rate, O=nodes output values

        //Calculate 1-O_k
        let one_minus_ho = math.subtract(math.matrix(math.ones([this.output_nodes, 1])), final_outputs);
        showtable(one_minus_ho,  "one_minus_ho");
        //Calculate  E_k * O_k(1-O_k)
        let deriv_ho = math.dotMultiply(output_errors, math.dotMultiply(final_outputs, one_minus_ho));
        showtable(deriv_ho,  "deriv_ho");
        //Calculate gradient
        let gradient_ho = math.multiply(deriv_ho, this.learning_rate);
        showtable(gradient_ho,  "gradient_ho");

        //Calculate \deltaW_jk multiplying by a and by the transposed hidden layer output matrix
        // let weightDiffs_a = math.multiply(math.multiply(deriv_product_a,   math.transpose(hidden_outputs)), this.learning_rate);
        let weightDeltas_ho = math.multiply(gradient_ho,   math.transpose(hidden_outputs));
        showtable(weightDeltas_ho,  "weightDeltas_ho");

        //Adjust weights between hidden layer and output layer
        this.weights_ho = math.add(this.weights_ho, weightDeltas_ho);
        showtable(this.weights_ho, "this.weights_ho");

        this.bias_o = math.add(this.bias_o, gradient_ho);
        showtable(this.bias_o,  "this.bias_o adjusted");


        // 2. Update weights between input layer and hidden layer
        // Apply formula:
        // ΔW_jk = a * E_k * O_k(1-O_k)*O^T_j
        //k=hidden node index, j=input node index, a=learning rate, O=values of nodes
        //Calculate errors of hidden-output weights

        //Calculate 1-O_k
        let one_minus_ih = math.subtract(math.matrix(math.ones([this.hidden_nodes, 1])), hidden_outputs);
        showtable(one_minus_ih, "one_minus_ih");
        //Calculate  E_k * O_k(1-O_k)
        let deriv_ih = math.dotMultiply(hidden_errors, math.dotMultiply(hidden_outputs, one_minus_ih));
        showtable(deriv_ih, "deriv_ih");
        //Calculate gradient
        let gradient_ih = math.multiply(deriv_ih, this.learning_rate);
        showtable(gradient_ih, "gradient_ih");

        //Calculate ΔW_jk multiplying by a and by the transposed imput layer  matrix
        let weightDeltas_ih = math.multiply(gradient_ih,   math.transpose(inputs));
        showtable(weightDeltas_ih,  "weightDeltas_ih");

        //Adjust weights between hidden layer and output layer
        this.weights_ih = math.add(this.weights_ih, weightDeltas_ih);
        showtable(this.weights_ih,  "this.weights_ih");

        this.bias_h = math.add(this.bias_h, gradient_ih);
        showtable(this.bias_h,  "this.bias_h adjusted");
    }

    query(input_array){
        let inputs = math.matrix(input_array);

        //Get the matrix containing values entering hidden nodes
        let hidden_inputs = math.multiply(this.weights_ih, inputs);
        showtable(hidden_inputs,  "hidden_inputs");

        //Get the matrix containing output values of hidden nodes,
        //i.e. after application of the activation function;
        let hidden_outputs = math.map(hidden_inputs, sigmoid);
        showtable(hidden_outputs,  "hidden_outputs");

        //Get the matrix containing values entering final output nodes
        let final_inputs = math.multiply(this.weights_ho, hidden_outputs);
        showtable(final_inputs,  "final_inputs");

        //Get the matrix containing output values of hidden nodes,
        //i.e. after application of the activation function;
        let final_outputs = math.map(final_inputs, sigmoid);
        showtable(final_outputs, "final_outputs");
    }

    testMe() {
        // con("NeuralNetwork works!");
        showtable(this.weights_ih, 'this.weights_ih');
        showtable(this.weights_ho, 'this.weights_ho');

    }
}

function sigmoid(x){
    return (1 / (1 + math.exp(-x)));
}


module.exports = NeuralNetwork;
