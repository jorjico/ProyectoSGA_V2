const Salida = require("../models/salida");
const Roles = require("../utils/roles");
const generarNumeroSalida = require("../utils/generarNumeroSalida");
const registrarMovimientos = require("../utils/registrarMovimientos");
const Producto = require("../models/producto");
const Movimiento = require("../models/movimiento");

const crearSalida = async (req, res) => {
    try {
        if (![Roles.ADMIN, Roles.ALMACEN].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para crear salidas.",
                data: null,
                error: null
            });
        }

        const { proyecto, motivo, productos, notas, fechaSalida } = req.body;

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Debes indicar al menos un producto en la salida.",
                data: null,
                error: null
            });
        }

        const productoIds = productos.map(p => p.producto);
        const productoDB = await Producto.find({ _id: { $in: productoIds } });
        const productoMap = {};
        productoDB.forEach(pr => { productoMap[pr._id.toString()] = pr; });

        for (const p of productos) {
            if (p.cantidad <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `La cantidad del producto ${p.sku} debe ser mayor a 0.`,
                    data: null,
                    error: null
                });
            }

            const productoDB = productoMap[p.producto];
            if (!productoDB) {
                return res.status(404).json({
                    success: false,
                    message: `Producto con ID ${p.producto} no encontrado.`,
                    data: null,
                    error: null
                });
            }

            const entradas = await Movimiento.aggregate([
                { $match: { sku: productoDB.sku, tipo: "entrada" } },
                { $group: { _id: null, total: { $sum: "$cantidad" } } }
            ]);

            const salidas = await Movimiento.aggregate([
                { $match: { sku: productoDB.sku, tipo: "salida" } },
                { $group: { _id: null, total: { $sum: "$cantidad" } } }
            ]);

            const stockActual = (entradas[0]?.total || 0) - (salidas[0]?.total || 0);

            if (p.cantidad > stockActual) {
                return res.status(400).json({
                    success: false,
                    message: `No hay stock suficiente para ${p.sku}. Disponible: ${stockActual}, solicitado: ${p.cantidad}`,
                    data: null,
                    error: null
                });
            }
        }

        const numero = await generarNumeroSalida();

        const salida = new Salida({
            numero,
            proyecto: proyecto || null,
            motivo: motivo || null,
            productos,
            usuario: req.user._id,
            notas: notas || "",
            fechaSalida: fechaSalida ? new Date(fechaSalida) : new Date()
        });

        const salidaDB = await salida.save();

        await registrarMovimientos(
            productos,
            "salida",
            salidaDB._id,
            numero,
            req.user._id
        );

        const salidaConPopulate = await Salida.findById(salidaDB._id).populate({
            path: "productos.producto",
            select: "nombreProducto sku",
        });

        res.status(201).json({
            success: true,
            message: "Salida creada correctamente",
            data: salidaConPopulate,
            error: null
        });

    } catch (error) {
        console.error("Error en crearSalida:", error);
        res.status(500).json({
            success: false,
            message: "Error al crear salida",
            data: null,
            error: error.message
        });
    }
};


const getSalidas = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;

        const filtro = {};

        if (search) {
            const regex = new RegExp(search, "i");
            filtro.$or = [
                { proyecto: regex },
                { motivo: regex },
                { "productos.sku": regex },
                { "productos.nombreProducto": regex }
            ];
        }

        const totalSalidas = await Salida.countDocuments(filtro);

        const salidas = await Salida.find(filtro)
            .select("numero proyecto motivo fechaSalida productos.sku productos.nombreProducto")
            .sort({ fechaSalida: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            message: "Salidas obtenidas correctamente",
            totalSalidas,
            page: Number(page),
            limit: Number(limit),
            data: salidas,
            error: null
        });

    } catch (error) {
        console.error("Error al obtener salidas:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener salidas",
            data: null,
            error: error.message
        });
    }
};

const getSalida = async (req, res) => {
    try {
        const { id } = req.params;

        const salida = await Salida.findById(id)
            .populate("proyecto", "nombre")
            .populate("usuario", "nombre email")
            .populate({
                path: "productos.producto",
                select: "nombreProducto sku",
            });

        if (!salida) {
            return res.status(404).json({
                success: false,
                message: "Salida no encontrada",
                data: null,
                error: null
            });
        }

        res.status(200).json({
            success: true,
            message: "Salida obtenida correctamente",
            data: salida,
            error: null
        });

    } catch (error) {
        console.error("Error al obtener salida:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener salida",
            data: null,
            error: error.message
        });
    }
};

