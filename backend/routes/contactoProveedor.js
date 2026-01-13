const { Router } = require('express');
const { createContactoProveedor, getContactoProveedor, getContactosProveedores, updateContactoProveedor, deleteContactoProveedor } = require('../controllers/contactoProveedor');
const { isRol, isAuth } = require('../middleware/autenticacion');
const Roles = require('../utils/roles');

const contactoProveedorRoutes = Router();

contactoProveedorRoutes.use(isAuth);

contactoProveedorRoutes.post('/', createContactoProveedor);

contactoProveedorRoutes.get('/:id', getContactoProveedor);

contactoProveedorRoutes.get('/', getContactosProveedores);

contactoProveedorRoutes.put('/:id', updateContactoProveedor);

contactoProveedorRoutes.delete('/:id', isRol([Roles.ADMIN]), deleteContactoProveedor);

module.exports = contactoProveedorRoutes;






