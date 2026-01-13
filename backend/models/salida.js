const mongoose = require('mongoose');

const salidaSchema = new mongoose.Schema({
    numero: { type: String, required: true, unique: true },

    proyecto: { type: mongoose.Schema.Types.ObjectId, ref: "Proyecto" }, 
    motivo: { type: String },

    fechaSalida: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },

    productos: [
        {
            producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
            sku: { type: String, required: true },
            nombreProducto: { type: String, required: true },
            cantidad: { type: Number, required: true, min: 1 }
        }
    ],

    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notas: { type: String }
}, { timestamps: true });

const Salida = mongoose.model("Salida", salidaSchema);
module.exports = Salida;
