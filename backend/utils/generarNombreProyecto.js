const Proyecto = require("../models/proyecto");

const generarNombreProyecto = async () => {
    const year = new Date().getFullYear().toString().slice(-2);

    const proyectosDelAño = await Proyecto.find({ nombre: new RegExp(`^OF-${year}/`) });

    let maxNum = 0;
    proyectosDelAño.forEach(p => {
        const match = p.nombre.match(/\/(\d{4})$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
        }
    });

    const siguienteProyecto = maxNum + 1;

    return `OF-${year}/${String(siguienteProyecto).padStart(4, '0')}`;
};

module.exports = { generarNombreProyecto }

