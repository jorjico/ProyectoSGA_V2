const Movimiento = require("../models/movimiento");

const getMovimientos = async (req, res) => {
    try {
        const { page = 1, limit = 20, tipo, fechaDesde, fechaHasta, q } = req.query;

        const filtro = {};

        if (tipo) filtro.tipo = tipo;

        if (q) {
            const regex = new RegExp(q, "i");
            filtro.$or = [
                { nombreProducto: regex },
                { sku: regex }
            ];
        }

        if (fechaDesde || fechaHasta) {
            filtro.createdAt = {};
            if (fechaDesde) filtro.createdAt.$gte = new Date(fechaDesde);
            if (fechaHasta) filtro.createdAt.$lte = new Date(fechaHasta);
        }

        const totalMovimientos = await Movimiento.countDocuments(filtro);

        const movimientos = await Movimiento.find(filtro)
            .populate("usuario", "email")
            .populate("albaran", "numero")
            .populate("salida", "numero")
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            message: "Movimientos obtenidos correctamente",
            totalMovimientos,
            page: Number(page),
            limit: Number(limit),
            data: movimientos,
            error: null
        });

    } catch (error) {
        console.error("Error al obtener movimientos:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener movimientos",
            data: null,
            error: error.message
        });
    }
};

module.exports = { getMovimientos };