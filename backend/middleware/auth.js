// import de jsonwebtoken pour la création de token aléatoire et unique pour chaque utilisateur
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw new Error('User Id invalide !');
    } else {
      next();
    }
  } catch {
    res.status(401).json({error: new Error('requête invalide!')});
  }
};