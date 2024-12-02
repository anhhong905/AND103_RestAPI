var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Import các model
var mongoose = require("mongoose");
require('./models/userModel');
require('./models/categoryModel');
require('./models/productModel');
require('./models/studentModel');
require('./models/nguoidungModel');

//Import các router
var indexRouter = require('./routes/index');  // Đảm bảo đúng đường dẫn
var usersRouter = require('./routes/users');
var productRouter = require('./routes/products');
var studentRouter = require('./routes/student');
var transpoterRouter = require('./routes/transpoter');
var nguoidungRouter = require('./routes/nguoidung');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://anhhong:anhhong123@anhhong.4x75m.mongodb.net/MD19202')
  .then(() => console.log('>>>>>>>> DB Connected!!!!!'))
  .catch(err => console.log('>>>>>>>> DB Error: ', err));

//Sử dụng các router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productRouter);
app.use('/student', studentRouter);
app.use('/api', transpoterRouter);
app.use('/nguoidung', nguoidungRouter);

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
