const Restaurante = require('../models/restaurante.model');

module.exports.CreateRestaurante = (reques, response) => {
    const { nombre, direccion, reputacion, url } = reques.body;
    Restaurante.create({
        nombre,
        direccion,
        reputacion,
        url
    })
    .then(restaurante => {
        response.status(201).json({
            status: "ok",
            message: "Restaurante creado correctamente",
            data: restaurante
        });
    })
    .catch(error => {
        response.status(400).json({
            status: "error",
            message: "Error al crear el restaurante",
            error: error.message
        });
    });
};