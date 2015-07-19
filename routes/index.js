var express = require('express');
var router = express.Router();

//importamos mw quiz_controllers
var quizController = require ('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

//enrutamos las peticiones GET de quiestion y answer 
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);



module.exports = router;
