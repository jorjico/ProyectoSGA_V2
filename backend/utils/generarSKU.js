const Producto = require("../models/producto");
const Familia = require("../models/familiaProducto");

async function generarSKU(familiaId) {
    const familia = await Familia.findById(familiaId);
    if (!familia) {
        return {
            success: false,
            message: "La familia indicada no existe"
        };
    }

    const ultimoProducto = await Producto
        .findOne({ familia: familiaId })
        .sort({ sku: -1 })
        .select("sku");

    if (!ultimoProducto) {
        return {
            success: true,
            sku: `${familia.codigo}.0001`
        };
    }


    const prodCodigo = ultimoProducto.sku.split(".")[1];

    const nuevoProdCodigo = String(parseInt(prodCodigo) + 1).padStart(4, "0");

    return {
        success: true,
        sku: `${familia.codigo}.${nuevoProdCodigo}`
    } 
}

module.exports = generarSKU;


