const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./Routes/user');
const bookRoutes = require('./Routes/books');

const helmet = require('helmet');
const bodyParser = require('body-parser'); // Ajout de l'importation de bodyParser
const path = require('path'); // Ajout de l'importation de path

// Middleware pour analyser le corps des requêtes au format JSON
app.use(express.json());
// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://benesanso:bene@cluster0.ptzdb0u.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


// Middleware pour gérer les CORS (Cross-Origin Resource Sharing)
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true })); // Ajout de l'analyse des URL encodées
app.use(bodyParser.json());
// Routes pour login
app.use('/api/auth/', userRoutes);
// Routes pour les livres
app.use('/api/books', bookRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));// Ajout du middleware pour servir les fichiers statiques

module.exports = app;
