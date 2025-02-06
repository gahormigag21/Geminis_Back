const express = require('express');
const domicilioController = require('../controllers/domicilioController');
const router = express.Router();

// Ruta para obtener domicilios por el ID de usuario
router.get('/:userId', domicilioController.getDomicilios);

// Ruta para crear un domicilio (antigua)
router.post('/:sedeId', domicilioController.createDomicilio);

// Ruta para obtener los menús de una sede
router.get('/Menus/:sedeId', domicilioController.getMenu);

// Ruta para actualizar el estado del domicilio a "entregando"
router.put('/entregando/:domicilioId', domicilioController.updateEstadoDomicilioEntregando);

// Ruta para actualizar el estado del domicilio a "entregado"
router.put('/entregado/:domicilioId', domicilioController.updateEstadoDomicilioEntregado);

// Nueva ruta para llenar la tabla Domicilios y ComidaDomicilio
router.post('/domicilios/crear', domicilioController.llenarDomicilios);

//Ruta para obtener el consecutivo del domicilio
router.get('/consecutivo/:sedeId', domicilioController.getConsecutivo);

//Ruta para obtener el detalle del domicilio
router.get('/detalle/:domicilioId', domicilioController.getDetalleDomicilio);

module.exports = router;