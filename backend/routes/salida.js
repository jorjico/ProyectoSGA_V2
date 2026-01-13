const { Router } = require('express');
const { crearSalida, getSalidas, getSalida, updateSalida, deleteSalida } = require('../controllers/salida');
const { isAuth, isRol } = require('../middleware/autenticacion');
const Roles = require('../utils/roles');

const salidaRoutes = Router();

salidaRoutes.use(isAuth);

salidaRoutes.post('/', isRol([Roles.ADMIN, Roles.ALMACEN]), crearSalida);

salidaRoutes.get('/', getSalidas);

salidaRoutes.get('/:id', getSalida);

salidaRoutes.put('/:id', isRol([Roles.ADMIN, Roles.ALMACEN]), updateSalida);

salidaRoutes.delete('/:id', isRol([Roles.ADMIN, Roles.ALMACEN]), deleteSalida);

module.exports = salidaRoutes;
