const { Router } = require('express');
const { getProveedores, getProveedor, createProveedor, updateProveedor, deleteProveedor, getResumenProveedor } = require('../controllers/proveedores');

const Roles = require('../utils/roles');
const { isAuth, isAdmin, isRol } = require('../middleware/autenticacion');

const proveedorRoutes = Router();

proveedorRoutes.use(isAuth);

proveedorRoutes.get('/', getProveedores);

proveedorRoutes.get('/:id', getProveedor);

proveedorRoutes.post('/', isRol([Roles.ADMIN, Roles.COMPRAS, Roles.ADMINISTRACION]), createProveedor);

proveedorRoutes.put('/:id', isRol([Roles.ADMIN, Roles.COMPRAS, Roles.ADMINISTRACION]), updateProveedor);

proveedorRoutes.delete('/:id', isAdmin, deleteProveedor);

proveedorRoutes.get('/resumen', getResumenProveedor);

module.exports = proveedorRoutes;

