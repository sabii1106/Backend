const Restaurantes = require('./restaurante.model');
const TipoComida = require('./TipoComida.model');
const Menu = require('./menu.model');

// Definir relaciones many-to-many
Restaurantes.belongsToMany(TipoComida, { 
    through: Menu,
    foreignKey: 'restauranteId',
    otherKey: 'tipoComidaId'
});

TipoComida.belongsToMany(Restaurantes, { 
    through: Menu,
    foreignKey: 'tipoComidaId',
    otherKey: 'restauranteId'
});

// Definir relaciones de la tabla intermedia
Menu.belongsTo(Restaurantes, { 
    foreignKey: 'restauranteId',
    as: 'restaurante'
});

Menu.belongsTo(TipoComida, { 
    foreignKey: 'tipoComidaId',
    as: 'tipoComida'
});

module.exports = {
    Restaurantes,
    TipoComida,
    Menu
};
