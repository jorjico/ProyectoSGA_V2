const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Producto = require("../../models/producto");
const Proveedor = require("../../models/proveedores");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });


const generarNumeroPedidos = (cantidad) => {
    const year = 2025;
    const pedidos = [];
    for (let i = 1; i <= cantidad; i++) {
        const numeroFormateado = String(i).padStart(4, '0');
        pedidos.push(`PED/${year}/${numeroFormateado}`);
    }
    return pedidos;
};


const generarCSV = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const productos = await Producto.find();
        const proveedores = await Proveedor.find();

        if (productos.length === 0 || proveedores.length === 0) {
            console.log("No hay productos o proveedores en la base de datos");
            process.exit(1);
        }

        const numeroPedidos = generarNumeroPedidos(50);
        const filas = [];

        numeroPedidos.forEach(numeroPedido => {

            const producto = productos[Math.floor(Math.random() * productos.length)];

            const proveedor = proveedores[Math.floor(Math.random() * proveedores.length)];


            const cantidad = Math.floor(Math.random() * 20) + 1;

            filas.push({
                numeroPedido,
                productoId: producto._id.toString(),
                productoNombre: producto.nombreProducto,
                proveedorId: proveedor._id.toString(),
                proveedorNombre: proveedor.nombre,
                cantidad
            });
        });

        const header = "numeroPedido;productoId;productoNombre;proveedorId;proveedorNombre;cantidad";
        const data = filas.map(f => `${f.numeroPedido};${f.productoId};${f.productoNombre};${f.proveedorId};${f.proveedorNombre};${f.cantidad}`).join("\n");
        const csv = `${header}\n${data}`;

        fs.writeFileSync(path.join(__dirname, "pedidos.csv"), csv, "utf-8");
        console.log("CSV generado con éxito: pedidos.csv");

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

generarCSV();

