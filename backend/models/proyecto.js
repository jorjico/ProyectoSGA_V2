const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
    estado: { 
        type: String, 
        enum: ["presupuesto", "aceptado", "en fabricación", "incidencia", "terminado"], 
        default: "presupuesto"
    },
    direccionEntrega: { type: String, required: true },
}, { timestamps: true });

const Proyecto = mongoose.model("Proyecto", proyectoSchema);
module.exports = Proyecto;