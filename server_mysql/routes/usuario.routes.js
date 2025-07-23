const UsuarioController = require('../controllers/usuario.controller');

module.exports = function(app) {
    // Ruta para crear un nuevo usuario
    app.post("/usuarios", UsuarioController.createUsuario);
    
    // Ruta para obtener todos los usuarios
    app.get("/usuarios", UsuarioController.getAllUsuarios);
    
    // Ruta para obtener un usuario específico por ID
    app.get("/usuarios/:id", UsuarioController.getUsuario);
    
    // Ruta para actualizar un usuario por ID
    app.put("/usuarios/:id", UsuarioController.updateUsuario);
    
    // Ruta para eliminar un usuario por ID
    app.delete("/usuarios/:id", UsuarioController.deleteUsuario);
};
