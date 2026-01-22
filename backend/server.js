require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/bbdd");

const albaranesRoutes = require("./routes/albaran");
const clienteRoutes = require("./routes/cliente");
const contactoProveedorRoutes = require("./routes/contactoProveedor");
const familiaRoutes = require("./routes/familiaProducto");
const movimientoRoutes = require("./routes/movimientos");
const pedidoRoutes = require("./routes/pedido");
const productoRoutes = require("./routes/producto");
const productoProveedorRoutes = require("./routes/productoProveedor");
const proveedorRoutes = require("./routes/proveedor");
const proyectoRoutes = require("./routes/proyecto");
const salidaRoutes = require("./routes/salida");
const usuarioRoutes = require("./routes/usuarios");
const autenticacion = require("./routes/Autenticacion");

const app = express();

connectDB();

app.use(express.json());
/*app.use(cors({
  origin: process.env.FRONTEND_URL
}));*/

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : [];

app.use(cors({
  origin: allowedOrigins
}));

app.use("/api/albaranes", albaranesRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/contactos-proveedores", contactoProveedorRoutes);
app.use("/api/familias", familiaRoutes);
app.use("/api/movimientos", movimientoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/producto-proveedor", productoProveedorRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/salidas", salidaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auth", autenticacion);

app.get("/", (req, res) => {
  res.send("Backend funcionando correctamente");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`Servidor funcionando en el puerto: ${PORT}`)
);
