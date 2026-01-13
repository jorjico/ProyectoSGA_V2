const Albaran = require("../models/albaran");

const generarNumeroAlbaran = async () => {
    const year = new Date().getFullYear();
    const yearShort = year.toString().slice(-2);

    let siguienteNumero = 1;
    let numeroFormateado = '';
    let numeroCompleto = '';

    while (true) {
        numeroFormateado = String(siguienteNumero).padStart(5, '0');
        numeroCompleto = `ALB-${yearShort}/${numeroFormateado}`;

        const existe = await Albaran.findOne({ numero: numeroCompleto });
        if (!existe) break;
        siguienteNumero++;
    }

    return numeroCompleto;
}

module.exports = generarNumeroAlbaran;
