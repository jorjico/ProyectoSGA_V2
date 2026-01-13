const Pedido = require("../models/pedido");

const generarNumeroPedido = async () => {
    const year = new Date().getFullYear();

    const pedidos = await Pedido.find({
        numeroPedido: { $regex: `^PED/${year}/` }
    });

    let maxNumero = 0;

    pedidos.forEach(pedido => {
        const partes = pedido.numeroPedido.split('/');
        const num = parseInt(partes[2], 10);
        if (num > maxNumero) maxNumero = num;
    });

    const siguienteNumero = maxNumero + 1;
    const numeroFormateado = String(siguienteNumero).padStart(4, '0');

    return `PED/${year}/${numeroFormateado}`;
};

module.exports = generarNumeroPedido;
