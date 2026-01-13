const Producto = require("../models/producto");
const ProductoProveedor = require("../models/productoProveedor");
const Proveedor = require("../models/proveedores");

const crearProductoProveedor = async (req, res) => {
    try {
        const {
            productoId,
            proveedorId,
            referenciaProveedor,
            precioUnitario,
            cantidadMinima,
            moneda
        } = req.body;

        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
                data: null,
                error: null
            });
        }

        const proveedor = await Proveedor.findById(proveedorId);
        if (!proveedor) {
            return res.status(404).json({
                success: false,
                message: "Proveedor no encontrado",
                data: null,
                error: null
            });
        }

        const existente = await ProductoProveedor.findOne({ producto: productoId, proveedor: proveedorId });
        if (existente) {
            return res.status(409).json({
                success: false,
                message: "Ya existe este producto para este proveedor",
                data: null,
                error: null
            });
        }

        if (precioUnitario === undefined || precioUnitario < 0) {
            return res.status(400).json({ success: false, message: "El precio unitario debe ser un número positivo", data: null, error: null });
        }
        if (cantidadMinima === undefined || cantidadMinima < 0) {
            return res.status(400).json({ success: false, message: "La cantidad mínima debe ser un número positivo", data: null, error: null });
        }

        const nuevoProductoProveedor = new ProductoProveedor({
            producto: productoId,
            proveedor: proveedorId,
            referenciaProveedor,
            precioUnitario,
            cantidadMinima,
            moneda
        });

        const productoProveedorDB = await nuevoProductoProveedor.save();

        await productoProveedorDB.populate("producto", "nombreProducto unidadMedida IVA sku");

        return res.status(201).json({
            success: true,
            message: "Relación producto-proveedor creada correctamente",
            data: productoProveedorDB,
            error: null
        });

    } catch (error) {
        console.error("Error al crear la relación producto-proveedor:", error);
        return res.status(500).json({
            success: false,
            message: "Error creando la relación producto-proveedor",
            data: null,
            error: error.message
        });
    }
};


const getProveedoresPorProducto = async (req, res) => {
    try {
        const { productoId } = req.params;
        const relaciones = await ProductoProveedor.find({ producto: productoId })
            .populate("proveedor", "nombre")

        res.status(200).json({
            success: true,
            message: "Proveedores obtenidos correctamente",
            data: relaciones,
            error: null
        });
        
    } catch (error) {
        console.error("Error al obtener los proveedores de este producto:", error);
        res.status(500).json({
            success: false,
            message: "Error obteniendo proveedores",
            data: null,
            error: error.message
        });
    }
};

const getProductosPorProveedor = async (req, res) => {
    try {
        const { proveedorId } = req.params;

        if (!proveedorId) {
            return res.status(400).json({
                success: false,
                message: "Falta el ID del proveedor",
                data: null,
                error: "ProveedorId no proporcionado"
            });
        }

        const relaciones = await ProductoProveedor.find({ proveedor: proveedorId })
            .populate("producto", "nombreProducto sku unidadMedida foto IVA")
            .select("referenciaProveedor precioUnitario cantidadMinima moneda");

        const relacionesConProducto = relaciones.filter(r => r.producto);

        res.status(200).json({
            success: true,
            message: "Productos obtenidos correctamente",
            data: relacionesConProducto,
            error: null
        });

    } catch (error) {
        console.error("Error al obtener productos de un proveedor:", error);
        res.status(500).json({
            success: false,
            message: "Error obteniendo productos",
            data: null,
            error: error.message
        });
    }
};

const updateProductoProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            referenciaProveedor,
            precioUnitario,
            cantidadMinima,
            moneda
        } = req.body;

        const productoProveedor = await ProductoProveedor.findById(id);
        if (!productoProveedor) {
            return res.status(404).json({
                success: false,
                message: "No se encuentra este producto para este proveedor.",
                data: null,
                error: null
            });
        }

        const datosActualizados = {};

        if (referenciaProveedor) datosActualizados.referenciaProveedor = referenciaProveedor;

        if (precioUnitario !== undefined) {
            if (precioUnitario < 0) return res.status(400).json({ success: false, message: "El precio unitario debe ser un valor positivo", data: null, error: null });
            datosActualizados.precioUnitario = precioUnitario;
        }

        if (cantidadMinima !== undefined) {
            if (cantidadMinima < 0) return res.status(400).json({ success: false, message: "La cantidad mínima debe ser un número positivo", data: null, error: null });
            datosActualizados.cantidadMinima = cantidadMinima;
        }

        if (moneda) datosActualizados.moneda = moneda;

        if (Object.keys(datosActualizados).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No se proporcionaron datos válidos para actualizar.",
                data: null,
                error: null
            });
        }

        const productoProveedorActualizado = await ProductoProveedor.findByIdAndUpdate(
            id,
            { $set: datosActualizados },
            { new: true }
        ).populate("producto", "nombreProducto unidadMedida IVA sku");

        res.status(200).json({
            success: true,
            message: "Relación producto-proveedor actualizada correctamente",
            data: productoProveedorActualizado,
            error: null
        });
    } catch (error) {
        console.error("Error al actualizar producto-proveedor:", error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar producto-proveedor.",
            data: null,
            error: error.message
        });
    }
};

const deleteProductoProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        const productoProveedor = await ProductoProveedor.findById(id);
        if (!productoProveedor) {
            return res.status(404).json({
                success: false,
                message: "No se encuentra este producto para este proveedor.",
                data: null,
                error: null
            });
        }

        await ProductoProveedor.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Relación eliminada correctamente",
            data: { id },
            error: null
        });
    } catch (error) {
        console.error("Error al eliminar producto-proveedor:", error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar producto-proveedor.",
            data: null,
            error: error.message
        });
    }
};

module.exports = {
    crearProductoProveedor, 
    getProveedoresPorProducto,
    getProductosPorProveedor,
    updateProductoProveedor,
    deleteProductoProveedor
};