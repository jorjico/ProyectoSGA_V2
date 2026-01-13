const { Router } = require('express');
const { isAuth, isRol } = require('../middleware/autenticacion');
const { crearProyecto, getProyectos, getProyecto, updateProyecto, deleteProyecto } = require('../controllers/proyecto');
const Roles = require('../utils/roles');

const proyectoRoutes = Router();

proyectoRoutes.use(isAuth);

proyectoRoutes.post('/', isRol([Roles.ADMIN, Roles.ADMINISTRACION]), crearProyecto);

proyectoRoutes.get('/', getProyectos);

proyectoRoutes.get('/:id', getProyecto);

proyectoRoutes.put('/:id', isRol([Roles.ADMIN, Roles.ADMINISTRACION]), updateProyecto);

proyectoRoutes.delete('/:id', isRol([Roles.ADMIN, Roles.ADMINISTRACION]), deleteProyecto);

module.exports = proyectoRoutes;
