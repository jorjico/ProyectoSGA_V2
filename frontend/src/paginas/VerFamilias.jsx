import { Box, Card, CardBody, Heading, HStack, SimpleGrid, useTheme } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import { useMemo, useState } from "react";
import productosStyle from "../theme/productosStyle";
import useFamilias from "../hooks/useFamilias";
import BotonCrearElemento from "../components/BotonCrearElemento";
import Buscador from "../components/Buscador";
import BotonCargarMas from "../components/BotonCargarMas";
import iconoCrear from "/create.png";

function VerFamilias() {
    const theme = useTheme();
    const styles = productosStyle(theme);

    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    
    const [filtroNombre, setFiltroNombre] = useState("");

    const filtros = useMemo(() => {
            return filtroNombre ? { q: filtroNombre } : {};
    }, [filtroNombre]);

    const { familias, setFamilias, loading, hayMas, cargarMasFamilias } = useFamilias(24, filtros);

    return (
        <Box>
            <MenuBar>
                <HStack justifyContent="space-between" w="full">
                    <BotonCrearElemento
                        recurso="familia"
                        apiUrl={`${backendUrl}/api/familias`}
                        backendUrl={backendUrl}
                        iconoSrc={iconoCrear}
                        campos={[
                            { name: "nombre", label: "Nombre", type: "text" },
                        ]}
                        onCreated={(nuevaFamilia) => { 
                            setFamilias(prev => [nuevaFamilia, ...prev]);
                        }}
                    />

                    <Buscador
                        placeholder="Buscar familia..."
                        onSearch={setFiltroNombre}
                    />
                </HStack>
            </MenuBar>

            <Box sx={styles.gridContainer}>
                <SimpleGrid columns={styles.gridFamilias.columns} spacing={styles.gridFamilias.spacing}>
                    {familias.map((familia) => (
                        <Card 
                            key={familia._id}
                            sx={styles.cardFamilia}
                            onClick={() => navigate(`/familia/${familia._id}`)}
                        >
                            <CardBody sx={styles.cardBody}>
                                <Heading sx={styles.cardTitle}>
                                    {familia.nombre}
                                </Heading>

                                <Box sx={styles.cardInfo}>
                                    Código: {familia.codigo}
                                </Box>
                                <Box sx={styles.cardInfo}>
                                    Total productos: {familia.totalProductos || 0}
                                </Box>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>

                {hayMas && (
                    <Box textAlign="center" mt={4}>
                        <BotonCargarMas
                            onClick={cargarMasFamilias}
                            loading={loading}
                            hayMas={hayMas}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );   
}

export default VerFamilias;