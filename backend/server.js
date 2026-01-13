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

const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5175",
  "https://tu-frontend.vercel.app" // pon aquí la URL de Vercel cuando despliegues
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `La política de CORS bloqueó el origen: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
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
  console.log(`Servidor funcionando en http://localhost:${PORT}`)
);
