const mongoose = require("mongoose");
const Proveedor = require("../../models/proveedores");
const leerCSV = require("../leerCSV");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const lanzarSemillaProveedores = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Conectado a MongoDB");

        await Proveedor.collection.drop().then(() => {
            console.log("Colección Proveedores eliminada");
        }).catch(() => {
            console.log("Colección Proveedores no existía, se crea nueva");
        });

        const proveedoresCSV = await leerCSV("../../data/proveedores.csv");

        await Proveedor.insertMany(proveedoresCSV);
        console.log("Proveedores introducidos");

    } catch (error) {
        console.error("Error al subir semilla de proveedores:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Desconectado de la BBDD");
    }
};

module.exports = { lanzarSemillaProveedores };
