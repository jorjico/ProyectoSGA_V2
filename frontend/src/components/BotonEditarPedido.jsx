import { useNavigate } from "react-router-dom";
import BotonConIcono from "./BotonConIcono";

function BotonEditarPedido({ id }) {
    const navigate = useNavigate();

    return (
        <BotonConIcono
            text="Editar"
            iconoSrc="/edit.png"
            onClick={() => navigate(`/editar-pedido/${id}`)}
        />
    );
}

export default BotonEditarPedido;