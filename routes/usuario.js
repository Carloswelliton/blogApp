const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcrypt')   


router.get('/registro', (req, res) => {
    res.render('usuarios/registro')
})

router.post('/registro', (req,res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "E-mail inválido"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "senha inválida"})
    }
    if(req.body.senha.length < 8){
        erros.push({texto: "sua senha deve conter no mínimo 8 dígitos"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas são diferentes, tente novamente!"})
    }
    if(erros.length > 0){
        res.render('usuarios/registro', {erros: erros})


    }else{
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash('error_msg', 'E-mail já cadastrado!')
                res.redirect('/usuarios/registro')
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        if(erro){
                            req.flash('error_msg', "Houve um erro durante o salvamento do usuário")
                            res.redirect('/')
                        }
                        
                        novoUsuario.senha = hash 

                        novoUsuario.save().then(() => {
                            req.flash('success_msg', 'usuário criado com sucesso!')
                            res.redirect('/')
                        }).catch((err) => {
                            req.flash('error_msg', 'O erro está aqui '+ err)
                            res.redirect('/usuarios/registro')
                        })
                    })
                })

            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    }
})

router.get('/login', (req, res) => {
    res.render('usuarios/login')
})

module.exports = router