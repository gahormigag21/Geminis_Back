const express = require('express');
const domicilioController = require('../controllers/domicilioController');
const router = express.Router();

// Ruta para obtener domicilios por el ID de usuario
router.get('/:userId', domicilioController.getDomicilios);

// Ruta para crear un domicilio (antigua)
router.post('/:sedeId', domicilioController.createDomicilio);

// Ruta para obtener los menús de una sede
router.get('/Menus/:sedeId', domicilioController.getMenu);

// Nueva ruta para llenar la tabla Domicilios y ComidaDomicilio
router.post('/domicilios/crear', domicilioController.llenarDomicilios);

//Ruta para obtener el consecutivo del domicilio
router.get('/consecutivo/:sedeId', domicilioController.getConsecutivo);

//Ruta para obtener el detalle del domicilio
router.get('/detalle/:domicilioId', domicilioController.getDetalleDomicilio);

//Ruta para cambiar el estado del domicilio
router.put('/cambiar-estado/:domicilioId', domicilioController.cambiarEstadoDomicilio);


module.exports = router;