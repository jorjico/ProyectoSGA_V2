const mongoose = require("mongoose");
const path = require("path");
const leerCSV = require("../leerCSV");
const Movimiento = require("../../models/movimiento");
const Producto = require("../../models/producto");
const Albaran = require("../../models/albaran");
const Salida = require("../../models/salida");
const User = require("../../models/usuarios");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const lanzarSemillaMovimientos = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Conectado a MongoDB");

        await Movimiento.collection
            .drop()
            .then(() => console.log("Colección Movimientos eliminada"))
            .catch(() => console.log("Colección Movimientos no existía, se crea nueva"));

        const movimientosCSV = await leerCSV("../../data/movimientos.csv");

        const productosDB = await Producto.find();
        const albaranesDB = await Albaran.find();
        const salidasDB = await Salida.find();
        const usuarioDB = await User.findOne({ email: "usuariosemilla@empresa.com" });

        if (!usuarioDB) {
            throw new Error("UsuarioSemilla no encontrado en la colección Usuario");
        }

        const movimientosAInsertar = [];

        for (const linea of movimientosCSV) {
            const nombreProducto = linea.nombreProducto?.trim();
            const tipo = linea.tipo?.trim();
            const cantidad = Number(linea.cantidad) || 0;
            const numero = linea.albaran?.trim() || linea.salida?.trim();

            if (!nombreProducto || !tipo || !numero || cantidad <= 0) continue;

            const productoDB = productosDB.find(
                (p) => p.nombreProducto.trim().toLowerCase() === nombreProducto.toLowerCase()
            );

            if (!productoDB) {
                console.log(`Producto no encontrado: ${nombreProducto}`);
                continue;
            }

            let albaranId = null;
            let salidaId = null;

            if (tipo === "entrada") {
                const albaranDB = albaranesDB.find(
                    (a) => a.numero.trim().toLowerCase() === numero.toLowerCase()
                );
                if (!albaranDB) {
                    console.log(`Albarán no encontrado: ${numero}`);
                    continue;
                }
                albaranId = albaranDB._id;
            } else if (tipo === "salida") {
                const salidaDB = salidasDB.find(
                    (s) => s.numero.trim().toLowerCase() === numero.toLowerCase()
                );
                if (!salidaDB) {
                    console.log(`Salida no encontrada: ${numero}`);
                    continue;
                }
                salidaId = salidaDB._id;
            }

            movimientosAInsertar.push({
                sku: productoDB.sku,
                nombreProducto: productoDB.nombreProducto,
                tipo,
                cantidad,
                origen: numero,
                albaran: albaranId,
                salida: salidaId,
                usuario: usuarioDB._id,
            });
        }

        if (movimientosAInsertar.length === 0) {
            console.log("No se han generado movimientos para insertar");
            return;
        }

        await Movimiento.insertMany(movimientosAInsertar);
        console.log(`${movimientosAInsertar.length} movimientos insertados correctamente`);

    } catch (error) {
        console.error("Error al subir semilla de movimientos:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Desconectado de la BBDD");
    }
};

module.exports = { lanzarSemillaMovimientos };

