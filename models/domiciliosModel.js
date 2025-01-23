// models/Domicilio.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Asegúrate de tener tu configuración de base de datos

const Domicilio = sequelize.define('Domicilio', {
    // Definir los campos y sus tipos de datos
    Usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Sede: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    DireccionEntrega: {
        type: DataTypes.STRING,
        allowNull: false
    },
    TipoPago: {
        type: DataTypes.STRING,
        allowNull: false
    },
    NumeroDomicilio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1 // 1: Pendiente, 2: Entregando, 3: Entregado
    }
});

module.exports = Domicilio;
