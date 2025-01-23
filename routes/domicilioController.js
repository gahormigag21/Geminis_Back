const express = require('express');
const domicilioController = require('./controllers/domicilioController');
const router = express.Router();

// Ruta para obtener domicilios por ID de usuario
router.get('/domicilios/:userId', async (req, res) => {
    try {
        const domicilios = await domicilioController.getDomiciliosByUserId(req.params.userId);
        res.json(domicilios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para crear un domicilio
router.post('/sede/:sedeId/domicilio', domicilioController.createDomicilio);

// Ruta para actualizar estado a "entregando"
router.put('/domicilio/:domicilioId/entregando', domicilioController.updateEstadoDomicilioEntregando);

// Ruta para actualizar estado a "entregado"
router.put('/domicilio/:domicilioId/entregado', domicilioController.updateEstadoDomicilioEntregado);

module.exports = router;
