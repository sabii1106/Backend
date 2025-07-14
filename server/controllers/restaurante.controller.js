const Restaurante = require('../models/restaurante.model');
//En el controlador se defienen los metodos encargador de utilizar los verbos HTTP






module.exports.CreateRestaurante = (reques, response) => {
    const { nombre, direccion, reputacion, url } = reques.body;

    // Verificar si ya existe un restaurante con el mismo nombre
    Restaurante.findOne({ nombre: nombre })
    .then(existingRestaurante => {
        if (existingRestaurante) {
            return response.status(409).json({
                status: "error",
                message: "Ya existe un restaurante con ese nombre",
                error: "Nombre duplicado"
            });
        }

        // Si no existe, crear el nuevo restaurante
        return Restaurante.create({
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

// Controlador para obtener restaurantes con reputación en un rango específico
module.exports.getRestaurantesByReputacion = (request, response) => {
    const { min, max } = request.query;
    
    Restaurante.find({ reputacion: { $gte: min, $lte: max } })
    .then(restaurantes => {
        if (restaurantes.length > 0) {
            response.json(restaurantes);
        } else {
            response.status(404).json({
                message: "No se encontraron restaurantes en ese rango"
            });
        }
    })
    .catch(error => response.json(error));
};         
    
module.exports.updateRestaurante = (request, response) => {
    Restaurante.findOneAndUpdate({_id: request.params.id}, request.body, {new: true})
    .then(updateRestaurante => response.json(updateRestaurante))
    .catch(error => response.json(error));
};

module.exports.deleteRestaurante = (request, response) => {
    Restaurante.findOneAndDelete({_id: request.params.id})
    .then(deletedRestaurante => {
        if (deletedRestaurante) {
            response.json({
              
                data: deletedRestaurante
            });
        } else {
            response.status(404).json({
                status: "error",
                message: "Restaurante no encontrado"
            });
        }
    })
    .catch(error => {
        if (error.name === 'CastError') {
            response.status(400).json({
                message: "ID de restaurante inválido",
            });
        } else {
            response.status(500).json({
                message: "Error interno del servidor",
            });
        }
    });
}
