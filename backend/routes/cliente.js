const { Router } = require('express');
const { isAuth, isRol } = require('../middleware/autenticacion');
const { crearCliente, getClientes, updateCliente, deleteCliente, getCliente } = require('../controllers/cliente');
const Roles = require('../utils/roles');

const clienteRoutes = Router();

clienteRoutes.use(isAuth);

clienteRoutes.post('/', isRol([Roles.ADMIN, Roles.ADMINISTRACION]), crearCliente);

clienteRoutes.get('/', getClientes);

clienteRoutes.get('/:id', getCliente);

clienteRoutes.put('/:id', isRol([Roles.ADMIN, Roles.ADMINISTRACION]), updateCliente);

clienteRoutes.delete('/:id', isRol([Roles.ADMIN, Roles.ADMINISTRACION]), deleteCliente);

module.exports = clienteRoutes;
