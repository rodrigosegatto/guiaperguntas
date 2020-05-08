const configuration = require('./config/config');
const express = require ('express');
const app = express();
const conn = require('./database/database');
const PerguntaModel = require('./models/Pergunta');
const RespostaModel = require('./models/Resposta');

//Lib Utilizada para receber dados do fomulário enviado no frontend e tratar no backend
const bodyParser = require('body-parser');

//Estou dizendo para o express utilizar o EJS como engine para renderizar o HTML
//Os arquivos HTML obrigatoriamente devem ser salvos dentro de uma pasta 'views'
//E os arquivos com EJS tem a extensão .ejs ao invés de .html
app.set('view engine','ejs');

//Utilizar arquivos estáticos com express (Ex: css, js, imagens, etc..)
app.use(express.static('public'));

//Body Parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Database
conn.authenticate()
    .then(() => {
        console.log('Conexão com Banco de Dados Realizada!');
    })
    .catch((msgErro) => {
        console.log('Erro ao se conectar no BD.');
        console.log('Verifique a se configurou as variaveis de ambiente.');
        console.log('Para ambiente de testes preencha em .env.testing e rode "npm test".');
    })

//Rotas
app.get('/',(req,res) => {
    PerguntaModel.findAll({raw: true, order: [
        ['id','DESC']
    ]}).then(perguntas => {
        res.render('index',{
            perguntas
        });
    });
    
});

app.get('/perguntar',(req,res) => {
    res.render('perguntar');
});

app.post('/salvarpergunta', (req,res) => {
    const {titulo, descricao} = req.body;
    PerguntaModel.create({
        titulo, 
        descricao
    }).then(() => {
        res.redirect("/");
    });
});

app.get('/pergunta/:id',(req,res) => {
    const {id} = req.params;
    PerguntaModel.findOne({
        where: {id: id} 
    }).then(pergunta => {
        if(!pergunta)
            res.redirect('/');
        
        RespostaModel.findAll({
            where: {perguntaId: id},
            order: [['id','DESC']]
        }).then(respostas => {
            res.render('pergunta',{pergunta,respostas});
        });
    });
});

app.post('/responder',(req,res) => {
    const {corpo, perguntaId} = req.body;
    RespostaModel.create({
        corpo, 
        perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);
    });
});

//Iniciar App
app.set('port',configuration.port || 3000);
app.listen(app.get('port'), () => {
    console.log(`Server running at port: ${app.get('port')}/`);
});