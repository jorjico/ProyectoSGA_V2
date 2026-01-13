import { useNavigate } from "react-router-dom";
import BotonConIcono from "./BotonConIcono";

function BotonEditarProducto({ sku }) {
    const navigate = useNavigate();
    return (
        <BotonConIcono
            text="Editar"
            iconoSrc="/edit.png"
            onClick={() => navigate(`/editar-producto/${sku}`)}
        />
    );
}

export default BotonEditarProducto;