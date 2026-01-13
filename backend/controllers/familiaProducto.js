const Familia = require("../models/familiaProducto");
const Producto = require("../models/producto");
const calcularTotalProductosFamilia = require("../utils/calcularTotalProductosFamilia");
const generarCodigoFamilia = require("../utils/generarCodigoFamilia");

const crearFamilia = async (req, res) => {
    try {
        const { nombre } = req.body;

        const existe = await Familia.findOne({ nombre });
        if (existe) {
            return res.status(400).json({
                success: false,
                message: "La familia ya existe",
                data: null,
                error: null
            });
        }

        const codigo = await generarCodigoFamilia();

        const nuevaFamilia = new Familia({ codigo, nombre });
        const familiaDB = await nuevaFamilia.save();

        res.status(201).json({
            success: true,
            data: familiaDB,
            error: null
        });

    } catch (error) {
        console.error("Error al crear familia:", error);
        res.status(500).json({
            success: false,
            message: "Error al crear familia",
            data: null,
            error: error.message
        });
    }
};

const getFamilias = async (req, res) => {
    try {
        const q = req.query.q || "";
        const familias = await Familia.find({ nombre: { $regex: q, $options: "i" } });

        const familiasConTotal = await Promise.all(
            familias.map(async (f) => {
                const totalProductos = await calcularTotalProductosFamilia (f._id);
                return { ...f.toObject(), totalProductos };
            })
        );

        res.status(200).json({
            success: true,
            data: familiasConTotal,
            error: null
        });

    } catch (error) {
        console.error("Error al obtener familias:", error);

        res.status(500).json({
            success: false,
            message: "Error al obtener familias",
            data: null,
            error: error.message
        });
    }
};

const getFamiliaById = async (req, res) => {
    try {
        const { id } = req.params;

        const familia = await Familia.findById(id);
        if (!familia) {
            return res.status(404).json({
                success: false,
                message: "Familia no encontrada",
                data: null,
                error: null
            });
        }

        const productos = await Producto.find({ familia: id })
            .populate("familia", "nombre codigo");

        res.status(200).json({
            success: true,
            data: {
                familia,
                productos
            },
            error: null
        });

    } catch (error) {
        console.error("Error al obtener familia:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener familia",
            data: null,
            error: error.message
        });
    }
};

const updateFamilia = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const familia = await Familia.findById(id);
        if (!familia) {
            return res.status(404).json({
                success: false,
                message: "Familia no encontrada",
                data: null,
                error: null
            });
        }

        const existe = await Familia.findOne({
            nombre,
            _id: { $ne: id }
        });

        if (existe) {
            return res.status(400).json({
                success: false,
                message: "Ya existe una familia con ese nombre",
                data: null,
                error: null
            });
        }

        familia.nombre = nombre;
        await familia.save();

        res.status(200).json({
            success: true,
            data: familia,
            error: null
        });

    } catch (error) {
        console.error("Error al actualizar familia:", error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar familia",
            data: null,
            error: error.message
        });
    }
};

const deleteFamilia = async (req, res) => {
    try {
        const { id } = req.params;

        const familia = await Familia.findById(id);
        if (!familia) {
            return res.status(404).json({
                success: false,
                message: "Familia no encontrada",
                data: null,
                error: null
            });
        }

        const productosAsociados = await Producto.findOne({ familia: id });
        if (productosAsociados) {
            return res.status(400).json({
                success: false,
                message: "No se puede eliminar la familia porque está asignada a uno o más productos",
                data: null,
                error: null
            });
        }

        await Familia.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Familia eliminada correctamente",
            data: familia,
            error: null
        });
    } catch (error) {
        console.error("Error al eliminar familia:", error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar familia",
            data: null,
            error: error.message
        });
    }
};

module.exports = { crearFamilia, getFamilias, getFamiliaById, updateFamilia, deleteFamilia };
