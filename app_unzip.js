var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs'); //파일을 사용하기 위한 것
var multer = require('multer'); //파일 업로드를 위한 것

//unzip
var Unzipper = require('decompress-zip'); 
var path     = require("path");

var _storage = multer.diskStorage({
  //어느 디렉토리에 저장할 것인가
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  //파일 이름은 어떻게 할 것인가
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: _storage })

//POST를 사용해도 req에서 데이터를 사용할 수 있게해줌
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('views', './views_file');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/upload',function(req,res){
     res.render('upload.html.ejs')
});


app.post('/upload', upload.single('userfile'), function(req, res) {
    
    if (req.file){

        var filepath = path.join(req.file.destination, req.file.filename);
        var unzipper = new Unzipper(filepath);

        unzipper.on("extract", function () {
            console.log("Finished extracting");
        });

        unzipper.extract({ path: "uploads/zip/"+req.file.filename});
    }

    console.log(req.file);
    res.send('Uploaded : ' + req.file.filename ); 
});


app.listen(process.env.PORT, function(){
   console.log('Connected, 3000 port!'); 
});

