const pool = require('../config/db');  // Importa el pool de db.js
const ESTADOS = {
    PENDIENTE: 1,
    ENTREGANDO: 2,
    ENTREGADO: 3,
};

// Obtener domicilios por usuario
const getDomicilios = async (req, res) => {
    try {
        const { userId } = req.params;

        // Consulta SQL usando el pool
        const [rows] = await pool.execute(
            `SELECT Rowid,Usuario,NumeroDomicilio, Fecha, Hora, DireccionEntrega, Estado
            FROM Domicilios
            WHERE Usuario = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron domicilios para este usuario.' });
        }

        return res.json(rows);
    } catch (error) {
        console.error('Error al obtener domicilios:', error);
        return res.status(500).json({ error: 'Error al obtener los domicilios.' });
    }
};

// Crear domicilio
const createDomicilio = async (req, res) => {
    try {
        const { sedeId } = req.params;
        const { documentoUsuario, direccionEntrega, tipoPago, numeroDomicilio } = req.body;

        const fechaActual = new Date().toISOString().split('T')[0];
        const horaActual = new Date().toLocaleTimeString('en-US', { hour12: false });

        // Consulta SQL para insertar un nuevo domicilio
        const [result] = await pool.execute(
            `INSERT INTO Domicilios (Usuario, Sede, Fecha, Hora, DireccionEntrega, TipoPago, NumeroDomicilio, Estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [documentoUsuario, sedeId, fechaActual, horaActual, direccionEntrega, tipoPago, numeroDomicilio, ESTADOS.PENDIENTE]
        );

        return res.status(201).json({ message: 'Domicilio creado exitosamente.', domicilioId: result.insertId });
    } catch (error) {
        console.error('Error al crear el domicilio:', error.message);
        return res.status(500).json({ error: 'No se pudo crear el domicilio.' });
    }
};

// Actualizar estado
const updateEstadoDomicilio = async (req, res, estado) => {
    try {
        const { domicilioId } = req.params;

        // Consulta SQL para obtener el domicilio
        const [rows] = await pool.execute(
            `SELECT * FROM Domicilios WHERE Rowid = ?`,
            [domicilioId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Domicilio no encontrado.' });
        }

        // Actualizar el estado del domicilio
        await pool.execute(
            `UPDATE Domicilios SET Estado = ? WHERE Rowid = ?`,
            [estado, domicilioId]
        );

        const estadoTexto = estado === ESTADOS.ENTREGANDO ? 'entregando' : 'entregado';
        return res.status(200).json({
            message: `Estado del domicilio actualizado a "${estadoTexto}".`,
            domicilio: rows[0],
        });
    } catch (error) {
        console.error('Error al actualizar el estado del domicilio:', error.message);
        return res.status(500).json({ error: 'No se pudo actualizar el estado del domicilio.' });
    }
};

module.exports = {
    createDomicilio,
    updateEstadoDomicilioEntregando: (req, res) => updateEstadoDomicilio(req, res, ESTADOS.ENTREGANDO),
    updateEstadoDomicilioEntregado: (req, res) => updateEstadoDomicilio(req, res, ESTADOS.ENTREGADO),
    getDomicilios,
};
