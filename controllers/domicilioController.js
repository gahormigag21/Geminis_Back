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
            `SELECT
        D.Rowid,
        D.Usuario,
        D.NumeroDomicilio,
        D.Fecha,
        D.Hora,
        D.DireccionEntrega,
        D.Estado,
        CONCAT(U.Nombres, ' ', U.Apellido) AS NombreCompleto,
        E.Nombre AS Empresa
    FROM
        Domicilios AS D
    JOIN
        Usuario AS U
        ON D.Usuario = U.Documento
    JOIN
        Sedes AS S
        ON D.Sede = S.Rowid
    JOIN
        Empresas AS E
        ON S.Empresa = E.Nit
    WHERE
        D.Usuario = ?
        AND D.Estado != 3`,
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

const getMenu = async (req, res) => {
    try {
        const { sedeId } = req.params;
        
        // Validación del parámetro
        if (!sedeId || isNaN(Number(sedeId))) {
            return res.status(400).json({ error: 'El parámetro idempresa es inválido.' });
        }

        // Consulta SQL usando el pool
        const [rows] = await pool.execute(
            `SELECT m.*, s.Empresa ,e.nombre as NombreEmpresa
            FROM sistemareservas.menus AS m
            JOIN sistemareservas.sedes AS s ON s.Rowid = m.Sede
            join sistemareservas.empresas as e on s.empresa = e.nit
            WHERE m.Estado = 1 AND m.Sede = ?`,
            [sedeId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: `No se encontraron menús para la empresa con ID ${sedeId}.` });
        }

        return res.json(rows);
    } catch (error) {
        console.error('Error al obtener menús:', error);
        return res.status(500).json({ error: 'Error interno del servidor al obtener los menús.' });
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

// llenar los domicilios en la base de datos
const llenarDomicilios = async (req, res) => {
    try {
        const { usuario, sede, fecha, hora, tipoPago, numeroDomicilio, menus } = req.body;

        // Validar que todos los campos estén presentes
        if (!usuario || !sede || !fecha || !hora || !tipoPago || !numeroDomicilio || !menus) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        // Consultar la dirección del usuario desde la tabla Usuario
        const [usuarioRows] = await pool.execute(
            `SELECT Direccion FROM Usuario WHERE Documento = ?`,
            [usuario]
        );

        if (usuarioRows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const direccionEntrega = usuarioRows[0].Direccion;

        // Insertar el domicilio en la base de datos
        const [result] = await pool.execute(
            `INSERT INTO Domicilios (Usuario, Sede, Fecha, Hora, DireccionEntrega, TipoPago, NumeroDomicilio, Estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [usuario, sede, fecha, hora, direccionEntrega, tipoPago, numeroDomicilio, ESTADOS.PENDIENTE]
        );

        // Obtener el ID del domicilio recién creado
        const domicilioId = result.insertId;

        // Insertar los menús en la tabla ComidaDomicilio
        for (const menu of menus) {
            if (menu.cantidad > 0) {
                await pool.execute(
                    `INSERT INTO ComidaDomicilio (DomicilioId, MenuId, Cantidad, Valor)
                    VALUES (?, ?, ?, ?)`,
                    [domicilioId, menu.menuId, menu.cantidad, menu.valor]
                );
            }
        }

        // Devolver el ID del domicilio creado
        return res.status(201).json({
            message: 'Domicilio creado exitosamente.',
            domicilioId,
        });
    } catch (error) {
        console.error('Error al crear el domicilio:', error.message);
        return res.status(500).json({ error: 'No se pudo crear el domicilio.' });
    }
};

module.exports = {
    getDomicilios,
    createDomicilio,
    llenarDomicilios,
    getMenu,
    updateEstadoDomicilioEntregando: (req, res) => updateEstadoDomicilio(req, res, ESTADOS.ENTREGANDO),
    updateEstadoDomicilioEntregado: (req, res) => updateEstadoDomicilio(req, res, ESTADOS.ENTREGADO),
};
