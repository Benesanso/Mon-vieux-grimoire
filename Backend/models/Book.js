const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma pour le modèle Book
const bookSchema = mongoose.Schema({
  userId:{ type: String, required: true},
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
        userId: {type: String, required: true},
        grade: {type: Number, required: true}
    }
    ],
    averageRating: { type: Number, required: true}
});

// Ajout du plugin uniqueValidator au schéma
bookSchema.plugin(uniqueValidator);

// Export du modèle Book basé sur le schéma bookSchema
module.exports = mongoose.model('Book', bookSchema);