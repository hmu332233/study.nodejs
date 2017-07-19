var express = require("express");
var app = express();
//쿠기를 사용하기 위한 라이브러리
var cookieParser = require('cookie-parser');
app.use(cookieParser('123'));

var products = {
    1:{title:'cart1'},
    2:{title:'cart2'}
};

app.get('/products',function(req,res){
    
    var output = '';
    
    for( var product_i in products ){
        console.log(product_i);
        console.log(products[product_i].title);
        
        output += 
        `<li>
        <a href="/cart/${product_i}">${products[product_i].title}</a>
        </li>
        `
    }
    
   res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});

app.get('/cart',function(req,res){
    var cart = req.signedCookies.cart;
    if(!cart) res.send('Empty!');
    else {
        var output = '';
        for(var cart_id in cart){
            output += `<li>${products[cart_id].title} : ${cart[cart_id]}</li>`
        }
    }
    res.send(`<ul>${output}</ul><a href='/products'>home</a>`); 
});

app.get('/cart/:id',function(req,res){
   var id = req.params.id
   if(req.signedCookies.cart)
     var cart = req.signedCookies.cart;
   else
     var cart = {};
   
   if(!cart[id]) cart[id] = 0;
   
   cart[id] = parseInt(cart[id]) + 1;
   res.cookie('cart',cart,{signed:true});
   res.redirect('/cart'); 
});
/*
cart = { 
    1:1,
    2:1
}
*/


app.listen(process.env.PORT,function(){
   console.log('Connected!'); 
});