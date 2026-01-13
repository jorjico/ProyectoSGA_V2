import { Box, Heading, Stack, Text, useTheme } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import BackButton from "../components/BotonAtras";
import BotonEliminarElemento from "../components/BotonEliminarElemento";
import BotonEditarUsuario from "../components/BotonEditarUsuario";
import usuariosStyle from "../theme/usuarioStyle";
import useUsuarioById from "../hooks/useUsuarioById";

function FichaUsuario() {
    const theme = useTheme();
    const styles = usuariosStyle(theme);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const { id } = useParams();
    const { usuario, loading, error } = useUsuarioById(id);

    if (loading) return <h1>Cargando...</h1>;
    if (error) return <h1>Error: {error.message}</h1>;
    if (!usuario) return <h1>No se encontró el usuario</h1>;

    const handleDeleted = () => {
        navigate("/usuarios/ver");
    };

    return (
        <Box>
            <MenuBar>
                <BackButton />

                <BotonEditarUsuario id={usuario._id} />

                <BotonEliminarElemento
                    recurso="usuario"
                    apiUrl={`${backendUrl}/api/usuarios/${usuario._id}`}
                    onDeleted={handleDeleted}
                />
            </MenuBar>

            <Box sx={styles.fichaContainer}>
                <Heading sx={styles.fichaTitulo}>{usuario.email}</Heading>

                <Box sx={styles.fichaRow}>
                    <Stack sx={styles.fichaInfo}>

                        <Text sx={styles.fichaText}>
                            <Text sx={styles.fichaLabel}>Rol:</Text> {usuario.rol}
                        </Text>

                        <Text sx={styles.fichaText}>
                            <Text sx={styles.fichaLabel}>Creado el:</Text> {new Date(usuario.createdAt).toLocaleDateString()}
                        </Text>
                        
                        <Text sx={styles.fichaText}>
                            <Text sx={styles.fichaLabel}>Última actualización:</Text> {new Date(usuario.updatedAt).toLocaleDateString()}
                        </Text>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

export default FichaUsuario;