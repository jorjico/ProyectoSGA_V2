const { Router } = require("express");
const User = require("../models/usuarios");
const { generateToken } = require("../utils/jwt");
const { isAuth } = require("../middleware/autenticacion");
const bcrypt = require("bcryptjs");


const AutenticacionRoutes = Router();

AutenticacionRoutes.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Email o contraseña incorrectos" });

        const isPasswordValid = await bcrypt.compare(password, user.password); 
        if (!isPasswordValid) return res.status(401).json({ message: "Email o contraseña incorrectos" }); 

        const token = generateToken({ id: user._id, email: user.email, rol: user.rol });

        res.json({
            token,
            usuario: {
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            },
        });
    } catch (error) {
        console.error("Error en /auth/login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
    });


AutenticacionRoutes.get("/usuario", isAuth, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
    }
});

module.exports = AutenticacionRoutes;
