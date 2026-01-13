const { Router } = require('express');
const { isAuth, isAdmin } = require('../middleware/autenticacion');
const { registerUser, loginUser, getUsers, getUser, updateUser, deleteUser } = require('../controllers/usuarios');

const usuarioRoutes = Router();

usuarioRoutes.post("/register", isAuth, isAdmin, registerUser);
usuarioRoutes.post("/login", loginUser);
usuarioRoutes.get("/", isAuth, isAdmin, getUsers);
usuarioRoutes.get("/:id", isAuth, isAdmin, getUser);
usuarioRoutes.put("/:id", isAuth, isAdmin, updateUser);
usuarioRoutes.delete("/:id", isAuth, isAdmin, deleteUser); 

module.exports = usuarioRoutes;