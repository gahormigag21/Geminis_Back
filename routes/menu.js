const express = require('express');
const router = express.Router();
const { getMenuByEmpresa, getMenuById, createMenu, getAllMenu, updateMenu, getMenuByRowid } = require('../controllers/menuController');

// Endpoint to get a specific menu by ID
router.get('/:id', getMenuById);

// Endpoint to create a new menu
router.post('/', createMenu);

// Endpoint to update a specific menu by ID
router.put('/:id', updateMenu);

// Endpoint to get a specific menu by rowid
router.get('/plato/:rowid', getMenuByRowid);

// Endpoint to get all menus
router.get('/', getAllMenu);

module.exports = router;
