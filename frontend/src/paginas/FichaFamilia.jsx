import { Box, Heading, Stack, Text, SimpleGrid, Card, CardBody, useTheme, useBreakpointValue, Image } from "@chakra-ui/react";
import productosStyle from "../theme/productosStyle";
import { useNavigate, useParams } from "react-router-dom";
import useFamiliaById from "../hooks/useFamiliaById";
import MenuBar from "../components/MenuBar";
import BackButton from "../components/BotonAtras";
import BotonEliminarElemento from "../components/BotonEliminarElemento";
import BotonEditarFamilia from "../components/BotonEditarFamilia";
import pixelFoto from "/pixel.png";

function FichaFamilia() {
    const theme = useTheme();
    const styles = productosStyle(theme);
    const mostrarImagen = useBreakpointValue(styles.mostrarImagen);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const { id } = useParams();
    const { familia, productos, loading, error } = useFamiliaById(id);

    if (loading) return <h1>Cargando...</h1>;
    if (error) return <h1>Error: {error.message}</h1>;
    if (!familia) return <h1>No se encontró la familia</h1>;

    const handleDeleted = () => {
        navigate("/productos/familias");
    };

    return (
        <Box>
            <MenuBar>
                <BackButton />

                <BotonEditarFamilia familia={familia} />

                <BotonEliminarElemento
                    recurso="familia"
                    apiUrl={`${backendUrl}/api/familias/${familia._id}`}
                    onDeleted={handleDeleted}
                />
            </MenuBar>

            <Box sx={styles.container}>

                <Heading sx={styles.fichaTitulo}>
                    {familia.nombre}
                </Heading>

                <Box sx={styles.fichaRow}>

                    <Stack sx={styles.fichaInfo}>
                        <Text sx={styles.fichaText}>
                            Código: {familia.codigo}
                        </Text>

                        <Text sx={styles.fichaText}>
                            Total de productos: {productos.length}
                        </Text>
                    </Stack>
                </Box>

                <Box sx={styles.fichaProductosBox}>
                    {productos.length > 0 ? (
                        <SimpleGrid
                            columns={styles.grid.columns}
                            spacing={styles.grid.spacing}
                        >
                            {productos.map((producto) => (
                                <Card
                                    key={producto._id}
                                    sx={styles.card}
                                    onClick={() =>
                                        navigate(`/producto/${producto.sku}`)
                                    }
                                >
                                    <CardBody sx={styles.cardBody}>
                                        <Heading sx={styles.cardTitle}>
                                            {producto.nombreProducto}
                                        </Heading>

                                        {mostrarImagen && (
                                            <Image
                                                src={producto.foto?.url || pixelFoto}
                                                alt={producto.nombreProducto}
                                                sx={styles.cardImage}
                                            />
                                        )}

                                        <Box sx={styles.sku}>
                                            {producto.sku}
                                        </Box>
                                    </CardBody>
                                </Card>
                            ))}
                        </SimpleGrid>
                    ) : (
                        <Text>No hay productos en esta familia</Text>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default FichaFamilia;