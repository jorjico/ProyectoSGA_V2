import { Box, Card, CardBody, Heading, SimpleGrid, Stack, Text, useTheme } from "@chakra-ui/react";
import proyectosStyle from "../theme/proyectosStyle";
import { useNavigate, useParams } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import BackButton from "../components/BotonAtras";
import BotonEliminarElemento from "../components/BotonEliminarElemento";
import BotonEditarCliente from "../components/BotonEditarCliente";
import useClienteById from "../hooks/useClienteById";
import useProyectosByCliente from "../hooks/useProyectoByCliente";

function FichaCliente() {
    const theme = useTheme();
    const styles = proyectosStyle(theme);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const { id } = useParams();
    const { cliente, loading, error } = useClienteById(id);

    const { proyectos, loading: loadingProyectos, error: errorProyectos } = useProyectosByCliente(id);

    if (loading) return <h1>Cargando...</h1>;
    if (error) return <h1>Error: {error.message}</h1>;
    if (!cliente) return <h1>No se encontró el cliente</h1>;

    const handleDeleted = () => {
        navigate("/clientes");
    };

    return (
        <Box>
            <MenuBar>
                <BackButton />

                <BotonEditarCliente
                    recurso="cliente"
                    id={cliente._id}
                    apiUrl={`${backendUrl}/api/clientes/${cliente._id}`}
                />

                <BotonEliminarElemento
                    recurso="cliente"
                    apiUrl={`${backendUrl}/api/clientes/${cliente._id}`}
                    onDeleted={handleDeleted}
                />
            </MenuBar>

            <Box sx={styles.fichaContainer}>
                <Heading sx={styles.fichaTitulo}>{cliente.nombre}</Heading>

                <Box sx={styles.fichaRow}>
                    <Stack sx={styles.fichaInfo}>
                        <Text sx={styles.fichaText}>
                            <Text   Text sx={styles.fichaLabel}>Tipo:</Text> {cliente.tipo.charAt(0).toUpperCase() + cliente.tipo.slice(1)}
                        </Text>

                        {cliente.NIF && (
                        <Text sx={styles.fichaText}>
                            <Text sx={styles.fichaLabel}>NIF:</Text> {cliente.NIF}
                        </Text>
                        )}

                        {cliente.CIF && (
                        <Text sx={styles.fichaText}>
                            <Text sx={styles.fichaLabel}>CIF:</Text> {cliente.CIF}
                        </Text>
                        )}

                        <Text sx={styles.fichaText}>
                            <Text sx={styles.fichaLabel}>Dirección de facturación:</Text> {cliente.direccionFacturacion}
                        </Text>

                        <Text sx={styles.fichaText}>
                            <Text sx={styles.fichaLabel}>Teléfono:</Text> {cliente.telefono}
                        </Text>

                        <Text sx={styles.fichaText}>
                            <Text sx={styles.fichaLabel}>Email:</Text> {cliente.email}
                        </Text>

                        <Text sx={styles.fichaText}>
                            <Text sx={styles.fichaLabel}>Activo:</Text> {cliente.activo ? "Sí" : "No"}
                        </Text>

                        <Text sx={styles.fichaText}>
                            <Text sx={styles.fichaLabel}>Creado el:</Text> {new Date(cliente.createdAt).toLocaleDateString()}
                        </Text>

                        <Text sx={styles.fichaText}>
                            <Text sx={styles.fichaLabel}>Última actualización:</Text> {new Date(cliente.updatedAt).toLocaleDateString()}
                        </Text>
                    </Stack>
                </Box>

                <Box sx={styles.fichaProyectosBox} mt={8}>
                    <Heading size="md" mb={4}>Proyectos de este cliente</Heading>

                    {loadingProyectos && <Text>Cargando proyectos...</Text>}
                    {errorProyectos && <Text>Error al cargar proyectos: {errorProyectos.message}</Text>}

                    {!loadingProyectos && proyectos.length > 0 ? (
                        <SimpleGrid columns={styles.proyectoGrid.columns} spacing={styles.proyectoGrid.spacing}>
                            {proyectos.map((proyecto) => (
                                <Card
                                    key={proyecto._id}
                                    sx={styles.proyectoCard}
                                    onClick={() => navigate(`/proyecto/${proyecto._id}`)}
                                >
                                    <CardBody sx={styles.cardBody}>
                                        <Heading sx={styles.cardTitle}>{proyecto.nombre}</Heading>
                                        <Text sx={styles.proyectoCardInfo}>
                                            Estado: {proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1)}
                                        </Text>
                                    </CardBody>
                                </Card>
                            ))}
                        </SimpleGrid>
                    ) : (
                        !loadingProyectos && <Text>Este cliente no tiene proyectos asociados</Text>
                    )}

                </Box>
            </Box>
        </Box>
    );
}

export default FichaCliente;