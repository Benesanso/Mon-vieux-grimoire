const emailValidator = require('email-validator');

const validEmail = (req, res, next) => {
    const userEmail = req.body.email;
    // Vérifie si l'adresse e-mail est valide en utilisant le module email-validator.
    if (!emailValidator.validate(userEmail)) {
        return res.status(400).json({ error: 'Adresse mail invalide' })
    } else {
        // Si l'adresse e-mail est valide, passe au middleware suivant.
        next()
    }
};

module.exports = validEmail;