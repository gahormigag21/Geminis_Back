const express = require('express');
const router = express.Router();
const domicilioController = require('../controllers/domicilioController');

// Ruta para obtener todos los domicilios
router.get('/domicilios', domicilioController.getDomicilios);

// Otras rutas para crear y actualizar domicilios
router.post('/domicilios/:sedeId', domicilioController.createDomicilio);
router.put('/domicilios/entregando/:domicilioId', domicilioController.updateEstadoDomicilioEntregando);
router.put('/domicilios/entregado/:domicilioId', domicilioController.updateEstadoDomicilioEntregado);

module.exports = router;