const updateSalida = async (req, res) => {
    try {
        if (![Roles.ADMIN, Roles.ALMACEN].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para actualizar salidas.",
                data: null,
                error: null
            });
        }

        const { id } = req.params;
        const { proyecto, motivo, productos, notas, fechaSalida } = req.body;

        const salida = await Salida.findById(id);
        if (!salida) {
            return res.status(404).json({
                success: false,
                message: "Salida no encontrada.",
                data: null,
                error: null
            });
        }

        if (productos && Array.isArray(productos)) {
            const productoIds = productos.map(p => p.producto);
            const productosDB = await Producto.find({ _id: { $in: productoIds } });
            const productoMap = {};
            productosDB.forEach(pr => { productoMap[pr._id.toString()] = pr; });

            for (const p of productos) {
                if (p.cantidad <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: `La cantidad del producto ${p.sku} debe ser mayor a 0.`,
                        data: null,
                        error: null
                    });
                }

                const productoDB = productoMap[p.producto];
                if (!productoDB) {
                    return res.status(404).json({
                        success: false,
                        message: `Producto con ID ${p.producto} no encontrado.`,
                        data: null,
                        error: null
                    });
                }

                const entradas = await Movimiento.aggregate([
                    { $match: { sku: productoDB.sku, tipo: "entrada" } },
                    { $group: { _id: null, total: { $sum: "$cantidad" } } }
                ]);

                const salidas = await Movimiento.aggregate([
                    { $match: { sku: productoDB.sku, tipo: "salida", salida: { $ne: salida._id } } },
                    { $group: { _id: null, total: { $sum: "$cantidad" } } }
                ]);

                const stockActual = (entradas[0]?.total || 0) - (salidas[0]?.total || 0);

                if (p.cantidad > stockActual) {
                    return res.status(400).json({
                        success: false,
                        message: `No hay stock suficiente para ${p.sku}. Disponible: ${stockActual}, solicitado: ${p.cantidad}`,
                        data: null,
                        error: null
                    });
                }
            }

            if (fechaSalida) salida.fechaSalida = new Date(fechaSalida);

            await Movimiento.deleteMany({ salida: salida._id });

            const movimientos = productos.map(p => ({
                sku: p.sku,
                nombreProducto: p.nombreProducto,
                tipo: "salida",
                cantidad: p.cantidad,
                salida: salida._id,
                usuario: req.user._id
            }));

            await Movimiento.insertMany(movimientos);

            salida.productos = productos;
        }

        if (proyecto) salida.proyecto = proyecto;
        if (motivo) salida.motivo = motivo;
        if (notas) salida.notas = notas;

        salida.usuario = req.user._id;

        const salidaActualizada = await salida.save();

        const salidaConPopulate = await Salida.findById(salidaActualizada._id).populate({
            path: "productos.producto",
            select: "nombreProducto sku",
        });

        res.status(200).json({
            success: true,
            message: "Salida actualizada correctamente",
            data: salidaConPopulate,
            error: null
        });

    } catch (error) {
        console.error("Error en updateSalida:", error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar salida",
            data: null,
            error: error.message
        });
    }
};

const deleteSalida = async (req, res) => {
    try {
        if (![Roles.ADMIN, Roles.ALMACEN].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para eliminar salidas.",
                data: null,
                error: null
            });
        }

        const { id } = req.params;
        const salida = await Salida.findById(id);

        if (!salida) {
            return res.status(404).json({
                success: false,
                message: "Salida no encontrada.",
                data: null,
                error: null
            });
        }

        await Movimiento.deleteMany({ salida: salida._id });

        await salida.deleteOne();

        res.status(200).json({
            success: true,
            message: "Salida eliminada correctamente",
            data: null,
            error: null
        });

    } catch (error) {
        console.error("Error en deleteSalida:", error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar salida",
            data: null,
            error: error.message
        });
    }
};

module.exports = { crearSalida, getSalidas, getSalida, updateSalida, deleteSalida };
