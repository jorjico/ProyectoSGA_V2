const { Router } = require("express");
const { isAuth, isAdmin, isRol } = require("../middleware/autenticacion");
const { crearProductoProveedor, getProductosPorProveedor, updateProductoProveedor, deleteProductoProveedor, getProveedoresPorProducto } = require("../controllers/productoProveedor");
const Roles = require("../utils/roles");


const productoProveedorRoutes = Router();

productoProveedorRoutes.use(isAuth);

productoProveedorRoutes.post('/', isRol([Roles.ADMIN, Roles.COMPRAS]), crearProductoProveedor);

productoProveedorRoutes.get('/producto/:productoId', isRol([Roles.ADMIN, Roles.COMPRAS]), getProveedoresPorProducto);

productoProveedorRoutes.get('/proveedor/:proveedorId', isRol([Roles.ADMIN, Roles.COMPRAS]), getProductosPorProveedor);

productoProveedorRoutes.put('/:id', isRol([Roles.ADMIN, Roles.COMPRAS]), updateProductoProveedor);

productoProveedorRoutes.delete('/:id', isAdmin, deleteProductoProveedor);

module.exports = productoProveedorRoutes;


