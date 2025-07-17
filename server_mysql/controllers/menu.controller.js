const Menu = require('../models/menu.model');
const Restaurantes = require('../models/restaurante.model');
const TipoComida = require('../models/TipoComida.model');

// Crear una nueva relación entre restaurante y tipo de comida
module.exports.createMenu = async (request, response) => {
    const { restauranteId, tipoComidaId } = request.body;
    try {
        const menu = await Menu.create({
            restauranteId,
            tipoComidaId
        });
        response.status(201).json({
            status: "ok",
            message: "Relación creada correctamente",
            data: menu
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al crear la relación",
            error: error.message
        });
    }
};

// Obtener todas las relaciones
module.exports.getAllMenus = async (_, response) => {
    try {
        const menus = await Menu.findAll({
            include: [
                { model: Restaurantes },
                { model: TipoComida }
            ]
        });
        response.json(menus);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener las relaciones",
            error: error.message
        });
    }
};

// Obtener tipos de comida de un restaurante específico
module.exports.getTiposComidaByRestaurante = async (request, response) => {
    try {
        const restaurante = await Restaurantes.findByPk(request.params.restauranteId, {
            include: [{ model: TipoComida }]
        });
        if (!restaurante) {
            return response.status(404).json({
                status: "error",
                message: "Restaurante no encontrado"
            });
        }
        response.json(restaurante.TipoComidas);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener los tipos de comida del restaurante",
            error: error.message
        });
    }
};

// Obtener restaurantes por tipo de comida
module.exports.getRestaurantesByTipoComida = async (request, response) => {
    try {
        const tipoComida = await TipoComida.findByPk(request.params.tipoComidaId, {
            include: [{ model: Restaurantes }]
        });
        if (!tipoComida) {
            return response.status(404).json({
                status: "error",
                message: "Tipo de comida no encontrado"
            });
        }
        response.json(tipoComida.Restaurantes);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener los restaurantes por tipo de comida",
            error: error.message
        });
    }
};

// Eliminar una relación
module.exports.deleteMenu = async (request, response) => {
    try {
        const menu = await Menu.findByPk(request.params.id);
        if (!menu) {
            return response.status(404).json({
                status: "error",
                message: "Relación no encontrada"
            });
        }
        await menu.destroy();
        response.json({
            status: "ok",
            message: "Relación eliminada correctamente"
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al eliminar la relación",
            error: error.message
        });
    }
};
