const Familia = require("../models/familiaProducto");

async function generarCodigoFamilia() {
    const familias = await Familia.find().sort({ codigo: 1 });
    if (familias.length === 0) {
        return "0001";
    }

    const ultima = familias[familias.length - 1];
    const nuevoCodigo = String(parseInt(ultima.codigo) + 1).padStart(4, "0");
    return nuevoCodigo;
}

module.exports = generarCodigoFamilia;
