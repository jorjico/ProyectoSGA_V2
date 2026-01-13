const Producto = require("../models/producto");
const { deleteFile } = require("../utils/deleteFiles");
const cloudinary = require('cloudinary').v2;
const Roles = require('../utils/roles');
const ProductoProveedor = require("../models/productoProveedor");
const generarSKU = require("../utils/generarSKU");
const Movimiento = require("../models/movimiento");


const crearProducto = async (req, res) => {
    try {
        const { familia, nombreProducto, foto, IVA, unidadMedida } = req.body;

        const resultadoSKU = await generarSKU(familia);

        if(!resultadoSKU.success) {
            return res.status(400).json({
                success: false,
                message: resultadoSKU.message,
                data: null,
                error: null
            });
        }

        const nSKU = resultadoSKU.sku;

        const productoExiste = await Producto.findOne({ sku: nSKU });
        if (productoExiste) {
            return res.status(400).json({
                success: false,
                message: "El producto ya existe",
                data: null,
                error: null
            });
        }

        const nuevoProducto = new Producto({
            sku: nSKU,
            familia,
            nombreProducto,
            foto,
            proveedores: [],
            IVA, 
            unidadMedida 
        });

        if (req.file) {
            nuevoProducto.foto = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        const productoDB = await nuevoProducto.save();

        return res.status(201).json({
            success: true,
            data: productoDB, 
            error: null
        });

    } catch (error) {
        console.error("Error al crear producto:", error);
        return res.status(400).json({
            success: false,
            message: "Error creando el producto",
            data: null,
            error: error.message
        });
    } 
};

const getProductos = async (req, res) => {
    try {
        const {familia, nombreProducto, pagina = 1, limite = 24} = req.query;

        const filtro = {};

        if (familia) {
            filtro.familia = familia;
        }

        if (nombreProducto) {
            const palabrasFiltroNombre = nombreProducto.split(' ').filter(palabra => palabra.trim() !== '');
            filtro.$and = palabrasFiltroNombre.map(palabra => ({
                nombreProducto: { $regex: palabra, $options: 'i' }
            }));            
        }

        const skip = (pagina - 1) * limite;

        const total = await Producto.countDocuments(filtro);

        const productos = await Producto.find(filtro)
            .collation({ locale: 'es', strength: 1 })
            .sort({ nombreProducto: 1 })
            .skip(skip)
            .limit(Number(limite))
            .populate("familia", "codigo nombre");

        res.status(200).json({
            success: true,
            data: productos,
            total,
            pagina: Number(pagina),
            limite: Number(limite),
            error: null
        });

    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener productos",
            data: null,
            error: error.message});
    }
};

const getProductoBySku = async (req, res) => {
    const { sku } = req.params;

    try {
        const producto = await Producto.findOne({ sku }).populate("familia", "codigo nombre");

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
                data: null,
                error: null
            });
        }

        const proveedores = await ProductoProveedor.find({ producto: producto._id })
            .populate("proveedor", "nombre CIF direccion codigoPostal pais condicionesPago diasTiempoEntrega");

        res.status(200).json({
            success: true,
            data: { ...producto.toObject(), proveedores },
            error: null
        });

    } catch (error) {
        console.error("Error interno buscando producto por SKU:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener el producto por SKU",
            data: null,
            error: error.message
        });
    }
};

const updateProducto = async (req, res) => {
    try {
        const { sku } = req.params;
        const producto = await Producto.findOne({ sku });

        if (!producto) {
            return res.status(404).json({ 
                success: false,
                message: "Producto no encontrado",
                data: null,
                error: null
            });
        }

        if (![Roles.ADMIN, Roles.COMPRAS].includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para modificar este producto",
                data: null,
                error: null
            });
        }

        if (req.body.unidadMedida !== undefined && req.body.unidadMedida.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "La unidad de medida no puede estar vacía",
                data: null,
                error: null
            });
        }


        const allowedFields = ["nombreProducto", "IVA", "unidadMedida", "familia"];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) producto[field] = req.body[field];
        });

        if (req.file && req.file.path) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "SGA" });

            if (producto.foto?.public_id) {
                await deleteFile(producto.foto.public_id);
            }

            producto.foto = {
                url: result.secure_url,
                public_id: result.public_id
            };
        }

        const productoActualizado = await producto.save();

        return res.status(200).json({
            success: true,
            message: "Producto actualizado correctamente",
            data: productoActualizado, 
            error: null
        });

    } catch (error) {
        console.error("Error actualizando producto:", error);
        return res.status(500).json({
            success: false,
            message: "No se pudo actualizar el producto",
            data: null,
            error: error.message });
    }
};

const deleteProducto = async (req, res) => {
    try {
        const { sku } = req.params;

        if (![Roles.ADMIN, Roles.COMPRAS].includes(req.user.rol)) {
            return res.status(403).json({ 
                success: false,
                message: "No tienes permiso para eliminar este producto",
                data: null,
                error: null
            });
        }

        const producto = await Producto.findOneAndDelete({ sku });
        if (!producto) {
            return res.status(404).json({ 
                success: false,
                message: "Producto no encontrado",
                data: null,
                error: null
            });
        }

        if (producto.foto?.public_id) {
            await deleteFile(producto.foto.public_id);
        }

        return res.status(200).json({
            success: true,
            message: "Producto eliminado correctamente",
            producto, 
            error: null
        });

    } catch (error) {
        console.error("Error eliminando producto:", error);
        return res.status(500).json({
            success: false,
            message: "No se pudo eliminar el producto",
            data: null,
            error: error.message });
    }
};

const getStockProducto = async (req, res) => {
    try {
        const { sku } = req.params;

        const result = await Movimiento.aggregate([
        { $match: { sku } },
        {
            $group: {
                _id: "$sku",
                stock: {
                    $sum: {
                        $cond: [
                            { $eq: ["$tipo", "entrada"] },
                            "$cantidad",
                            { $multiply: ["$cantidad", -1] }
                        ]
                    }
                }
            }
        }
        ]);

        const stock = result.length > 0 ? result[0].stock : 0;

        res.status(200).json({
            success: true,
            message: "Stock calculado correctamente",
            data: { sku, stock },
            error: null
        });

    } catch (error) {
        console.error("Error calculando stock:", error);
        res.status(500).json({
            success: false,
            message: "Error calculando stock",
            data: null,
            error: error.message
        });
    }
};

module.exports = { crearProducto, getProductos, getProductoBySku, updateProducto, deleteProducto, getStockProducto };
