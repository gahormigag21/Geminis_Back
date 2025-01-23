const db = require('../config/db'); // Asumiendo que tienes un archivo de configuración para la base de datos

// Función para obtener domicilios por ID de usuario y fecha de hoy
const getDomiciliosByUserId = async (userId) => {
    try {
        // Validar que el parámetro userId no sea nulo o indefinido
        if (!userId) {
            throw new Error('El ID del usuario es requerido.');
        }

        // Obtener la fecha actual en formato YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];

        // Consulta para obtener los domicilios asociados al ID de usuario y fecha de hoy
        const query = `
            SELECT 
                d.id AS domicilioId,
                d.pedidoNumero,
                d.direccion,
                d.estado,
                d.hora,
                u.nombre AS clienteNombre
            FROM 
                domicilios d
            INNER JOIN 
                usuarios u
            ON 
                d.usuarioId = u.id
            WHERE 
                d.usuarioId = ? AND d.fecha = ?;
        `;

        // Ejecutar la consulta
        const [results] = await db.execute(query, [userId, today]);

        // Devolver los resultados
        return results;
    } catch (error) {
        console.error('Error al obtener los domicilios:', error.message);
        throw new Error('No se pudieron obtener los domicilios.');
    }
};

// Función para crear un domicilio
const createDomicilio = async (req, res) => {
    try {
        // Obtener el id de la sede desde la URL y el documento del usuario conectado
        const { sedeId } = req.params; // El id de la sede desde la URL
        const { documentoUsuario, direccionEntrega, tipoPago, numeroDomicilio } = req.body; // Los datos desde el body

        // Validar que se reciban todos los datos necesarios
        if (!sedeId || !documentoUsuario || !direccionEntrega || !tipoPago || !numeroDomicilio) {
            return res.status(400).json({ error: 'Faltan datos necesarios para crear el domicilio.' });
        }

        // Fecha y hora actuales
        const fechaActual = new Date().toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD
        const horaActual = new Date().toLocaleTimeString('en-US', { hour12: false }); // Hora en formato HH:mm:ss

        // Consulta SQL para insertar un nuevo domicilio
        const query = `
            INSERT INTO domicilios (
                Usuario,
                Sede,
                Fecha,
                Hora,
                DireccionEntrega,
                TipoPago,
                NumeroDomicilio,
                Estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 1);
        `;

        // Ejecutar la consulta con los parámetros
        await db.execute(query, [
            documentoUsuario,
            sedeId,
            fechaActual,
            horaActual,
            direccionEntrega,
            tipoPago,
            numeroDomicilio
        ]);

        // Responder con éxito
        return res.status(201).json({ message: 'Domicilio creado exitosamente.' });
    } catch (error) {
        console.error('Error al crear el domicilio:', error.message);
        return res.status(500).json({ error: 'No se pudo crear el domicilio.' });
    }
};

// Función para actualizar el estado a 2 (entregando)
const updateEstadoDomicilioEntregando = async (req, res) => {
    try {
        // Obtener el id del domicilio desde la URL
        const { domicilioId } = req.params;

        // Validar que el domicilioId esté presente
        if (!domicilioId) {
            return res.status(400).json({ error: 'El ID del domicilio es requerido.' });
        }

        // Consulta SQL para actualizar el estado del domicilio a 2 (entregando)
        const query = `
            UPDATE domicilios
            SET Estado = 2
            WHERE id = ?;
        `;

        // Ejecutar la consulta con el id del domicilio
        const [result] = await db.execute(query, [domicilioId]);

        // Verificar si se actualizó el domicilio correctamente
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Domicilio no encontrado.' });
        }

        // Responder con éxito
        return res.status(200).json({ message: 'Estado del domicilio actualizado a "entregando".' });
    } catch (error) {
        console.error('Error al actualizar el estado del domicilio:', error.message);
        return res.status(500).json({ error: 'No se pudo actualizar el estado del domicilio.' });
    }
};

// Función para actualizar el estado a 3 (entregado)
const updateEstadoDomicilioEntregado = async (req, res) => {
    try {
        // Obtener el id del domicilio desde la URL
        const { domicilioId } = req.params;

        // Validar que el domicilioId esté presente
        if (!domicilioId) {
            return res.status(400).json({ error: 'El ID del domicilio es requerido.' });
        }

        // Consulta SQL para actualizar el estado del domicilio a 3 (entregado)
        const query = `
            UPDATE domicilios
            SET Estado = 3
            WHERE id = ?;
        `;

        // Ejecutar la consulta con el id del domicilio
        const [result] = await db.execute(query, [domicilioId]);

        // Verificar si se actualizó el domicilio correctamente
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Domicilio no encontrado.' });
        }

        // Responder con éxito
        return res.status(200).json({ message: 'Estado del domicilio actualizado a "entregado".' });
    } catch (error) {
        console.error('Error al actualizar el estado del domicilio:', error.message);
        return res.status(500).json({ error: 'No se pudo actualizar el estado del domicilio.' });
    }
};

// Exportar las funciones junto con las anteriores
module.exports = {
    getDomiciliosByUserId,
    createDomicilio,
    updateEstadoDomicilioEntregando,
    updateEstadoDomicilioEntregado,
};

