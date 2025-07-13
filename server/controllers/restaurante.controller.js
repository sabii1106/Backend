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

module.exports.getAllRestaurantes = (request, response) => {
    Restaurante.find({})
    .then(restaurantes => response.json(restaurantes))
    .catch(error => response.json(error));
    }

module.exports.getRestaurante = (request, response) => {
    Restaurante.findOne({_id: request.params.id})
    .then(restaurante => response.json(restaurante))
    .catch(error => response.json(error));
};         
    
module.exports.updateRestaurante = (request, response) => {
    Restaurante.findOneAndUpdate({_id: request.params.id}, request.body, {new: true})
    .then(updateRestaurante => response.json(updateRestaurante))
    .catch(error => response.json(error));
};

module.exports.deleteRestaurante = (request, response) => {
    Restaurante.deleteOne({_id: request.params.id})
    .then(deleteResponse => response.json(deleteResponse))
    .catch(error => response.json(error));
}