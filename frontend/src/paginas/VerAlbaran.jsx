import { Box, Table, Thead, Tbody, Tr, Th, Td, HStack, Text, useTheme } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import MenuBar from "../components/MenuBar";
import BotonCargarMas from "../components/BotonCargarMas";
import Buscador from "../components/Buscador";
import FiltroSelect from "../components/FiltroSelect";
import comprasStyle from "../theme/comprasStyle";
import BotonConIcono from "../components/BotonConIcono";
import FormatearFecha from "../components/FormatearFecha";
import useAlbaranes from "../hooks/useAlbaranes";

function VerAlbaranes() {
    const theme = useTheme();
    const styles = comprasStyle(theme);
    const navigate = useNavigate();

    const [filtroProveedor, setFiltroProveedor] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroNumero, setFiltroNumero] = useState("");

    const filtros = useMemo(() => {
        const f = {};
        if (filtroProveedor) f.proveedorId = filtroProveedor;
        if (filtroEstado) f.estado = filtroEstado;
        if (filtroNumero) f.q = filtroNumero;
        return f;
    }, [filtroProveedor, filtroEstado, filtroNumero]);

    const { albaranes, loading, hayMas, cargarMasAlbaranes } = useAlbaranes(20, filtros);

    return (
        <Box>
            <MenuBar>
                <Box sx={styles.menuBarContainer}>
                    <HStack sx={styles.menuBarGrupoIzquierda}>
                        <BotonConIcono
                            text=""
                            iconoSrc="/quitarFiltro.png"
                            onClick={() => {
                                setFiltroProveedor("");
                                setFiltroEstado("");
                                setFiltroNumero("");
                            }}
                        />
                    </HStack>

                    <HStack sx={styles.menuBarGrupoDerecha}>
                        <Buscador
                            placeholder="Buscar proveedor..."
                            onSearch={(term) => {
                                setFiltroProveedor(term);
                                setFiltroNumero("");
                                setFiltroEstado("");
                            }}
                        />

                        <Buscador
                            placeholder="Buscar albarán..."
                            onSearch={(term) => {
                                setFiltroNumero(term);
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
                            <Th>Número Albarán</Th>
                            <Th>Estado</Th>
                            <Th>Proveedor</Th>
                            <Th>Fecha Recepción</Th>
                            <Th>Pedido</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {albaranes.map((albaran) => (
                            <Tr
                                key={albaran._id}
                                sx={styles.tableRow}
                                onClick={() => navigate(`/albaran/${albaran._id}`)}
                            >
                                <Td>{albaran.numero || "-"}</Td>

                                <Td>
                                    <Text color={
                                        albaran.estado === "recibido" ? "green.500" :
                                        albaran.estado === "pendiente" ? "orange.500" :
                                        albaran.estado === "parcial" ? "yellow.500" :
                                        "red.500"
                                    }>
                                        {albaran.estado ? albaran.estado.charAt(0).toUpperCase() + albaran.estado.slice(1) : "-"}
                                    </Text>
                                </Td>

                                <Td>{albaran.proveedor?.nombre || "-"}</Td>

                                <Td><FormatearFecha fecha={albaran.fechaRecepcion} /></Td>

                                <Td>{albaran.pedido?.numeroPedido || "-"}</Td>

                            </Tr>
                        ))}
                    </Tbody>
                </Table>

                {hayMas && (
                    <Box textAlign="center" mt={4}>
                        <BotonCargarMas
                            onClick={cargarMasAlbaranes}
                            loading={loading}
                            hayMas={hayMas}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default VerAlbaranes;