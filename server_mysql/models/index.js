const sequelize = require('../config/sequelize.config');

// Importar modelos
const Restaurantes = require('./restaurante.model');
const TipoComida = require('./TipoComida.model');
const Menu = require('./menu.model');
const Usuario = require('./usuario.model');

// Definir las asociaciones muchos a muchos
Restaurantes.belongsToMany(TipoComida, { 
    through: Menu,
    foreignKey: 'restauranteId',
    otherKey: 'tipoComidaId',
    as: 'tiposComida'
});

TipoComida.belongsToMany(Restaurantes, { 
    through: Menu,
    foreignKey: 'tipoComidaId',
    otherKey: 'restauranteId',
    as: 'restaurantes'
});

// Asociaciones adicionales para consultar desde Menu
Menu.belongsTo(Restaurantes, { foreignKey: 'restauranteId' });
Menu.belongsTo(TipoComida, { foreignKey: 'tipoComidaId' });

// Exportar los modelos y sequelize
module.exports = {
    sequelize,
    Restaurantes,
    TipoComida,
    Menu,
    Usuario
};
