import { useEffect, useState } from "react";

function useProyectoById(id) {
    const [proyecto, setProyecto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProyecto = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/proyectos/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    throw new Error("Error al cargar el proyecto");
                }

                const data = await res.json();

                setProyecto(data.data);

            } catch (err) {
                console.error(err);
                setError(err);

            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProyecto();

    }, [id]);

    return { proyecto, loading, error };
}

export default useProyectoById;