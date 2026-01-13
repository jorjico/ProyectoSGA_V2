function calcularCantidadAlbaran(albaran) {
    let totalPedido = 0;
    let totalRecibido = 0;

    albaran.productos.forEach(p => {
        p.diferencia = p.cantidadPedido - p.cantidadRecibida

        if (p.cantidadRecibida > p.cantidadPedido) {
            throw new Error(`La cantidad recibida del producto ${p.productoProveedor} es mayor que la pedida.`);
        }

        totalPedido += p.cantidadPedido;
        totalRecibido += p.cantidadRecibida;
    });

    albaran.cantidadPedido = totalPedido;
    albaran.cantidadRecibida = totalRecibido;
    albaran.cantidadPendiente = totalPedido - totalRecibido;

    if (albaran.cantidadPendiente === 0) {
        albaran.estado = "recibido";
    } else {
        albaran.estado = "pendiente";
    }

    return albaran;
}

module.exports = calcularCantidadAlbaran;
