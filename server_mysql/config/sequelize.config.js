const {Sequelize} = require("sequelize");
const { DataTypes } = require("sequelize");

const username = "root";
const password = "root";
const bdd_name = "Restaurante";
const hostName = "localhost";

//Conexión incial sin especificar la base de datos
const initialSequelize = new Sequelize(`mysql://${username}:${password}@localhost`);

initialSequelize.query(`CREATE DATABASE IF NOT EXISTS ${bdd_name};`)
    .then(() => console.log("DBB creada o ya existía"))
    .catch((error) => {
        console.error("Error al crear la BDD", error);
        process.exit(1);
    });

const sequelize = new Sequelize(bdd_name, username, password, {
    host: hostName,
    dialect: "mysql",
});

module.exports = sequelize;

// Importar modelos para establecer relaciones DESPUÉS de exportar sequelize
require('../models/restaurante.model');
require('../models/TipoComida.model');
require('../models/menu.model');
require('../models/associations');

//EN el sync si se utiliza el parametro de entrafa force: true, se eliminan las tablas existentes y se crean de nuevo
//Con el alter:true se actualizan las tablas existentes sin perder los datos, pero puede causar problemas si hay cambios incompatibles (Hace el mejor intento de mantener los datos)
//Lo recomendable en el desarrollo es usar force true
//En producción no se debe utilizar ninguno.

sequelize.sync({ force: true }).then(() => {
    console.log("Base de datos sincronizada");
}).catch((error) => {
    console.error("Error al sincronizar la base de datos", error);
});

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

const Restaurantes = require('./restaurante.model');
const TipoComida = require('./TipoComida.model');

// Definir relaciones many-to-many con claves en minúscula
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

// Relación directa para acceder desde Menu
Menu.belongsTo(Restaurantes, { foreignKey: 'restauranteId' });
Menu.belongsTo(TipoComida, { foreignKey: 'tipoComidaId' });

module.exports = { Restaurantes, TipoComida, Menu };
