var cool = require('cool-ascii-faces');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connect = require('connect');
var app2 = connect();
var app = express();
var errorhandler = require('errorhandler');
var session = require('express-session');
var sessionStore = require('./lib/sessionStore');
var config = require('./config');
var mongoose = require('mongoose');
var checkAuth = require('middleware/checkAuth');
/* Routes */
var index = require('./routes/index');
var users = require('./routes/users');
var chat = require('./routes/chat');
var login = require('./routes/login');
var logout = require('./routes/logout');
var frontpage = require('./routes/frontpage');
// view engine setup
app.engine('ejs', require('ejs-locals')); // layout partial block
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(function(req, res, next) {
  if (req.url == '/hello') {
      res.end("Hello");
  }else{
    next();
  }

});

app.use(function(req, res, next) {
    if (req.url == '/forbidden') {
        /*res.send(401);*/
        next(new Error("wops, denied"));
    }else{
        next();
    }
});

app2.use(function (err, req, res, next) {
    if (typeof err == 'number') {
        err = new HttpError(err);
    }

    if  (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            express.errorHandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (app.get('env') == 'development') {
    app.use(logger('dev'));
}else {
    app.use(logger('default'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    store: sessionStore
}));
/*
app.use(function(req, res, next) {
   req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
   res.send("Visits: " + req.session.numberOfVisits);
});
*/

app.use(require('middleware/sendHttpError'));
app.use(require('middleware/loadUser'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/chat', checkAuth, chat);
app.use('/login', login);
app.use('/logout', logout);
app.use('/frontpage', frontpage);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
