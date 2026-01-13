const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    numeroPedido: { type: String, required: true, unique: true },
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor", required: true },
    proyecto: { type: mongoose.Schema.Types.ObjectId, ref: "Proyecto" },
    fechaPedido: { type: Date, default: Date.now },
    fechaEntregaEstimado: { type: Date },
    productos: [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Producto",
                required: true
            },
            productoProveedor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ProductoProveedor",
                required: true
            },
            cantidad: {
                type: Number,
                required: true
            },
                precioUnitario: {
                type: Number,
                required: true
            },
            referenciaProveedor: String,
            importeBruto: Number
        }
    ],
    totalBruto: { type: Number, required: true, min: 0 },
    totalConIVA: { type: Number, required: true, min: 0 },
    estado: { 
        type: String, 
        enum: ["pendiente", "parcial", "recibido", "cancelado"], 
        default: "pendiente"
    },
    cancelados: { type: Number, default: 0 }
}, { timestamps: true });

const Pedido = mongoose.model("Pedido", pedidoSchema);
module.exports = Pedido;
