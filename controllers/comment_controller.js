var models = require('../models/models.js');

// Autoload  de comment
exports.load = function (req, res, next, commentId){
        models.Comment.findById(commentId)
		.then(function(comment){
			if (comment) {
				req.comment = comment;
				next();
			}else { next (new Error("No existe el commentId=" + commentId)); }
		}
	).catch (function(error){next(error);});
	
};

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
	res.render('comments/new.ejs',{quizid: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
	var comment = models.Comment.build(
		{
			texto: req.body.comment.texto,
			QuizId: req.params.quizId
		}
		);

	comment
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('comments/new.ejs',
					{comment: comment, quizid: req.params.quizId, errors: err.errors});
			} else {
				comment // save: guarda en DB campo texto comment
				.save()
				.then( function () { res.redirect('/quizes/' + req.params.quizId)})
			}
		}
	).catch(function(error){next(error)});
};

//GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res){
	req.comment.publicado = true;

	req.comment.save({fields: ["publicado"]})
		.then(function(){res.redirect('/quizes/' + req.params.quizId);})
		.catch(function(error){next(error)});
};
