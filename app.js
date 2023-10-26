//carregando modulos
    const express = require ('express')()
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require ('./routes/admin')
    const path = require('path')
    //const mongoose = require ('mongoose')

// configurações
    //Body-parser foi descontinuado, deve-se usar o express
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
    //Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');
    //Mongoose
        //Em breve
    //Public
        app.use(express.static(path.join(__dirname,'public')))

//rotas (sempre chamar embaixo das configurações)
app.use('/admin', admin)


//outros
const PORT = 8081
app.listen(PORT, () => {
    console.log('Servidor rodando na URL http://localhost:8081')
})

