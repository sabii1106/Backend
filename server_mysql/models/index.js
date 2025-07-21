const sequelize = require('../config/sequelize.config');

// Importar modelos
const Restaurantes = require('./restaurante.model');
const TipoComida = require('./TipoComida.model');
const Menu = require('./menu.model');

// Definir las asociaciones muchos a muchos
Restaurantes.belongsToMany(TipoComida, { 
    through: Menu,
    foreignKey: 'restauranteId',
    as: 'tiposComida'
});

TipoComida.belongsToMany(Restaurantes, { 
    through: Menu,
    foreignKey: 'tipoComidaId',
    as: 'restaurantes'
});

// Asociaciones adicionales para consultar desde Menu
Menu.belongsTo(Restaurantes, { foreignKey: 'restauranteId' });
Menu.belongsTo(TipoComida, { foreignKey: 'tipoComidaId' });

// Relaciones para consultas desde Menu (estas están duplicadas, las eliminamos)

// Exportar los modelos y sequelize
module.exports = {
    sequelize,
    Restaurantes,
    TipoComida,
    Menu
};
