const mongoose = require("mongoose");
const path = require("path");
const leerCSV = require("../leerCSV");
const Salida = require("../../models/salida");
const Producto = require("../../models/producto");
const Proyecto = require("../../models/proyecto");
const User = require("../../models/usuarios");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const lanzarSemillaSalidas = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Conectado a MongoDB");

        await Salida.collection
            .drop()
            .then(() => console.log("Colección Salidas eliminada"))
            .catch(() => console.log("Colección Salidas no existía, se crea nueva"));

        const salidasCSV = await leerCSV("../../data/salidas.csv");

        const productosDB = await Producto.find();
        const proyectosDB = await Proyecto.find();
        const usuarioDB = await User.findOne({ email: "usuariosemilla@empresa.com" });

        if (!usuarioDB) {
            throw new Error("UsuarioSemilla no encontrado en la colección Usuario");
        }

        const salidasMap = new Map();
        for (const linea of salidasCSV) {
            const numero = linea.numero?.trim();
            if (!numero) continue;

            if (!salidasMap.has(numero)) {
                salidasMap.set(numero, []);
            }
            salidasMap.get(numero).push(linea);
        }

        const salidasAInsertar = [];
        for (const [numero, lineasSalida] of salidasMap.entries()) {
            const primera = lineasSalida[0];

            const proyectoDB = proyectosDB.find(
                (p) => p.nombre.trim() === primera.proyecto.trim()
            );
            if (!proyectoDB) {
                console.log(`Proyecto no encontrado: ${primera.proyecto}`);
                continue;
            }

            const productosSalida = [];
            for (const linea of lineasSalida) {
                const nombreProd = linea.nombreProducto?.trim();
                if (!nombreProd) continue;

                const productoDB = productosDB.find(
                    (p) => p.nombreProducto.trim() === nombreProd
                );
                if (!productoDB) {
                    console.log(`Producto no encontrado: ${nombreProd}`);
                    continue;
                }

                productosSalida.push({
                    producto: productoDB._id,
                    sku: productoDB.sku,
                    nombreProducto: productoDB.nombreProducto,
                    cantidad: Number(linea.cantidad) || 0,
                });
            }

            if (productosSalida.length === 0) {
                console.log(`Salida ${numero} sin productos válidos`);
                continue;
            }

            salidasAInsertar.push({
                numero,
                proyecto: proyectoDB._id,
                motivo: primera.motivo?.trim() || "",
                fechaSalida: primera.fechaSalida ? new Date(primera.fechaSalida) : new Date(),
                usuario: usuarioDB._id,
                notas: primera.notas?.trim() || "",
                productos: productosSalida,
            });
        }

        if (salidasAInsertar.length === 0) {
            console.log("No se han generado salidas para insertar");
            return;
        }

        await Salida.insertMany(salidasAInsertar);
        console.log(`${salidasAInsertar.length} salidas insertadas correctamente`);

    } catch (error) {
        console.error("Error al subir semilla de salidas:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Desconectado de la BBDD");
    }
};

module.exports = { lanzarSemillaSalidas };
