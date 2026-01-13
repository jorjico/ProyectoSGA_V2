const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    CIF: { type: String, required: true, unique: true },
    direccion: { type: String, required: true },
    codigoPostal: { type: String, required: false },
    pais: { type: String, required: false },
    condicionesPago: {
        type: String,
        enum: ["transferencia", "cheque", "domiciliacion", "tarjeta", "efectivo"],
        default: "transferencia"
    },
    diasTiempoEntrega: {type: Number, required: true},
    activo: { type: Boolean, default: true },
}, { timestamps: true });


const Proveedor = mongoose.model("Proveedor", proveedorSchema);
module.exports = Proveedor;



