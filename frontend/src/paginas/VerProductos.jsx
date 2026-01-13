import { Box, Card, CardBody, Heading, Image, SimpleGrid, useTheme, useBreakpointValue, HStack } from "@chakra-ui/react";
import productosStyle from "../theme/productosStyle";
import pixelFoto from "/pixel.png";
import useProductos from "../hooks/useProductos";
import BotonCargarMas from "../components/BotonCargarMas";
import MenuBar from "../components/MenuBar";
import { useNavigate } from "react-router-dom";
import BotonCrearElemento from "../components/BotonCrearElemento";
import iconoCrear from "/create.png";
import Buscador from "../components/Buscador";
import { useMemo, useState } from "react";

function VerProductos() {
    const theme = useTheme();
    const styles = productosStyle(theme);

    const navegar = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const [filtroNombre, setFiltroNombre] = useState("");

    const filtros = useMemo(() => {
        return filtroNombre ? { nombreProducto: filtroNombre } : {};
    }, [filtroNombre]);

    const {
        productos,
        setProductos,
        loading,
        hayMas,
        cargarMasProductos
    } = useProductos(24, filtros);

    const mostrarImagen = useBreakpointValue(styles.mostrarImagen);

    return (
        <Box>
            <MenuBar>
                <HStack justifyContent="space-between" w="full">
                    <BotonCrearElemento
                        recurso="producto"
                        apiUrl={`${backendUrl}/api/productos`}
                        backendUrl={backendUrl}
                        iconoSrc={iconoCrear}
                        campos={[
                            { name: "nombreProducto", label: "Nombre", type: "text" },
                            {
                                name: "familia",
                                label: "Familia",
                                type: "autocomplete",
                                fetchOptions: "/api/familias",
                                multiple: false,
                                onCreate: {
                                    apiUrl: "/api/familias",
                                    campos: [{
                                        name: "nombre",
                                        label: "Nombre",
                                        type: "text"
                                    }]
                                }
                            },
                            { name: "IVA", label: "IVA", type: "select", parse: "number", options: [4,5,10,21] },
                            { name: "unidadMedida", label: "Unidad de medida", type: "select", options: ["Uds","ML","Caja","Pack"] },
                            { name: "foto", label: "Foto", type: "file" },
                        ]}
                        onCreated={(nuevoProducto) => { 
                            setProductos(prev => [nuevoProducto, ...prev]);
                        }}
                    />
                    <Buscador
                        placeholder="Buscar producto..."
                        onSearch={setFiltroNombre}
                    />
                </HStack>
            </MenuBar>

            <Box sx={styles.gridContainer}>
                <SimpleGrid columns={styles.grid.columns} spacing={styles.grid.spacing}>
                    {productos.map((producto) => (
                        <Card 
                            key={producto._id}
                            sx={styles.card}
                            onClick={() => navegar(`/producto/${producto.sku}`)}
                        >
                            <CardBody sx={styles.cardBody}>
                                <Heading sx={styles.cardTitle}> {producto.nombreProducto} </Heading>

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
                <BotonCargarMas 
                    onClick={cargarMasProductos}
                    loading={loading}
                    hayMas={hayMas}
                />
            </Box>
        </Box>
    )
};

export default VerProductos;