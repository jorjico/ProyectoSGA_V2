const Albaran = require("../models/albaran");
const Pedido = require("../models/pedido");
const Roles = require("../utils/roles");
const generarNumeroAlbaran = require("../utils/generarNumeroAlbaran");
const calcularAlbaran = require("../utils/calcularCantidadesAlbaran");
const registrarMovimientos = require("../utils/registrarMovimientos");


const crearAlbaran = async (req, res) => {
    try {
        if (![Roles.ADMIN, Roles.ALMACEN].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para crear albaranes.",
                data: null,
                error: null
            });
        }

        const { pedidoId, productos, fechaRecepcion, notas, pdf } = req.body;

        if (!pedidoId || !Array.isArray(productos) || productos.length === 0) {
            console.log("Datos incompletos:", { pedidoId, productos });
            return res.status(400).json({
                success: false,
                message: "Falta pedidoId o productos",
                data: null,
                error: null
            });
        }

        const pedido = await Pedido.findById(pedidoId);

        if (!pedido) {
            return res.status(404).json({
                success: false,
                message: "Pedido no encontrado.",
                data: null,
                error: null
            });
        }

        if (["recibido", "cancelado"].includes(pedido.estado)) {
            return res.status(400).json({
                success: false,
                message: "No se puede generar un albarán para un pedido ya recibido o cancelado.",
                data: null,
                error: null
            });
        }

        const fecha = fechaRecepcion ? new Date(fechaRecepcion) : new Date();
            if (fecha < pedido.fechaPedido) {
            return res.status(400).json({
                success: false,
                message: "La fecha de recepción no puede ser anterior a la fecha del pedido.",
                data: null,
                error: null
            });
        }

        const numeroAlbaran = await generarNumeroAlbaran();

        const albaranesPrevios = await Albaran.find({ pedido: pedido._id, estado: { $ne: "cancelado" } });

        for (let linea of productos) {
            const recibidoPrevio = albaranesPrevios.reduce((sum, alb) => {
                const prod = alb.productos.find(p => p.productoProveedor.toString() === linea.productoProveedor.toString());
                return sum + (prod ? prod.cantidadRecibida : 0);
            }, 0);

            const lineaPedido = pedido.productos.find(p => p.productoProveedor.toString() === linea.productoProveedor.toString());

            if (!lineaPedido) {
                return res.status(400).json({
                    success: false,
                    message: `El producto ${linea.productoProveedor} no está en el pedido.`,
                    data: null,
                    error: null
                });
            }

            const cantidadTotal = recibidoPrevio + (linea.cantidadRecibida || 0);

            if (cantidadTotal > lineaPedido.cantidad) {
                return res.status(400).json({
                    success: false,
                    message: `La cantidad total recibida del producto ${linea.productoProveedor} supera lo pedido.`,
                    data: null,
                    error: null
                });
            }
        }

        let albaranData = {
            numero: numeroAlbaran,
            fechaRecepcion: fecha,
            pedido: pedido._id,
            proveedor: pedido.proveedor,
            usuario: req.user._id,
            productos: productos.map(p => ({
                productoProveedor: p.productoProveedor,
                cantidadPedido: p.cantidadPedido,
                cantidadRecibida: p.cantidadRecibida || 0,
                diferencia: p.cantidadPedido - (p.cantidadRecibida || 0)
            })),
            notas: notas || "",
            pdf: pdf || "",
            estado: "recibido",
        };

        albaranData.cantidadPedido = albaranData.productos.reduce((sum, p) => sum + p.cantidadPedido, 0);

        albaranData.cantidadRecibida = albaranData.productos.reduce((sum, p) => sum + p.cantidadRecibida, 0);

        albaranData.cantidadPendiente = albaranData.cantidadPedido - albaranData.cantidadRecibida;

        const albaranDB = await Albaran.create(albaranData);

        await registrarMovimientos(albaranData.productos, "entrada", albaranDB._id, numeroAlbaran, req.user._id);

        const totalRecibido = albaranesPrevios.reduce((sum, alb) => sum + (alb.cantidadRecibida || 0), 0) + albaranData.cantidadRecibida;
        const totalPedido = pedido.productos.reduce((sum, p) => sum + p.cantidad, 0);

        pedido.estado = totalRecibido < totalPedido ? "parcial" : "recibido";
        await pedido.save();

        return res.status(201).json({
            success: true,
            message: "Albarán creado correctamente",
            data: albaranDB,
            error: null
        });

    } catch (error) {
        console.error("Error al crear albarán:", error);

        res.status(500).json({
            success: false,
            message: "Error al crear albarán",
            error: error.message
        });
    }
};

const getAlbaran = async (req, res) => {
    try {
        const { id } = req.params;

        const albaran = await Albaran.findById(id)
            .populate("pedido", "fechaPedido estado proyecto numeroPedido")
            .populate("proveedor", "nombre")
            .populate("usuario", "nombre email")
            .populate({
                path: "productos.productoProveedor",
                select: "referenciaProveedor producto",
                populate: {
                    path: "producto",
                    select: "nombreProducto"
                }
            });

        if (!albaran) {
            return res.status(404).json({
                success: false,
                message: "Albarán no encontrado",
                data: null,
                error: null
            });
        }

        res.status(200).json({
            success: true,
            message: "Albarán obtenido correctamente",
            data: albaran,
            error: null
        });

    } catch (error) {
        console.error("Error al obtener albarán:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener albarán",
            data: null,
            error: error.message
        });
    }
};

