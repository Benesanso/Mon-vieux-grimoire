const PasswordValidator = require('password-validator');

const passwordSchema = new PasswordValidator();
passwordSchema
    .is().min(8) //Au moins 8 caractères
    .is().max(50) //Au plus 50 caractères
    .has().uppercase() //Au moins une lettre majuscule
    .has().lowercase() //Au moins une lettre minuscule
    .has().digits() //Au moins un chiffre
    .has().not().spaces() //Pas d'espaces

module.exports = (req, res, next) => {
    const userPassword = req.body.password;
    // Vérifier si le mot de passe respecte les critères définis dans le schéma de validation
    if (!passwordSchema.validate(userPassword)) {
         // Si le mot de passe ne respecte pas les critères, renvoyer une réponse d'erreur avec les détails
        return res.status(400).json({ error: `Mot de passe trop faible ${passwordSchema.validate(userPassword, {list: true})}` })     
    } else {
        // Si le mot de passe est valide, passer au prochain middleware ou à la prochaine route
        next()
    };
};

module.exports = PasswordValidator;