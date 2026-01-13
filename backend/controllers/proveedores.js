const ContactoProveedor = require('../models/contactoProveedor');
const Proveedor = require('../models/proveedores');
const Roles = require('../utils/roles');

const createProveedor = async (req, res) => {
    try {
        if (![Roles.ADMIN, Roles.COMPRAS, Roles.ADMINISTRACION].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para crear un proveedor",
                data: null,
                error: null
            });
        }

        const { nombre, CIF, direccion, codigoPostal, pais, condicionesPago, diasTiempoEntrega } = req.body;

        const proveedorExiste = await Proveedor.findOne({ CIF });
        if (proveedorExiste) {
            return res.status(400).json({
                success: false,
                message: "El proveedor ya existe",
                data: null,
                error: null
            });
        }

        const nuevoProveedor = new Proveedor({
            nombre,
            CIF,
            direccion,
            codigoPostal,
            pais,
            condicionesPago,
            diasTiempoEntrega
        });

        const proveedorDB = await nuevoProveedor.save();
        return res.status(201).json({
            success: true,
            message: "Proveedor creado correctamente",
            data: proveedorDB,
            error: null
        });

    } catch (error) {
        console.error("Error al crear proveedor:", error);
        return res.status(500).json({
            success: false,
            message: "Error creando el proveedor",
            data: null,
            error: error.message
        });
    }
};

const getProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).json({
            success: false,
            message: "No se proporcionó id de proveedor",
            data: null,
            error: null
        });

        const proveedor = await Proveedor.findById(id);
        
        if (!proveedor) {
            return res.status(404).json({
                success: false,
                message: "Proveedor no encontrado",
                data: null,
                error: null
            });
        }

        const contactos = await ContactoProveedor.find({ proveedor: proveedor._id }, "nombre cargo telefono email");

        res.status(200).json({
            success: true,
            message: "Proveedor obtenido correctamente",
            data: { proveedor, contactos },
            error: null
        });

    } catch (error) {
        console.error("Error al obtener proveedor:", error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener proveedor",
            data: null,
            error: error.message
        });
    }
};

const getProveedores = async (req, res) => {
    try {
        const { q, CIF, activo, condicionesPago } = req.query;
        const filtro = {};

        if (q) {
            filtro.nombre = { $regex: q, $options: 'i' };
        }

        if (CIF) filtro.CIF = CIF;
        if (activo !== undefined) filtro.activo = activo === 'true';
        if (condicionesPago) filtro.condicionesPago = condicionesPago;

        const proveedores = await Proveedor.find(filtro).sort({ nombre: 1 });
        
        res.status(200).json({
            success: true,
            message: "Proveedores obtenidos correctamente",
            data: proveedores,
            error: null
        });

    } catch (error) {
        console.error("Error al obtener proveedores:", error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener proveedores",
            data: null,
            error: error.message
        });
    }
};


const updateProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            direccion,
            codigoPostal,
            pais,
            condicionesPago,
            diasTiempoEntrega,
            activo
        } = req.body;

        const proveedor = await Proveedor.findById(id);
        if (!proveedor) {
            return res.status(404).json({
                success: false,
                message: "Proveedor no encontrado",
                data: null,
                error: null
            });
        }

        if (![Roles.ADMIN, Roles.COMPRAS, Roles.ADMINISTRACION].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para modificar un proveedor",
                data: null,
                error: null
            });
        }

        if (condicionesPago && !["transferencia", "cheque", "domiciliacion", "tarjeta", "efectivo"].includes(condicionesPago)) {
            return res.status(400).json({
                success: false,
                message: "Condición de pago no válida",
                data: null,
                error: null
            });
        }

        const datosActualizados = {};

        if (req.user.rol === Roles.ADMINISTRACION && condicionesPago) {
            datosActualizados.condicionesPago = condicionesPago;
        }

        if ([Roles.ADMIN, Roles.COMPRAS].includes(req.user.rol)) {
            if (nombre) datosActualizados.nombre = nombre;
            if (direccion) datosActualizados.direccion = direccion;
            if (codigoPostal) datosActualizados.codigoPostal = codigoPostal;
            if (pais) datosActualizados.pais = pais;
            if (diasTiempoEntrega) datosActualizados.diasTiempoEntrega = diasTiempoEntrega;
            if (activo !== undefined) datosActualizados.activo = activo;
        }

        if (Object.keys(datosActualizados).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No se proporcionaron datos válidos para actualizar",
                data: null,
                error: null
            });
        }

        const proveedorActualizado = await Proveedor.findByIdAndUpdate(id, { $set: datosActualizados }, { new: true });

        res.status(200).json({
            success: true,
            message: "Proveedor actualizado correctamente",
            data: proveedorActualizado,
            error: null
        });

    } catch (error) {
        console.error("Error al actualizar proveedor:", error);
        return res.status(500).json({
            success: false,
            message: "Error actualizando el proveedor",
            data: null,
            error: error.message
        });
    }
};

const deleteProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.rol !== Roles.ADMIN) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para eliminar un proveedor.",
                data: null,
                error: null
            });
        }
        
        const proveedor = await Proveedor.findByIdAndDelete(id);
        if (!proveedor) {
            return res.status(404).json({
                success: false,
                message: "Proveedor no encontrado",
                data: null,
                error: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Proveedor eliminado correctamente",
            data: proveedor,
            error: null
        });

    } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        return res.status(500).json({
            success: false,
            message: "Error eliminando el proveedor",
            data: null,
            error: error.message
        });
    }
};

const getResumenProveedor = async (req, res) => {
    try {
        const proveedores = await Proveedor.find({ activo: true }, { nombre: 1, CIF: 1, _id: 0 });
        res.status(200).json({
            success: true,
            message: "Resumen de proveedores obtenido correctamente",
            data: proveedores,
            error: null
        });
    } catch (error) {
        console.error("Error al obtener proveedores resumen:", error);
        return res.status(500).json({
            success: false,
            message: "Error obteniendo proveedores resumen",
            data: null,
            error: error.message
        });
    }
};

module.exports = { createProveedor, getProveedor, getProveedores, updateProveedor, deleteProveedor, getResumenProveedor };
