import { Box, Heading, Image, Stack, Text, useTheme } from "@chakra-ui/react";
import productosStyle from "../theme/productosStyle";
import { useNavigate, useParams } from "react-router-dom";
import useProductoBySKU from "../hooks/useProductoBySKU";
import MenuBar from "../components/MenuBar";
import pixelFoto from "/pixel.png";
import BackButton from "../components/BotonAtras";
import BotonEditarProducto from "../components/BotonEditarProducto";
import BotonEliminarElemento from "../components/BotonEliminarElemento";


function FichaProducto() {
    const theme = useTheme();
    const styles = productosStyle(theme);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    
    const { sku } = useParams();
    const { producto, loading, error } = useProductoBySKU(sku);

    if (loading) return <h1>Cargando...</h1>;
    if (error) return <h1>Error: {error.message}</h1>;
    if (!producto) return <h1>No se encontró el producto</h1>;

    const handleDeleted = () => {
        navigate("/productos/ver");
    };

    return (
        <Box>
            <MenuBar>
                <BackButton />
                <BotonEditarProducto sku={producto.sku}/>

                <BotonEliminarElemento
                    recurso="producto"
                    apiUrl={`${backendUrl}/api/productos/${producto.sku}`}
                    onDeleted={handleDeleted}
                />

            </MenuBar>

            <Box sx={styles.container}>

                <Heading sx={styles.fichaTitulo}>
                    {producto.nombreProducto}
                </Heading>

                <Box sx={styles.fichaRow}>

                    <Stack sx={styles.fichaInfo}>
                        <Text sx={styles.fichaText}>SKU: {producto.sku}</Text>

                        <Text sx={styles.fichaText}>
                            Stock: {producto.stock ?? 0} {producto.unidadMedida}
                        </Text>

                        <Text sx={styles.fichaText}>
                            Familia:{" "}
                            {producto.familia ? (
                                <Text
                                    as="span"
                                    sx={styles.linkText}
                                    onClick={() => navigate(`/familia/${producto.familia._id}`)}
                                >
                                    {producto.familia?.nombre}
                                </Text>
                            ) : (
                                "Sin familia"
                            )}
                        </Text>

                        <Text sx={styles.fichaText}>
                            IVA: {producto.IVA}%
                        </Text>
                    </Stack>

                    <Box sx={styles.fichaImageBox}>
                        <Image
                            src={producto.foto?.url || pixelFoto}
                            alt={producto.nombreProducto}
                            sx={styles.fichaImage}
                        />
                    </Box>
                </Box>

                <Box sx={styles.proveedoresBox}>
                    <Heading sx={styles.proveedoresHeading}>Proveedores</Heading>

                    {producto.proveedores?.length > 0 ? (
                        producto.proveedores.map((p) => (
                            <Box key={p._id} sx={styles.proveedorItem}>
                                <Text><strong>Proveedor:</strong> {p.proveedor?.nombre}</Text>
                                <Text><strong>Precio:</strong> {p.precioUnitario} {p.moneda}</Text>
                            </Box>
                        ))
                    ) : (
                        <Text>No hay proveedores asociados</Text>
                    )}
                </Box>
            </Box>

        </Box>
    );
}

export default FichaProducto;

