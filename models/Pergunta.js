const Sequelize = require('sequelize');
const conn = require('../database/database');

//Definindo tabela e model Pergunta. Isto aqui vai virar uma tabela no banco de dados
const Pergunta = conn.define('pergunta',{
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//Se não existir a tabela pergunta no BD (force), ele vai sincronizar e criar
Pergunta.sync({force: false}).then(() => {});

module.exports = Pergunta;