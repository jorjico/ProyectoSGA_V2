const Producto = require("../models/producto");

const calcularTotalProductosFamilia = async (familiaId) => {
    const total = await Producto.countDocuments({ familia: familiaId });
    return total
};

module.exports = calcularTotalProductosFamilia;