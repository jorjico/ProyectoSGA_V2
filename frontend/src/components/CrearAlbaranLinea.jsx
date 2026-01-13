import { Tr, Td, Input } from "@chakra-ui/react";

function CrearAlbaranLinea({ producto, index, productos, setProductos }) {
    const handleCantidadChange = (value) => {
        let cantidad = Number(value);
        if (cantidad > producto.cantidadPedido) cantidad = producto.cantidadPedido;
        if (cantidad < 0) cantidad = 0;

        const updated = [...productos];
        updated[index].cantidadRecibida = cantidad;
        setProductos(updated);
    };

    return (
        <Tr>
            <Td>{producto.nombre}</Td>
            <Td>{producto.cantidadPedido}</Td>
            <Td>
                <Input
                    type="number"
                    min="0"
                    max={producto.cantidadPedido}
                    value={producto.cantidadRecibida}
                    onChange={(e) => handleCantidadChange(e.target.value)}
                />
            </Td>
        </Tr>
    );
}

export default CrearAlbaranLinea;