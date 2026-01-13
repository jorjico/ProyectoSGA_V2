import { useNavigate } from "react-router-dom";
import BotonConIcono from "./BotonConIcono";

function BotonEditarCliente({ id }) {
    const navigate = useNavigate();

    return (
        <BotonConIcono
            text="Editar"
            iconoSrc="/edit.png"
            onClick={() => navigate(`/editar-cliente/${id}`)}
        />
    );
}

export default BotonEditarCliente;