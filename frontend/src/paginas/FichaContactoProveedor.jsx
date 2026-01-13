import { Box, Heading, Stack, Text, useTheme } from "@chakra-ui/react";
import proveedoresStyle from "../theme/ProveedorStyle";
import { useNavigate, useParams } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import BackButton from "../components/BotonAtras";
import useContactoProveedorById from "../hooks/useContactoProveedorById";
import BotonEditarContactoProveedor from "../components/BotonEditarContactoProveedor";
import BotonEliminarElemento from "../components/BotonEliminarElemento";

function FichaContactoProveedor() {
    const theme = useTheme();
    const styles = proveedoresStyle(theme);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const navigate = useNavigate();

    const { id } = useParams();
    const { contacto, loading, error } = useContactoProveedorById(id);

    if (loading) return <h1>Cargando contacto...</h1>;
    if (error) return <h1>Error: {error.message}</h1>;
    if (!contacto) return <h1>No se encontró el contacto</h1>;

    return (
        <Box>
            <MenuBar>
                <BackButton />

                <BotonEditarContactoProveedor
                    recurso="contacto-proveedor"
                    id={contacto._id}
                    apiUrl={`${backendUrl}/api/contactos-proveedores/${contacto._id}`}
                />

                <BotonEliminarElemento
                    recurso="contacto"
                    apiUrl={`${backendUrl}/api/contactos-proveedores/${contacto._id}`}
                    onDeleted={() => navigate(`/proveedores/${contacto.proveedor?._id}`)}
                />

            </MenuBar>

            <Box sx={styles.fichaContainer}>
                <Heading sx={styles.fichaTitulo}>{contacto.nombre}</Heading>

                <Stack sx={styles.fichaInfo}>
                    <Text sx={styles.fichaText}>
                        <Text sx={styles.fichaLabel}>Cargo:</Text> {contacto.cargo}
                    </Text>

                    <Text sx={styles.fichaText}>
                        <Text sx={styles.fichaLabel}>Email:</Text> {contacto.email}
                    </Text>

                    <Text sx={styles.fichaText}>
                        <Text sx={styles.fichaLabel}>Teléfono:</Text> {contacto.telefono}
                    </Text>

                    <Text sx={styles.fichaText}>
                        <Text sx={styles.fichaLabel}>Proveedor:</Text> {contacto.proveedor?.nombre || "-"}
                    </Text>

                    <Text sx={styles.fichaText}>
                        Proveedor:{" "}
                        {contacto.proveedor ? (
                            <Text
                                as="span"
                                sx={styles.linkText}
                                onClick={() => navigate(`/proveedores/${contacto.proveedor._id}`)}
                            >
                                {contacto.proveedor.nombre}
                            </Text>
                        ) : (
                            "-"
                        )}
                    </Text>

                    <Text sx={styles.fichaText}>
                        <Text sx={styles.fichaLabel}>Creado el:</Text> {new Date(contacto.createdAt).toLocaleDateString()}
                    </Text>

                    <Text sx={styles.fichaText}>
                        <Text sx={styles.fichaLabel}>Última actualización:</Text> {new Date(contacto.updatedAt).toLocaleDateString()}
                    </Text>
                </Stack>
            </Box>
        </Box>
    );
}

export default FichaContactoProveedor;