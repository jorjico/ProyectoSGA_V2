const { Router } = require('express');
const { getMovimientos } = require('../controllers/movimiento');
const { isAuth } = require('../middleware/autenticacion');

const movimientoRoutes = Router();

movimientoRoutes.use(isAuth);

movimientoRoutes.get('/', getMovimientos);

module.exports = movimientoRoutes;
