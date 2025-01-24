const express = require('express');

const domicilioController = require('../controllers/domicilioController');  // Asegúrate de que la ruta sea correcta
const router = express.Router();

// Ruta para obtener domicilios por el ID de usuario
router.get('/:userId', domicilioController.getDomicilios);  // Asegúrate de que el método se llame correctamente
// Otras rutas para crear y actualizar domicilios
router.post('/:sedeId', domicilioController.createDomicilio);
router.get('/Menus/:sedeId', domicilioController.getMenu);
router.put('/entregando/:domicilioId', domicilioController.updateEstadoDomicilioEntregando);
router.put('/entregado/:domicilioId', domicilioController.updateEstadoDomicilioEntregado);

module.exports = router;
