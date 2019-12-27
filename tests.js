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

const A = [[1, 2, 3], [4, 5, 6]]
let B = math.transpose(A)               // returns [[1, 4], [2, 5], [3, 6]]
showtable(B, "%d");
// console.log (B);
