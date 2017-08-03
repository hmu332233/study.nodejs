const express = require('express');
const app = express();

const bodyParser = require('body-parser');



/*외부에서 접근 가능*/
app.use(express.static('public'));
/*bodyParser*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*route*/
app.use('/', require('./router/index'));


app.listen(process.env.PORT, function (){
   console.log('server start!'); 
});