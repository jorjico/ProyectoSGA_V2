import { useNavigate } from "react-router-dom";
import BotonConIcono from "./BotonConIcono";

function BotonEditarProyecto({ id }) {
    const navigate = useNavigate();

    return (
        <BotonConIcono
            text="Editar"
            iconoSrc="/edit.png"
            onClick={() => navigate(`/editar-proyecto/${id}`)}
        />
    );
}

export default BotonEditarProyecto;