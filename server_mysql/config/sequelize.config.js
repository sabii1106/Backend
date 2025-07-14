const {Sequelize} = requiere("sequelize");

const username = "root";
const password = "root";
const bdd_name = "myApp";
const hostName = "localhost";

//Conexión incial sin especificar la base de datos
const initialSequelize = new Sequelize("mysql://${username}:${password}@localhost");

initialSequelize.query("CREATE DATABASE IF NOT EXISTS ${bdd_name};")
.then(()=> console.log("DBB creada o ya existía"))
.catch((error)=>{
    console.error("Error al crear la BDD", error);
    process.exit(1); //Termina el proceso si hay un error
})