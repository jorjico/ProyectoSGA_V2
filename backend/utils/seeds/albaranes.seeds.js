const mongoose = require("mongoose");
const path = require("path");
const leerCSV = require("../leerCSV");
const Proveedor = require("../../models/proveedores");
const ProductoProveedor = require("../../models/productoProveedor");
const Albaran = require("../../models/albaran");
const User = require("../../models/usuarios");
const Pedido = require("../../models/pedido");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const lanzarSemillaAlbaranes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Conectado a MongoDB");

        await Albaran.collection
            .drop()
            .then(() => console.log("Colección Albaranes eliminada"))
            .catch(() => console.log("Colección Albaranes no existía, se crea nueva"));

        const albaranesCSV = await leerCSV("../../data/albaranes.csv");

        const proveedoresDB = await Proveedor.find();
        const productosProveedorDB = await ProductoProveedor.find();
        const usuarioDB = await User.findOne({ email: "usuariosemilla@empresa.com" });

        if (!usuarioDB) {
            throw new Error("UsuarioSemilla no encontrado en la colección Usuario");
        }

        const albaranesMap = new Map();
        for (const linea of albaranesCSV) {
            const numero = linea.numero?.trim();
            if (!numero) continue;

            if (!albaranesMap.has(numero)) {
                albaranesMap.set(numero, []);
            }
            albaranesMap.get(numero).push(linea);
        }

        const albaranesAInsertar = [];

        for (const [numero, lineasAlbaran] of albaranesMap.entries()) {
            const primera = lineasAlbaran[0];

            const pedidoDB = await Pedido.findOne({ numeroPedido: primera.pedido?.trim() });
            if (!pedidoDB) {
                console.log(`Pedido no encontrado: ${primera.pedido}`);
                continue;
            }

            const proveedor = proveedoresDB.find(
                (p) => p.nombre.trim() === primera.proveedor.trim()
            );
            if (!proveedor) {
                console.log(`Proveedor no encontrado: ${primera.proveedor}`);
                continue;
            }

            const productosAlbaran = [];
            for (const linea of lineasAlbaran) {
                const referencia = linea.productoProveedor?.trim();
                if (!referencia) continue;

                const productoProv = productosProveedorDB.find(
                    (pp) => pp.referenciaProveedor === referencia
                );
                if (!productoProv) {
                    console.log(`ProductoProveedor no encontrado: ${referencia}`);
                    continue;
                }

                productosAlbaran.push({
                    productoProveedor: productoProv._id,
                    cantidadPedido: Number(linea.cantidadPedido) || 0,
                    cantidadRecibida: Number(linea.cantidadRecibida) || 0,
                    diferencia: Number(linea.diferencia) || 0,
                });
            }

            if (productosAlbaran.length === 0) {
                console.log(`Albarán ${numero} sin productos válidos`);
                continue;
            }

            albaranesAInsertar.push({
                numero,
                fechaRecepcion: new Date(primera.fechaRecepcion),
                pedido: pedidoDB._id,
                proveedor: proveedor._id,
                usuario: usuarioDB._id,
                estado: primera.estado?.trim() || "pendiente",
                pdf: primera.pdf?.trim() || "",
                productos: productosAlbaran,
            });
        }

        if (albaranesAInsertar.length === 0) {
            console.log("No se han generado albaranes para insertar");
            return;
        }

        await Albaran.insertMany(albaranesAInsertar);
        console.log(`${albaranesAInsertar.length} albaranes insertados correctamente`);

    } catch (error) {
        console.error("Error al subir semilla de albaranes:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Desconectado de la BBDD");
    }
};

module.exports = { lanzarSemillaAlbaranes };


