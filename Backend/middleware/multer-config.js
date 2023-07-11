const multer = require('multer');
const sharp = require('sharp');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const originalName = file.originalname;
    let extension = MIME_TYPES[file.mimetype];
    // Si l'extension est jpg ou jpeg, nous la remplaçons par webp
    if (extension === 'jpg' || extension === 'jpeg') {
      extension = 'webp';
    }
    // Séparation du nom de fichier et de l'extension
    const fileNameWithoutExtension = originalName.split('.').slice(0, -1).join('.');
    // Génération du nouveau nom de fichier avec la date actuelle et la nouvelle extension
    const newFileName = fileNameWithoutExtension + '_' + Date.now() + '.' + extension;
    callback(null, newFileName);
  }
});

// Middleware multer pour le téléchargement de l'image
const upload = multer({ storage: storage }).single('image');

// Middleware de redimensionnement et limitation de résolution
const resizeAndLimitResolution = (req, res, next) => {
  if (!req.file) {
    // Vérifiez si une image a été téléchargée
    return next();
  }

  const imageFilePath = req.file.path;
  const maxWidth = 260; // Définissez la largeur maximale souhaitée ici
  const maxHeight = 206; // Définissez la hauteur maximale souhaitée ici

  sharp(imageFilePath)
  .resize(maxWidth, maxHeight, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  // Redimensionne l'image en utilisant la méthode 'contain', qui préserve le ratio d'aspect
 
  // La couleur de l'arrière-plan est définie sur blanc (RGB : 255, 255, 255) avec une opacité de 1.
  .toFile(imageFilePath, (err, info) => {
    if (err) {
      // Gérez les erreurs de redimensionnement de l'image
      return next(err);
    }
    next();
  });
};

module.exports = { upload, resizeAndLimitResolution };
module.exports = multer({ storage: storage }).single('image');
