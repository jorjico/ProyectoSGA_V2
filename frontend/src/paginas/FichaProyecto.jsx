import { Box, Heading, Stack, Text, useTheme } from "@chakra-ui/react";
import proyectosStyle from "../theme/proyectosStyle";
import { useNavigate, useParams } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import BackButton from "../components/BotonAtras";
import BotonEliminarElemento from "../components/BotonEliminarElemento";
import BotonEditarProyecto from "../components/BotonEditarProyecto";
import useProyectoById from "../hooks/useProyectoById";

function FichaProyecto() {
    const theme = useTheme();
    const styles = proyectosStyle(theme);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const { id } = useParams();
    const { proyecto, loading, error } = useProyectoById(id);

    if (loading) return <h1>Cargando...</h1>;
    if (error) return <h1>Error: {error.message}</h1>;
    if (!proyecto) return <h1>No se encontró el proyecto</h1>;

    const handleDeleted = () => {
        navigate("/proyectos");
    };

    return (
        <Box>
            <MenuBar>
                <BackButton />

                <BotonEditarProyecto id={proyecto._id} />

                <BotonEliminarElemento
                    recurso="proyecto"
                    apiUrl={`${backendUrl}/api/proyectos/${proyecto._id}`}
                    onDeleted={handleDeleted}
                />
            </MenuBar>

            <Box sx={styles.fichaContainer}>
                <Heading sx={styles.fichaTitulo}>{proyecto.nombre}</Heading>

                <Box sx={styles.fichaRow}>
                    <Stack sx={styles.fichaInfo}>

                        <Text sx={styles.fichaText}>
                            Estado: {proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1)}
                        </Text>

                        <Text sx={styles.fichaText}>
                            Cliente:{" "}
                            {proyecto.cliente ? (
                                <Text
                                    as="span"
                                    sx={styles.linkText}
                                    onClick={() => navigate(`/cliente/${proyecto.cliente._id}`)}
                                >
                                    {proyecto.cliente.nombre} ({proyecto.cliente.tipo})
                                </Text>
                            ) : (
                                "Sin cliente"
                            )}
                        </Text>

                        <Text sx={styles.fichaText}>
                            Dirección de entrega: {proyecto.direccionEntrega}
                        </Text>

                        <Text sx={styles.fichaText}>
                            Creado el: {new Date(proyecto.createdAt).toLocaleDateString()}
                        </Text>

                        <Text sx={styles.fichaText}>
                            Última actualización: {new Date(proyecto.updatedAt).toLocaleDateString()}
                        </Text>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

export default FichaProyecto;