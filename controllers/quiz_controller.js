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
       models.Quiz.findAll()
		  .then(function(quizes){
		res.render('quizes/index.ejs', { quizes: quizes  });
	}).catch(function(error) {next(error);})

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

// GET /quizes/new
exports.new = function (req, res) {
	var quiz = models.Quiz.build(	//crea objeto quiz
	 				 {
					  pregunta:"Pregunta" ,
					  respuesta:"Respuesta"
					 }
				);
	res.render('quizes/new', { quiz: quiz });
};


// POST /quizes/create
exports.create = function (req, res) {
	//crear objeto quiz a  partir parametros body del formulario de quizes/new
	var quiz = models.Quiz.build(  req.body.quiz);

	//guardar en BD los campos pregunta y respuesta de quiz. 
	//especificamos los campos para evitar inyeccion de codigo
	quiz.save( { fields: ["pregunta", "respuesta"] })
	    .then(function() {
			//una vez creada pregunta redirigimos a /quizes
			res.redirect('/quizes');
		} )	

};


