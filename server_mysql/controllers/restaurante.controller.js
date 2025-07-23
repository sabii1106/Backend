const Restaurantes = require('../models/restaurante.model');

module.exports.CreateRestaurante =  async (request, response) => {
    const { nombre, direccion, reputacion, url } = request.body;
    try {
        const Restaurante = await Restaurantes.create({
            nombre,
            direccion,
            reputacion,
            url
        });
        response.status(201).json({
            status: "ok",
            message: "Restaurante creado correctamente",
            data: Restaurante
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al crear el restaurante",
            error: error.message
        });
    }
};

module.exports.getAllRestaurantes = async (_, response) => {
    try {
        const restaurantes = await Restaurantes.findAll();
        response.json(restaurantes);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener los restaurantes",
            error: error.message
        });
    }
}

module.exports.getRestaurante = async (request, response) => {
    try {
        const restaurante = await Restaurantes.findOne({
            where: { _id: request.params.id }
        });
        if (!restaurante) {
            return response.status(404).json({
                status: "error",
                message: "Restaurante no encontrado"
            });
        }
        response.json(restaurante);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener el restaurante",
            error: error.message
        });
    }
}



module.exports.updateRestaurante = async (request, response) => {
    const { nombre, direccion, reputacion, url } = request.body;
    try {
        // Verificar primero que el restaurante exista
        const restaurante = await Restaurantes.findOne({
            where: { _id: request.params.id }
        });
        
        if (!restaurante) {
            return response.status(404).json({
                status: "error",
                message: "Restaurante no encontrado"
            });
        }
        
        // Actualizar el restaurante
        await restaurante.update({
            nombre,
            direccion,
            reputacion,
            url
        });
        
        response.json({
            status: "ok",
            message: "Restaurante actualizado correctamente"
        });
    } catch (error) {
        console.error("Error al actualizar restaurante:", error);
        response.status(500).json({
            status: "error",
            message: "Error al actualizar el restaurante",
            error: error.message
        });
    }
}

module.exports.deleteRestaurante = async (request, response) => {
    try {
        // Primero, eliminar las relaciones en la tabla Menu
        const { Menu } = require('../models/index');
        await Menu.destroy({
            where: { restauranteId: request.params.id }
        });
        
        // Luego, eliminar el restaurante
        const deleted = await Restaurantes.destroy({
            where: { _id: request.params.id }
        });
        
        if (!deleted) {
            return response.status(404).json({
                status: "error",
                message: "Restaurante no encontrado"
            });
        }
        
        response.json({
            status: "ok",
            message: "Restaurante eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar restaurante:", error);
        response.status(500).json({
            status: "error",
            message: "Error al eliminar el restaurante",
            error: error.message
        });
    }
};