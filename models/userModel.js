const bcrypt = require('bcrypt');
const pool = require('../config/db');

const getUserByDocument = async (document) => {
    const [rows] = await pool.query('SELECT * FROM Usuario WHERE Documento = ?', [document]);
    return rows[0];
};

const getUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM Usuario WHERE Correo = ?', [email]);
    return rows[0];
};

// Inserta un nuevo usuario
const createUser = async (userData) => {
    const { Documento, Nombres, Apellido, Telefono, Direccion, Contrasena, Penalizacion, Estado, Tipo, Empresa, Administrador } = userData;

    const [result] = await pool.query(
        'INSERT INTO Usuario (Documento, Nombres, Apellido, Telefono, Direccion, Contrasena, Penalizacion, Estado, Tipo, Empresa, Administrador, AutenticacionDosFactores) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)',
        [Documento, Nombres, Apellido, Telefono, Direccion, Contrasena, Penalizacion, Estado, Tipo, Empresa, Administrador]
    );
    return result.insertId;
};

// Obtiene todos los usuarios
const getAllUsers = async () => {
    const [rows] = await pool.query('SELECT * FROM Usuario');
    return rows;
};

// Actualiza el usuario
const updateUserByDocument = async (document, userData) => {
    // Extraemos las claves y valores del objeto userData
    const fields = [];
    const values = [];

    // Iteramos sobre userData para construir los campos dinámicos
    for (const [key, value] of Object.entries(userData)) {
        if (key === 'Contrasena' && value) {
            // Encriptamos la contraseña si está presente y no es nula
            const hashedPassword = await bcrypt.hash(value, 10);
            fields.push(`${key} = ?`);
            values.push(hashedPassword);
        } else if (key === 'AutenticacionDosFactores') {
            fields.push(`${key} = ?`);
            values.push(value ? 1 : 0);
        } else if (value !== undefined && value !== null) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    }

    // Si no hay campos para actualizar, retornamos un error
    if (fields.length === 0) {
        throw new Error('No hay datos para actualizar');
    }

    // Agregamos el documento al final de los valores para el WHERE
    values.push(document);

    // Construimos y ejecutamos la consulta
    const query = `UPDATE Usuario SET ${fields.join(', ')} WHERE Documento = ?`;
    const [result] = await pool.query(query, values);

    return result.affectedRows; // Devuelve el número de filas afectadas
};



module.exports = {
    getUserByDocument,
    getUserByEmail,
    createUser,
    getAllUsers,
    updateUserByDocument,
};
