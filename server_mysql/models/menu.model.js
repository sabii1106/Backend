//veras restaurante y tipo comida tinene una relacion de muchos a muchos crea la relacion con datatype y con enrollment este es el modelo 
const { DataTypes } = require("sequelize");
const sequelize = require('../config/sequelize.config');

const Menu = sequelize.define("Menu", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    restauranteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Restaurantes',
            key: '_id'
        }
    },
    tipoComidaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'TipoComidas',
            key: '_id'
        }
    },
    enrollmentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'Menus'
});

module.exports = Menu;
