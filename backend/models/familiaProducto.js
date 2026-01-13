const mongoose = require("mongoose");

const familiaSchema = new mongoose.Schema({
    codigo: { type: String, required: true, unique: true },
    nombre: { type: String, required: true, unique: true }
}, { timestamps: true });

const Familia = mongoose.model("Familia", familiaSchema);
module.exports = Familia;
