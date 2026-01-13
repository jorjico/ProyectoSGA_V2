import { Box, Table, Thead, Tbody, Tr, Th, Td, VStack, Text, useTheme } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import BackButton from "../components/BotonAtras";
import comprasStyle from "../theme/comprasStyle";
import useAlbaranById from "../hooks/useAlbaranById";
import FormatearFecha from "../components/FormatearFecha";

function FichaAlbaran() {
    const { id } = useParams();
    const { albaran, loading, error } = useAlbaranById(id);
    const theme = useTheme();
    const styles = comprasStyle(theme);
    const navigate = useNavigate();
    //const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    if (loading) return <Text p={6}>Cargando albarán...</Text>;
    if (error) return <Text p={6} color="red.500">Error: {error.message}</Text>;
    if (!albaran) return <Text p={6}>No se encontró el albarán</Text>;

    return (
        <Box>
            <MenuBar>
                <BackButton />
            </MenuBar>

            <Box sx={styles.pedidoContainer1} p={4}>
                <VStack align="start" spacing={2}>
                    <Text>Albarán: {albaran.numero}</Text>

                    <Text sx={styles.fichaText}>
                        Pedido asociado:{" "}
                        {albaran.pedido ? (
                            <Text
                                as="span"
                                sx={styles.linkText}
                                onClick={() => navigate(`/pedido/${albaran.pedido._id}`)}
                            >
                                {albaran.pedido.numeroPedido}
                            </Text>
                        ) : (
                            "-"
                        )}
                    </Text>

                    <Text sx={styles.fichaText}>
                        Proveedor:{" "}
                        {albaran.proveedor ? (
                            <Text
                                as="span"
                                sx={styles.linkText}
                                onClick={() => navigate(`/proveedores/${albaran.proveedor._id}`)}
                            >
                                {albaran.proveedor.nombre}
                            </Text>
                        ) : (
                            "No asociado"
                        )}
                    </Text>

                    <Text>
                        Fecha de recepción:{" "}
                        <FormatearFecha fecha={albaran.fechaRecepcion} />
                    </Text>

                    <Text>Estado: {albaran.estado}</Text>
                </VStack>
            </Box>

            <Box sx={styles.pedidoContainer2} p={4}>
                <Table variant="simple" sx={styles.table}>
                    <Thead>
                        <Tr>
                            <Th display={{ base: "table-cell", md: "table-cell" }}>Producto</Th>
                            <Th display={{ base: "none", md: "table-cell" }}>Referencia Proveedor</Th>
                            <Th display={{ base: "table-cell", md: "table-cell" }}>Cantidad Pedida</Th>
                            <Th display={{ base: "table-cell", md: "table-cell" }}>Cantidad Recibida</Th>
                            <Th display={{ base: "none", md: "table-cell" }}>Diferencia</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {albaran.productos.map((item) => (
                            <Tr key={item._id}>
                                <Td display={{ base: "table-cell", md: "table-cell" }}>
                                    {item.productoProveedor?.producto?.nombreProducto || "-"}
                                </Td>

                                <Td display={{ base: "none", md: "table-cell" }}>
                                    {item.productoProveedor?.referenciaProveedor || "-"}
                                </Td>

                                <Td display={{ base: "table-cell", md: "table-cell" }}>
                                    {item.cantidadPedido}
                                </Td>

                                <Td display={{ base: "table-cell", md: "table-cell" }}>
                                    {item.cantidadRecibida}
                                </Td>

                                <Td display={{ base: "none", md: "table-cell" }}>
                                    {item.diferencia}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
}

export default FichaAlbaran;