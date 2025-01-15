const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { getUserByDocument,createUser,getAllUsers } = require('../models/userModel');


const login = async (document, password) => {
    const user = await getUserByDocument(document);

    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.Contrasena);

    if (!isPasswordValid) {
        throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign({ id: user.Documento, role: user.Administrador }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    return { token, user };
};


const registerUser = async (user) => {
    const {
        documento,
        nombres,
        apellido,
        telefono,
        direccion,
        contrasena,
        penalizacion,
        estado,
        administrador,
        empresa, // NIT de la empresa
    } = user;

    // Validar que todos los campos necesarios estén presentes
    if (!documento || !nombres || !apellido || !telefono || !direccion || !contrasena) {
        throw new Error('Todos los campos son obligatorios');
    }

    // Verificar si el documento ya existe
    const [existingUser] = await pool.query(`SELECT Documento FROM Usuario WHERE Documento = ?`, [documento]);
    if (existingUser.length > 0) {
        throw new Error('El documento ya está registrado');
    }

    // Obtener el ID de la empresa si se proporcionó un NIT
    let empresaId = empresa || null;

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar el usuario en la base de datos
    const query = `
        INSERT INTO Usuario (Documento, Nombres, Apellido, Telefono, Direccion, Contrasena, Penalizacion, Estado, Tipo, Empresa, Administrador) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        documento,
        nombres,
        apellido,
        telefono,
        direccion,
        hashedPassword,
        penalizacion,
        estado,
        0, // Tipo siempre será 0 para usuarios normales
        empresaId,
        administrador,
    ];

    const result = await pool.query(query, values);

    // Retornar el ID del usuario recién creado
    return result.insertId;
};
const listUsers = async () => {
    return await getAllUsers();
};

module.exports = {
    login,
    registerUser,
    listUsers,
};
