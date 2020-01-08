const fs = require('fs');
const yargs = require('yargs');
const math = require('mathjs');

const tools = require('./tools.js');
const log = tools.log;
const show = tools.show;
const showtable = tools.showtable;
// const showmatrix = tools.showmatrix;


var lastErrors;

class NeuralNetwork {

    constructor(input_nodes, hidden_nodes, output_nodes, learning_rate) {
        this.input_nodes = input_nodes;
        this.hidden_nodes = hidden_nodes;
        this.output_nodes = output_nodes;
        this.learning_rate = learning_rate

        //Initialize weights input -> hidden
        // Make a matrix of size hidden_nodes * input_nodes and fill with random values between -0.5 and 0.5
        let wih = math.random([hidden_nodes, input_nodes], -0.5, 0.5);
        this.weights_ih = math.matrix(wih);
        // showtable(this.weights_ih,'this.weights_ih');

        //Initialize weights hidden -> output
        // Make a matrix of size output_nodes * hidden_nodes and fill with random values between -0.5 and 0.5
        let who = math.random([output_nodes, hidden_nodes], -0.5, 0.5);
        this.weights_ho = math.matrix(who);
        // showtable(this.weights_ho,  'this.weights_ho');


        //Initalize bias nodes for hidden and output layers
        let bi = math.random([this.hidden_nodes, 1], -0.1, 0.1);
        this.bias_i = math.matrix(bi);
        // showtable(this.bias_i, 'this.bias_i');

        let bh = math.random([this.output_nodes, 1], -0.1, 0.1);
        this.bias_h = math.matrix(bh);
        // showtable(this.bias_h,  'this.bias_h');

    }

    //When called with calc_error = true, applies the cost function
    //and returns the result
    train(input_array, target_array, calc_error=false){
        // FEED FORWARD PROCEDURE
        let inputs = math.matrix(input_array);
        // showtable(inputs, "inputs")

        let targets = math.matrix(target_array);
        // showtable(targets, "targets")

        //Get the matrix containing values entering hidden nodes
        let hidden_inputs = math.multiply(this.weights_ih, inputs);
        // showtable(hidden_inputs,  "hidden_inputs");

        //Add the input->hidden bias
        hidden_inputs = math.add(hidden_inputs, this.bias_i);
        // showtable(hidden_inputs,  "hidden_inputs after bias");


        //Get the matrix containing output values of hidden nodes,
        //i.e. after application of the activation function;
        let hidden_outputs = math.map(hidden_inputs, sigmoid);
        // showtable(hidden_outputs, "hidden_outputs");

        //Get the matrix containing values entering final output nodes
        let final_inputs = math.multiply(this.weights_ho, hidden_outputs);
        // showtable(final_inputs,  "final_inputs");

        //Add the hidden->output bias
        final_inputs = math.add(final_inputs, this.bias_h);
        // showtable(final_inputs,  "final_inputs after bias");

        //Get the matrix containing output values of hidden nodes,
        //i.e. after application of the activation function;
        let final_outputs = math.map(final_inputs, sigmoid);
        // showtable(final_outputs, "final_outputs");

        //CALCULATE ERRORS
        //Calculate errors in output layer
        let output_errors = math.subtract(targets, final_outputs);
        // showtable(output_errors,  "output_errors");

        let lastErrors;
        if (calc_error){
            lastErrors = cost_function(final_outputs, targets);
            // console.log(lastErrors);
            // lastErrors = calcError(final_outputs, targets);
        }
        //Calculate errors in hidden layer
        let weights_ho_t = math.transpose(this.weights_ho);
        let hidden_errors = math.multiply(weights_ho_t, output_errors);
        // showtable(hidden_errors,  "hidden_errors");


        //UPDATE WEIGHTS PROCEDURE

        // 1. Update weights between hidden layer and output layer
        // Apply formula:
        // ΔW_jk = a * E_k * O_k(1-O_k)*O^T_j
        // k=output node index, j=hidden node index, a=learning rate, O=nodes output values

        //Calculate sigmoid derivative  O_k(1-O_k)
        let sigderiv_ho = math.map(final_outputs, sigmoidDeriv);
        // showtable(sigderiv_ho,  "sigderiv_ho");
        //Calculate gradient:  a * E_k * O_k(1-O_k)
        let gradient_ho =  math.multiply(math.dotMultiply(output_errors, sigderiv_ho), this.learning_rate) ;
        // showtable(gradient_ho,  "gradient_ho");

        //Calculate \deltaW_jk multiplying by a and by the transposed hidden layer output matrix
        // let weightDiffs_a = math.multiply(math.multiply(deriv_product_a,   math.transpose(hidden_outputs)), this.learning_rate);
        let weightDeltas_ho = math.multiply(gradient_ho,   math.transpose(hidden_outputs));
        // showtable(weightDeltas_ho,  "weightDeltas_ho");

        //Adjust weights between hidden layer and output layer
        this.weights_ho = math.add(this.weights_ho, weightDeltas_ho);
        // showtable(this.weights_ho, "this.weights_ho");

        //Adjust bias weights
        this.bias_h = math.add(this.bias_h, gradient_ho);
        // showtable(this.bias_h,  "this.bias_h adjusted");


        // 2. Update weights between input layer and hidden layer
        // Apply formula:
        // ΔW_jk = a * E_k * O_k(1-O_k)*O^T_j
        //k=hidden node index, j=input node index, a=learning rate, O=values of nodes
        //Calculate errors of hidden-output weights

        //Calculate sigmoid derivative  O_k(1-O_k)
        let sigderiv_ih = math.map(hidden_outputs, sigmoidDeriv);

        //Calculate gradient:  a * E_k * O_k(1-O_k)
        let gradient_ih =  math.multiply(math.dotMultiply(hidden_errors, sigderiv_ih), this.learning_rate) ;
        // showtable(gradient_ih,  "gradient_ih");

        //Calculate ΔW_jk multiplying by a and by the transposed imput layer  matrix
        let weightDeltas_ih = math.multiply(gradient_ih,   math.transpose(inputs));
        // showtable(weightDeltas_ih,  "weightDeltas_ih");

        //Adjust weights between hidden layer and output layer
        this.weights_ih = math.add(this.weights_ih, weightDeltas_ih);
        // showtable(this.weights_ih,  "this.weights_ih");

        //Adjust bias weights
        this.bias_i = math.add(this.bias_i, gradient_ih);
        // showtable(this.bias_i,  "this.bias_i adjusted");

        return lastErrors;
    }

