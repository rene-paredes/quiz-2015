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
			res.render('quizes/index.ejs', { quizes: quizes, errors: []  });
		}).catch(function(error) {next(error);})
	}
	else {
	        models.Quiz.findAll()
			  .then(function(quizes){
			res.render('quizes/index.ejs', { quizes: quizes, errors:[]  });
		}).catch(function(error) {next(error);})
	
	}
};

// GET /quizes/:quizId
exports.show = function (req, res) {
	//el autoload ya carga en req.quiz el objeto pregunta
	res.render('quizes/show', { quiz: req.quiz , errors: [] });
};


//GET /quizes/answer
exports.answer = function (req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta ) {
		resultado ='Correcto';
	}

	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []  });

};

// GET /quizes/new
exports.new = function (req, res) {
	var quiz = models.Quiz.build(	//crea objeto quiz
	 				 {
					  pregunta:"Pregunta" ,
					  respuesta:"Respuesta",
					  tema:"tema"
					 }
				);
	res.render('quizes/new', { quiz: quiz, errors: [] });
};


// POST /quizes/create
exports.create = function (req, res) {
	//crear objeto quiz a  partir parametros body del formulario de quizes/new
	var quiz = models.Quiz.build(  req.body.quiz);

	//Validar los campos antes de guardar
	quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/new', 
						{
						 quiz:		quiz,
						 errors:	err.errors	
						});
			} else {
				//guardar en BD los campos pregunta y respuesta de quiz. 
				//especificamos los campos para evitar inyeccion de codigo
				quiz.save( { fields: ["pregunta", "respuesta", "tema"] })
    				    .then(function() {
				//una vez creada pregunta redirigimos a /quizes
				res.redirect('/quizes');
					} )
				}	
	
		});
};


// GET /quizes/:id/edit
exports.edit = function (req, res) {
	var quiz = req.quiz;
	res.render('quizes/edit', { quiz: quiz, errors: [] });
};

// PUT /quizes/update
exports.update = function (req, res) {
	//actualizar objeto quiz del req cargado con autoload 
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	//Validar los campos antes de guardar
	req.quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/edit', 
						{
						 quiz:		req.quiz,
						 errors:	err.errors	
						});
			} else {
				//guardar en BD los campos pregunta y respuesta de quiz. 
				//especificamos los campos para evitar inyeccion de codigo
				req.quiz
				  .save( { fields: ["pregunta", "respuesta", "tema"] })
    				  .then(function() {
				//una vez actualizada pregunta redirigimos a /quizes
				res.redirect('/quizes');
					} )
				}	
	
		});
};

// DELETE /quizes/:id
exports.destroy = function (req, res) {
	req.quiz
	 .destroy()
	 .then(function(){
			res.redirect('/quizes');
		})
	 	.catch(function(error){next(error)});
};
