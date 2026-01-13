const Movimiento = require("../models/movimiento");
const Producto = require("../models/producto");
const ProductoProveedor = require("../models/productoProveedor");

const registrarMovimientos = async (productos, tipo, referenciaId, numero, usuarioId) => {
    const movimientos = [];

    for (const p of productos) {
        let cantidad = tipo === "entrada" ? p.cantidadRecibida ?? 0 : p.cantidad ?? 0;
        if (cantidad <= 0) continue;

        let productoId;
        if (tipo === "entrada") {
            const pp = await ProductoProveedor.findById(p.productoProveedor);
            if (!pp) continue;
            productoId = pp.producto;
        } else {
            productoId = p.producto;
        }

        const producto = await Producto.findById(productoId);
        if (!producto) continue;

        movimientos.push({
            sku: producto.sku,
            nombreProducto: producto.nombreProducto,
            tipo,
            cantidad,
            unidadMedida: producto.unidadMedida,
            origen: numero,
            [tipo === "entrada" ? "albaran" : "salida"]: referenciaId,
            usuario: usuarioId
        });

        const ajuste = tipo === "entrada" ? cantidad : -cantidad;
        await Producto.findByIdAndUpdate(producto._id, { $inc: { stock: ajuste } });
    }

    await Movimiento.insertMany(movimientos);
};

module.exports = registrarMovimientos;