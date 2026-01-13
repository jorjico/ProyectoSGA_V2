const mongoose = require("mongoose");
const Producto = require("../../models/producto");
const ProductoProveedor = require("../../models/productoProveedor");
const leerCSV = require("../leerCSV");
const path = require("path");
const Proveedor = require("../../models/proveedores");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });


const lanzarSemillaProductoProveedor = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Conectado a MongoDB");

        await ProductoProveedor.collection.drop().then(() => {
            console.log("Colección ProductoProveedor eliminada");
        }).catch(() => {
            console.log("Colección ProductoProveedor no existía, se crea nueva");
        });

        const productoProveedorCSV = await leerCSV("../../data/productoProveedor.csv");

        const relacionesMongo = [];

        for (const relacion of productoProveedorCSV) {
            const { producto, proveedor, referenciaProveedor, precioUnitario, cantidadMinima, moneda } = relacion;

            const productoDB = await Producto.findOne({ nombreProducto: producto });
            if (!productoDB) {
                console.log(`Producto no encontrado: ${producto}`);
                continue;
            }

            const proveedorDB = await Proveedor.findOne({ nombre: proveedor });
            if (!proveedorDB) {
                console.log(`Proveedor no encontrado: ${proveedor}`);
                continue;
            }

            relacionesMongo.push({
                producto: productoDB._id,
                proveedor: proveedorDB._id,
                referenciaProveedor,
                precioUnitario: parseFloat(precioUnitario),
                cantidadMinima: parseInt(cantidadMinima, 10),
                moneda,
            });

        }

        if (relacionesMongo.length > 0) {
            await ProductoProveedor.insertMany(relacionesMongo);
            console.log("Relaciones producto-proveedor introducidas");
        } else {
            console.log("No se creó ninguna relación");
        }

    } catch (error) {
        console.error("Error al subir semilla de productoProveedor:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Desconectado de la BBDD");
    }
};

module.exports = { lanzarSemillaProductoProveedor };



