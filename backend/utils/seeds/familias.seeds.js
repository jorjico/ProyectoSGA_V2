const mongoose = require("mongoose");
const Familia = require("../../models/familiaProducto");
const leerCSV = require("../leerCSV");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const lanzarSemillaFamilia = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Conectado a MongoDB");

        await Familia.collection.drop().then(() => {
            console.log("Colección Familias eliminada");
        }).catch(() => {
            console.log("Colección Familias no existía, se crea nueva");
        });

        const familiasCSV = await leerCSV ("../../data/familias.csv");

        await Familia.insertMany(familiasCSV);
        console.log("Familias introducidas");

    } catch (error) {
        console.error("Error al subir semilla de familias:", error);
    
    } finally {
        await mongoose.disconnect();
        console.log("Desconectado de la BBDD");
    }
}

module.exports = { lanzarSemillaFamilia };