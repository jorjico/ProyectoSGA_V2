import { Box, Table, Thead, Tbody, Tr, Th, Td, HStack, Text, useTheme } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import MenuBar from "../components/MenuBar";
import BotonCargarMas from "../components/BotonCargarMas";
import Buscador from "../components/Buscador";
import BotonCrearElemento from "../components/BotonCrearElemento";
import useProveedores from "../hooks/useProveedores";
import proveedoresStyle from "../theme/ProveedorStyle";
import iconoCrear from "/create.png";
import FiltroSelect from "../components/FiltroSelect";
import CondicionesPago from "../data/condicionesPago";

function VerProveedores() {
    const theme = useTheme();
    const styles = proveedoresStyle(theme);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroActivo, setFiltroActivo] = useState("");

    const filtros = useMemo(() => {
        const f = {};
        if (filtroNombre) f.q = filtroNombre;
        if (filtroActivo !== "") f.activo = filtroActivo;
        return f;
    }, [filtroNombre, filtroActivo]);

    const {
        proveedores,
        setProveedores,
        loading,
        hayMas,
        cargarMasProveedores
    } = useProveedores(20, filtros);

    return (
        <Box>
            <MenuBar>
                <HStack justifyContent="space-between" w="full">
                    <HStack spacing={4}>
                        <BotonCrearElemento
                            recurso="proveedor"
                            apiUrl={`${backendUrl}/api/proveedores`}
                            backendUrl={backendUrl}
                            iconoSrc={iconoCrear}
                            campos={[
                                { name: "nombre", label: "Nombre", type: "text" },
                                { name: "CIF", label: "CIF", type: "text" },
                                { name: "direccion", label: "Dirección", type: "text" },
                                { name: "codigoPostal", label: "Código Postal", type: "text" },
                                {
                                    name: "condicionesPago",
                                    label: "Condiciones de pago",
                                    type: "select",
                                    options: CondicionesPago
                                },
                                { name: "diasTiempoEntrega", label: "Días de Entrega", type: "number" },
                            ]}
                            onCreated={(nuevoProveedor) => {
                                setProveedores(prev => [nuevoProveedor, ...prev]);
                            }}
                        />

                        <FiltroSelect
                            label="Activo"
                            options={[
                                { value: "true", label: "Activos" },
                                { value: "false", label: "Inactivos" }
                            ]}
                            value={filtroActivo}
                            onChange={setFiltroActivo}
                            placeholder="Todos"
                            sx={styles.filtroSelect}
                        />
                    </HStack>

                    <Buscador
                        placeholder="Buscar proveedor..."
                        onSearch={setFiltroNombre}
                    />
                </HStack>
            </MenuBar>

            <Box sx={styles.gridContainer}>
                <Table variant="simple" sx={styles.table}>
                    <Thead>
                        <Tr>
                            <Th>Nombre</Th>
                            <Th>CIF</Th>
                            <Th>Activo</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {proveedores.map(prov => (
                            <Tr
                                key={prov._id}
                                sx={styles.tableRow}
                                onClick={() => navigate(`/proveedores/${prov._id}`)}
                            >
                                <Td>{prov.nombre}</Td>
                                <Td>{prov.CIF}</Td>
                                <Td>
                                    <Text color={prov.activo ? "green.500" : "red.500"}>
                                        {prov.activo ? "Sí" : "No"}
                                    </Text>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>

                <BotonCargarMas
                    onClick={cargarMasProveedores}
                    loading={loading}
                    hayMas={hayMas}
                />
            </Box>
        </Box>
    );
}

export default VerProveedores;