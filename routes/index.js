var express = require('express');
var router = express.Router();

//importamos mw quiz_controllers
var quizController = require ('../controllers/quiz_controller');

//importamos mw controlador de comentarios
var commentController = require('../controllers/comment_controller');
//importamos mw de sesion y de user 
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors: [] });
});

//Autoload de comandos con :quizId
router.param('quizId', quizController.load); 

//autoload de coments con :commentId
router.param('commentId',commentController.load);

// Definicion de rutas de session
router.get('/login', 	sessionController.new); // formulario login
router.post('/login', 	sessionController.create); // crear sesión
router.get('/logout', 	sessionController.destroy); // destruir sesión


//GET author
router.get('/author', function(req, res, next) {
  res.render('author', { title: 'Quiz', errors: [] });
});

//enrutamos las peticiones GET de quizes, quiz y answer 
router.get('/quizes', 				quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',	quizController.answer);
router.get('/quizes/new',			quizController.new);
router.post('/quizes/create',			quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', 	quizController.edit);
router.put('/quizes/:quizId(\\d+)',		quizController.update);
router.delete('/quizes/:quizId(\\d+)',		quizController.destroy);


//enrutamos peticiones de comments
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);



module.exports = router;
