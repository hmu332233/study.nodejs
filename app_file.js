var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs'); //파일을 사용하기 위한 것

//POST를 사용해도 req에서 데이터를 사용할 수 있게해줌
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('views', './views_file');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);



app.get('/topic/new',function(req,res){
    console.log(__dirname);
    res.render('new.html'); 
});

//첫번째 인자로 여러값을 줄 수도 있다.
app.get(['/topic','/topic2'],function(req,res){
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

