const ContactoProveedor = require("../models/contactoProveedor");
const Proveedor = require("../models/proveedores");
const Roles = require("../utils/roles");

const createContactoProveedor = async (req, res) => {
    try {
        const { nombre, cargo, telefono, email, proveedor } = req.body;

        const contactoProveedorExiste = await ContactoProveedor.findOne({ email });
        if (contactoProveedorExiste) {
            return res.status(409).json({
                success: false,
                message: "El contacto ya existe",
                data: null,
                error: null
            });
        }

        const proveedorDB = await Proveedor.findById(proveedor);
        if (!proveedorDB) {
            return res.status(404).json({
                success: false,
                message: "Proveedor no encontrado",
                data: null,
                error: null
            });
        }

        const nuevoContactoProveedor = new ContactoProveedor({
            nombre,
            cargo,
            telefono,
            email,
            proveedor: proveedorDB._id
        });

        const contactoProveedorDB = await nuevoContactoProveedor.save();
        return res.status(201).json({
            success: true,
            data: contactoProveedorDB,
            error: null
        });
    } catch (error) {
        console.error("Error al crear contacto de proveedor:", error);
        return res.status(400).json({
            success: false,
            message: "Error creando el contacto de proveedor",
            data: null,
            error: error.message
        });
    }
};

const getContactoProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false, 
                message: "No hay contacto con el id indicado", 
                data: null, 
                error: null
            });
        }

        const contactoProveedor = await ContactoProveedor.findById(id)
            .populate("proveedor", "nombre");

        if (!contactoProveedor) {
            return res.status(404).json({
                success: false, 
                message: "Contacto de proveedor no encontrado",
                data: null, 
                error: null
            });
        }

        res.status(200).json({
            success: true,
            data: contactoProveedor, 
            error: null
        });

    } catch (error) {
        console.error("Error al obtener contacto de proveedor:", error);
        res.status(500).json({
            success: false, 
            message: "Error al obtener contacto de proveedor",
            data: null,
            error: error.message
        });
    }
};

const getContactosProveedores = async (req, res) => {
    try {
        const { nombre, email, proveedorCIF, proveedorId  } = req.query;
        const filtro = {};

        if (nombre) {
            const palabrasFiltroNombre = nombre.split(' ').filter(palabra => palabra.trim() !== '');
            filtro.$and = palabrasFiltroNombre.map(palabra => ({
                nombre: { $regex: palabra, $options: 'i' }
            }));            
        }

        if (email) {
            filtro.email = { $regex: `^${email}$`, $options: 'i' };
        }

        if (proveedorCIF) {
            const proveedor = await Proveedor.findOne({ CIF: proveedorCIF });
            if (proveedor) {
                filtro.proveedor = proveedor._id;
            } else {
                return res.status(404).json({
                    success: false, 
                    message: "Proveedor no encontrado para el CIF proporcionado", 
                    data: null, 
                    error: null
                });
            }
        }

        if (proveedorId) {
            filtro.proveedor = proveedorId;
        }

        const contactosProveedores = await ContactoProveedor.find(filtro).populate("proveedor", "nombre");
        res.status(200).json({
            success: true,
            message: "Contactos de proveedores obtenidos correctamente",
            data: contactosProveedores, 
            error: null     
        });
    } catch (error) {
        console.error("Error al obtener contactos de proveedores:", error);
        res.status(500).json({
            success: false, 
            message: "Error al obtener contactos de proveedores",
            data: null, 
            error: error.message
        });
    }
};

const updateContactoProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, cargo, telefono, email } = req.body;

        const contactoProveedor = await ContactoProveedor.findById(id);
        if (!contactoProveedor) {
            return res.status(404).json({
                success: false, 
                message: "Contacto no encontrado", 
                data: null, 
                error: null
            });
        }

        if (email && email !== contactoProveedor.email) {
            const existeEmail = await ContactoProveedor.findOne({ email });
            if (existeEmail) {
                return res.status(409).json({
                    success: false, 
                    message: "El email ya está en uso por otro contacto",
                    data: null, 
                    error: null
                });
            }
        }

        const datosActualizados = {};
        if (nombre) datosActualizados.nombre = nombre;
        if (cargo) datosActualizados.cargo = cargo;
        if (telefono) datosActualizados.telefono = telefono;
        if (email) datosActualizados.email = email;

        if (Object.keys(datosActualizados).length === 0) {
            return res.status(400).json({
                success: false, 
                message: "No se proporcionaron datos válidos para actualizar", 
                data: null, 
                error: null
            });
        }

        const contactoProveedorActualizado = await ContactoProveedor.findByIdAndUpdate(
            id,
            { $set: datosActualizados },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Contacto actualizado correctamente",
            data: contactoProveedorActualizado, 
            error: null
        });

    } catch (error) {
        console.error("Error al actualizar contacto de proveedor:", error);
        return res.status(400).json({
            success: false, 
            message: "Error actualizando el contacto de proveedor",
            data: null, 
            error: error.message
        });
    }
};

const deleteContactoProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.rol !== Roles.ADMIN) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para eliminar este contacto.",
                data: null,
                error: null
            });
        }

        const contactoProveedor = await ContactoProveedor.findByIdAndDelete(id);

        if (!contactoProveedor) {
            return res.status(404).json({
                success: false,
                message: "Contacto no encontrado",
                data: null,
                error: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contacto eliminado correctamente",
            data: contactoProveedor,
            error: null
        });

    } catch (error) {
        console.error("Error al eliminar contacto de proveedor:", error);
        return res.status(400).json({
            success: false,
            message: "Error eliminando el contacto de proveedor",
            data: null,
            error: error.message
        });
    }
};

module.exports = { 
    createContactoProveedor,
    getContactoProveedor,
    getContactosProveedores,
    updateContactoProveedor,
    deleteContactoProveedor
};


