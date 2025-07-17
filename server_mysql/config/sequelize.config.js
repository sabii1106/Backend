const { Query } = require('mongoose');
const {Sequelize} = require('sequelize');

const username ='root'; ;
const password = 'root';
const bdd_name = 'myApp';
const hostname = 'localhost';    
const initialSequelize = new Sequelize('mysql://${username}:${password}@localhost');

initialSequelize.query(`CREATE DATABASE IF NOT EXISTS ${bdd_name}`)
    .then(() => {
        console.log(`Database ${bdd_name} created successfully.`);
    })
    .catch((error) => {
        console.error(`Error creating database ${bdd_name}:`, error);
    });

