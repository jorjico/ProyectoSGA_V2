const mongoose = require("mongoose");
const Producto = require("../../models/producto");
const Pedido = require("../../models/pedido");
const Proveedor = require("../../models/proveedores");
const Proyecto = require("../../models/proyecto");
const ProductoProveedor = require("../../models/productoProveedor");
const leerCSV = require("../leerCSV");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const lanzarSemillaPedidos = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Conectado a MongoDB");

        await Pedido.collection.drop()
            .then(() => console.log("Colección Pedido eliminada"))
            .catch(() => console.log("Colección Pedido no existía, se crea nueva"));

        const pedidosCSV = await leerCSV("../../data/pedidos.csv");

        const pedidosMongo = [];

        const proveedoresCache = {};
        const proyectosCache = {};
        const productosCache = {};

        for (const fila of pedidosCSV) {
            const { numeroPedido, proveedor, proyecto, fechaPedido, fechaEntregaEstimado, productoProveedor, cantidad, precioUnitario, referenciaProveedor, estado } = fila;

            let proveedorDB = proveedoresCache[proveedor];
            if (!proveedorDB) {
                proveedorDB = await Proveedor.findOne({ nombre: proveedor });
                if (!proveedorDB) {
                    console.log(`Proveedor no encontrado: ${proveedor}`);
                    continue;
                }
                proveedoresCache[proveedor] = proveedorDB;
            }

            let proyectoDB = proyectosCache[proyecto];
            if (!proyectoDB) {
                proyectoDB = await Proyecto.findOne({ nombre: proyecto });
                if (!proyectoDB) {
                    console.log(`Proyecto no encontrado: ${proyecto}`);
                    continue;
                }
                proyectosCache[proyecto] = proyectoDB;
            }

            let productoDB = productosCache[referenciaProveedor];
            if (!productoDB) {
                productoDB = await ProductoProveedor.findOne({ referenciaProveedor }).populate("producto");
                if (!productoDB) {
                    console.log(`ProductoProveedor no encontrado: ${referenciaProveedor}`);
                    continue;
                }
                productosCache[referenciaProveedor] = productoDB;
            }

            const cantidadNum = parseFloat(cantidad);
            const precioNum = parseFloat(precioUnitario);
            const importeBruto = cantidadNum * precioNum;
            const iva = productoDB.producto.IVA || 0;
            const totalConIVA = importeBruto * (1 + iva / 100);

            let pedidoExistente = pedidosMongo.find(p => p.numeroPedido === numeroPedido);
            if (!pedidoExistente) {
                pedidoExistente = {
                    numeroPedido,
                    proveedor: proveedorDB._id,
                    proyecto: proyectoDB._id,
                    fechaPedido: new Date(fechaPedido),
                    fechaEntregaEstimado: new Date(fechaEntregaEstimado),
                    productos: [],
                    totalBruto: 0,
                    totalConIVA: 0,
                    estado: estado || "pendiente",
                    cancelados: estado === "cancelado" ? 1 : 0
                };
                pedidosMongo.push(pedidoExistente);
            } else if (estado === "cancelado") {
                pedidoExistente.cancelados += 1;
            }

            pedidoExistente.productos.push({
                productoProveedor: productoDB._id,
                cantidad: cantidadNum,
                precioUnitario: precioNum,
                referenciaProveedor,
                importeBruto
            });

            pedidoExistente.totalBruto += importeBruto;
            pedidoExistente.totalConIVA += totalConIVA;
        }

        if (pedidosMongo.length > 0) {
            await Pedido.insertMany(pedidosMongo);
            console.log(`Se han importado ${pedidosMongo.length} pedidos`);
        } else {
            console.log("No se creó ningún pedido");
        }

    } catch (error) {
        console.error("Error al subir semilla de pedidos:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Desconectado de la BBDD");
    }
};

module.exports = { lanzarSemillaPedidos };