const getAlbaranes = async (req, res) => {
    try {
        const { page = 1, limit = 20, estado, pedido, q } = req.query;

        const filtro = {};

        if (estado) filtro.estado = estado;
        if (pedido) filtro.pedido = pedido;
        if (q) filtro.numero = { $regex: q, $options: "i" };

        const totalAlbaranes = await Albaran.countDocuments(filtro);

        const albaranes = await Albaran.find(filtro)
            .select("numero fechaRecepcion estado pedido proveedor")
            .populate("pedido", "fechaPedido estado numeroPedido")
            .populate("proveedor", "nombre")
            .sort({ numero: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            message: "Albaranes obtenidos correctamente",
            totalAlbaranes,
            page: Number(page),
            limit: Number(limit),
            data: albaranes,
            error: null
        });

    } catch (error) {
        console.error("Error al obtener albaranes:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener albaranes",
            data: null,
            error: error.message
        });
    }
};

const updateAlbaran = async (req, res) => {
    try {
        if (![Roles.ADMIN, Roles.ALMACEN].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para actualizar albaranes.",
                data: null,
                error: null
            });
        }

        const { id } = req.params;
        const { productos, fechaRecepcion, notas, pdf } = req.body;

        const albaran = await Albaran.findById(id);
        if (!albaran) {
            return res.status(404).json({
                success: false,
                message: "Albarán no encontrado.",
                data: null,
                error: null
            });
        }

        const pedido = await Pedido.findById(albaran.pedido);
        if (!pedido) {
            return res.status(404).json({
                success: false,
                message: "Pedido asociado no encontrado.",
                data: null,
                error: null
            });
        }

        if (fechaRecepcion && fechaRecepcion < pedido.fechaPedido) {
            return res.status(400).json({
                success: false,
                message: "La fecha de recepción no puede ser anterior a la fecha del pedido.",
                data: null,
                error: null
            });
        }

        if (productos) albaran.productos = productos;
        if (fechaRecepcion) albaran.fechaRecepcion = fechaRecepcion;
        if (notas) albaran.notas = notas;
        if (pdf) albaran.pdf = pdf;

        const albaranesPrevios = await Albaran.find({
            pedido: pedido._id,
            _id: { $ne: albaran._id },
            estado: { $ne: "cancelado" }
        });

        for (let linea of albaran.productos) {
            const recibidoPrevio = albaranesPrevios.reduce((sum, alb) => {
                const prod = alb.productos.find(p => p.productoProveedor.toString() === linea.productoProveedor.toString());
                return sum + (prod ? prod.cantidadRecibida : 0);
            }, 0);

            const lineaPedido = pedido.productos.find(p => p.productoProveedor.toString() === linea.productoProveedor.toString());
            if (!lineaPedido) {
                return res.status(400).json({
                    success: false,
                    message: `El producto ${linea.productoProveedor} no está en el pedido.`,
                    data: null,
                    error: null
                });
            }

            if (recibidoPrevio + linea.cantidadRecibida > lineaPedido.cantidad) {
                return res.status(400).json({
                    success: false,
                    message: `La cantidad total recibida del producto ${linea.productoProveedor} supera lo pedido.`,
                    data: null,
                    error: null
                });
            }
        }

        calcularAlbaran(albaran);

        const albaranActualizado = await albaran.save();

        const albaranesTodos = await Albaran.find({ pedido: pedido._id, estado: { $ne: "cancelado" } });
        const totalRecibido = albaranesTodos.reduce((sum, alb) => sum + alb.cantidadRecibida, 0);
        const totalCancelado = pedido.productos.reduce((sum, p) => sum + (p.cancelado || 0), 0);
        const totalPedido = pedido.productos.reduce((sum, p) => sum + p.cantidad, 0);
        const totalEsperado = totalPedido - totalCancelado;

        if (totalRecibido < totalEsperado) {
            const restoProductos = albaran.productos.map(p => ({
                ...p.toObject ? p.toObject() : p,
                cantidadRecibida: p.cantidadPedido - p.cantidadRecibida
            })).filter(p => p.cantidadRecibida > 0);

            if (restoProductos.length > 0) {
                const numeroPendiente = await generarNumeroAlbaran();
                await Albaran.create({
                    numero: numeroPendiente,
                    fechaRecepcion: null,
                    pedido: pedido._id,
                    proveedor: pedido.proveedor,
                    usuario: req.user._id,
                    productos: restoProductos,
                    estado: "pendiente"
                });
            }

            pedido.estado = "parcial";
        } else {
            pedido.estado = "recibido";
        }

        await pedido.save();

        res.status(200).json({
            success: true,
            message: "Albarán actualizado correctamente",
            data: albaranActualizado,
            error: null
        });

    } catch (error) {
        console.error("Error al actualizar albarán:", error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar albarán",
            data: null,
            error: error.message
        });
    }
};

module.exports = { crearAlbaran, getAlbaran, getAlbaranes, updateAlbaran };



