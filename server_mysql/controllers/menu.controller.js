const { Menu, Restaurantes, TipoComida } = require('../models/index');

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
        const restaurante = await Restaurantes.findOne({
            where: { _id: request.params.restauranteId },
            include: [{ 
                model: TipoComida,
                as: 'tiposComida'
            }]
        });
        if (!restaurante) {
            return response.status(404).json({
                status: "error",
                message: "Restaurante no encontrado"
            });
        }
        response.json(restaurante.tiposComida);
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
        const tipoComidaId = request.params.id;
        console.log(`Buscando restaurantes para tipo de comida ID: ${tipoComidaId}`);
        
        // Buscar el tipo de comida y sus restaurantes asociados
        const tipoComida = await TipoComida.findOne({
            where: { _id: tipoComidaId },
            include: [{
                model: Restaurantes,
                as: 'restaurantes',
                through: { attributes: [] } // Esto evita que se incluyan los atributos de la tabla intermedia
            }]
        });
        
        if (!tipoComida) {
            console.log(`No se encontró tipo de comida con ID: ${tipoComidaId}`);
            return response.status(404).json({
                status: "error",
                message: `No existe ese tipo de comida con el ID ${tipoComidaId}`
            });
        }

        // Obtener los restaurantes del tipo de comida
        const restaurantes = tipoComida.restaurantes || [];
        console.log(`Se encontraron ${restaurantes.length} restaurantes para tipo de comida ID: ${tipoComidaId}`);

        if (restaurantes.length === 0) {
            return response.json({
                status: "success",
                message: "No hay restaurantes registrados con este tipo de comida",
                data: []
            });
        }

        return response.json(restaurantes);
    } catch (error) {
        console.error("Error al buscar restaurantes:", error);
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
        const menu = await Menu.findOne({
            where: { id: request.params.id }
        });
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
