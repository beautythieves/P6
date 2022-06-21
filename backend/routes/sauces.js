const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
// multer pour sauvergarder les images sur le serveur
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauces');
// routes CRUD pour les sauces
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// route pour les likes & dislikes
router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;