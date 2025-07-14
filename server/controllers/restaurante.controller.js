const { request } = require('express');
const Restaurante = require('../models/restaurante.model');
//En el controlador se defienen los metodos encargador de utilizar los verbos HTTP
module.exports.CreateRestaurante = (reques, response) => {
    //Validar que tenga un nombre y una direccion, que el nombre no exista en la BDD
    const { nombre, direccion, reputacion, url } = reques.body;
    Restaurante.findOne({ nombre: nombre.trim() })
        .then(existing => {
            if (existing) {
                response.status(409).json({
                    status: "error",
                    message: "El nombre del restaurante ya existe",
                    error: "Nombre duplicado"
                });
                return null; // Detiene la cadena de promesas
            }
            return Restaurante.create({
                nombre,
                direccion,
                reputacion,
                url
            });
        })
        .then(restaurante => {
            if (restaurante) {
                response.status(201).json({
                    status: "ok",
                    message: "Restaurante creado correctamente",
                    data: restaurante
                });
            }
            // Si restaurante es null, no hace nada
        })
        .catch(error => {
            response.status(400).json({
                status: "error",
                message: "Error al crear el restaurante",
                error: error.message
            });
        });
};
//El module.exports hace que pueda ser invocado desde archivos externos.
module.exports.getAllRestaurantes = (_, response) => {
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
    //Con el new:true le decimos que me retorne el restaurante actualizado, si no me envia el restaurante antes de actualizar 
    Restaurante.findOneAndUpdate({_id: request.params.id}, request.body, {new: true})
    .then(updateRestaurante => response.json(updateRestaurante))
    .catch(error => response.json(error));
};

module.exports.deleteRestaurante = (request, response) => {
    //Restaurante.deleteOne({_id: request.params.id})
    Restaurante.findByIdAndDelete({_id: request.params.id})
    //Esto retorna un objeto con acknolgment y la cantidad de filas borradas, pero nosotros queremos retornar el objeto
    .then(deleteResponse => response.json(deleteResponse))
    .catch(error => response.json(error));
}

//Se envia 2 parametros de ruta una inferior y la superior y se retorna la lista que lo cumpla 

module.exports.getRestaurantesByReputacion = (request, response) => {
    const { min, max } = request.query;

    // Validación básica de parámetros
    if (min === undefined || max === undefined) {
        return response.status(400).json({
            status: "error",
            message: "Debe proporcionar los parámetros 'min' y 'max' en la consulta"
        });
    }

    Restaurante.find({
        reputacion: { $gte: Number(min), $lte: Number(max) }
    })
    .then(restaurantes => response.json(restaurantes))
    .catch(error => response.status(400).json({
        status: "error",
        message: "Error al obtener restaurantes por reputación",
        error: error.message
    }));
};

module.exports.getRestaurantesByReputacionParms = (request, response) => {
    const { min, max } = request.params;

    // Validación básica de parámetros
    if (min === undefined || max === undefined) {
        return response.status(400).json({
            status: "error",
            message: "Debe proporcionar los parámetros 'min' y 'max' en la ruta"
        });
    }

    Restaurante.find({
        reputacion: { $gte: Number(min), $lte: Number(max) }
    })
    .then(restaurantes => response.json(restaurantes))
    .catch(error => response.status(400).json({
        status: "error",
        message: "Error al obtener restaurantes por reputación",
        error: error.message
    }));
};

