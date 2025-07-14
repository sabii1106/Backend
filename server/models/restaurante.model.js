const mongoose = require('mongoose');

const RestaurantesSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre del restaurante es obligatorio"],
        trim: true,
        maxlength: [100, "El nombre del restaurante no puede exceder los 100 caracteres"],
    },
    direccion: {
        type: String,
        required: [true, "La dirección del restaurante es obligatoria"],
        trim: true,
        maxlength: [200, "La dirección del restaurante no puede exceder los 200 caracteres"],
    },
    reputacion: {
        type: Number,
        required: [true, "La reputación del restaurante es obligatoria"],
        min: [1, "La reputación debe ser al menos 1"],
        max: [5, "La reputación no puede exceder 5"],
        validate: {
            validator: function(v) {
                return v >= 1 && v <= 5;
            },
            message: "La reputación debe estar entre 1 y 5"
        }
    },
    url: {
        type: String,
        required: [true, "La URL del restaurante es obligatoria"],
        validate: {
            validator: val => /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/[^\s]*)?(\?[^\s]*)?$/.test(val),
            message: "La URL proporcionada no es válida"
            }
        }
    }, { timestamps: true,
        versionKey: false });
const Restaurantes = mongoose.model('Restaurantes', RestaurantesSchema);

module.exports = Restaurantes;
     