const { DataTypes } = require("sequelize");
const sequelize = require('../config/sequelize.config');

const Usuario = sequelize.define("Usuario", {
    _id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: "El nombre de usuario es obligatorio" },
            len: [3, 50] // Longitud entre 3 y 50 caracteres
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: "El correo electrónico es obligatorio" },
            isEmail: { msg: "El formato del correo electrónico no es válido" }
        }
    }
}, 
{ timestamps: false }
);

module.exports = Usuario;
