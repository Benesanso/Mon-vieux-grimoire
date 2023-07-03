//Ajout importation express
const express = require('express');
const app = express();
//Ajout importation mongoose
const mongoose = require('mongoose');
//Ajout importation CORS
const cors = require('cors');
//Ajout importation des routes
const userRoutes = require('./Routes/user');
const bookRoutes = require('./Routes/books');
// Ajout de l'importation de bodyParser
const bodyParser = require('body-parser'); 
// Ajout de l'importation de path module qui permet de manipuler et de résoudre des chemins de fichiers de manière sécurisée et portable
const path = require('path'); 
// Module pour gérer les variables d'environnement stockage données sensibles
require('dotenv').config();

// Middleware pour analyser le corps des requêtes au format JSON
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


// Middleware pour gérer les CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Ajout de l'analyse des URL encodées
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes pour login
app.use('/api/auth/', userRoutes);
// Routes pour les livres
app.use('/api/books', bookRoutes);
// Ajout du middleware pour servir les fichiers statiques
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
