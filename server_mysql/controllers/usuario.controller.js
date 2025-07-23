const Usuario = require('../models/usuario.model');
require ("dotenv").config();
const  jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};



// Crear un nuevo usuario
module.exports.createUsuario = async (request, response) => {
    const { username, email } = request.body;
    try {
        const usuario = await Usuario.create({
            username,
            email
        });
        response.status(201).json({
            status: "ok",
            message: "Usuario creado correctamente",
            data: usuario
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        response.status(500).json({
            status: "error",
            message: "Error al crear el usuario",
            error: error.message
        });
    }
};

// Obtener todos los usuarios
module.exports.getAllUsuarios = async (_, response) => {
    try {
        const usuarios = await Usuario.findAll();
        response.json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        response.status(500).json({
            status: "error",
            message: "Error al obtener los usuarios",
            error: error.message
        });
    }
};

// Obtener un usuario por ID
module.exports.getUsuario = async (request, response) => {
    try {
        const usuario = await Usuario.findOne({
            where: { _id: request.params.id }
        });
        if (!usuario) {
            return response.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }
        response.json(usuario);
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        response.status(500).json({
            status: "error",
            message: "Error al obtener el usuario",
            error: error.message
        });
    }
};

// Actualizar un usuario por ID
module.exports.updateUsuario = async (request, response) => {
    const { username, email } = request.body;
    try {
        // Verificar primero que el usuario exista
        const usuario = await Usuario.findOne({
            where: { _id: request.params.id }
        });
        
        if (!usuario) {
            return response.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }
        
        // Actualizar el usuario
        await usuario.update({
            username,
            email
        });
        
        response.json({
            status: "ok",
            message: "Usuario actualizado correctamente",
            data: usuario
        });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        response.status(500).json({
            status: "error",
            message: "Error al actualizar el usuario",
            error: error.message
        });
    }
};



// Eliminar un usuario por ID
module.exports.deleteUsuario = async (request, response) => {
    try {
        const usuario = await Usuario.findOne({
            where: { _id: request.params.id }
        });
        if (!usuario) {
            return response.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }
        await usuario.destroy();
        response.json({
            status: "ok",
            message: "Usuario eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        response.status(500).json({
            status: "error",
            message: "Error al eliminar el usuario",
            error: error.message
        });
    }
};
