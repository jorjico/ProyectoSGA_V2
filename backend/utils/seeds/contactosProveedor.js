const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const leerCSV = require("../leerCSV");
const Proveedor = require("../../models/proveedores");
const ContactoProveedor = require("../../models/contactoProveedor");

const lanzarSemillaContactosProveedor = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Conectado a MongoDB");

        await ContactoProveedor.collection
            .drop()
            .then(() => console.log("Colección ContactoProveedor eliminada"))
            .catch(() => console.log("Colección ContactoProveedor no existía, se crea nueva"));

        const contactosCSV = await leerCSV("../../data/contactosProveedor.csv");
        console.log(`Leídos ${contactosCSV.length} contactos desde CSV`);

        const proveedoresDB = await Proveedor.find();
        if (!proveedoresDB.length) {
            throw new Error("No se encontraron proveedores en la base de datos");
        }

        const contactosAInsertar = [];

        for (const linea of contactosCSV) {
            const nombreProveedor = linea.proveedor?.trim();
            const proveedor = proveedoresDB.find(
                (p) => p.nombre.trim().toLowerCase() === nombreProveedor.toLowerCase()
            );

            if (!proveedor) {
                console.log(`Proveedor no encontrado para contacto: ${linea.nombre}`);
                continue;
            }

            contactosAInsertar.push({
                nombre: linea.nombre?.trim(),
                cargo: linea.cargo?.trim() || "",
                telefono: linea.telefono?.trim() || "",
                email: linea.email?.trim().toLowerCase(),
                proveedor: proveedor._id,
            });
        }

        if (contactosAInsertar.length === 0) {
            console.log("No se encontraron contactos válidos para insertar");
            return;
        }

        await ContactoProveedor.insertMany(contactosAInsertar);
        console.log(`${contactosAInsertar.length} contactos insertados correctamente`);

    } catch (error) {
        console.error("Error al subir semilla de contactos de proveedores:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Desconectado de la BBDD");
    }
};

/*lanzarSemillaContactosProveedor();*/
module.exports = { lanzarSemillaContactosProveedor };
