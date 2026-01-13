const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { lanzarSemillaFamilia } = require("./familias.seeds.js");
const { lanzarSemillaProveedores } = require("./proveedores.seeds.js");
const { lanzarSemillaProductos } = require("./productos.seeds.js");
const { lanzarSemillaProductoProveedor } = require("./productoProveedor.seeds.js");
const { lanzarSemillaClientes } = require("./clientes.seeds.js");
const { lanzarSemillaProyectos } = require("./proyectos.seeds.js");
const { lanzarSemillaPedidos } = require("./pedidos.seeds.js");
const { lanzarSemillaAlbaranes } = require("./albaranes.seeds.js");
const { lanzarSemillaSalidas } = require("./salidas.seeds.js");
const { lanzarSemillaMovimientos } = require("./movimientos.seeds.js");
const { lanzarSemillaContactosProveedor } = require("./contactosProveedor.js");
const { lanzarUsuariosSemillas } = require("./usuarios.seeds.js");

const lanzarTodasSemillas = async () => {
    try {
        console.log("Iniciando la subida de semillas");

        await lanzarSemillaFamilia();
        console.log("Semilla de Familias subida");

        await lanzarSemillaProveedores();
        console.log("Semilla de Proveedores subida");

        await lanzarSemillaProductos();
        console.log("Semilla de Productos subida");

        await lanzarSemillaProductoProveedor();
        console.log("Semilla de Producto-Proveedor subida");

        await lanzarSemillaClientes();
        console.log("Semilla de Clientes subida");

        await lanzarSemillaProyectos();
        console.log("Semilla de Proyectos subida");

        await lanzarSemillaPedidos();
        console.log("Semilla de Pedidos subida");

        await lanzarUsuariosSemillas();
        console.log("Semilla de Usuarios subida");

        await lanzarSemillaAlbaranes();
        console.log("Semilla de Albaranes subida");

        await lanzarSemillaSalidas();
        console.log("Semilla de Salidas subida");

        await lanzarSemillaMovimientos();
        console.log("Semilla de Movimientos subida");

        await lanzarSemillaContactosProveedor();
        console.log("Semilla de Contactos de Proveedores subida");

        console.log("Todas las semillas se han ejecutado correctamente");

    } catch (error) {
        console.error("Error al ejecutar las semillas:", error);
    } finally {
        process.exit();
    }
};

lanzarTodasSemillas();
