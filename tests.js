const fs = require ('fs');
const yargs = require ('yargs');
const math = require('mathjs');

const tools = require('./tools.js');
const log = tools.log;
const show = tools.show;
// const showmatrix = tools.showmatrix;
const showtable = tools.showtable;


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

let out = [[2], [4.2], [6]];
let target = [[4.1], [1.8], [10.5]];

console.log(cost_function(out, target));

function cost_function (output, target){
    let sum = math.sum(math.square(math.subtract(target, output)));
    return (0.5 * sum).toFixed(5);

}
