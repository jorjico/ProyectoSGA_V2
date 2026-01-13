import BotonConIcono from "./BotonConIcono";

function BotonCrear({ recurso, apiUrl, onCreated, iconoSrc, texto, camposExtra = {}, campoNombre = "nombreProducto" }) {
    const handleClick = async () => {
        const nombre = prompt(`Indica el nombre de ${recurso}:`);
        if (!nombre) return;

        try {
            const token = localStorage.getItem("token");

            const body = {
                [campoNombre]: nombre,
                ...camposExtra
            };

            const res = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(body),
            });

            const result = await res.json();

            if (result.success) {
                alert(`${recurso} creada correctamente`);
                onCreated(result.data);
            } else {
                alert(result.error || `Error al crear ${recurso}`);
            }

        } catch (error) {
            console.error(error);
            alert(`Error al crear ${recurso}`);
        }
    };

    return (
        <BotonConIcono
            text={texto || `Crear ${recurso}`}
            iconoSrc={iconoSrc || "/create.png"}
            onClick={handleClick}
        />
    );
}

export default BotonCrear;
