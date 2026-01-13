import { useState, useEffect } from "react";

function useUsuarioById(id) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchUsuario = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Error cargando usuario");
                const data = await res.json();
                setUsuario(data.data);

            } catch (err) {
                console.error(err);
                setError(err);

            } finally {
                setLoading(false);
            }
        };

        fetchUsuario();
    }, [id]);

    return { usuario, loading, error };
}

export default useUsuarioById;