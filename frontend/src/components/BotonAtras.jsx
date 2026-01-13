import { useNavigate } from "react-router-dom";
import BotonConIcono from "./BotonConIcono";

function BackButton() {
    const navigate = useNavigate();

    return (
        <BotonConIcono
            text="Volver"
            iconoSrc="/back-arrow.png"
            onClick={() => navigate(-1)}
        />
    );
}

export default BackButton;