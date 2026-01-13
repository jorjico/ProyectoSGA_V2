import { Box, Card, CardBody, Heading, SimpleGrid, useTheme, HStack } from "@chakra-ui/react";
import BotonCargarMas from "../components/BotonCargarMas";
import MenuBar from "../components/MenuBar";
import { useNavigate } from "react-router-dom";
import BotonCrearElemento from "../components/BotonCrearElemento";
import iconoCrear from "/create.png";
import Buscador from "../components/Buscador";
import { useMemo, useState } from "react";
import usuariosStyle from "../theme/usuarioStyle";
import useUsuarios from "../hooks/useUsuario";

function VerUsuarios() {
    const theme = useTheme();
    const styles = usuariosStyle(theme);
    const navegar = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const [filtroEmail, setFiltroEmail] = useState("");

    const filtros = useMemo(() => {
        return filtroEmail ? { email: filtroEmail } : {};
    }, [filtroEmail]);

    const {
        usuarios,
        setUsuarios,
        loading,
        hayMas,
        cargarMasUsuarios
    } = useUsuarios(24, filtros);

    return (
        <Box>
            <MenuBar>
                <HStack justifyContent="space-between" w="full">
                    <BotonCrearElemento
                        recurso="usuario"
                        apiUrl={`${backendUrl}/api/usuarios/register`}
                        backendUrl={backendUrl}
                        iconoSrc={iconoCrear}
                        campos={[
                            { name: "email", label: "Email", type: "text" },
                            { name: "rol", label: "Rol", type: "select", options: ["admin", "compras", "almacen", "administracion"] },
                            { name: "password", label: "Contraseña", type: "password" },
                        ]}
                        onCreated={(nuevoUsuario) => {
                            setUsuarios(prev => [nuevoUsuario, ...prev]);
                        }}
                    />
                    <Buscador
                        placeholder="Buscar usuario..."
                        onSearch={setFiltroEmail}
                    />
                </HStack>
            </MenuBar>

            <Box sx={styles.gridContainer}>
                <SimpleGrid columns={styles.grid.columns} spacing={styles.grid.spacing}>
                    {usuarios.map((usuario) => (
                        <Card
                            key={usuario._id}
                            sx={styles.card}
                            onClick={() => navegar(`/usuarios/${usuario._id}`)}
                        >
                            <CardBody sx={styles.cardBody}>
                                <Heading sx={styles.cardTitle}>
                                    {usuario.email.split("@")[0]}
                                    <wbr />@
                                    {usuario.email.split("@")[1]}
                                </Heading>

                                <Box sx={styles.rol}>{usuario.rol}</Box>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>

                <BotonCargarMas
                    onClick={cargarMasUsuarios}
                    loading={loading}
                    hayMas={hayMas}
                />
            </Box>
        </Box>
    );
}

export default VerUsuarios;