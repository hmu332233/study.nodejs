var async = require('async');
var timestamp = new Date().getTime();

var tasks = [
    function (callback) {
        setTimeout(function () {
            console.log(1);
            callback(null, 1,2);
        },2000);
    },
    function (callback) {
        setTimeout(function () {
           console.log(2);
           callback(null,3);
        },1000);
    },
    function (callback) {
        setTimeout(function () {
           console.log(3);
           callback(null,3);
        },3000);
    }
];

async.parallel(tasks, function (err, results){
    console.log(results, 'in ', new Date().getTime() - timestamp, 'ms');
});