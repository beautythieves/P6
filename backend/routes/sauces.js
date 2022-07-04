const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
// multer pour sauvergarder les images sur le serveur
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauces');
// routes CRUD (create, read, update, delete) pour les sauces
router.get('/', auth, sauceCtrl.getAllSauces);// read
router.get('/:id', auth, sauceCtrl.getOneSauce);//read
router.post('/', auth, multer, sauceCtrl.createSauce);//  create
router.put('/:id', auth, multer, sauceCtrl.modifySauce);// update
router.delete('/:id', auth, sauceCtrl.deleteSauce);//  delete

// route pour les likes & dislikes
router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;