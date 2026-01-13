import { useNavigate } from "react-router-dom";
import BotonConIcono from "./BotonConIcono";

function BotonEditarProveedor({ id }) {
    const navigate = useNavigate();

    return (
        <BotonConIcono
            text="Editar"
            iconoSrc="/edit.png"
            onClick={() => navigate(`/editar-proveedor/${id}`)}
        />
    );
}

export default BotonEditarProveedor;