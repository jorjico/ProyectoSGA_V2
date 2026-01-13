import { Box, Table, Thead, Tbody, Tr, Th, Td, HStack, Text, useTheme, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import MenuBar from "../components/MenuBar";
import BotonCargarMas from "../components/BotonCargarMas";
import Buscador from "../components/Buscador";
import FiltroSelect from "../components/FiltroSelect";
import BotonCrearPedido from "../components/BotonCrearPedido";
import usePedidos from "../hooks/usePedidos";
import comprasStyle from "../theme/comprasStyle";
import iconoCrear from "/create.png";
import FormatearFecha from "../components/FormatearFecha";
import BotonConIcono from "../components/BotonConIcono";

function VerPedidos() {
    const theme = useTheme();
    const styles = comprasStyle(theme);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const [filtroProveedor, setFiltroProveedor] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroNombre, setFiltroNombre] = useState("");

    const filtros = useMemo(() => {
        const f = {};
        if (filtroProveedor) f.proveedorId = filtroProveedor;
        if (filtroEstado) f.estado = filtroEstado;
        if (filtroNombre) f.q = filtroNombre;
        return f;
    }, [filtroProveedor, filtroEstado, filtroNombre]);

    const { pedidos, setPedidos, loading, hayMas, cargarMasPedidos } = usePedidos(20, filtros);

    return (
        <Box>
            <MenuBar>
                <Box sx={styles.menuBarContainer}>
                    <HStack sx={styles.menuBarGrupoIzquierda}>
                        <BotonCrearPedido
                            apiUrl={`${backendUrl}/api/pedidos`}
                            backendUrl={backendUrl}
                            iconoSrc={iconoCrear}
                            onCreated={(nuevoPedido) => setPedidos(prev => [nuevoPedido, ...prev])}
                        />

                        <BotonConIcono
                            text=""
                            iconoSrc="/quitarFiltro.png"
                            onClick={() => {
                                setFiltroProveedor("");
                                setFiltroEstado("");
                                setFiltroNombre("");
                            }}
                        />
                    </HStack>

                    <HStack sx={styles.menuBarGrupoDerecha}>
                        <FiltroSelect
                            label="Estado"
                            options={[
                                { value: "pendiente", label: "Pendiente" },
                                { value: "parcial", label: "Parcial" },
                                { value: "recibido", label: "Recibido" },
                                { value: "cancelado", label: "Cancelado" },
                            ]}
                            value={filtroEstado}
                            onChange={setFiltroEstado}
                            placeholder="Estado"
                            sx={styles.filtroSelect}
                        />

                        <Buscador
                            placeholder="Buscar proveedor..."
                            onSearch={(term) => {
                                setFiltroProveedor(term);
                                setFiltroNombre("");
                                setFiltroEstado("");
                            }}
                        />

                        <Buscador
                            placeholder="Buscar pedido..."
                            onSearch={(term) => {
                                setFiltroNombre(term);
                                setFiltroProveedor("");
                                setFiltroEstado("");
                            }}
                        />
                    </HStack>
                </Box>
            </MenuBar>


            <Box sx={styles.gridContainer}>
                <Table variant="simple" sx={styles.table}>
                    <Thead>
                        <Tr>
                            <Th display={{ base: "table-cell", md: "table-cell" }}>Número Pedido</Th>
                            <Th display={{ base: "table-cell", md: "table-cell" }}>Estado</Th>
                            <Th display={{ base: "table-cell", md: "table-cell" }}>Proveedor</Th>
                            <Th display={{ base: "none", md: "table-cell" }}>Fecha Pedido</Th>
                            <Th display={{ base: "table-cell", md: "table-cell" }}>Entrega Estimada</Th>
                            <Th display={{ base: "none", md: "table-cell" }}>Total (IVA)</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {pedidos.map(pedido => (
                            <Tr
                                key={pedido._id}
                                sx={styles.tableRow}
                                onClick={() => navigate(`/pedido/${pedido._id}`)}
                            >
                                <Td display={{ base: "table-cell", md: "table-cell" }}>
                                    {pedido.numeroPedido}
                                </Td>

                                <Td display={{ base: "table-cell", md: "table-cell" }}>
                                    <Text color={
                                        pedido.estado === "recibido" ? "green.500" :
                                        pedido.estado === "pendiente" ? "orange.500" :
                                        pedido.estado === "parcial" ? "yellow.500" :
                                        "red.500"
                                    }>
                                        
                                        {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                                    </Text>
                                </Td>

                                <Td display={{ base: "table-cell", md: "table-cell" }}>
                                    {pedido.proveedor?.nombre || "-"}
                                </Td>

                                <Td display={{ base: "none", md: "table-cell" }}>
                                    <FormatearFecha fecha={pedido.fechaPedido} />
                                </Td>

                                <Td display={{ base: "table-cell", md: "table-cell" }}>
                                    <FormatearFecha fecha={pedido.fechaEntregaEstimado} />
                                </Td>

                                <Td display={{ base: "none", md: "table-cell" }}>
                                    {pedido.totalConIVA?.toFixed(2) ?? 0}€
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>

                <BotonCargarMas
                    onClick={cargarMasPedidos}
                    loading={loading}
                    hayMas={hayMas}
                />
            </Box>
        </Box>
    );
}

export default VerPedidos;