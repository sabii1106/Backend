const menuController = require('../controllers/menu.controller');

module.exports = function(app) {
    app.post("/menu", menuController.createMenu);
    app.get("/menu", menuController.getAllMenus);
    app.get("/menu/restaurante/:restauranteId/tipos-comida", menuController.getTiposComidaByRestaurante);
    app.get("/menu/tipo-comida/:tipoComidaId/restaurantes", menuController.getRestaurantesByTipoComida);
    app.delete("/menu/:id", menuController.deleteMenu);
};
