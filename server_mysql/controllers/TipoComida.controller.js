//crea el controller de tipo comida el crud 
const TipoComida = require('../models/TipoComida.model');
module.exports.CreateTipoComida = async (request, response) => {
    const { nombre, paisOrigen } = request.body;
    try {
        const tipoComida = await TipoComida.create({
            nombre,
            paisOrigen
        });
        response.status(201).json({
            status: "ok",
            message: "Tipo de comida creado correctamente",
            data: tipoComida
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al crear el tipo de comida",
            error: error.message
        });
    }
}
module.exports.getAllTipoComidas = async (_, response) => {
    try {
        const tipoComidas = await TipoComida.findAll();
        response.json(tipoComidas);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener los tipos de comida",
            error: error.message
        });
    }
}
module.exports.getTipoComida = async (request, response) => {
    try {
        const tipoComida = await TipoComida.findOne({ where: { _id: request.params.id } });
        if (!tipoComida) {
            return response.status(404).json({
                status: "error",
                message: "Tipo de comida no encontrado"
            });
        }
        response.json(tipoComida);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener el tipo de comida",
            error: error.message
        });
    }
}
module.exports.updateTipoComida = async (request, response) => {
    const { nombre, paisOrigen } = request.body;
    try {
        const tipoComida = await TipoComida.findOne({ where: { _id: request.params.id } });
        if (!tipoComida) {
            return response.status(404).json({
                status: "error",
                message: "Tipo de comida no encontrado"
            });
        }
        tipoComida.nombre = nombre;
        tipoComida.paisOrigen = paisOrigen;
        await tipoComida.save();
        response.json({
            status: "ok",
            message: "Tipo de comida actualizado correctamente",
            data: tipoComida
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al actualizar el tipo de comida",
            error: error.message
        });
    }
}
module.exports.deleteTipoComida = async (request, response) => {
    try {
        // Primero, eliminar las relaciones en la tabla Menu
        const { Menu } = require('../models/index');
        await Menu.destroy({
            where: { tipoComidaId: request.params.id }
        });
        
        // Luego, eliminar el tipo de comida
        const tipoComida = await TipoComida.findOne({ where: { _id: request.params.id } });
        if (!tipoComida) {
            return response.status(404).json({
                status: "error",
                message: "Tipo de comida no encontrado"
            });
        }
        await tipoComida.destroy();
        response.json({
            status: "ok",
            message: "Tipo de comida eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar tipo de comida:", error);
        response.status(500).json({
            status: "error",
            message: "Error al eliminar el tipo de comida",
            error: error.message
        });
    }
}
  