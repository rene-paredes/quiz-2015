var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
//Comentamos la carga de la pagina users. Paso 2 modulo6
//var users = require('./routes/users');

var fecha_ultima_peticion = null;
var TIMEOUT = 120;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Instalamos mw partials generandolo con ()
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//añadir mw para guardar el ultimo path antes de cada peticion siempre que no sea login o logout
app.use(function(req, res, next){
    //guardar path en session.redir para despues de login
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }

    // Hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});


//mw de auto-logout 
app.use(function(req,res,next){

    var fecha_actual = new Date();

    //si es un usuario logeado se comprueba 	
    if (req.session.user) {

        if (fecha_ultima_peticion){
            diferencia = ((fecha_actual - fecha_ultima_peticion)/1000);
            if (diferencia > TIMEOUT){
                delete req.session.user;
                fecha_ultima_peticion = null;
                console.log("Diferencia= "+ diferencia +" segundos, destruida sesion");
            } else {
                fecha_ultima_peticion = fecha_actual;    
                console.log("Diferencia= " + diferencia + " segundos");
            }
            
        } else {
            fecha_ultima_peticion = fecha_actual;
	    console.log("Inicializar fecha peticion al hacer login");    
        }        


    }
    next();
});


app.use('/', routes);
//comentamos la carga de mw users. Paso2 modulo6
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []	
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []	
  });
});


module.exports = app;
