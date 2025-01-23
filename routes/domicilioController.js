const express = require('express');
const domicilioController = require('./controllers/domicilioController');
const router = express.Router();

router.post('/sede/:sedeId/domicilio', domicilioController.createDomicilio);
router.put('/domicilio/:domicilioId/entregando', domicilioController.updateEstadoDomicilioEntregando);
router.put('/domicilio/:domicilioId/entregado', domicilioController.updateEstadoDomicilioEntregado);

module.exports = router;
