const multer = require('multer');

// Définition des types MIME acceptés et de leurs extensions correspondantes
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Définition du dossier de destination des fichiers
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // Génération du nom de fichier unique en remplaçant les espaces par des underscores
    const name = file.originalname.split(' ').join('_');
    // Récupération de l'extension du fichier en fonction du type MIME
    const extension = MIME_TYPES[file.mimetype];
    // Concaténation du nom de fichier, de la date actuelle et de l'extension
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Configuration de Multer avec le stockage défini et la limite à un seul fichier
module.exports = multer({storage: storage}).single('image');