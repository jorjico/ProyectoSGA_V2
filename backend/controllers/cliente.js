const Cliente = require("../models/cliente");
const Proyecto = require("../models/proyecto");
const Roles = require("../utils/roles");

const crearCliente = async (req, res) => {
    try {
        if (![Roles.ADMIN, Roles.ADMINISTRACION].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para crear clientes.",
                data: null,
                error: null
            });
        }

        const cliente = new Cliente(req.body);
        const clienteDB = await cliente.save();

        res.status(201).json({
            success: true,
            message: "Cliente creado correctamente",
            data: clienteDB,
            error: null
        });

    } catch (error) {
        console.error(error);

        let mensajeError = "Error al crear cliente";

        if (error.code === 11000) {
            const datoDuplicado = Object.keys(error.keyPattern)[0];
            mensajeError = `Ya existe un cliente con ese ${datoDuplicado}`;
        }

        res.status(500).json({
            success: false,
            message: mensajeError,
            data: null,
            error: error.message
        });
    }
};

const getClientes = async (req, res) => {
    try {
        const { q = "", page = 1, limit = 20 } = req.query;
        const filtro = {};

        if (q) filtro.nombre = { $regex: q, $options: 'i' };

        if (req.query.activo) filtro.activo = req.query.activo === "true";

        let clientesConsulta;

        if ([Roles.ADMIN, Roles.ADMINISTRACION].includes(req.user.rol)) {
            clientesConsulta = Cliente.find(filtro);
        } else {
            clientesConsulta = Cliente.find(filtro).select('nombre tipo activo');
        }

        const totalClientes = await clientesConsulta.clone().countDocuments();

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const clientes = await clientesConsulta
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.status(200).json({
            success: true,
            message: "Clientes obtenidos correctamente",
            total: totalClientes,
            page: pageNumber,
            limit: limitNumber, 
            data: clientes,
            error: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al obtener clientes",
            data: null,
            error: error.message
        });
    }
};

const getCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: "Cliente no encontrado",
                data: null,
                error: null
            });
        }

        let clienteData = cliente;

        if (![Roles.ADMIN, Roles.ADMINISTRACION].includes(req.user.rol)) {
            clienteData = {
                _id: cliente._id,
                nombre: cliente.nombre,
                tipo: cliente.tipo,
                activo: cliente.activo,
            };
        }

        res.status(200).json({
            success: true,
            message: "Cliente obtenido correctamente",
            data: clienteData,
            error: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al obtener cliente",
            data: null,
            error: error.message
        });
    }
};

const updateCliente = async (req, res) => {
    try {
        if (![Roles.ADMIN, Roles.ADMINISTRACION].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para editar clientes.",
                data: null,
                error: null
            });
        }

        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: "Cliente no encontrado",
                data: null,
                error: null
            });
        }

        const { tipo, NIF, CIF, ...resto } = req.body;

        if (tipo && tipo !== cliente.tipo) {
            if (tipo === 'persona' && !NIF) {
                return res.status(400).json({
                    success: false,
                    message: "Al cambiar de 'empresa' a 'persona' se debe proporcionar un NIF",
                    data: null,
                    error: null
                });
            }
            if (tipo === 'empresa' && !CIF) {
                return res.status(400).json({
                    success: false,
                    message: "Al cambiar de 'persona' a 'empresa' se debe proporcionar un CIF",
                    data: null,
                    error: null
                });
            }
            cliente.tipo = tipo;
        }

        if (NIF) cliente.NIF = NIF;
        if (CIF) cliente.CIF = CIF;

        Object.assign(cliente, resto);

        const clienteActualizado = await cliente.save();

        res.status(200).json({
            success: true,
            message: "Cliente actualizado correctamente",
            data: clienteActualizado,
            error: null
        });

    } catch (error) {
        console.error(error);

        let mensajeError = "Error al actualizar cliente";

        if (error.code === 11000) {
            const datoDuplicado = Object.keys(error.keyPattern)[0];
            mensajeError = `Ya existe un cliente con ese ${datoDuplicado}`;
        }

        res.status(500).json({
            success: false,
            message: mensajeError,
            data: null,
            error: error.message
        });
    }
};

const deleteCliente = async (req, res) => {
    try {
        if (![Roles.ADMIN, Roles.ADMINISTRACION].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para eliminar clientes.",
                data: null,
                error: null
            });
        }

        const clienteId = req.params.id;

        const proyectosCliente = await Proyecto.findOne({ cliente: clienteId });
        if (proyectosCliente) {
            return res.status(400).json({
                success: false,
                message: "No se puede eliminar el cliente porque tiene proyectos asociados.",
                data: null,
                error: null
            });
        }

        const cliente = await Cliente.findByIdAndDelete(clienteId);
        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: "Cliente no encontrado",
                data: null,
                error: null
            });
        }

        res.status(200).json({
            success: true,
            message: "Cliente eliminado correctamente",
            data: cliente,
            error: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar cliente",
            data: null,
            error: error.message
        });
    }
};

module.exports = { crearCliente, getClientes, getCliente, updateCliente, deleteCliente };
