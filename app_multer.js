var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs'); //파일을 사용하기 위한 것
var multer = require('multer'); //파일 업로드를 위한 것
var upload = multer({ dest: 'uploads/' });  //사용자가 업로드한 파일을 uploads/에 저장되는 미들웨어를 리턴

var _storage = multer.diskStorage({
  //어느 디렉토리에 저장할 것인가
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
    /*
    if(파일의 형식이 이미지면)
      cb(null, 'uploads/img/');
    else if(파일의 형식이 텍스트면)
      cb(null, 'uploads/text/');
    */
  },
  //파일 이름은 어떻게 할 것인가
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload2 = multer({ storage: _storage })

//POST를 사용해도 req에서 데이터를 사용할 수 있게해줌
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('views', './views_file');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/upload',function(req,res){
     res.render('upload.html.ejs')
});

//첫번째 인자의 url로 들어오면 두번째 인자인 미들웨어를 통과한뒤 마지막 callback이 호출된다
//'/upload'로 접근했을때 파일이 포함되어 있다면 가공해서 req.file을 추가하도록 하는 미들웨어
// upload.single( 파라미터 이름)
app.post('/upload', upload2.single('userfile'), function(req, res) {
    console.log(req.file);
    res.send('Uploaded : ' + req.file.filename ); 
});

app.get('/topic/new',function(req,res){
    console.log(__dirname);
    res.render('new.html'); 
});

//첫번째 인자로 여러값을 줄 수도 있다.
// app.get(['/topic','/topic2'],function(req,res){
app.get('/topic',function(req,res){
    //폴더의 내용을 읽는다
    //The callback gets two arguments (err, files) where files is an array of the names of the files in the directory excluding '.' and '..'
    fs.readdir('data', function(err,files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        console.log(files);
        res.render('index.html.ejs',{topics: files});
    });
});

app.get('/topic/:id',function(req,res){
     var id = req.params.id;
     fs.readFile('data/'+id,'utf8', function(err, data){
        if(err){
            res.status(500).send('Internal Server Error');
        }
        res.send(data);
    });
});


app.post('/topic',function(req,res){
    var title = req.body.title;
    var content = req.body.content;
    
    fs.writeFile('data/'+title,content,function(err){
        if(err){
            res.status(500).send('Internal Server Error');
        }
        console.log(__dirname+'/data/'+title);
        
        res.redirect('/topic'); 
    });
});


app.listen(process.env.PORT, function(){
   console.log('Connected, 3000 port!'); 
});

