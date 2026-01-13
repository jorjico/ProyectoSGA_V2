import { Box, Table, Thead, Tbody, Tr, Th, Td, VStack, Text, useTheme } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import usePedidoById from "../hooks/usePedidoById";
import MenuBar from "../components/MenuBar";
import BackButton from "../components/BotonAtras";
import BotonEditarPedido from "../components/BotonEditarPedido";
import BotonEliminarElemento from "../components/BotonEliminarElemento";
import comprasStyle from "../theme/comprasStyle";
import { useEffect, useState } from "react";
import BotonConIcono from "../components/BotonConIcono";
import CrearAlbaranModal from "../components/CrearAlbaranModal";

function FichaPedido() {
    const { id } = useParams();
    const { pedido, loading, error } = usePedidoById(id);
    const theme = useTheme();
    const styles = comprasStyle (theme);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [pedidoState, setPedidoState] = useState(null);

    useEffect(() => {
        if (pedido) setPedidoState(pedido);
    }, [pedido]);

    const handleAlbaranCreado = (nuevoAlbaran) => {
        setPedidoState(prev => ({
            ...prev,
            albaranes: [...(prev.albaranes || []), nuevoAlbaran]
        }));
    };

    if (loading) return <Text>Cargando pedido...</Text>;

    if (error) return <Text color="red.500">Error: {error.message}</Text>;

    if (!pedidoState) return <Text>No se encontró el pedido</Text>;

    const formatearMoneda = (valor, moneda = "EUR") => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: moneda,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor);
    };

    const monedaPedido = pedido.productos[0]?.productoProveedor.moneda || "EUR";

    return (
        <Box>
            <MenuBar>
                <BackButton />

                <BotonEditarPedido id={pedido._id} />

                <BotonEliminarElemento
                    recurso="pedido"
                    apiUrl={`${backendUrl}/api/pedidos/${pedidoState._id}`}
                    onDeleted={() => navigate("/pedidos")}
                />

                <BotonConIcono
                    text="Crear Albarán"
                    iconoSrc="/recibir.png"
                    onClick={() => setIsOpen(true)}
                />
            </MenuBar>

            <Box sx={styles.pedidoContainer1}>
                <VStack align="start" spacing={2}>
                    <Text>Pedido: {pedidoState.numeroPedido}</Text>

                    <Text>
                        Proveedor:{" "}
                        {pedidoState.proveedor ? (
                            <Text
                                as="span"
                                sx={styles.linkText}
                                onClick={() => navigate(`/proveedores/${pedidoState.proveedor._id}`)}
                                >
                                {pedidoState.proveedor.nombre}
                            </Text>
                        ) : (
                            "No asignado"
                        )}
                    </Text>

                    <Text sx={styles.fichaText}>
                        Proyecto:{" "}
                        {pedidoState.proyecto ? (
                            <Text
                                as="span"
                                sx={styles.linkText}
                                onClick={() => navigate(`/proyecto/${pedidoState.proyecto._id}`)}
                            >
                                {pedidoState.proyecto.nombre}
                            </Text>
                        ) : (
                            "No asociado"
                        )}
                    </Text>

                    <Text>Estado: {pedidoState.estado}</Text>
                </VStack>
            </Box>

            <Box sx={styles.pedidoContainer2}>
                <Table variant="simple" sx={styles.table}>
                    <Thead>
                        <Tr>
                            <Th display={{ base: "none", md: "table-cell" }}>SKU</Th>
                            <Th display={{ base: "table-cell", md: "table-cell" }}>Producto</Th>
                            <Th display={{ base: "none", md: "table-cell" }}>Referencia Proveedor</Th>
                            <Th display={{ base: "table-cell", md: "table-cell" }}>Cantidad Pedida</Th>
                            <Th display={{ base: "table-cell", md: "table-cell" }}>Cantidad Recibida</Th>
                            <Th display={{ base: "none", md: "table-cell" }}>Unidad</Th>
                            <Th display={{ base: "none", md: "table-cell" }}>Precio Unitario</Th>
                            <Th display={{ base: "table-cell", md: "table-cell" }}>Importe Bruto</Th>
                            <Th display={{ base: "none", md: "table-cell" }}>IVA</Th>
                            <Th display={{ base: "table-cell", md: "table-cell" }}>Importe con IVA</Th>
                            <Th display={{ base: "table-cell", md: "table-cell" }}>Albaranes</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {pedidoState.productos.map((item) => {
                            const importeConIVA = item.importeBruto * (1 + (item.productoProveedor.producto.IVA || 0) / 100);

                            const cantidadRecibida = pedidoState.albaranes?.reduce((total, alb) => {
                                if (!alb.productos) return total;
                                const linea = alb.productos.find((p) => 
                                    p.productoProveedor?._id?.toString() === item.productoProveedor?._id?.toString()
                                );
                                return total + (linea?.cantidadRecibida ?? 0);
                            }, 0);

                            return (
                                <Tr key={item._id}>
                                    <Td display={{ base: "none", md: "table-cell" }}>
                                        {item.productoProveedor.producto.sku}
                                    </Td>

                                    <Td display={{ base: "table-cell", md: "table-cell" }}>
                                        {item.productoProveedor.producto.nombreProducto}
                                    </Td>

                                    <Td display={{ base: "none", md: "table-cell" }}>
                                        {item.referenciaProveedor}
                                    </Td>

                                    <Td display={{ base: "table-cell", md: "table-cell" }}>
                                        {item.cantidad}
                                    </Td>

                                    <Td display={{ base: "table-cell", md: "table-cell" }}>
                                        {cantidadRecibida}
                                    </Td>

                                    <Td display={{ base: "none", md: "table-cell" }}>
                                        {item.productoProveedor.producto.unidadMedida || "-"}
                                    </Td>

                                    <Td display={{ base: "none", md: "table-cell" }}>
                                        {formatearMoneda(item.precioUnitario, item.productoProveedor.moneda)}
                                    </Td>

                                    <Td display={{ base: "table-cell", md: "table-cell" }}>
                                        {formatearMoneda(item.importeBruto, item.productoProveedor.moneda)}
                                    </Td>

                                    <Td display={{ base: "none", md: "table-cell" }}>
                                        {item.productoProveedor.producto.IVA || 0}%
                                    </Td>

                                    <Td display={{ base: "table-cell", md: "table-cell" }}>
                                        {formatearMoneda(importeConIVA, item.productoProveedor.moneda)}
                                    </Td>
                                    
                                    <Td display={{ base: "table-cell", md: "table-cell" }}>
                                        {pedidoState.albaranes && pedidoState.albaranes.length > 0 ? (
                                            pedidoState.albaranes.map((alb) => (
                                            <Text
                                                as="span"
                                                key={alb._id}
                                                sx={styles.columnaAlbaranes}
                                                onClick={() => navigate(`/albaran/${alb._id}`)}
                                            >
                                                {alb.numero}
                                            </Text>
                                            ))
                                        ) : (
                                            "-"
                                        )}
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>

                <Box sx={styles.totalContainer}>
                    <Text>Total Bruto: {formatearMoneda(pedidoState.totalBruto, monedaPedido)}</Text>
                    <Text>Total con IVA: {formatearMoneda(pedidoState.totalConIVA, monedaPedido)}</Text>
                </Box>
            </Box>
            
            <CrearAlbaranModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                pedido={pedidoState}
                onAlbaranCreado={handleAlbaranCreado}
            />
        </Box>
    );
}

export default FichaPedido;