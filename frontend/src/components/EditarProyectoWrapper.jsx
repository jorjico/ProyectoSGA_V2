import { useParams } from "react-router-dom";
import EditarProyecto from "../paginas/EditarProyecto";
import { useEffect, useState } from "react";

function EditarProyectoWrapper() {
    const { id } = useParams();
    const [proyecto, setProyecto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const fetchProyecto = async () => {

            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
                const url = `${backendUrl}/api/proyectos/${id}`;

                const token = localStorage.getItem("token");

                const res = await fetch(url, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                const text = await res.text();

                if (!res.ok) {
                    throw new Error(`Error al cargar proyecto: ${res.status} ${text}`);
                }

                let data;
                try {
                    data = JSON.parse(text);
                } catch {
                    throw new Error(`La respuesta no es JSON: ${text}`);
                }

                setProyecto(data.data);
                setErrorMsg(null);

            } catch (error) {
                console.error("Error capturado en fetchProyecto:", error);
                setErrorMsg(error.message || "Error al cargar proyecto");
                setProyecto(null);

            } finally {
                setLoading(false);
            }
        };

        fetchProyecto();

    }, [id]);

    if (loading) return <div>Cargando proyecto...</div>;
    if (errorMsg) return <div>{errorMsg}</div>;
    if (!proyecto) return <div>Proyecto no encontrado</div>;

    return <EditarProyecto proyecto={proyecto} />;
}

export default EditarProyectoWrapper;