const { DataTypes } = require("sequelize");
const sequelize = require('../config/sequelize.config');

const Menu = sequelize.define("Menu", {
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