const mongoose = require('mongoose');

const contactoProveedorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    cargo: {type: String},
    telefono: {
        type: String,
        required: false,
        validate: {
            validator: v => !v || /^(\+?\d{7,15})$/.test(v),
            message: props => `${props.value} no es un número de teléfono válido`
        }
},
    email: {type: String, required: true, unique: true},
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor", required: true },
}, {timestamps: true});

const ContactoProveedor = mongoose.model("ContactoProveedor", contactoProveedorSchema);
module.exports = ContactoProveedor
