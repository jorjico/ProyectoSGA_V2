const User = require("../models/usuarios");
const { verifyToken } = require("../utils/jwt");
const Roles = require("../utils/roles");

const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Falta token en la cabecera Authorization" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token);
        if (!decoded || !decoded.email) {
            return res.status(401).json({ message: "Token inválido" });
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(401).json({ message: "El usuario asociado ya no existe" });
        }

        const userObj = user.toObject();
        delete userObj.password;

        req.user = userObj;

        next();
    } catch (error) {
        return res.status(401).json({ message: "No estás autorizado" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.rol !== Roles.ADMIN) {
        return res.status(403).json({ message: "Solo usuarios con rol admin" });
    }
    next();
};

const isRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ message: "No tienes permiso para realizar esta acción" });
        }
        next();
    };
};

module.exports = { isAuth, isAdmin, isRol };

