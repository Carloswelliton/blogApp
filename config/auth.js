const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/Usuario')

//model de usuario
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {
        Usuario.findOne({email: email}).then((usuario) => {
            if(!usuario){
                return done(null, false, {message: 'Email não cadastrado!'})
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: 'Email ou senha estão incorretos'})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser(function(id, done) {
        Usuario.findOne({where:{id:id}}).then((usuario) => {
            done(null, usuario);
        }).catch((err) => {
            done(err, null);
        });
      })



}