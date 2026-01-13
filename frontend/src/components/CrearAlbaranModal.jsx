import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, VStack, useToast } from "@chakra-ui/react";
import CrearAlbaranFormulario from "./CrearAlbaranFormulario";

function CrearAlbaranModal({ isOpen, onClose, pedido, onAlbaranCreado }) {
    const toast = useToast();
    const hoy = new Date().toISOString().split("T")[0];
    const [productos, setProductos] = useState(
        pedido.productos.map(p => ({
            productoProveedor: p.productoProveedor._id,
            nombre: p.productoProveedor.producto.nombreProducto,
            cantidadPedido: p.cantidad,
            cantidadRecibida: 0,
        }))
    );
    const [fechaRecepcion, setFechaRecepcion] = useState(hoy);
    const [notas, setNotas] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCrearAlbaran = async () => {
        const productosValidos = productos.filter(p => p.cantidadRecibida > 0);

        if (productosValidos.length === 0) {
            toast({
                title: "No hay cantidades a recibir",
                status: "warning",
                duration: 4000,
                isClosable: true
            });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:4000/api/albaranes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    pedidoId: pedido._id,
                    productos: productosValidos,
                    fechaRecepcion,
                    notas,
                    pdf: ""
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error al crear albarán");
            }

            toast({
                title: "Albarán creado",
                description: `Número de albarán: ${data.data.numero}`,
                status: "success",
                duration: 4000,
                isClosable: true
            });

            onAlbaranCreado(data.data);
            onClose();

        } catch (err) {
            toast({
                title: "Error",
                description: err.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Crear albarán de recepción</ModalHeader>

                <ModalCloseButton />

                <ModalBody>
                    <VStack spacing={4}>
                        <CrearAlbaranFormulario
                        productos={productos}
                        setProductos={setProductos}
                        fechaRecepcion={fechaRecepcion}
                        setFechaRecepcion={setFechaRecepcion}
                        notas={notas}
                        setNotas={setNotas}
                        />
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={onClose} mr={3} variant="ghost">Cancelar</Button>
                    <Button colorScheme="blue" onClick={handleCrearAlbaran} isLoading={loading}>
                        Crear Albarán
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default CrearAlbaranModal;