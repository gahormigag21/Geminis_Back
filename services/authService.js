const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { getUserByEmail, createUser, getAllUsers } = require('../models/userModel');
const nodemailer = require('nodemailer');

const login = async (email, password) => {
    const user = await getUserByEmail(email);

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
        correo,
        telefono,
        direccion,
        contrasena,
        penalizacion,
        estado,
        administrador,
        empresa, // NIT de la empresa
        autenticacionDosFactores = 0 // Nuevo campo autenticacionDosFactores con valor por defecto 0
    } = user;

    // Validar que todos los campos necesarios estén presentes
    if (!documento || !nombres || !apellido || !correo || !telefono || !direccion || !contrasena) {
        throw new Error('Todos los campos son obligatorios');
    }

    // Verificar si el documento ya existe
    const [existingUser] = await pool.query(`SELECT Documento FROM Usuario WHERE Documento = ?`, [documento]);
    if (existingUser.length > 0) {
        throw new Error('El documento ya está registrado');
    }

    // Verificar si el correo ya existe
    const [existingEmail] = await pool.query(`SELECT Correo FROM Usuario WHERE Correo = ?`, [correo]);
    if (existingEmail.length > 0) {
        throw new Error('El correo ya está registrado');
    }

    // Obtener el ID de la empresa si se proporcionó un NIT
    let empresaId = empresa || null;

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar el usuario en la base de datos
    const query = `
        INSERT INTO Usuario (Documento, Nombres, Apellido, Correo, Telefono, Direccion, Contrasena, Penalizacion, Estado, Tipo, Empresa, Administrador, AutenticacionDosFactores) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        documento,
        nombres,
        apellido,
        correo,
        telefono,
        direccion,
        hashedPassword,
        penalizacion,
        estado,
        0, // Tipo siempre será 0 para usuarios normales
        empresaId,
        administrador,
        autenticacionDosFactores // Nuevo campo autenticacionDosFactores
    ];

    const result = await pool.query(query, values);

    // Retornar el ID del usuario recién creado
    return result.insertId;
};

const registerRestaurant = async (restaurant) => {
    const { nit, nombre, UbicacionLogo, descripcion, categoria } = restaurant;

    if (!nit || !nombre) {
        throw new Error('NIT y Nombre son obligatorios para crear un restaurante');
    }

    const query = `
        INSERT INTO Empresas (NIT, Nombre, UbicacionLogo, Descripcion, Categoria) 
        VALUES (?, ?, ?, ?, ?)`;
    const values = [nit, nombre, UbicacionLogo || '', descripcion || '', categoria || ''];

    await pool.query(query, values);
};

const listUsers = async () => {
    return await getAllUsers();
};

const sendConfirmationEmail = async (email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const confirmationLink = `http://localhost:3000/api/auth/confirm?email=${encodeURIComponent(email)}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirmación de inicio de sesión',
        text: `Por favor, confirme su inicio de sesión haciendo clic en el siguiente enlace: ${confirmationLink}`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    login,
    registerUser,
    registerRestaurant,
    listUsers,
    sendConfirmationEmail,
};
