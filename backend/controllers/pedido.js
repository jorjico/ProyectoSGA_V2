const Pedido = require("../models/pedido");
const ProductoProveedor = require("../models/productoProveedor");
const Proveedor = require("../models/proveedores");
const Proyecto = require("../models/proyecto");
const generarNumeroPedido = require("../utils/generarNumeroPedido");
const Roles = require("../utils/roles");
const {calcularImporteBruto, calcularImporteConIVA} = require("../utils/calculosPedido");
const Albaran = require("../models/albaran");

const crearPedido = async (req, res) => {
    try {
        const { proveedorId, proyectoId, productos } = req.body;

        if (![Roles.ADMIN, Roles.COMPRAS].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para crear pedidos.",
                data: null,
                error: null
            });
        }

        const proveedor = await Proveedor.findById(proveedorId);
        if (!proveedor) {
            return res.status(404).json({
                success: false,
                message: "Proveedor no encontrado",
                data: null,
                error: null
            });
        }

        if (proyectoId) {
            const proyecto = await Proyecto.findById(proyectoId);
            if (!proyecto) {
                return res.status(404).json({
                    success: false,
                    message: "Proyecto no encontrado",
                    data: null,
                    error: null
                });
            }
            if (proyecto.estado === 'presupuesto') {
                return res.status(400).json({
                    success: false,
                    message: "No se pueden crear pedidos para proyectos en estado 'presupuesto'.",
                    data: null,
                    error: null
                });
            }
        }

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Debes indicar al menos un producto en el pedido",
                data: null,
                error: null
            });
        }

        const productosPedido = [];

        for (const item of productos) {
            const { productoProveedorId, cantidad } = item;

            if (cantidad <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "La cantidad debe ser mayor que 0",
                    data: null,
                    error: null
                });
            }

            const prodProv = await ProductoProveedor.findById(productoProveedorId).populate('producto');
            if (!prodProv) {
                return res.status(404).json({
                    success: false,
                    message: `El productoProveedor ${productoProveedorId} no se ha encontrado`,
                    data: null,
                    error: null
                });
            }

            const importeBruto = calcularImporteBruto(prodProv.precioUnitario, cantidad);
            const importeConIVA = calcularImporteConIVA(importeBruto, prodProv.producto.IVA);

            productosPedido.push({
                producto: prodProv.producto._id,
                productoProveedor: prodProv._id,
                sku: prodProv.producto.sku,
                nombreProducto: prodProv.producto.nombreProducto,
                unidadMedida: prodProv.producto.unidadMedida,
                cantidad,
                precioUnitario: prodProv.precioUnitario,
                referenciaProveedor: prodProv.referenciaProveedor,
                importeBruto,
                importeConIVA,
                IVA: prodProv.producto.IVA,
            });
        }

        const totalBruto = productosPedido.reduce((sum, p) => sum + p.importeBruto, 0);
        const totalConIVA = productosPedido.reduce((sum, p) => sum + p.importeConIVA, 0);

        const fechaEntregaEstimado = new Date();
        fechaEntregaEstimado.setDate(fechaEntregaEstimado.getDate() + proveedor.diasTiempoEntrega);

        const numeroPedido = await generarNumeroPedido();

        const nuevoPedido = new Pedido({
            numeroPedido,
            proveedor: proveedorId,
            proyecto: proyectoId || null,
            productos: productosPedido,
            totalBruto,
            totalConIVA,
            fechaEntregaEstimado,
        });

        const pedidoDB = await nuevoPedido.save();

        res.status(201).json({
            success: true,
            message: "Pedido creado correctamente",
            data: pedidoDB,
            error: null
        });

    } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(500).json({
            success: false,
            message: "Error al crear pedido",
            data: null,
            error: error.message
        });
    }
};

const getPedidos = async (req, res) => {
    try {
        const { estado, proveedorId, proyectoId, fechaInicio, fechaFin, q, page = 1, limit = 20 } = req.query;
        const filtro = {};

        if (estado) {
            if (!["pendiente", "parcial", "recibido", "cancelado"].includes(estado)) {
                return res.status(400).json({
                    success: false,
                    message: "Estado inválido para el filtro",
                    data: null,
                    error: null
                });
            }
            filtro.estado = estado;
        }

        if (proyectoId) filtro.proyecto = proyectoId;

        if (fechaInicio || fechaFin) {
            filtro.fechaPedido = {};
            if (fechaInicio) filtro.fechaPedido.$gte = new Date(fechaInicio);
            if (fechaFin) filtro.fechaPedido.$lte = new Date(fechaFin);
        }

        if (q) {
            filtro.numeroPedido = { $regex: q, $options: "i" };
        }

        if (proveedorId) {
            const proveedores = await Proveedor.find({
                nombre: { $regex: proveedorId, $options: "i" }
            }).select("_id");

            filtro.proveedor = { $in: proveedores.map(p => p._id) };
        }

        const totalPedidos = await Pedido.countDocuments(filtro);

        const pedidos = await Pedido.find(filtro)
            .populate("proveedor", "nombre diasTiempoEntrega")
            .populate("proyecto", "nombre")
            .sort({ fechaPedido: -1 })
            .select("numeroPedido fechaPedido fechaEntregaEstimado estado proveedor proyecto totalConIVA")
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            message: "Pedidos obtenidos correctamente",
            total: totalPedidos,
            page: Number(page),
            limit: Number(limit),
            data: pedidos,
            error: null
        });

    } catch (error) {
        console.error("Error al obtener pedidos:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener pedidos",
            data: null,
            error: error.message
        });
    }
};


