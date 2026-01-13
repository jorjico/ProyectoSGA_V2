import { Button, useToast } from "@chakra-ui/react";

function BotonHacerPedido({ proveedorSeleccionado, proyectoSeleccionado, lineasPedido, backendUrl, onCreated }) {
    const toast = useToast();

    const handleCrearPedido = async () => {
        if (!proveedorSeleccionado) {
            toast({ title: "Error", description: "Debes seleccionar un proveedor", status: "error" });
            return;
        }

        const productos = lineasPedido
            .filter(l => l.productoSeleccionado && Number(l.cantidad) > 0)
            .map(l => ({
                productoProveedorId: l.productoSeleccionado._id,
                cantidad: Number(l.cantidad)
            }));

        if (productos.length === 0) {
            toast({ title: "Error", description: "Debes agregar al menos un producto con cantidad", status: "error" });
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${backendUrl}/api/pedidos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    proveedorId: proveedorSeleccionado._id,
                    proyectoId: proyectoSeleccionado?._id || null,
                    productos
                })
            });

            const result = await res.json();

            if (result.success) {
                toast({ title: "Pedido creado", description: `Número de pedido: ${result.data.numeroPedido}`, status: "success" });
                onCreated && onCreated(result.data);
            } else {
                toast({ title: "Error", description: result.error || "Error al crear pedido", status: "error" });
            }

        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: error.message, status: "error" });
        }
    };

    return (
        <Button colorScheme="green" onClick={handleCrearPedido}>
            Crear Pedido
        </Button>
    );
}

export default BotonHacerPedido;