    //When called with target_array and calc_error = true,
    //applies the cost function and returns the result
    query(input_array, target_array=undefined, calc_error=false){
        let inputs = math.matrix(input_array);
        // showtable(inputs, "inputs")

        let targets;
        if (target_array){
            targets = math.matrix(target_array);
        }
        // showtable(targets, "targets")

        //Get the matrix containing values entering hidden nodes
        let hidden_inputs = math.multiply(this.weights_ih, inputs);
        // showtable(hidden_inputs,  "hidden_inputs");

        //Add the input->hidden bias
        hidden_inputs = math.add(hidden_inputs, this.bias_i);
        // showtable(hidden_inputs,  "hidden_inputs after bias");

        //Get the matrix containing output values of hidden nodes,
        //i.e. after application of the activation function;
        let hidden_outputs = math.map(hidden_inputs, sigmoid);
        // showtable(hidden_outputs, "hidden_outputs");


        //Get the matrix containing values entering final output nodes
        let final_inputs = math.multiply(this.weights_ho, hidden_outputs);
        // showtable(final_inputs,  "final_inputs");

        //Add the hidden->output bias
        final_inputs = math.add(final_inputs, this.bias_h);
        // showtable(final_inputs,  "final_inputs after bias");

        //Get the matrix containing output values of hidden nodes,
        //i.e. after application of the activation function;
        let final_outputs = math.map(final_inputs, sigmoid);
        // showtable(final_outputs, "final_outputs");

        let lastErrors;
        if (calc_error && targets){
            lastErrors = cost_function(final_outputs, targets);
            // console.log(lastErrors);
            return lastErrors;
        }
        return (final_outputs._data);
    }

    setLearningRate(learning_rate = 0.1) {
      this.learning_rate = learning_rate;
    }

}

function sigmoid(x){
    return (1 / (1 + math.exp(-x)));
}

//Calculate sigmoid derivative.
//Note: y is already the output of a sigmoid function
function sigmoidDeriv(y){
    return y * (1-y);
}

//Implement the cost function to calculate errors
function cost_function (output, target){
    let sum = math.sum(math.square(math.subtract(target, output)));
    return (0.5 * sum).toFixed(8);

}



module.exports = NeuralNetwork;
