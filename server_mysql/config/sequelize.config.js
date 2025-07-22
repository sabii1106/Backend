const { Sequelize } = require("sequelize");

const username = "root";
const password = "root";
const bdd_name = "Restaurante";
const hostName = "localhost";

const sequelize = new Sequelize(bdd_name, username, password, {
    host: hostName,
    dialect: "mysql",
    logging: false // Para no ver todos los logs SQL
});

module.exports = sequelize;
