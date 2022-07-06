const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: 'Le Mot de passe doit contenir au moins 8 caractères, avec, au minimum un chiffre, une majuscule et une minuscule.' });
    } else {
        next();
    }
};