const getPedido = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await Pedido.findById(id)
            .populate("proveedor", "nombre CIF direccion telefono email diasTiempoEntrega")
            .populate("proyecto", "nombre")
            .populate({
                path: "productos.productoProveedor",
                select: "referenciaProveedor precioUnitario cantidadMinima moneda producto",
                populate: {
                    path: "producto",
                    select: "sku nombreProducto familia foto IVA unidadMedida"
                }
            });

        if (!pedido) {
            return res.status(404).json({
                success: false,
                message: "Pedido no encontrado",
                data: null,
                error: null
            });
        }

        const albaranes = await Albaran.find({ pedido: id })
            .populate({
                path: "productos.productoProveedor",
                select: "producto referenciaProveedor precioUnitario",
                populate: {
                    path: "producto",
                    select: "sku nombreProducto"
                }
            })
            .lean();

        res.status(200).json({
            success: true,
            message: "Pedido obtenido correctamente",
            data: { ...pedido.toObject(), albaranes },
            error: null
        });

    } catch (error) {
        console.error("Error al obtener pedido:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener pedido",
            data: null,
            error: error.message
        });
    }
};



const updatePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { fechaEntregaEstimado, productos, estado, proyecto } = req.body;

        if (![Roles.ADMIN, Roles.COMPRAS].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para modificar este pedido.",
                data: null,
                error: null,
            });
        }

        const pedido = await Pedido.findById(id)
            .populate("proveedor", "nombre diasTiempoEntrega")
            .populate("productos.producto", "sku nombreProducto IVA")
            .populate("productos.productoProveedor", "precioUnitario unidadMedida");

        if (!pedido) {
            return res.status(404).json({
                success: false,
                message: "Pedido no encontrado.",
                data: null,
                error: null,
            });
        }

        if (fechaEntregaEstimado) pedido.fechaEntregaEstimado = new Date(fechaEntregaEstimado);

        if (productos) {
            if (pedido.estado !== "pendiente") {
                return res.status(400).json({
                    success: false,
                    message: "Solo se pueden modificar productos de pedidos pendientes.",
                    data: null,
                    error: null,
                });
            }

            const productosActualizados = [];
            let totalBruto = 0;
            let totalConIVA = 0;

            for (const item of productos) {
                const productoProveedor = await ProductoProveedor.findById(item.productoProveedor)
                .populate("producto", "IVA nombreProducto sku unidadMedida");

                if (!productoProveedor || !productoProveedor.producto) {
                    return res.status(400).json({
                        success: false,
                        message: `ProductoProveedor inválido: ${item.productoProveedor}`,
                        data: null,
                        error: null,
                    });
                }

                const precioUnitario = item.precioUnitario ?? productoProveedor.precioUnitario;
                const cantidad = item.cantidad;
                const importeBruto = precioUnitario * cantidad;
                const importeConIVA = importeBruto * (1 + (productoProveedor.producto.IVA ?? 0) / 100);

                totalBruto += importeBruto;
                totalConIVA += importeConIVA;

                productosActualizados.push({
                    _id: item._id,
                    productoProveedor: productoProveedor._id,
                    producto: productoProveedor.producto._id,
                    cantidad,
                    precioUnitario,
                    importeBruto,
                    importeConIVA,
                });
            }

            pedido.productos = productosActualizados;
            pedido.totalBruto = totalBruto;
            pedido.totalConIVA = totalConIVA;
        }

        if (proyecto !== undefined) {
            pedido.proyecto = proyecto;
        }

        const albaranes = await Albaran.find({ pedido: pedido._id });

        let todosRecibidos = true;
        let algunRecibido = false;

        pedido.productos.forEach((item) => {
            const totalRecibido = albaranes.reduce((sum, alb) => {
                const linea = alb.productos?.find(
                    (p) => p.productoProveedor.toString() === item.productoProveedor.toString()
                );
                return sum + (linea?.cantidadRecibida || 0);
            }, 0);

            if (totalRecibido < item.cantidad) todosRecibidos = false;
            if (totalRecibido > 0) algunRecibido = true;
        });

        if (todosRecibidos) pedido.estado = "recibido";
        else if (algunRecibido) pedido.estado = "parcial";
        else pedido.estado = "pendiente";

        if (estado) {
            const estadosValidos = ["pendiente", "parcial", "recibido", "cancelado"];
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({
                    success: false,
                    message: "Estado inválido.",
                    data: null,
                    error: null,
                });
            }
            pedido.estado = estado;
        }

        const pedidoActualizado = await pedido.save();

        res.status(200).json({
            success: true,
            message: "Pedido actualizado correctamente",
            data: pedidoActualizado,
            error: null,
        });

    } catch (error) {
        console.error("Error al actualizar pedido:", error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar pedido.",
            data: null,
            error: error.message,
        });
    }
};

const deletePedido = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.rol !== Roles.ADMIN) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para eliminar este pedido.",
                data: null,
                error: null
            });
        }

        const pedidoEliminado = await Pedido.findByIdAndDelete(id);

        if (!pedidoEliminado) {
            return res.status(404).json({
                success: false,
                message: "Pedido no encontrado",
                data: null,
                error: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Pedido eliminado correctamente",
            data: pedidoEliminado,
            error: null
        });

    } catch (error) {
        console.error("Error al eliminar pedido:", error);
        return res.status(500).json({
            success: false,
            message: "Error al eliminar pedido",
            data: null,
            error: error.message
        });
    }
};

module.exports = { crearPedido, getPedidos, getPedido, updatePedido, deletePedido };




