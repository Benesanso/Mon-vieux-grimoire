const Book = require('../models/Book');
const fs = require('fs');

exports.addBook = (req, res, next) => {
    console.log('Request file:', req.file); // Affiche les informations sur le fichier
    // Analyse le corps de la requête qui contient les informations du livre
    const reqBody = JSON.parse(req.body.book);
    // Crée une nouvelle instance du modèle Book avec les données de la requête
    const book = new Book({
        userId: req.auth.userId,
        title: reqBody.title,
        author: reqBody.author,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        year: reqBody.year,
        genre: reqBody.genre,
        ratings: [
            {
                userId: req.auth.userId,
                grade: reqBody.ratings[0].grade
            }
        ],
        averageRating: reqBody.averageRating
    });
    // Sauvegarde le livre dans la base de données
    book.save()
        .then(() => {
            res.status(201).json({ message: 'Livre enregistré!' });
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

exports.getAllBooks = (req, res, next) => {
    // Recherche tous les livres dans la base de données
    Book.find()
        .then(books => { res.status(200).json(books);})// Livres trouvés
        .catch(error => { res.status(400).json({ error });});
};

exports.getOneBook = (req, res, next) => {
    // Recherche un livre dans la base de données en utilisant l'ID fourni dans les paramètres de la requête
    Book.findOne({ _id: req.params.id })
        .then(book => {res.status(200).json(book);})// Livre trouvé
        .catch(error => {res.status(400).json({ error });});
 };

 exports.deleteBook = (req, res, next) => {
    // Recherche le livre dans la base de données en utilisant l'ID fourni dans les paramètres de la requête
    Book.findOne({ _id: req.params.id })
        .then(book => {
            // Vérifie si l'utilisateur qui a effectué la requête est l'auteur du livre
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: '403: unauthorized request' });
            } else {
                // Si l'utilisateur est l'auteur du livre, procède à la suppression du livre et de l'image associée
                const filename = book.imageUrl.split('/images/')[1];
                // Supprime le fichier de l'image du livre du système de fichiers
                fs.unlink(`images/${filename}`, () => {
                    // Supprime le livre de la base de données
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: 'Livre supprimé!' });
                        })
                        .catch(error => {
                            res.status(401).json({ error });
                        });
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};


exports.updateBook = (req, res, next) => {
    // Vérifier si un fichier est présent dans la requête
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : { ...req.body };
    // Supprimer la propriété _userId de bookObject
    delete bookObject._userId;
    // Rechercher le livre dans la base de données en utilisant l'ID fourni
    Book.findOne({ _id: req.params.id })
        .then(book => {
            // Vérifier si l'utilisateur est autorisé à mettre à jour le livre
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: '403: requête non autorisée' });
            } else if (req.file) {
                // Si un fichier est présent dans la requête, supprimer l'ancienne image du livre
                const filename = book.imageUrl.split('/images')[1];
                fs.unlink(`images/${filename}`, () => { });
            }
            // Mettre à jour le livre dans la base de données
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                .then(() => {
                    res.status(200).json({ message: 'Livre modifié !' });
                })
                .catch(error => {
                    res.status(400).json({ error });
                });
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};


exports.getBestBook = (req, res, next) => {
    // Recherche les livres dans la base de données, triés par note moyenne décroissante et limités à 3 livres
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => {
            res.status(200).json(books); 
        })
        .catch(error => {
            res.status(401).json({ error }); 
        });
};


exports.ratingBook = async (req, res, next) => {
    const user = req.body.userId;
    // Vérifier si l'utilisateur est autorisé à noter le livre
    if (user !== req.auth.userId) {
        return res.status(401).json({ message: 'Non autorisé' });
    }
    try {
        // Rechercher le livre dans la base de données
        const book = await Book.findOne({ _id: req.params.id });
        // Vérifier si l'utilisateur a déjà noté le livre
        if (book.ratings.find(rating => rating.userId === user)) {
            return res.status(401).json({ message: 'Livre déjà noté' });
        }
        // Créer une nouvelle note
        const newRating = {
            userId: user,
            grade: req.body.rating,
            _id: req.body._id
        };
        // Mettre à jour les notes du livre avec la nouvelle note
        const updatedRatings = [...book.ratings, newRating];
        // Calculer la note moyenne et mise à jour
        const calcAverageRating = ratings => {
            const sumRatings = ratings.reduce((total, rate) => total + rate.grade, 0);
            const average = sumRatings / ratings.length;
            return parseFloat(average.toFixed(2));
        };
        const updateAverageRating = calcAverageRating(updatedRatings);
        // Mettre à jour le livre dans la base de données avec la nouvelle note et la note moyenne mise à jour
        const updatedBook = await Book.findOneAndUpdate(
            { _id: req.params.id, 'ratings.userId': { $ne: user } },
            { $push: { ratings: newRating }, averageRating: updateAverageRating },
            { new: true }
        );
        res.status(201).json(updatedBook); 
    } catch (error) {
        res.status(401).json({ error }); 
    }
};
