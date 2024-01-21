if(process.env.NODE_ENV == 'production'){                                                                                                               // Verifica se a aplicação esta em desenvolvimento ou produção
    module.exports = {mongoURI: 'mongodb+srv://carloswelliton7:<RqHhS7ZhlRoybd0k>@blogapp-production.p6naeii.mongodb.net/'}
    module.exports = {mongoURI: 'mongodb://127.0.0.1:27017/blogapp'}                                                                                      // Caso esteja em desenvolvimento, se conectará com o banco de dados local
}