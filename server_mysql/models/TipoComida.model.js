

//realixa el modelo de tipo comida con id nombre y pais de origen estos dos com ostring 
const { DataTypes } = require("sequelize");
const sequelize = require('../config/sequelize.config');

const TipoComida = sequelize.define("TipoComida", {
    _id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    paisOrigen: {
        type: DataTypes.STRING,
        allowNull: false
    }
}
,
{ timestamps: false }
);

module.exports = TipoComida;
