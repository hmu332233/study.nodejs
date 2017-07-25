var express = require('express');
var app = express();


// p1으로 들어오는 경로는 router에 위임한다
var p1 = require("./routes/p1")(app);
app.use('/p1', p1);

// p2으로 들어오는 경로는 router에 위임한다
var p2 = require("./routes/p2");
app.use('/p2', p2);


app.listen(process.env.PORT, function () {
  console.log('Connected!')
});