import { Box, Table, Thead, Tbody, Tr, Th, Td, HStack, Text, useTheme } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import MenuBar from "../components/MenuBar";
import BotonCargarMas from "../components/BotonCargarMas";
import Buscador from "../components/Buscador";
import FiltroSelect from "../components/FiltroSelect";
import productosStyle from "../theme/productosStyle";
import useMovimientos from "../hooks/useMovimientos";

function VerMovimientos() {
    const theme = useTheme();
    const styles = productosStyle(theme);

    const [filtroBusqueda, setFiltroBusqueda] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");

    const filtros = useMemo(() => {
        const f = {};
        if (filtroBusqueda) f.q = filtroBusqueda;
        if (filtroTipo) f.tipo = filtroTipo;
        return f;
    }, [filtroBusqueda, filtroTipo]);

    const { movimientos, loading, hayMas, cargarMasMovimientos } = useMovimientos(20, filtros);

    const formatearFechaHora = (fecha) => {
        if (!fecha) return "-";
        return new Date(fecha).toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Box>
            <MenuBar>
                <Box sx={styles.menuBarContainer}>
                    <HStack sx={styles.menuBarGrupoIzquierda}>
                        <BotonCargarMas
                            onClick={() => {
                                setFiltroBusqueda("");
                                setFiltroTipo("");
                            }}
                        />
                    </HStack>

                    <HStack sx={styles.menuBarGrupoDerecha}>
                        <FiltroSelect
                            label="Tipo"
                            options={[
                                { value: "entrada", label: "Entrada" },
                                { value: "salida", label: "Salida" },
                            ]}
                            value={filtroTipo}
                            onChange={setFiltroTipo}
                            placeholder="Tipo"
                            sx={styles.filtroSelect}
                        />

                        <Buscador
                            placeholder="Buscar producto o SKU..."
                            onSearch={(term) => {
                                setFiltroBusqueda(term);
                                setFiltroTipo("");
                            }}
                        />
                    </HStack>
                </Box>
            </MenuBar>

            <Box sx={styles.gridContainer}>
                <Box sx={{ overflowX: "auto" }}>
                    <Table variant="simple" sx={styles.table}>
                        <Thead>
                            <Tr>
                                <Th>SKU</Th>
                                <Th>Producto</Th>
                                <Th>Cantidad</Th>
                                <Th>Tipo</Th>
                                <Th>Origen</Th>
                                <Th>Fecha</Th>
                                <Th>Usuario</Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {movimientos.map((mov) => (
                                <Tr key={mov._id} sx={styles.tableRow}>
                                    <Td>{mov.sku}</Td>
                                    <Td>{mov.nombreProducto}</Td>
                                    <Td>{mov.cantidad}</Td>
                                    <Td>
                                        <Text sx={mov.tipo === "entrada" ? styles.tipoEntrada : styles.tipoSalida}>
                                            {mov.tipo === "entrada" ? "Entrada" : "Salida"}
                                        </Text>
                                    </Td>
                                    <Td>{mov.origen}</Td>
                                    <Td>{formatearFechaHora(mov.createdAt)}</Td>
                                    <Td>{mov.usuario?.email || "-"}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>

                {hayMas && (
                    <Box textAlign="center" mt={4}>
                        <BotonCargarMas
                            onClick={cargarMasMovimientos}
                            loading={loading}
                            hayMas={hayMas}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default VerMovimientos;