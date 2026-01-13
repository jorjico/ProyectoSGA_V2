const mongoose = require('mongoose');

const albaranSchema = new mongoose.Schema({
    numero: { type: String, required: true, unique: true },
    fechaRecepcion: { type: Date},
    pdf: { type: String },
    pedido: { type: mongoose.Schema.Types.ObjectId, ref: "Pedido", required: true },
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor", required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    estado: { 
        type: String, 
        enum: ["pendiente", "recibido", "incidencia", "cancelado"], 
        default: "recibido"
    },
    productos: [
        {
            productoProveedor: { type: mongoose.Schema.Types.ObjectId, ref: "ProductoProveedor", required: true },
            cantidadPedido: { type: Number, required: true },
            cantidadRecibida: { type: Number, required: true },
            diferencia: { type: Number },
        }
    ],
    notas: { type: String },
    cantidadPedido: { type: Number },
    cantidadRecibida: { type: Number },
    cantidadPendiente: { type: Number }
}, { timestamps: true });


const Albaran = mongoose.model("Albaran", albaranSchema);
module.exports = Albaran;



