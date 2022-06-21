const Sauce = require('../models/sauces'); // importation du modèle de sauce
const fs = require('fs');
/* création de sauce*/
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() // sauvegarde la sauce dans la BDD
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  };

  /* modification d'une sauce*/
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };

/* récupération d'une seule sauce*/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {res.status(200).json(sauce);})
    .catch((error) => {res.status(404).json({ error: error});
    }
  );
};

/*suppression d'une sauce*/
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

/* récupération de toutes les sauces disponibles*/
exports.getAllSauces = (_req, res, next) => {
  Sauce.find()
    .then((sauces) => {res.status(200).json(sauces);})
    .catch((error) => {res.status(400).json({error: error});
    }
  );
};

/* Ajout ou Suppresion des likes & dislikes*/

exports.likeSauce =(req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          if (req.body.like === 1){  // si l'utilisateur aime
            if (!sauce.usersLiked.includes(req.body.userId)){ // si l'id de l'utilisateur n'est pas déjà présent dans le tableau usersliked
          sauce.usersLiked.push(req.body.userId) //on insère dans le tableau userliked l'id de l'utilisateur
          sauce.likes++; // on incrémente le like
          sauce.save()// on sauvegarde
          .then(() => res.status(201).json({ message: "sauce appréciée" }))
          .catch((error) => res.status(400).json({ error }));
        } else { // sinon ie si l'utilisateur veut liker deux fois
          res.status(403).json({ message: "vous avez déjà donné votre avis"})
          .catch((error) => res.status(400).json({ error }));
        }
      }
    // même principe que précédemment
      else if (req.body.like === -1) {  // si l'utilisateur n'aime pas
        if (!sauce.usersDisliked.includes(req.body.userId)){ // si l'id de l'utilisateur n'est pas déjà présent dans le tableau usersdisliked
          sauce.usersDisliked.push(req.body.userId) // on insère dans le tableau userdisliked l'id de l'tilisateur
          sauce.dislikes++; // on incrémente le dislike
          sauce.save() // on sauvegarde
          .then(() => res.status(201).json({ message: "sauce dépréciée" }))
          .catch((error) => res.status(400).json({ error }));
        }
        else {
          res.status(403).json({ message: "vous avez déjà donné votre avis"})
          .catch((error) => res.status(400).json({ error }));
        }
      } 
  
      else if (req.body.like === 0) { // si l'utilisateur annule son like ou dislike
        if (sauce.usersLiked.includes(req.body.userId)){ // si l'id de l'utilisateur est déjà présent dans le tableau usersliked
          sauce.usersLiked.pull(req.body.userId) // on retire l'id de l'utilisateur dans le tableau 
          sauce.likes-- // et on retire le like de l'utilisateur
          sauce.save() // sauvegarde
          .then(() => res.status(201).json({ message: "vous avez supprimé votre avis positif" }))
          .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {// si l'id de l'utilisateur est déjà présent dans le tableau usersdisliked
          sauce.usersDisliked.pull(req.body.userId) // on retire l'id de l'utilisateur dans le tableau 
          sauce.dislikes-- // et on retire le like de l'utilisateur
          sauce.save()
          .then(() => res.status(201).json({ message: "Vous avez supprimé votre avis négatif" }))
          .catch((error) => res.status(400).json({ error }));
        }
      }
    })
    .catch((error) => res.status(500).json({ error }));
  }
  