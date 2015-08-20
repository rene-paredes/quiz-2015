//// Controlador de quizes

//declarar variable para acceder al modelo
var models = require('../models/models.js');

//Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
       models.Quiz.findById(quizId)
		  .then(function(quiz){
	if (quiz) {
		console.log('Autoload de quizId='+quizId);
		req.quiz = quiz;
		next();	
	} else { next(new Error('No existe quizId='+ quizId) );   }

	}).catch(function(error) {next(error); });
};

// GET /quizes
exports.index = function (req, res) {
	var filtrar = ('%' + req.query.search + '%').replace(/\s/g,'%');
	console.log('Filtro:'+ filtrar);

	if (req.query.search) {
	        models.Quiz.findAll(
				    {
			where: ["pregunta like ?", filtrar],
			order: [['pregunta' , 'ASC' ]] 	
				    }
				)
			  .then(function(quizes){
			res.render('quizes/index.ejs', { quizes: quizes  });
		}).catch(function(error) {next(error);})
	}
	else {

	        models.Quiz.findAll()
			  .then(function(quizes){
			res.render('quizes/index.ejs', { quizes: quizes  });
		}).catch(function(error) {next(error);})
	
	}
};

// GET /quizes/:quizId
exports.show = function (req, res) {
	//el autoload ya carga en req.quiz el objeto pregunta
	res.render('quizes/show', { quiz: req.quiz });
};


//GET /quizes/answer
exports.answer = function (req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta ) {
		resultado ='Correcto';
	}

	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });

};

