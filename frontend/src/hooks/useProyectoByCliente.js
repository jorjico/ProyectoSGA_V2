import { useEffect, useState } from "react";

function useProyectosByCliente(clienteId) {
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/proyectos?cliente=${clienteId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!res.ok) throw new Error("Error al cargar los proyectos");

                const data = await res.json();
                setProyectos(data.data || []);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (clienteId) fetchProyectos();
    }, [clienteId]);

    return { proyectos, loading, error };
}

export default useProyectosByCliente;