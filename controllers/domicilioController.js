const Domicilio = require('../models/Domicilio');

// Función para crear un domicilio
const createDomicilio = async (req, res) => {
    try {
        const { sedeId } = req.params;
        const { documentoUsuario, direccionEntrega, tipoPago, numeroDomicilio } = req.body;

        if (!sedeId || !documentoUsuario || !direccionEntrega || !tipoPago || !numeroDomicilio) {
            return res.status(400).json({ error: 'Faltan datos necesarios para crear el domicilio.' });
        }

        // Fecha y hora actuales
        const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const horaActual = new Date().toLocaleTimeString('en-US', { hour12: false }); // HH:mm:ss

        // Crear el domicilio usando el modelo
        const domicilio = await Domicilio.create({
            Usuario: documentoUsuario,
            Sede: sedeId,
            Fecha: fechaActual,
            Hora: horaActual,
            DireccionEntrega: direccionEntrega,
            TipoPago: tipoPago,
            NumeroDomicilio: numeroDomicilio,
            Estado: 1 // Estado inicial: Pendiente
        });

        return res.status(201).json({ message: 'Domicilio creado exitosamente.', domicilio });
    } catch (error) {
        console.error('Error al crear el domicilio:', error.message);
        return res.status(500).json({ error: 'No se pudo crear el domicilio.' });
    }
};

// Funciones para actualizar estado a "entregando" y "entregado"
const updateEstadoDomicilio = async (req, res, estado) => {
    try {
        const { domicilioId } = req.params;

        if (!domicilioId) {
            return res.status(400).json({ error: 'El ID del domicilio es requerido.' });
        }

        // Actualizar el estado del domicilio
        const domicilio = await Domicilio.update(
            { Estado: estado },
            { where: { id: domicilioId } }
        );

        if (domicilio[0] === 0) {
            return res.status(404).json({ error: 'Domicilio no encontrado.' });
        }

        const estadoTexto = estado === 2 ? 'entregando' : 'entregado';
        return res.status(200).json({ message: `Estado del domicilio actualizado a "${estadoTexto}".` });
    } catch (error) {
        console.error('Error al actualizar el estado del domicilio:', error.message);
        return res.status(500).json({ error: 'No se pudo actualizar el estado del domicilio.' });
    }
};

// Exportar las funciones del controlador
module.exports = {
    createDomicilio,
    updateEstadoDomicilioEntregando: (req, res) => updateEstadoDomicilio(req, res, 2),
    updateEstadoDomicilioEntregado: (req, res) => updateEstadoDomicilio(req, res, 3)
};
