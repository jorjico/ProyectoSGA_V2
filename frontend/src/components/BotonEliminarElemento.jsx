import { useToast } from "@chakra-ui/react"
import BotonConIcono from "./BotonConIcono";

function BotonEliminarElemento({ recurso, apiUrl, onDeleted, iconoSrc }) {

    const toast = useToast();

    const handleClick = async () => {
        const confirmar = window.confirm(`¿Estas seguro de querer eliminar este ${recurso}?`)

        if (!confirmar) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            const result = await res.json();

            if (result.success) {
                toast({
                    title: "Eliminado", 
                    description: `${recurso} eliminado correctamente`, 
                    status: "success"
                });
                onDeleted && onDeleted(result.data);
            
            } else {
                toast({
                    title: "Error",
                    description: result.error || `No se pudo eliminar ${recurso}`,
                    status: "error"
                });
            }

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: error.message,
                status: "error"
            });
        }
    };

    return (
        <BotonConIcono
            text={`Eliminar ${recurso}`}
            iconoSrc={iconoSrc || "/delete.png"}
            onClick={handleClick}
        />
    );
}

export default BotonEliminarElemento;