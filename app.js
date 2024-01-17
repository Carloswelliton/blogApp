//carregando modulos
    const express = require ('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const admin = require ('./routes/admin');
    const path = require('path');
    const mongoose = require ('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash');
    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')
    const usuarios = require('./routes/usuario')

// configurações
    //Sessão
        app.use(session(
        {
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    //Middleware
        app.use((req, res, next) => 
        {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })
    //Body-parser foi descontinuado, deve-se usar o express
        app.use(express.urlencoded({extended: true}));
        app.use(express.json());

    //Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');

    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect("mongodb://127.0.0.1:27017/blogapp").then(() => 
        {
            console.log("Conectado ao Mongo")
        }).catch((err) => 
        {
            console.log("Erro ao se conectar", err)
        })

    //Public
        app.use(express.static(path.join(__dirname,'public')));
        //app.use((req, res, next) => {
        //    console.log("Oi eu sou um Middleware")
        //    next()
        //})

//rotas (sempre chamar embaixo das configurações)
    app.get('/', (req, res) => 
    {
        Postagem.find().lean().populate("categoria").sort({data: 'desc'}).then((postagens) => {
            res.render('index', {postagens: postagens})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno!')
            res.redirect('/404')
        })
    })

    app.get('/postagem/:slug', (req, res) => {
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
            if(postagem){
                res.render('postagem/index', {postagem: postagem})
            }else{
                req.flash('error_msg', 'Essa postagem não exite!')
                res.redirect('/')
            }
        }).catch((err) => {
            req.flasj('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    })

    app.get('/categorias', (req, res) => {
        Categoria.find().lean().then((categorias) => {
            res.render('categorias/index', {categorias: categorias})
        }).catch((erro) => {
            req.flash('error_msg', 'Houve um erro interno ao listar as categorias')
            res.redirect('/')
        })
    })

    app.get('/categorias/:slug', (req, res) => {
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
            if(categoria){

                Postagem.find({categoria: categoria._id}).lean().then((postagens) => {

                    res.render('categorias/postagens', {postagens: postagens, categoria: categoria})

                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao listar os posts!')
                    res.redirect('/')
                })

            }else{
                req.flash('error_msg', 'Esta categoria não existe')
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno ao carregar a página desta categoria')
            res.redirect('/')
        })
    })

    app.get('/404', (req, res) => {
        res.send('Erro 404, Página não encontrada')
    })

    app.get('/post', (req, res) => {
        res.send('Lista de Posts')
    })
    app.use('/admin', admin);
    app.use('/usuarios', usuarios);


//outros
    const PORT = 8081;
    app.listen(PORT, () => 
    {
        console.log('Servidor rodando na URL http://localhost:8081');
    });

