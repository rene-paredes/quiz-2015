//modelos contruidos 

var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;


//Cargar modulo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);


//Importar la definicion de la tabla Quiz que existe en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//exportar la definicion de la tabla Quiz para poder ser usada en otras partes dela aplicacion
exports.Quiz = Quiz;

//sequelize.sync() crea e inicializa la tabla de preguntas en BD
sequelize.sync().then(function() {
	//usar .then en vez de  .success(..) ejecuta el manejador una vez creada la tabla. forma antigua de acceder a callbacks de sequelize.
	//  Actualmente se usan las promises con .then(..) 
	Quiz.count().then(function (count) {
		if (count === 0) {
		//la tabla se inicializa solo si esta vacia 
		Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			   })
				//funcion a ejecutar una vez creado el objeto quiz
  		    .then(function() {console.log('Base de datos inicializada')});
		};

	});	

});

