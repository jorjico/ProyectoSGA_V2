const { Router } = require("express");
const { isAuth, isAdmin, isRol } = require("../middleware/autenticacion");
const { crearPedido, getPedidos, getPedido, updatePedido, deletePedido } = require("../controllers/pedido");
const Roles = require("../utils/roles");

const pedidoRoutes = Router();

pedidoRoutes.use(isAuth);

pedidoRoutes.post('/', isRol([Roles.ADMIN, Roles.COMPRAS]), crearPedido);

pedidoRoutes.get('/', getPedidos);

pedidoRoutes.get('/:id', getPedido);

pedidoRoutes.put('/:id', isRol([Roles.ADMIN, Roles.COMPRAS]), updatePedido);

pedidoRoutes.delete('/:id', isAdmin, deletePedido);

module.exports = pedidoRoutes;