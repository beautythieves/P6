// import de jsonwebtoken pour la création de token aléatoire et unique pour chaque utilisateur
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];// récupération du token
    const decodedToken = jwt.verify(token, process.env.TOKEN); // décodage du token
    const userId = decodedToken.userId;// récupération du userId
    req.auth = { userId };// ajout de  userId à l'objet request pour que les routes puissent l'exploiter
    if (req.body.userId && req.body.userId !== userId) {
      throw new Error('User Id invalide !');
    } else {
      next();
    }
  } catch {
    res.status(401).json({error: new Error('requête invalide!')});
  }
};