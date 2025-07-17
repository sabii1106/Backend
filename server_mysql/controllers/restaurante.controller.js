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
        const restaurante = await Restaurantes.findOne({_id: request.params.id});
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
        const [updated] = await Restaurantes.update({
            nombre,
            direccion,
            reputacion,
            url
        }, {
            where: { _id: request.params.id }
        });
        if (!updated) {
            return response.status(404).json({
                status: "error",
                message: "Restaurante no encontrado"
            });
        }
        response.json({
            status: "ok",
            message: "Restaurante actualizado correctamente"
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al actualizar el restaurante",
            error: error.message
        });
    }
}

module.exports.deleteRestaurante = async (request, response) => {
    try {
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
        response.status(500).json({
            status: "error",
            message: "Error al eliminar el restaurante",
            error: error.message
        });
    }
};