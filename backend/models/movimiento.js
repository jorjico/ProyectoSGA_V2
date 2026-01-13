const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
    sku: { type: String, required: true },
    nombreProducto: { type: String, required: true },
    tipo: { 
        type: String, 
        enum: ["entrada", "salida"], 
        required: true 
    },
    cantidad: { type: Number, required: true, min: 1 },
    origen: { type: String, required: true }, 
    albaran: { type: mongoose.Schema.Types.ObjectId, ref: "Albaran" }, 
    salida: { type: mongoose.Schema.Types.ObjectId, ref: "Salida" }, 
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });


const Movimiento = mongoose.model("Movimiento", movimientoSchema);
module.exports = Movimiento;


