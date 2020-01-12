const fs = require ('fs');
const yargs = require ('yargs');
const math = require('mathjs');

const tools = require('./tools.js');
const log = tools.log;
const show = tools.show;
// const showmatrix = tools.showmatrix;
const showtable = tools.showtable;

const NeuralNetwork = require('./NeuralNetwork');
var neuralNetwork = new NeuralNetwork(3, 10, 1, 0.1);
try {
  neuralNetwork.loadModel('cars_model.dat');
}
catch(error) {
  console.error(error);
  return;
}

// let a = [[0.21345689, 1.987654, -0.254678],
//          [0.9890196,  1.120987, -0.973458],
//          [0.92354956, 1.2935729, -0.092784]];
// showtable(a)
// const str = JSON.stringify(a);
// console.log(str);
// let b = JSON.parse(str);
// showtable(b);


// let a = [1, 2, 3];
// let a1 = math.transpose(math.reshape(a,  [3,1]));
// console.log(a1);

// let learning_rate = 0.02;
//
// let final_outputs = [[0.489339224401926]];
//
// let hidden_outputs = [
// [0.624963145 ],
// [0.4455318168],
// [0.3736783483],
// [0.4214831999],
// [0.4149270092]
// ];
//
// let output_errors = [
// [-0.388979224401926]
// ];
//
// let sigderiv_ho = math.map(final_outputs, sigmoidDeriv);
// showtable(sigderiv_ho,  "sigderiv_ho");
//
// // let gradient_ho =  math.multiply(math.dotMultiply(output_errors, sigderiv_ho), learning_rate) ;
// let gradient_ho =  math.dotMultiply(output_errors, sigderiv_ho) ;
// showtable(gradient_ho,  "gradient_ho");
//
// let weightDeltas_ho = math.multiply(gradient_ho,   math.transpose(hidden_outputs));
// showtable(weightDeltas_ho,  "weightDeltas_ho");
//
// weightDeltas_ho = math.dotMultiply(learning_rate, weightDeltas_ho);
// showtable(weightDeltas_ho,  "weightDeltas_ho");
//
//
// function sigmoid(x){
//     return (1 / (1 + math.exp(-x)));
// }
//
// //Calculate sigmoid derivative.
// //Note: y is already the output of a sigmoid function
// function sigmoidDeriv(y){
//     return y * (1-y);
// }


// let a = [[0.21345689, 1.987654, -0.254678],
//          [0.9890196,  1.120987, -0.973458],
//          [0.92354956, 1.2935729, -0.092784]];
// let fmt = "%1.8f  %1.8f  %1.8f";
//
// logtab(a, fmt);

// var sprintf = require('sprintf-js').sprintf;
//
// let n =  0.2345;
// console.log(sprintf("%+.15f", n));
// console.log(n.toFixed(20));

// let one = math.matrix(math.ones([3, 1]));
// showtable(one, "%d");

// const A = [[1, 2, 3], [4, 5, 6]]
// let B = math.transpose(A)               // returns [[1, 4], [2, 5], [3, 6]]
// showtable(B, "%d");
// console.log (B);

// let m1 = math.matrix([[2, 3], [4, 5], [6,7]]);
// let m2 = math.matrix([[1, 2], [3, 4], [5,6]]);
//
// showtable (calcError(m2, m1));
//
// function calcError(output, target ){
//     let size = math.size(output);
//     let outarr = output._data;
//     let tararr = target._data;
//     let errors = [];
//
//     for (let i=0; i<outarr.length; i++){
//         let err = [];
//         for (let j=0; j<outarr[i].length; j++){
//             err[j] = ((tararr[i][j] - outarr[i][j])/tararr[i][j]).toFixed(5);
//         }
//         errors.push(err);
//     }
//
//     return (errors)
// }

// let out = [[2], [4.2], [6]];
// let target = [[4.1], [1.8], [5.25]];
//
// let out2 = [[4], [8.4], [12]];
// let target2 = [[8.2], [3.6], [10.5]];
//
//
// let out1 = [[2]];
// let target1 = [[4.1]];
//
// let sqerr = 0.0;
// // for (let i=0; i< 10; i++){
//     sqerr = squaredError(target, out);
//     console.log('sqerr1=' + sqerr);
//     sqerr += squaredError(target2, out2);
// // }
// console.log(sqerr);
//
//
// function squaredError (target, output){
//     //If matrix length > 1, return the average of sum of squares
//     //of differences element wise
//
//     let diff = math.subtract(target, output);
//
//     if (diff.length > 1){
//         diff = math.squeeze(diff);
//     }
//
//     let sqerr;
//     if (diff.length)
//         sqerr = (math.sum(math.square(diff))) / diff.length;
//     else
//         sqerr = (math.sum(math.square(diff)));
//
//     // console.log(sqerr);
//
//     return sqerr;
// }
//
// function cost_function (output, target){
//     let sum = math.sum(math.square(math.subtract(target, output)));
//     return (0.5 * sum).toFixed(5);
//
// }
