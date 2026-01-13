import { Box, Card, CardBody, Heading, SimpleGrid, useTheme, Text } from "@chakra-ui/react";
import useProyectos from "../hooks/useProyectos"; 
import BotonCargarMas from "../components/BotonCargarMas";
import MenuBar from "../components/MenuBar";
import { useNavigate } from "react-router-dom";
import BotonCrearElemento from "../components/BotonCrearElemento";
import iconoCrear from "/create.png";
import Buscador from "../components/Buscador";
import { useMemo, useState } from "react";
import FiltroSelect from "../components/FiltroSelect";
import proyectosStyle from "../theme/proyectosStyle";

function VerProyectos() {
    const theme = useTheme();
    const styles = proyectosStyle(theme);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroYear, setFiltroYear] = useState("");

    const filtros = useMemo(() => {
        const f = {};
        if(filtroNombre) f.q = filtroNombre;
        if(filtroEstado) f.estado = filtroEstado;
        if(filtroYear) f.anio = filtroYear;
        return f;
    }, [filtroNombre, filtroEstado, filtroYear]);

    const { proyectos, setProyectos, loading, hayMas, cargarMasProyectos } = useProyectos(24, filtros);

    const añosDisponibles = useMemo(() => {
        const años = proyectos.map(p => new Date(p.createdAt).getFullYear());
        return [...new Set(años)].sort((a,b) => b - a);
    }, [proyectos]);

    return (
        <Box>
            <MenuBar>
                <SimpleGrid sx={styles.menuBarGrid}>
                    <Box sx={styles.menuCrear}>
                        <BotonCrearElemento
                            recurso="proyecto"
                            apiUrl={`${backendUrl}/api/proyectos`}
                            backendUrl={backendUrl}
                            iconoSrc={iconoCrear}
                            campos={[
                                {
                                    name: "cliente",
                                    label: "Cliente",
                                    type: "autocomplete",
                                    fetchOptions: "/api/clientes?activo=true",
                                    multiple: false,
                                    placeholder: "Buscar cliente..."
                                },
                                { name: "direccionEntrega", label: "Dirección de entrega", type: "text" }
                            ]}
                            onCreated={(nuevoProyecto) => {
                                setProyectos(prev => [nuevoProyecto, ...prev]);
                            }}
                        />
                    </Box>

                    <Box sx={styles.menuFiltroAnio}>
                        <FiltroSelect
                            label="Año"
                            options={añosDisponibles}
                            value={filtroYear}
                            onChange={setFiltroYear}
                            placeholder="Filtrar por año"
                            sx={styles.filtroSelect}
                        />
                    </Box>

                    <Box sx={styles.menuFiltroEstado}>
                        <FiltroSelect
                            label="Estado"
                            options={[
                                { value: "presupuesto", label: "Presupuesto" },
                                { value: "aceptado", label: "Aceptado" },
                                { value: "en fabricación", label: "En fabricación" },
                                { value: "incidencia", label: "Incidencia" },
                                { value: "terminado", label: "Terminado" },
                            ]}
                            value={filtroEstado}
                            onChange={setFiltroEstado}
                            placeholder="Filtrar por estado"
                            sx={styles.filtroSelect}
                        />
                    </Box>

                    <Box sx={styles.menuBuscador}>
                        <Buscador
                            placeholder="Buscar proyecto..."
                            onSearch={setFiltroNombre}
                        />
                    </Box>
                </SimpleGrid>
            </MenuBar>

            <Box sx={styles.gridContainer}>
                <SimpleGrid columns={styles.grid.columns} spacing={styles.grid.spacing}>
                    {proyectos.map((proyecto) => (
                        <Card
                            key={proyecto._id}
                            sx={styles.card}
                            onClick={() => navigate(`/proyecto/${proyecto._id}`)}
                        >
                            <CardBody sx={styles.cardBody}>
                                <Heading sx={styles.cardTitle}>{proyecto.nombre}</Heading>
                                <Text sx={styles.cardInfo}>
                                    {proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1)}
                                </Text>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>

                <BotonCargarMas 
                    onClick={cargarMasProyectos}
                    loading={loading}
                    hayMas={hayMas}
                />
            </Box>
        </Box>
    );
}

export default VerProyectos;