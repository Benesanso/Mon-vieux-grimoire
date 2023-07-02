const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       // Récupérer le token JWT de l'en-tête Authorization de la requête
       const token = req.headers.authorization.split(' ')[1];
       // Vérifier la validité du token et décoder son contenu
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       // Extraire l'ID de l'utilisateur à partir du token décodé
       const userId = decodedToken.userId;
       // Ajouter l'ID de l'utilisateur à l'objet req.auth pour le rendre accessible aux middleware ou aux routes ultérieures
       req.auth = {
           userId: userId
       };
       // Appeler le prochain middleware ou la prochaine route
       next();

}   catch(error) {
       // En cas d'erreur lors de la vérification du token ou si le token est invalide
       res.status(401).json({ error });
    }
};