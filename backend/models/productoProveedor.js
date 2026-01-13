const mongoose = require('mongoose');

const productoProveedorSchema = new mongoose.Schema({
    producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor", required: true },
    referenciaProveedor: { type: String, required: true },
    precioUnitario: { type: Number, required: true, min: 0 },
    cantidadMinima: { type: Number, required: true, min: 0 },
    moneda: { type: String, required: true, default: 'EUR' },
}, { timestamps: true });

const ProductoProveedor = mongoose.model("ProductoProveedor", productoProveedorSchema);
module.exports = ProductoProveedor;
