const mongoose = require("mongoose");
const leerCSV = require("../leerCSV");
const path = require("path");
const Proyecto = require("../../models/proyecto");
const Cliente = require("../../models/cliente");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const lanzarSemillaProyectos = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Conectado a MongoDB");

        await Proyecto.collection.drop().then(() => {
            console.log("Colección Proyecto eliminada");
        }).catch(() => {
            console.log("Colección Proyecto no existía, se crea nueva");
        });

        let proyectosCSV = await leerCSV("../../data/proyectos.csv");

        const proyectosMongo = [];

        for (const proyecto of proyectosCSV) {
            const clienteDB = await Cliente.findOne({ nombre: proyecto.cliente });
            if (!clienteDB) {
                console.log(`Cliente no encontrado: ${proyecto.cliente}`);
                continue;
            }

            proyectosMongo.push({
                nombre: proyecto.nombre,
                cliente: clienteDB._id,
                estado: proyecto.estado.toLowerCase(),
                direccionEntrega: proyecto.direccionEntrega
            });
        }

        if (proyectosMongo.length > 0) {
            await Proyecto.insertMany(proyectosMongo);
            console.log("Proyectos introducidos correctamente");
        } else {
            console.log("No se insertó ningún proyecto");
        }

    } catch (error) {
        console.error("Error al subir semilla de proyectos:", error);
        
    } finally {
        await mongoose.disconnect();
        console.log("Desconectado de la BBDD");
    }
};

module.exports = { lanzarSemillaProyectos };
