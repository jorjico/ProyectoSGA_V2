import { Box, Table, Thead, Tbody, Tr, Th, Td, HStack, Text, useTheme } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import MenuBar from "../components/MenuBar";
import BotonCargarMas from "../components/BotonCargarMas";
import Buscador from "../components/Buscador";
import FiltroSelect from "../components/FiltroSelect";
import BotonCrearElemento from "../components/BotonCrearElemento";
import useClientes from "../hooks/useClientes";
import proyectosStyle from "../theme/proyectosStyle";
import iconoCrear from "/create.png";

function VerClientes() {
    const theme = useTheme();
    const styles = proyectosStyle(theme);
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
        clientes,
        setClientes,
        loading,
        hayMas,
        cargarMasClientes
    } = useClientes(20, filtros);

    return (
        <Box>
            <MenuBar>
                <HStack justifyContent="space-between" w="full">

                    <HStack spacing={4}>
                        <BotonCrearElemento
                            recurso="cliente"
                            apiUrl={`${backendUrl}/api/clientes`}
                            backendUrl={backendUrl}
                            iconoSrc={iconoCrear}
                            campos={[
                                { name: "tipo", label: "Tipo", type: "select", options: ["persona", "empresa"] },
                                { name: "nombre", label: "Nombre", type: "text" },
                                { name: "NIF", label: "NIF", type: "text" },
                                { name: "CIF", label: "CIF", type: "text" },
                                { name: "direccionFacturacion", label: "Dirección de facturación", type: "text" },
                                { name: "telefono", label: "Teléfono", type: "text" },
                                { name: "email", label: "Email", type: "email" },
                            ]}
                            onCreated={(nuevoCliente) => {
                                setClientes(prev => [nuevoCliente, ...prev]);
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
                        placeholder="Buscar cliente..."
                        onSearch={setFiltroNombre}
                    />
                </HStack>
            </MenuBar>

            <Box sx={styles.gridContainer}>
                <Table variant="simple" sx={styles.table}>
                    <Thead>
                        <Tr>
                            <Th>Nombre</Th>
                            <Th>Tipo</Th>
                            <Th>Activo</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {clientes.map(cliente => (
                            <Tr
                                key={cliente._id}
                                sx={styles.tableRow}
                                onClick={() => navigate(`/cliente/${cliente._id}`)}
                            >
                                <Td>{cliente.nombre}</Td>
                                <Td>{cliente.tipo}</Td>
                                <Td>
                                    <Text color={cliente.activo ? "green.500" : "red.500"}>
                                        {cliente.activo ? "Sí" : "No"}
                                    </Text>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>

                <BotonCargarMas
                    onClick={cargarMasClientes}
                    loading={loading}
                    hayMas={hayMas}
                />
            </Box>
        </Box>
    );
}

export default VerClientes;