import { useTheme } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import BotonConIcono from "./BotonConIcono";
import comprasStyle from "../theme/comprasStyle";

function BotonCrearPedido({ iconoSrc }) {
    const theme = useTheme();
    const styles = comprasStyle(theme);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/crear-pedido");
    };

    return (
        <BotonConIcono
            text="Crear pedido"
            iconoSrc={iconoSrc}
            onClick={handleClick}
            sx={styles.botonCrearPedido}
            iconSx={styles.botonCrearPedidoIcono}
        />
    );
}

export default BotonCrearPedido;
