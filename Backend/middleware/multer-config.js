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

module.exports = multer({ storage: storage }).single('image');
