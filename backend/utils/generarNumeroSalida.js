const Salida = require("../models/salida");

const generarNumeroSalida = async () => {
    const year = new Date().getFullYear();
    const yearShort = year.toString().slice(-2);

    const ultimaSalida = await Salida.findOne({
        numero: { $regex: `^SAL-${yearShort}/` }
    }).sort({ createdAt: -1 });

    let siguienteNumero = 1;

    if (ultimaSalida) {
        const numeroUltimo = ultimaSalida.numero.split('/')[1];
        siguienteNumero = parseInt(numeroUltimo, 10) + 1;
    }

    const numeroFormateado = String(siguienteNumero).padStart(5, '0');

    return `SAL-${yearShort}/${numeroFormateado}`;
};

module.exports = generarNumeroSalida;
