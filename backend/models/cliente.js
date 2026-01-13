const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    tipo: { 
        type: String, 
        enum: ["persona", "empresa"], 
        required: true 
    },
    nombre: { type: String, required: true },
    NIF: { 
        type: String, 
        required: function() { return this.tipo === 'persona'; },
        match: /^[0-9]{8}[A-Z]$/,
        unique: true
    },
    CIF: {
        type: String,
        required: function() { return this.tipo === 'empresa'; }, 
        match: /^[A-Z0-9]{9}$/, 
        unique: true
    },
    direccionFacturacion: { type: String, required: true },
    telefono: {
        type: String,
        required: true, 
        match: /^\+?[0-9]{7,15}$/
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true, 
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    activo: { type: Boolean, default: true }
}, { timestamps: true });

const Cliente = mongoose.model("Cliente", clienteSchema);
module.exports = Cliente;