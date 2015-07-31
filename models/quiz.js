//Definicion del modelo de quiz

module.exports = function(sequelize, Datatypes) {
	return sequelize.define('Quiz',
		{
		 pregunta:	Datatypes.STRING,
		 respuesta:	Datatypes.STRING
		});

}
