const mongoose = require("mongoose");
const leerCSV = require("../leerCSV");
const path = require("path");
const Cliente = require("../../models/cliente");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const lanzarSemillaClientes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Conectado a MongoDB");

        await Cliente.collection.drop().then(() => {
            console.log("Colección Clientes eliminada");
        }).catch(() => {
            console.log("Colección Clientes no existía, se crea nueva");
        });

        let clientesCSV = await leerCSV("../../data/clientes.csv");

        clientesCSV = clientesCSV.map(cliente => ({
            ...cliente,
            activo: cliente.activo === "true" || cliente.activo === true
        }));

        await Cliente.insertMany(clientesCSV);
        console.log("Clientes introducidos correctamente");

    } catch (error) {
        console.error("Error al subir semilla de clientes:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Desconectado de la BBDD");
    }
};

module.exports = { lanzarSemillaClientes };
