const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const User = require("../../models/usuarios");
const Roles = require("../../utils/roles");

const lanzarUsuariosSemillas = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Conectado a MongoDB");

        const usuarios = [
            { email: "usuariosemilla@empresa.com", password: "123456", rol: Roles.ADMIN },
            { email: "admin@empresa.com", password: "123456", rol: Roles.ADMIN },
            { email: "compras@empresa.com", password: "123456", rol: Roles.COMPRAS },
            { email: "almacen@empresa.com", password: "123456", rol: Roles.ALMACEN },
            { email: "administracion@empresa.com", password: "123456", rol: Roles.ADMINISTRACION },
        ];

        for (const usuario of usuarios) {
            const existente = await User.findOne({ email: usuario.email });

            if (existente) {
                console.log(`El usuario '${usuario.email}' ya existe con ID: ${existente._id}`);
                continue;
            }

            const nuevoUsuario = new User(usuario);
            await nuevoUsuario.save();
            console.log(`Usuario '${usuario.email}' creado correctamente con rol '${usuario.rol}'`);
        }

    } catch (error) {
        console.error("Error al crear los usuarios semilla:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Desconectado de la base de datos");
    }
};

module.exports = { lanzarUsuariosSemillas };
