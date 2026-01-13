import { useNavigate } from "react-router-dom";
import BotonConIcono from "./BotonConIcono";

function BotonEditarUsuario({ id }) {
    const navigate = useNavigate();

    return (
        <BotonConIcono
            text="Editar"
            iconoSrc="/edit.png"
            onClick={() => navigate(`/editar-usuario/${id}`)}
        />
    );
}

export default BotonEditarUsuario;