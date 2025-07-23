const menuController = require('../controllers/menu.controller');

module.exports = function(app) {
    // Rutas existentes
    app.post("/menu", menuController.createMenu);
    app.get("/menu", menuController.getAllMenus);
    app.get("/menu/restaurante/:restauranteId/tipos-comida", menuController.getTiposComidaByRestaurante);
    app.delete("/menu/:id", menuController.deleteMenu);
    
    // Ruta para obtener restaurantes por tipo de comida
    app.get("/restaurantesByTipoC/:id", menuController.getRestaurantesByTipoComida);
};
