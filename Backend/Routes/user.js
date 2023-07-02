const express = require('express');
const router = express.Router();
const validEmail = require('../middleware/email-validator');
const validPassword = require('../middleware/password-validator');
const userCtrl = require('../controllers/user');

// Route pour l'inscription des utilisateurs
router.post('/signup',userCtrl.signup);

// Route pour la connexion des utilisateurs
router.post('/login', userCtrl.login)

module.exports = router;