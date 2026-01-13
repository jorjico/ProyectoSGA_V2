const { Router } = require('express');
const { isAuth, isRol } = require('../middleware/autenticacion');
const { upload } = require('../middleware/archivosCloudinary');
const { getProductos, getProductoBySku, updateProducto, deleteProducto, crearProducto } = require('../controllers/producto');
const Roles = require('../utils/roles');

const productoRoutes = Router();

productoRoutes.use(isAuth);

productoRoutes.post('/', isRol([Roles.ADMIN, Roles.COMPRAS]), upload.single('foto'), crearProducto);

productoRoutes.get('/', getProductos);

productoRoutes.get('/:sku', getProductoBySku);

productoRoutes.put('/:sku', isRol([Roles.ADMIN, Roles.COMPRAS]), upload.single('foto'), updateProducto);

productoRoutes.delete('/:sku', deleteProducto);

module.exports = productoRoutes;



