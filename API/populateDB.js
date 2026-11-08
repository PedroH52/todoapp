#! /usr/bin/env node

console.log('Teste gravacao de dados no banco remoto');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
var mongoDB = userArgs[0] || "mongodb+srv://ProjetoSistemasIntegrados:SistemasIntegrados@cluster0.p3xhbzg.mongodb.net/tarefasDB?retryWrites=true&w=majority";

var Tarefa = require('./models/tarefa');
var mongoose = require('mongoose');

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function gravaRegistros() {
  await (new Tarefa({descricao: "Estudar Frameworks WEB", statusRealizada: false})).save();
  await (new Tarefa({descricao: "Comer Pizza", statusRealizada: false})).save();
  await (new Tarefa({descricao: "Ajudar meus pais", statusRealizada: false})).save();
  console.log('Registros gravados com sucesso no banco tarefasDB!');
  await mongoose.connection.close();
}

gravaRegistros();
