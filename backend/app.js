const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const dotenv = require('dotenv').config('../.env');
console.log(dotenv);

mongoose.connect(process.env.SECRET_MONGODB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



  app.use(bodyParser.json());
 // logique CORS
app.use((req, res, next) => {
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
     next();
   });
 
   app.use('/images', express.static(path.join(__dirname, 'images')));
   app.use('/api/sauces', sauceRoutes);
   app.use('/api/auth', userRoutes);
 //Permet de créer le dossier images si il n'existe pas
if (!fs.existsSync('images')) {
  fs.mkdirSync('images');
};

module.exports = app;