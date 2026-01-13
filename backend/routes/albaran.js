const { Router } = require('express');
const { crearAlbaran, getAlbaranes, getAlbaran, updateAlbaran } = require('../controllers/albaran');
const { isAuth, isRol } = require('../middleware/autenticacion');
const Roles = require('../utils/roles');

const albaranRoutes = Router();

albaranRoutes.use(isAuth);

albaranRoutes.post('/', isRol([Roles.ADMIN, Roles.ALMACEN]), crearAlbaran);

albaranRoutes.get('/', getAlbaranes);

albaranRoutes.get('/:id', getAlbaran);

albaranRoutes.put('/:id', isRol([Roles.ADMIN, Roles.ALMACEN]), updateAlbaran);

module.exports = albaranRoutes;
