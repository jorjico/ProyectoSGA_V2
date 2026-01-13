const User = require("../models/usuarios");
const bcrypt = require('bcrypt'); 
const { generateToken } = require("../utils/jwt");
const Roles = require("../utils/roles");

const registerUser = async (req, res) => {
    try {
        const { id, email, password, rol } = req.body;

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "El usuario ya existe",
                data: null,
                error: null
            });
        }

        const user = new User({ id, email, password, rol });
        const userDB = await user.save();

        return res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente",
            data: userDB,
            error: null
        });

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return res.status(500).json({
            success: false,
            message: "Error registrando al usuario",
            data: null,
            error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Recuerda poner el usuario y la contraseña",
                data: null,
                error: null
            });
        }

        const user = await User.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({
                success: false,
                message: "Usuario o contraseña incorrectos",
                data: null,
                error: null
            });
        }

        const token = generateToken(user._id);
        return res.status(200).json({
            success: true,
            message: "Login exitoso",
            data: { user, token },
            error: null
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({
            success: false,
            message: "Error en el login",
            data: null,
            error: error.message
        });
    }
};

const getUsers = async (req, res) => {
    try {
        if (req.user.rol !== Roles.ADMIN) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para acceder a los usuarios",
                data: null,
                error: null
            });
        }

        const { pagina = 1, limite = 24, email } = req.query;
        const page = parseInt(pagina, 10) || 1;
        const limit = parseInt(limite, 10) || 24;

        const filtro = {};

        if (email) {
            filtro.email = { $regex: email, $options: "i" };
        }

        const total = await User.countDocuments(filtro);
 
        const users = await User.find(filtro)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ email: 1 });

        return res.status(200).json({
            success: true,
            message: "Usuarios obtenidos correctamente",
            data: users,
            total,
            pagina: page,
            limite: limit,
            hayMas: page * limit < total,
            error: null
        });

    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener el listado de usuarios",
            data: null,
            error: error.message
        });
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.rol !== Roles.ADMIN) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para acceder a este usuario",
                data: null,
                error: null
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
                data: null,
                error: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Usuario obtenido correctamente",
            data: user,
            error: null
        });

    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return res.status(500).json({
            success: false,
            message: "No se ha podido encontrar el usuario",
            data: null,
            error: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.rol !== Roles.ADMIN) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para modificar este usuario",
                data: null,
                error: null
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
                data: null,
                error: null
            });
        }

        const { email, password, rol } = req.body;
        const updatedFields = {};
        const cambios = [];

       if (email && email !== user.email) {
            updatedFields.email = email;
            cambios.push("email");
        }

        if (rol && rol !== user.rol) {
            if (!Object.values(Roles).includes(rol)) {
                return res.status(400).json({
                    success: false,
                    message: "Rol no válido",
                    data: null,
                    error: null
                });
            }
            updatedFields.rol = rol;
            cambios.push("rol");
        }

        if (password) {
            updatedFields.password = bcrypt.hashSync(password, 10);
            cambios.push("password");
        }

        if (cambios.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No se han proporcionado datos válidos para actualizar",
                data: null,
                error: null
            });
        }

        const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });

        return res.status(200).json({
            success: true,
            message: `Usuario actualizado correctamente: ${cambios.join(", ")}`,
            data: updatedUser,
            error: null
        });

    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return res.status(500).json({
            success: false,
            message: "No se ha podido actualizar el usuario",
            data: null,
            error: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.rol !== Roles.ADMIN) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para eliminar este usuario",
                data: null,
                error: null
            });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
                data: null,
                error: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado correctamente",
            data: user,
            error: null
        });

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return res.status(500).json({
            success: false,
            message: "No se ha podido eliminar el usuario",
            data: null,
            error: error.message
            
        });
    }
};

module.exports = { registerUser, loginUser, getUsers, getUser, updateUser, deleteUser };