import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import { Box, Card, CardBody, Heading, Image } from "@chakra-ui/react";
import { useTheme } from "@chakra-ui/react";
import BotonLogout from "../components/BotonLogout";
import homeStyle from "../theme/homeStyle";


function Home() {
  const { usuario } = useContext(UsuarioContext);
  const theme = useTheme();
  const styles = homeStyle(theme);

  const modulos = [
    { label: "Productos", path: "/productos/ver", icon: "/producto.png" },
    { label: "Proyectos", path: "/proyectos", icon: "/proyecto.png" },
    { label: "Compras", path: "/pedidos", icon: "/compras.png" },
  ];

  if (usuario.rol === "admin") {
    modulos.push({ label: "Usuarios", path: "/usuarios/ver", icon: "/usuarios.png" });
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.cardRow}>
        {modulos.map((modulo) => (
          <Card
            key={modulo.label}
            as={RouterLink}
            to={modulo.path}
            sx={styles.card}
          >
            <CardBody>
              <Heading sx={styles.cardTitulo}>{modulo.label}</Heading>
              <Image src={modulo.icon} alt={modulo.label} sx={styles.cardIcon} />
            </CardBody>
          </Card>
        ))}
      </Box>

      <Box sx={styles.logoutContainer}>
        <BotonLogout sx={styles.logoutButton} />
      </Box>
    </Box>
  );
}

export default Home;
