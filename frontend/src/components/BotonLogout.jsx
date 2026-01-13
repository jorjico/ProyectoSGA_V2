import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import { Button } from "@chakra-ui/react";
import NavbarStyle from "../theme/navbarStyle";

function BotonLogout() {
    const { logout } = useContext(UsuarioContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Button 
            onClick={handleLogout}
            sx={NavbarStyle.logoutButton}

        >
            Cerrar sesión
        </Button>
    );
}

export default BotonLogout; 