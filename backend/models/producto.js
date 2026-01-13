const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    familia: { type: mongoose.Schema.Types.ObjectId, ref: "Familia", required: true },
    nombreProducto: { type: String, required: true },
    foto: {
        url: {type: String, required: false},
        public_id: {type: String, required: false}
    },
    proveedores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proveedor" }], 
    IVA: { 
        type: Number, 
        enum: [4, 5, 10, 21], 
        default: 21
    }, 
    stock: { type: Number, default: 0, min: 0 },
    unidadMedida: {
        type: String,
        enum: ["Uds", "ML", "Caja", "Pack"],
        required: true
    }
}, { timestamps: true });


const Producto = mongoose.model("Producto", productoSchema);
module.exports = Producto;





