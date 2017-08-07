var async = require('async');

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
    }
];

async.series(tasks, function (err, results){
    console.log(results);
});