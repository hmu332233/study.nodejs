const fs = require('fs');





fs.readFile('data.txt','utf8', function(err, data){
  if (err) throw err;
  console.log(data);
});

var data = fs.readFileSync('data.txt','utf8');

console.log(1 + data);