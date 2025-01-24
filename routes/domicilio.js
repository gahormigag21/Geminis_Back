const express = require('express');

const domicilioController = require('../controllers/domicilioController');  // Aseg�rate de que la ruta sea correcta
const router = express.Router();

// Ruta para obtener domicilios por el ID de usuario
router.get('/:userId', domicilioController.getDomicilios);  // Aseg�rate de que el m�todo se llame correctamente
// Otras rutas para crear y actualizar domicilios
router.post('/:sedeId', domicilioController.createDomicilio);
router.get('/Menus/:sedeId', domicilioController.getMenu);
router.put('/entregando/:domicilioId', domicilioController.updateEstadoDomicilioEntregando);
router.put('/entregado/:domicilioId', domicilioController.updateEstadoDomicilioEntregado);

module.exports = router;
