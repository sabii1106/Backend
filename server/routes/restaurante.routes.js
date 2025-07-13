const RestauranteController = require('../controllers/restaurante.controller');

module.exports = function(app) {
    app.post("/restaurantes/neuvo", RestauranteController.CreateRestaurante);
    app.get("/restaurantes", RestauranteController.getAllRestaurantes);
    app.get("/restaurantes/:id", RestauranteController.getRestaurante);
    app.put("/restaurantes/:id", RestauranteController.updateRestaurante);
    app.delete("/restaurantes/:id", RestauranteController.deleteRestaurante);
}