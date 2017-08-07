var async = require('async');

var tasks = [
    function (callback) {
        setTimeout(function () {
            console.log(1);
            callback(null, 1);
        },2000);
    },
    function (data,callback) {
        setTimeout(function () {
          console.log(2);
          callback(null,data+2);
        },1000);
    }
];

async.waterfall(tasks, function (err, results){
    console.log(results);
});