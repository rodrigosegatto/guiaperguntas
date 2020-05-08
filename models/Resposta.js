const Sequelize = require('sequelize');
const conn = require('../database/database');

//Definindo tabela e model Resposta. Isto aqui vai virar uma tabela no banco de dados
const Resposta = conn.define('resposta',{
    corpo: {
        type: Sequelize.TEXT,
        allowNull: false //Not null
    },
    perguntaId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

//Se não existir a tabela resposta no BD (force), ele vai sincronizar e criar
Resposta.sync({force: false}).then(() => {});

module.exports = Resposta;