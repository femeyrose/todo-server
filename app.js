var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors =require('cors')
//requiring cors

const dataService= require('./services/data.service')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const db=require('./models');
//models is provided here


var app = express();



app.use(cors({
  origin:'http://localhost:4202',
  credentials:true
}))
//connecting to 4202 port of angular

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const authMiddleware=(req,res,next)=>{
const tokenHeader =req.headers['authorization'];
if(tokenHeader){
const bearer= tokenHeader.split(' ')//token is get from tokenHeader and taking token from authorization of postman in the header and split with a space
const bearerToken=bearer[1] //we get the token, with first element
console.log(bearerToken); //to check whether getting token
dataService.verifyToken(bearerToken,req,res,next);
}
else{
  res.status(401).json({"message":"Authentication Failed"}) //if the token is not passed
}


}
//now using token we have to call the APIs
//to get and create todos we have to create Middleware after creating token
//authorization is passed in the header
//in postman, under new http://localhost:3002, give name and decription in the body (bcz todo has these 2 fields)
//under authorization-->bearer token-->token-->give the token get while log in
//now when click on send,token also send
//to validate token----we get autorization in tokenHeader
//pass this to app.use('/',authMiddleware, indexRouter);
//to check, click send in the http://localhost:3002 of postman
//check the token in cmd (long string)




app.use('/users', usersRouter);

app.use('/',authMiddleware, indexRouter);
//indexRouter is the index.js under routes
//note:order of these (/users and authMiddleware is important)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
