// haz las rutas para el tipo comida segu nel controlador
const TipoComidaController = require('../controllers/TipoComida.controller');
module.exports = function(app) {
    app.post("/tipo-comida", TipoComidaController.CreateTipoComida);
    app.get("/tipo-comida", TipoComidaController.getAllTipoComidas);
    app.get("/tipo-comida/:id", TipoComidaController.getTipoComida);
    app.put("/tipo-comida/:id", TipoComidaController.updateTipoComida);
    app.delete("/tipo-comida/:id", TipoComidaController.deleteTipoComida);
}