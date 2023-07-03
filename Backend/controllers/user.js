const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Inscription de l'utilisateur
exports.signup = (req, res, next) => {
    console.log('Signup function called', req.body); // vérifie si la fonction est appelée
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            console.log('Password hashed:', hash); // vérifie le hachage du mot de passe
        const user = new User({
            email: req.body.email,
            password: hash
        });
        console.log('User object:', user); // Ajouter cette ligne pour vérifier l'objet utilisateur
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ message: error + 'création compte'  }));
        })
        .catch(error => res.status(500).json({ message: error  }));
};

// Connexion de l'utilisateur
exports.login = (req, res, next) => {
    console.log('Login function called'); //  vérifie si la fonction est appelée
    User.findOne({ email: req.body.email })
        .then(user => {
            console.log('User found:', user); // vérifie si l'utilisateur est trouvé
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    console.log('Password comparison result:', valid); //  vérifie le résultat de la comparaison du mot de passe
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };

