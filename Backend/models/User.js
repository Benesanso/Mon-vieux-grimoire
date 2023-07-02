const mongoose = require("mongoose");


// Définition du schéma pour le modèle User
const authSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true // l'email doit être unique
        },
        password: {
            type: String,
            required: true
        }
    }
)



// Export du modèle User basé sur le schéma authSchema
module.exports = mongoose.model("User", authSchema);