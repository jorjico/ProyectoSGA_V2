const mongoose = require("mongoose");
const Familia = require("../../models/familiaProducto");
const Producto = require("../../models/producto");
const leerCSV = require("../leerCSV");
const path = require("path");
const Proveedor = require("../../models/proveedores");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const lanzarSemillaProductos = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Conectado a MongoDB");

        await Producto.collection.drop().then(() => {
            console.log("Colección Productos eliminada");
        }).catch(() => {
            console.log("Colección Productos no existía, se crea nueva");
        });

        const productosCSV = await leerCSV("../../data/productos.csv");

        const familiasDB = await Familia.find();

        const productosConSKU = [];

        const contadoresFamilia = {};

        for (const prod of productosCSV) {
            const familiaDB = familiasDB.find(f => f.nombre === prod.familia);
            if (!familiaDB) {
                console.log(`Familia no encontrada para producto ${prod.nombreProducto}`);
                continue;
            }

            if (!contadoresFamilia[familiaDB._id]) {
                contadoresFamilia[familiaDB._id] = 1;
            } else {
                contadoresFamilia[familiaDB._id]++;
            }

            const nuevoCodigo = String(contadoresFamilia[familiaDB._id]).padStart(4, "0");
            const sku = `${familiaDB.codigo}.${nuevoCodigo}`;

            let proveedoresInfo = [];
            if (prod.proveedoresCIF) {
                const cifs = prod.proveedoresCIF.split(",").map(c => c.trim());
                proveedoresInfo = await Proveedor.find({ CIF: { $in: cifs } });
            }

            const { proveedoresCIF, ...restoCampos } = prod;

            productosConSKU.push({
                ...restoCampos,
                familia: familiaDB._id,
                sku,
                stock: prod.stock || 0,
                IVA: prod.IVA || 21, 
                proveedores: proveedoresInfo
            });
        }

        await Producto.insertMany(productosConSKU);
        console.log("Productos introducidos");

    } catch (error) {
        console.error("Error al subir semilla de productos:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Desconectado de la BBDD");
    }
};


module.exports = { lanzarSemillaProductos };
