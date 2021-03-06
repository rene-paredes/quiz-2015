//Definicion del modelo de quiz

module.exports = function(sequelize, Datatypes) {
	return sequelize.define('Quiz',
		{
		 pregunta:{
			type:		Datatypes.STRING,
			validate:	{ notEmpty: {msg: "--> Falta Pregunta"}}
			},
		 respuesta:{
			type:		Datatypes.STRING,
			validate:	{ notEmpty: {msg: "--> Falta Respuesta"}}
			},
		 tema:{
			type:		Datatypes.STRING,
			defaultValue:	"otro",
			validate:	{ notEmpty: {msg: "--> Falta Tema"}}
			}
		});

}
