const multer = require('multer');
// formats d'images acceptés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (_req, file, callback) => {
    callback(null, 'images');
  },
  filename: (_req, file, callback) => {
    const name = file.originalname.split(' ').join('_');// suprression des espaces pour le noms de fichiers et insertion de _ entre les mots
    const extension = MIME_TYPES[file.mimetype];// extension des ficheirsd images
    callback(null, name + Date.now() + '.' + extension);// génération du nom de fichier nom + date + extension
  }
});

module.exports = multer({storage: storage}).single('image');

