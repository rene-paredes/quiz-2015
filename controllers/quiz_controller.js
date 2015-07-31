//// Controlador de quizes

//declarar variable para acceder al modelo
var models = require('../models/models.js');


// GET /quizes/question. YA no se usa por question. Dejar para pruebas
//exports.question = function (req, res) {
//       models.Quiz.findAll().then(function(quiz){
//		res.render('quizes/question', { pregunta: quiz[0].pregunta  });
//	})
//};


// GET /quizes
exports.index = function (req, res) {
       models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index.ejs', { quizes: quizes  });
	})

};

// GET /quizes/:quizId
exports.show = function (req, res) {
       models.Quiz.find(req.params.quizId)
		  .then(function(quiz){
	res.render('quizes/show', { quiz: quiz });
	})

};


//GET /quizes/answer
exports.answer = function (req, res) {
       models.Quiz.find(req.params.quizId).then(function(quiz){
		if (req.query.respuesta === quiz.respuesta ) {
			res.render('quizes/answer',
					 { quiz: quiz, respuesta: 'Correcto' }
				);

		} else {
			res.render('quizes/answer',
					 { quiz: quiz, respuesta: 'Incorrecto' }
				);

		}
	})

};

