const Proyecto = require("../models/proyecto");
const Cliente = require("../models/cliente");
const Roles = require("../utils/roles");
const { generarNombreProyecto } = require("../utils/generarNombreProyecto");

const crearProyecto = async (req, res) => {
    try {
        if (![Roles.ADMIN, Roles.ADMINISTRACION].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para crear proyectos.",
                data: null,
                error: null
            });
        }

        const { cliente, direccionEntrega } = req.body;

        const clienteDB = await Cliente.findById(cliente);
        if (!clienteDB) {
            return res.status(404).json({
                success: false,
                message: "Cliente no encontrado.",
                data: null,
                error: null
            });
        }

        const nombre = await generarNombreProyecto();

        const proyecto = new Proyecto({
            nombre,
            cliente,
            direccionEntrega
        });

        const proyectoDB = await proyecto.save();

        res.status(201).json({
            success: true,
            message: "Proyecto creado correctamente",
            data: proyectoDB,
            error: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al crear proyecto",
            data: null,
            error: error.message
        });
    }
};

const getProyectos = async (req, res) => {
    try {
        const { q, estado, cliente, page = 1, limit = 24 } = req.query;
        const filtro = {};

        if (q) {
            filtro.nombre = { $regex: q, $options: "i" };
        }

        if (estado) {
            const estadosValidos = ["presupuesto", "aceptado", "en fabricación", "incidencia", "terminado"];
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({
                    success: false,
                    message: "Estado inválido para filtro",
                    data: null,
                    error: null
                });
            }
            filtro.estado = estado;
        }

        if (cliente) {
            filtro.cliente = cliente;
        }

        const totalProyectos = await Proyecto.countDocuments(filtro);

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const proyectos = await Proyecto.find(filtro)
            .populate("cliente", "nombre tipo")
            .sort({ createdAt: 1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.status(200).json({
            success: true,
            message: "Proyectos obtenidos correctamente",
            total: totalProyectos,
            page: pageNumber,
            limit: limitNumber,
            data: proyectos,
            error: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al obtener proyectos",
            data: null,
            error: error.message
        });
    }
};

const getProyecto = async (req, res) => {
    try {
        const { id } = req.params;

        const proyecto = await Proyecto.findById(id).populate("cliente");

        if (!proyecto) {
            return res.status(404).json({
                success: false,
                message: "Proyecto no encontrado",
                data: null,
                error: null
            });
        }

        let datosCliente;

        if ([Roles.ADMIN, Roles.ADMINISTRACION].includes(req.user.rol)) {
            datosCliente = proyecto.cliente;
        } else {
            datosCliente = {
                nombre: proyecto.cliente.nombre,
                tipo: proyecto.cliente.tipo
            };
        }

        const infoProyecto = proyecto.toObject();
        infoProyecto.cliente = datosCliente;

        res.status(200).json({
            success: true,
            message: "Proyecto obtenido correctamente",
            data: infoProyecto,
            error: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al obtener proyecto",
            data: null,
            error: error.message
        });
    }
};

const updateProyecto = async (req, res) => {
    try {
        if (![Roles.ADMIN, Roles.ADMINISTRACION].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para editar proyectos.",
                data: null,
                error: null
            });
        }

        const { id } = req.params;
        const { estado, direccionEntrega, cliente } = req.body;

        const proyecto = await Proyecto.findById(id);
        if (!proyecto) {
            return res.status(404).json({
                success: false,
                message: "Proyecto no encontrado.",
                data: null,
                error: null
            });
        }

        if (estado) {
            const estados = [ "presupuesto", "aceptado", "en fabricación", "incidencia", "terminado"];
            if (!estados.includes(estado)) {
                return res.status(400).json({
                    success: false,
                    message: "Estado inválido.",
                    data: null,
                    error: null
                });
            }
            proyecto.estado = estado;
        }


        if (direccionEntrega) proyecto.direccionEntrega = direccionEntrega;

        if (cliente) {
            const clienteDB = await Cliente.findById(cliente);
            if (!clienteDB) {
                return res.status(404).json({
                    success: false,
                    message: "Cliente no encontrado.",
                    data: null,
                    error: null
                });
            }
            proyecto.cliente = cliente;
        }

        const proyectoActualizado = await proyecto.save();

        res.status(200).json({
            success: true,
            message: "Proyecto actualizado correctamente",
            data: proyectoActualizado,
            error: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar proyecto",
            data: null,
            error: error.message
        });
    }
};

const deleteProyecto = async (req, res) => {
    try {
        if (![Roles.ADMIN, Roles.ADMINISTRACION].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para eliminar proyectos.",
                data: null,
                error: null
            });
        }

        const { id } = req.params;
        const proyecto = await Proyecto.findByIdAndDelete(id);

        if (!proyecto) {
            return res.status(404).json({
                success: false,
                message: "Proyecto no encontrado",
                data: null,
                error: null
            });
        }

        res.status(200).json({
            success: true,
            message: "Proyecto eliminado correctamente",
            data: proyecto,
            error: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar proyecto",
            data: null,
            error: error.message
        });
    }
};

module.exports = { crearProyecto, getProyectos, getProyecto, updateProyecto, deleteProyecto };
